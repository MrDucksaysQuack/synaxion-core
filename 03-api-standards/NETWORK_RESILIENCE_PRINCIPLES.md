# 네트워크 탄력 원칙 (Network resilience principles)

**목적**: 클라이언트·서버가 외부 호출을 할 때 **타임아웃·재시도·에러 형식·멱등성**을 일관되게 다룬다. **특정 HTTP 클라이언트 함수 이름**은 이 문서에 두지 않는다(구현은 레포 규약·래퍼에 둔다).

**Tier**: **권장** — 운영 관측·operation ID는 [OBSERVABILITY_AND_PAGE_STATE.md](../07-frontend-ui/OBSERVABILITY_AND_PAGE_STATE.md), [LOGGING_OBSERVABILITY_PRINCIPLES.md](../09-observability/LOGGING_OBSERVABILITY_PRINCIPLES.md)와 짝을 이룬다.

---

## 1. 타임아웃

- 사용자 대기·백그라운드 잡을 구분해 **상한 시간**을 둔다. 무한 대기 호출을 기본으로 두지 않는다 — [UX_SAFETY_RULES.md](../04-safety-standards/UX_SAFETY_RULES.md).

---

## 2. 재시도

- **멱등한 읽기**에 한해 제한된 횟수·백오프 재시도를 허용한다. **쓰기**는 재시도 시 **중복 부작용**을 검토하고, 필요하면 **멱등 키·요청 ID**를 계약에 포함한다.
- **429·일시적 5xx**와 **구문 오류·인증 실패**를 구분한다. 후자를 무한 재시도하지 않는다.

---

## 3. 에러 구조화

- 호출 실패는 **원인 분류**(네트워크, 인증, 검증, 서버, 알 수 없음)를 로그·UI에 전달할 수 있는 형태로 올린다. 빈 `catch`로 삼키지 않는다 — [SILENT_FAILURE_PREVENTION.md](../04-safety-standards/SILENT_FAILURE_PREVENTION.md).

---

## 4. 상관·추적

- 지원하는 환경에서는 **요청·연산 식별자**를 헤더 또는 컨텍스트에 실어, 클라이언트 로그와 서버 로그를 대응시킨다.

---

## 5. 안전 인프라 장애 시 Graceful Fallback (Rate limit 등)

**Tier**: **Tier 2** (권장 — 보안 인프라 단일 장애점 완화)

Redis 기반 rate limiter, 분산 circuit breaker, WAF edge 등 **요청을 막기 위해 둔 외부 안전 계층**이 없거나 실패했을 때, **전체 트래픽을 deny-by-default로 두지 않는다**는 원칙이다.

### Rate limiting

| 상황 | 기본 동작 |
|------|-----------|
| 외부 limiter **미설정**(env 없음) | **in-process** 슬라이딩 윈도·버킷 등으로 동일 한도 적용 |
| 외부 limiter **호출 실패**(타임아웃·5xx) | **로그 후 in-process fallback** — 요청을 무조건 허용하지 않되, **인프라 장애 ≠ 사용자 무제한 허용**과 **인프라 장애 ≠ 전면 503** 사이에서 팀이 정한 한도를 유지 |
| in-process도 불가 | 명시적 정책(예: allow-with-warning vs fail-closed)을 문서화 — 침묵 실패 금지 |

**규칙**

- Fallback 전환은 **구조화 로그**로 남긴다(`upstash fallback to memory` 등).
- in-process 한도는 **인스턴스별**이므로 멀티 인스턴스 환경에서는 한도가 느슨해질 수 있음을 운영 문서에 명시한다.
- **fail-open(무제한 허용)**은 DDoS·남용 위험이 있으므로, 기본 권장은 **degraded but bounded**(in-process)이다.

### 인스턴스 참고

- truefarm `checkRateLimit`: Upstash 설정 시 Redis, 미설정·예외 시 `checkRateLimitInMemory`.

---

## 🔗 인스턴스 (Itemwiki)

- 구체 호출 래퍼·retry 정책·operationId 매핑: [NETWORK_CALL_RULES.md](../../itemwiki-constitution/itemwiki-specific/api-network/NETWORK_CALL_RULES.md) 등 인스턴스 `api-network/` 문서.

---

**최종 업데이트**: 2026-05-23 — §5 안전 인프라 graceful fallback
