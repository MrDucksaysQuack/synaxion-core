# 상태 전이 계약 (State Transition Contract)

**목적**: “사용자가 행동했는데 다음 상태가 보이지 않거나, 로딩에서 벗어나지 않는” 결함을 **불변식(invariant)** 수준에서 막는다. 구체 훅·컴포넌트 이름은 프로젝트 인스턴스에 둔다.

**Tier**: **필수(원칙)** — 비동기 상태 구현 세부는 [STATE_MANAGEMENT_PRINCIPLES.md](../07-frontend-ui/STATE_MANAGEMENT_PRINCIPLES.md)와 짝을 이룬다.

---

## 1. 로딩은 반드시 종료 상태로 수렴

- 비동기 구간에서 **로딩(또는 pending) 플래그를 켠 경우**, 성공·실패·취소 여부와 관계없이 **동일 경로에서 끈다**(`finally` 또는 동등한 단일 수렴 경로). 예외만 던지고 로딩을 남기지 않는다.
- **금지**: 에러 분기에서만 `setLoading(false)`를 두고, 성공 경로에서는 잊는 패턴.

---

## 2. 전이는 사용자에게 관측 가능해야 함

- 상태 머신·플로우가 있을 때, **허용된 전이**는 UI·접근성 계층에서 **구분 가능한 피드백**(스피너, 단계 문구, 비활성 버튼 등)과 맞물려야 한다. “내부 상태만 바뀌고 화면은 이전 단계”는 전이 누락으로 간주한다.

---

## 3. 이벤트와 상태 이름을 혼동하지 않음

- **이벤트**(OAuth 완료, 저장 완료)와 **상태**(인증됨, 편집 중)를 타입·문서에서 분리한다 — [AUTH_FLOW_PRINCIPLES.md](../04-safety-standards/AUTH_FLOW_PRINCIPLES.md) §4와 정합.

---

## 4. 의존성·재실행 (프론트엔드)

- 비동기 상태 **객체 전체**를 `useEffect` / `useCallback` 의존성에 넣어 **같은 fetch가 연쇄 재실행**되지 않도록 한다 — [STATE_MANAGEMENT_PRINCIPLES.md §2](../07-frontend-ui/STATE_MANAGEMENT_PRINCIPLES.md#2-비동기-상태-훅useasyncstate-등과-의존성-배열-필수).

---

## 🔗 관련 문서

- [STATE_MANAGEMENT_PRINCIPLES.md](../07-frontend-ui/STATE_MANAGEMENT_PRINCIPLES.md) — 훅·deps·Stale UI와의 관계  
- [UX_SAFETY_RULES.md](../04-safety-standards/UX_SAFETY_RULES.md) — 네트워크·로딩 안전  
- [AUTH_FLOW_PRINCIPLES.md](../04-safety-standards/AUTH_FLOW_PRINCIPLES.md) — 인증 단계 전이  
- **Itemwiki 인스턴스(예시·금지 패턴)** — [STATE_TRANSITION_RULES.md](../../itemwiki-constitution/itemwiki-specific/state-management/STATE_TRANSITION_RULES.md)

---

**최종 업데이트**: 2026-04-14
