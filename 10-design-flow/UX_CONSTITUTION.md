# UX Constitution

**Tier**: 1 (필수)
**목적**: 모든 Synaxion 프로젝트에서 최소 UX 품질을 강제한다.
         "좋다/나쁘다" 감각 판단이 아니라, 빠졌으면 사용자 피해가 생기는 구조 기준이다.

---

## §0 Constitution vs Project Guide 경계

이 문서가 다루는 것:
- 자동 또는 반자동으로 검증 가능한 UX 구조 규칙
- 위반 시 사용자, 접근성, 데이터 손실에 실제 피해가 생기는 규칙

이 문서가 다루지 않는 것:
- "이 흐름이 자연스러운가" — 프로젝트별 UX Research Guide
- 사용자 인터뷰, 프로토타입 반응 분석 — 프로젝트별
- 브랜드 감성, 카피 톤 — 14-experience-direction

---

## §1 7개 필수 UX 규칙

### UX-01 — Primary Intent Declaration
모든 페이지(또는 주요 모달)는 해당 화면의 primary user intent를 한 문장으로 정의해야 한다.
- 검증: 프로젝트 constitution 문서의 해당 페이지 항목에 intent 필드가 있는가 (soft check)
- 위반 신호: 한 화면에 행동 목적이 2개 이상 충돌한다

### UX-02 — State Coverage
모든 interactive flow는 **최소** loading, empty, error, success 4가지 상태를 반드시 정의해야 한다.
- 검증: check:ux-state-coverage (컴포넌트 내 loading/error/empty 분기 존재 여부 정적 분석)
- 위반 신호: data가 없을 때 빈 화면, 에러 시 무반응

### UX-02b — Permission & Configuration Surfaces (2.18.0+)
권한·설정 미완은 blank와 구분한다. list/detail shell은 아래를 **success와 혼동하지 않는** 별도 surface로 표현한다.
- **forbidden** — 주체가 해당 리소스·action에 도달 불가 (이유 상세는 기본 비노출 — [INDIRECT_UX_PRINCIPLE.md](./INDIRECT_UX_PRINCIPLE.md))
- **not-configured** — tenant·subdomain·schema 미설정 (empty와 구분)
- 검증: check:ux-state-coverage 확장(인스턴스) · PR 체크리스트
- 위반 신호: 403 시 빈 테이블, 미설정 subdomain에 generic "불러오지 못했습니다"만 표시

### UX-03 — Form Completeness
모든 form은 아래 4가지를 정의해야 한다:
  1. validation 조건
  2. 각 에러에 대한 copy
  3. submit 중 상태 (loading/disabled)
  4. 성공/실패 후 recovery path
- 검증: PR 리뷰 체크리스트 (UX Safety Rules와 연계)
- 위반 신호: submit 후 결과 없음, 에러 copy가 "Something went wrong"만 있음

### UX-04 — Single Primary CTA
페이지(또는 주요 섹션)에는 primary CTA가 하나여야 한다.
예외: dashboard, listing 페이지는 명시적으로 multi-CTA 허용으로 분류해야 한다.
- 검증: PR 리뷰 (soft check)
- 위반 신호: 같은 레벨의 버튼이 3개 이상, 무엇을 눌러야 할지 모름

### UX-05 — Navigation Label Standard
내비게이션 레이블은 사용자 mental model 언어를 사용해야 한다.
내부 데이터베이스 용어, 개발 네이밍을 그대로 노출하지 않는다.
- 검증: PR 리뷰 + IA_NAVIGATION_PRINCIPLES.md 체크리스트
- 위반 신호: "user_profile", "item_list", "contribution_moderation" 등이 레이블로 노출

### UX-06 — Destructive Action Safety
데이터 삭제, 영구 변경, 취소 불가 액션은 아래 중 하나 이상을 반드시 구현해야 한다:
  - 명시적 확인 다이얼로그 (텍스트 입력 또는 이중 확인)
  - Undo / soft delete (복구 가능한 삭제)
- 검증: check:ux-risks 또는 PR 리뷰
- 연계: UX_SAFETY_RULES.md, INPUT_PERSISTENCE_GUARANTEE.md

### UX-07 — Touch Target Minimum
모바일 터치 가능 요소(버튼, 링크, 입력)의 최소 크기:
- 터치 타겟: 44×44px 이상 (WCAG 2.5.5 기준)
- 인접 타겟 간격: 8px 이상
- 검증: `synaxion-core/verification/check-ux-touch-targets.mjs` (`check:ux-touch-targets`, 경고만)

---

## §2 검증 레인

| 규칙 | 검증 방법 | CI 차단 여부 |
|------|-----------|-------------|
| UX-01 | soft check (문서 항목 존재) | No (PR 코멘트) |
| UX-02 | check:ux-state-coverage | Yes (경고 → 실패) |
| UX-02b | check:ux-state-coverage (확장) · PR | No → 인스턴스 strict 승격 시 Yes |
| UX-03 | PR 체크리스트 | No |
| UX-04 | PR 체크리스트 | No |
| UX-05 | PR 체크리스트 | No |
| UX-06 | check:ux-risks | Yes |
| UX-07 | check:ux-touch-targets | No (경고) |

---

## §3 관련 문서

- [10-design-flow/DESIGN_FLOW_PRINCIPLES.md](./DESIGN_FLOW_PRINCIPLES.md) — 한 페이지 한 목적, 3-Depth, 플로우 원칙
- [07-frontend-ui/UX_FEEDBACK_AND_ACCESSIBILITY.md](../07-frontend-ui/UX_FEEDBACK_AND_ACCESSIBILITY.md) — 피드백·접근성
- [04-safety-standards/UX_SAFETY_RULES.md](../04-safety-standards/UX_SAFETY_RULES.md) — UX 안전 규칙
- [10-design-flow/UX_READINESS_RUBRIC.md](./UX_READINESS_RUBRIC.md) — 완성도 자가 평가
- [INDIRECT_UX_PRINCIPLE.md](./INDIRECT_UX_PRINCIPLE.md) — 간접 UX · UX-02b 맥락

**최종 업데이트**: 2026-06-23
