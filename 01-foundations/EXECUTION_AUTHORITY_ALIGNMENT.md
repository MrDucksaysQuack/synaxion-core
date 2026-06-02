# Execution Authority Alignment
# 실행 권한 정합 원칙

> **Execution principal ≠ Policy principal**  
> 시스템이 *행동*할 때 쓰는 자격(실행 주체)과, 리소스가 *허용*하는 자격(정책 주체)은 같지 않다. 둘이 어긋나면 버그 하나로 타 사용자 데이터 접근·변조가 가능해진다.

**Tier**: 3 (도입 단계 · 2.16.0 신규)  
**상태**: Itemwiki·Inflomatrix 2인스턴스에서 동형 5종 실패 패턴 + `check:auth-boundary` / `check:authority-boundary` 패턴으로 실증.  
**승격 조건**: [META_CONSTITUTION.md](../META_CONSTITUTION.md) §0.3 — AB 규칙·playbook은 Tier 2 후보; 원칙 본문은 외부 2인스턴스 작동 확인 후 Tier 1 검토.  
**연계**: [TRUST_BOUNDARY_PRINCIPLE.md](./TRUST_BOUNDARY_PRINCIPLE.md)(책임 한계) · [AUTH_FLOW_PRINCIPLES.md](../04-safety-standards/AUTH_FLOW_PRINCIPLES.md)(인증 순서) · [LAYER_BOUNDARIES.md](./LAYER_BOUNDARIES.md)(계층)

**최종 업데이트**: 2026-06-02

---

## 1. TRUST_BOUNDARY와의 관계

| 문서 | 질문 |
|------|------|
| **Trust Boundary** | 시스템이 *무엇을 책임지는가* / 지지 않는가 |
| **Execution Authority Alignment** (본 문서) | 시스템이 *어떤 자격으로* 행동하는가, 그 자격이 정책과 *일치하는가* |

---

## 2. 경계 질문 (모든 write/read 전)

1. **어떤 권한으로 실행하는가?** (요청 principal · elevated job principal)
2. **대상 리소스는 무엇을 요구하는가?** (RLS · row filter · domain permission)
3. **일치하는가?** (불일치면 설계 오류 또는 명시적 elevated 경로)
4. *(Elevated일 때)* **어느 route/job에서만 허용되는가?** (HTTP handler 파일에서 elevated factory 직접 호출 금지 — 인스턴스 norm)

---

## 3. 데이터 평면 규칙 (Rule A–D)

| Rule | 데이터·동작 | Principal |
|------|-------------|-----------|
| **A** | Audit·이벤트·불변 로그 **기록** | **Elevated authority only** (서비스·배치 전용). 요청 JWT만으로 audit 테이블 insert 금지(정책이 허용하지 않는 한). |
| **B** | Business·tenant 데이터 **read/write** | **Caller authority + policy** (RLS, permission matrix, tenant scope). |
| **C** | Audit·메트릭·부가 관측 **실패** | Primary 사용자 트랜잭션을 **차단하지 않음**. 대신 **반드시** log · metric · outbox · degraded 응답 헤더 중 하나. **금지**: 의존 실패를 빈 성공(0건·200)으로 위장. |
| **D** | 동일 리소스 **read vs write** | Mutation에 policy guard가 있으면 **list/detail read에도 동일 policy principal**. 예외는 Boundary Inventory에 `public-by-design`로 명시. |

### 3.1 Principal 층 (스택 중립)

| 층 | 이름 | 역할 |
|----|------|------|
| **Edge** | Request-scoped principal | 세션·JWT·API key — 사용자 요청의 정체 |
| **Application** | Bounded elevated persistence | 배치·감사·storage backend — **인증된 route 뒤** application/job 계층만 |
| **Store** | Policy enforcement | RLS · tenant_id · permission service |

**Norm (스택 중립)**: 요청 principal만으로 policy를 만족할 수 없는 저장 작업은 application/job의 elevated client로만 수행하고, **HTTP handler·route 파일에서는 elevated factory를 직접 호출하지 않는다.**

---

## 4. 실패 패턴 5+1종 (분류 SSOT)

| # | 패턴 | 증상 예 |
|---|------|---------|
| **①** | 권한 불일치 | privileged client로 user API가 동일 테이블 R/W · CUD guard 없음 · read만 열림 |
| **②** | 환경 불일치 | privileged env 없을 때 anon/downgrade · `NEXT_PUBLIC_*`를 서버 비밀 대체 |
| **③** | 인터셉터·요청 컨텍스트 불일치 | middleware vs wrapper vs handler가 다른 토큰·tenant · Bearer-only vs cookie |
| **④** | SSOT·스키마 드리프트 | 코드가 조회하는 컬럼·테이블이 migration SSOT에 없음 · permission 명칭 이중 SSOT |
| **⑤** | async·관측 유실 | fire-and-forget audit · catch swallow · in-memory idempotency(멀티 인스턴스) |
| **⑥** | 컨텍스트 덮어쓰기 | 앞 단계 tenant/user가 뒤 미들웨어에서 default로 reset |

인스턴스 **Findings Register**(`F-①-01` 형식)와 **Boundary Inventory**는 [AUTHORITY_BOUNDARY_PLAYBOOK.md](../06-automation/AUTHORITY_BOUNDARY_PLAYBOOK.md)를 따른다.

---

## 5. 경계 함수 목록 (문제는 경계에서 난다)

다음 진입점마다 §2 질문·Rule A–D를 적용한다. [7_STAGE_LOGIC_CONSTRUCTION.md](../03-api-standards/7_STAGE_LOGIC_CONSTRUCTION.md) § Authority at boundary와 병행.

| 경계 | 예 |
|------|-----|
| API route / handler | HTTP 진입 |
| DB write / read | ORM·repository |
| Object storage | upload path·ownership |
| Webhook | signature · idempotency |
| Cron / batch | secret · job principal |
| External call | timeout · credential scope |

---

## 6. 인스턴스에 남기는 것 (Synaxion에 올리지 않음)

- 구체 DB·JWT·`service_role` 레시피
- 테이블명·마이그레이션 번호
- allowlist JSON·CI 산출물 본문

→ `docs/<project>-constitution/` · `docs/planning/auth-boundary-hardening/` 등.

---

## 7. 검증·승격

| 산출물 | Tier | 경로 |
|--------|------|------|
| 본 원칙 | 3 | 이 문서 |
| AB 규칙 카탈로그 | 2 | [AUTHORITY_BOUNDARY_CHECK_RULES.md](../06-automation/AUTHORITY_BOUNDARY_CHECK_RULES.md) |
| Playbook·4단계 성숙도 | 3 | [AUTHORITY_BOUNDARY_PLAYBOOK.md](../06-automation/AUTHORITY_BOUNDARY_PLAYBOOK.md) |
| `check:authority-boundary` | 2 (패턴) | 인스턴스 구현 예: Itemwiki `check:auth-boundary`, Inflomatrix 동명 |

[VERIFICATION_SCRIPTS.md](../06-automation/VERIFICATION_SCRIPTS.md) · [META_GATE_TELEMETRY.md](../06-automation/META_GATE_TELEMETRY.md) — 게이트 건강: 0 finding + **만료일 있는** allowlist.

---

**제안자 인스턴스**: Itemwiki (auth-boundary hardening), Inflomatrix (AUTH_PERMISSION_BOUNDARY_FINDINGS)  
**Tier 3 등재일**: 2026-06-02
