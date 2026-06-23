# Host Trust Surface Separation
# 호스트 신뢰 표면 분리

> **같은 호스트 아래에도, 서로 다른 신뢰·의도·권한을 가진 표면은 라우팅·가드·context·API namespace로 분리한다.**

**Tier**: 3 (도입 단계 · 2.18.0 신규)  
**상태**: Inflomatrix 4-plane topology (Public · Relationship · Business · Platform) + plane guard + strangler promotion으로 실증.  
**승격 조건**: META §0.3 — 외부 multi-surface SaaS 1건 적용 시 Tier 2.  
**연계**: [TRUST_BOUNDARY_PRINCIPLE.md](./TRUST_BOUNDARY_PRINCIPLE.md) · [EXECUTION_AUTHORITY_ALIGNMENT.md](./EXECUTION_AUTHORITY_ALIGNMENT.md) · [OPERATIONAL_MATURITY_LAYERS.md](./OPERATIONAL_MATURITY_LAYERS.md) · Ch.19 Role Routing

**최종 업데이트**: 2026-06-23

---

## 1. 문제

멀티-tenant·multi-audience 제품에서 흔한 실패:

- **Public 쇼룸**과 **거래처 업무실**이 같은 shell·session·nav에 섞임
- 내부 직원 경로와 외부 관계자 경로가 **동일 JWT**로 상호 침투
- "외부에 보이는 화면"을 하나로 묶어 **권한 모델이 뭉개짐**

겉으로는 페이지가 많아지지만, **출입구가 하나**처럼 동작한다.

---

## 2. 추상 4표면 모델 (이름은 인스턴스가 정한다)

| 표면 | 대표 audience | 신뢰 수준 | 전형적 목적 |
|------|---------------|-----------|-------------|
| **Public** | Guest, 일반 고객, 비로그인 | 낮음 — 공개 읽기·제한된 write | 쇼룸, 마케팅, 가입·문의 |
| **Relationship** | 공급업체, 고객사, 파트너, 투자자 | 중간 — scoped external | 거래처 전용 업무, portal |
| **Business** | 내부 직원, operator | 높음 — tenant 운영 | ERP형 운영, workspace |
| **Platform** | owner, billing, onboarding | 최고 — cross-tenant | 테넌트 생성, 플랫폼 관리 |

인스턴스는 plane 이름·URL prefix·host 분기를 정의한다. Synaxion은 **분리 불변식**만 고정한다.

---

## 3. 분리 불변식

1. **Plane Guard** — 각 plane 진입에 JWT + entityType(또는 동등 capability) 검사. Business plane guard와 Relationship plane guard는 **미러 대칭**으로 설계한다.
2. **Context Isolation** — plane별 Provider·Model·theme bleed 금지. Public session이 Relationship API를 호출하지 않는다.
3. **API Namespace** — plane별 API prefix 또는 mount. compat alias는 **기한·ADR**와 함께만 허용한다.
4. **Discoverability Parity** — plane마다 inventory·nav discoverability에 **1급으로 편입**한다. 한 plane만 측정하면 전체 IA가 왜곡된다.
5. **Cross-Plane Handoff** — plane 간 이동은 **handoff catalog**에 양면으로 기록한다 (Ch.19 §10).

---

## 4. Strangler 승격 (무중단 분리)

대규모 plane 승격은 한 번에 이동하지 않는다.

```
RP0  alias + skeleton + barrel re-export
  → RP1 plane guard + scoped providers
  → RP2 FE module relocation (shim 잔류)
  → RP3 API namespace (+ compat)
  → RP4 shared package split
  → RP8 discoverability parity gate
```

상세: [STRANGLER_PROMOTION_PLAYBOOK.md](./STRANGLER_PROMOTION_PLAYBOOK.md)

---

## 5. 검증 (인스턴스)

| 검사 | 목적 |
|------|------|
| plane E2E | member/internal이 external-only plane 차단 |
| `check:auth-boundary` / `check:authority-boundary` | principal ≠ policy |
| `check:nav-discoverability` | plane별 A+B 커버리지 |
| cross-plane import scan | site → business 역참조 0 (또는 shim만) |

---

## 6. 한계

- B2C only 제품은 Public+Business 2표면만 써도 된다. 4표면은 **필수가 아님**.
- plane 이름을 Ch.19 `role.plane` enum에 하드코딩하지 않는다 — **인스턴스 JSON SSOT**.

**제안 인스턴스**: Inflomatrix — `RELATIONSHIP_PLANE_SEPARATION.md`, RP0–RP8 (2026-06)
