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

## 🔗 인스턴스 (Itemwiki)

- 구체 호출 래퍼·retry 정책·operationId 매핑: [NETWORK_CALL_RULES.md](../../itemwiki-constitution/itemwiki-specific/api-network/NETWORK_CALL_RULES.md) 등 인스턴스 `api-network/` 문서.

---

**최종 업데이트**: 2026-04-14
