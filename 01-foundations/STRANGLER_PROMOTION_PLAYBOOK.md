# Strangler Promotion Playbook
# 점진 승격 플레이북

> **대규모 모듈·plane·namespace 이동은 alias + shim + 병렬 스트림으로 무중단 수행한다.**

**Tier**: 3 (도입 단계 · 2.18.0)  
**상태**: Inflomatrix Relationship Plane Promotion RP0–RP8, event-flow soft-legacy, document family consolidation에서 실증.  
**연계**: [HOST_TRUST_SURFACE_SEPARATION.md](./HOST_TRUST_SURFACE_SEPARATION.md) · [CONTRACT_CHANGE_POLICY.md](../CONTRACT_CHANGE_POLICY.md)

**최종 업데이트**: 2026-06-23

---

## 1. 언제 쓰는가

- 100+ 파일 모듈 relocation
- plane 분리 (site/portal → relationship)
- API namespace 변경 (`/api/site/*` → `/api/relationship/*`)
- shared package 분리 (`@shared/site/portal` → `@shared/relationship`)

**금지**: big-bang rename PR 하나로 전체 이동.

---

## 2. 표준 단계 (RP0–RP8 패턴 일반화)

| 단계 | 이름 | 산출물 | 검증 |
|------|------|--------|------|
| **0** | Foundation | tsconfig/vite alias, skeleton dir, barrel re-export shim | build, type-check |
| **1** | Guard + Context | plane guard, scoped providers, router wrap | plane E2E |
| **2** | FE Relocation | 디렉터리 단위 이동, 구 경로 thin shim | 역참조 0 |
| **3** | API Namespace | 신규 mount + compat alias | contract E2E |
| **4** | Shared Package | `@shared/<plane>` 배럴 | import scan |
| **5** | Public/Hub 확정 | hub route plane 재배치 | redirect smoke |
| **6** | Session/Login 결정 | login success path per plane | ADR |
| **7** | Cross-link 정책 | CTA·naming | manual |
| **8** | Discoverability parity | inventory + nav gate에 1급 편입 | `check:nav-discoverability` |

단계 번호는 고정이 아니다. **Foundation → Guard → Move → Namespace → Measure** 순서만 지킨다.

---

## 3. 파일 소유권 규칙

- 병렬 스트림은 **파일 소유권 표**로 충돌을 막는다.
- thin shim 파일은 **한 스트림만** 소유한다.
- compat API alias에는 **sunset 날짜**를 ADR에 기록한다.

---

## 4. Soft-Legacy Write Gate (연계)

deprecated 테이블·경로에 대한 **신규 write**는 env-gated CI로 차단한다.

- 인스턴스 예: `stream-definition-write-policy`, `check:stream-subdomain-write-policy`
- 원칙: read/migrate-only legacy는 **쓰기만** 막고, 읽기 compat는 유지

---

**제안 인스턴스**: Inflomatrix relationship-plane-promotion, event-flow-closeout-wave (2026-06)
