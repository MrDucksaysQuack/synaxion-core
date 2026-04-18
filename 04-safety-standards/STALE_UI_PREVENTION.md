# Stale UI 방지 (Stale UI Prevention)

**목적**: 데이터 변경(Mutation) 후 UI가 이전 정보를 보여주지 않도록, 갱신 의무를 범용 원칙으로 정의합니다.  
**Tier**: 2 (권장. 프로젝트/팀 단위 적용. 검증은 패턴 스캔·리뷰로 가능)

---

## 1. 핵심 원칙

> **"데이터는 바뀌었는데 UI는 이전 정보를 보여주면 안 된다."**

Mutation(저장·수정·삭제·생성)이 성공한 뒤, 해당 데이터를 표시하는 화면은 **반드시 최신 데이터를 반영**해야 한다. 사용자가 "왜 반영이 안 됐지?"라고 느끼는 상황을 방지한다.

---

## 2. 규칙

### 2.1 Mutation 후 갱신 의무

- **저장/수정/삭제/생성**이 성공한 경우, 그 결과를 보여주는 **뷰(화면·목록·캐시)**를 갱신해야 한다.
- 갱신 방식은 프로젝트 정책에 따른다. 예:
  - **명시적 refetch**: 성공 콜백에서 해당 리소스(또는 연관 리소스)를 다시 조회.
  - **캐시 무효화(invalidate)**: 해당 리소스/쿼리 키를 무효화하여 다음 접근 시 자동 재조회.
  - **낙관적 갱신**: 이미 로컬 상태를 갱신했다면, 서버와의 일치 여부 정책에 따라 보조적으로 refetch/invalidate 적용 권장.

### 2.2 금지 패턴

- Mutation 성공 후 **아무 갱신도 하지 않는 것**. (해당 데이터를 표시하는 UI가 그대로 이전 값을 보여주면 Stale UI.)
- **onSuccess에서만** ad-hoc으로 refetch하고, 프로젝트 표준(예: `refetchAfterSuccess`, `invalidateQueries`)이 있는데도 쓰지 않는 것 — 일관된 패턴 사용 권장.

### 2.3 적용 범위

- 클라이언트에서 호출하는 **모든 Mutation**(REST PUT/PATCH/DELETE/POST, GraphQL mutation 등)에 적용.
- 서버 전용 배치 작업 등은 프로젝트 정책에 따라 예외 가능. 예외 시 문서화 권장.

---

## 3. 검증

- **자동**: 프로젝트에서 "Mutation 후 refetch/invalidate 누락" 패턴을 스캔하는 스크립트·ESLint 플러그인 도입 권장.
- **수동**: PR 체크리스트에 "Mutation 성공 후 해당 뷰 갱신했는가?" 항목 추가 가능.

**Itemwiki**: 휴리스틱 스캔은 `pnpm run check:stale-ui-risks`이며, `check:constitution-pr`·`check:all`에 포함됩니다. (`@ux-safe` 주석으로 의도적 예외 표시 가능 — `scripts/check-stale-ui-risks.ts` 참고.)

---

## 4. 관련 문서

- [UX_SAFETY_RULES.md](./UX_SAFETY_RULES.md) — 로딩 고정 방지, 타임아웃
- [SILENT_FAILURE_PREVENTION.md](./SILENT_FAILURE_PREVENTION.md) — 에러 시 피드백 의무
- [07-frontend-ui/FRONTEND_LAYER_PRINCIPLES.md](../07-frontend-ui/FRONTEND_LAYER_PRINCIPLES.md) — 전역 상태 공유·단일 진입점

---

**최종 업데이트**: 2026-03-19
