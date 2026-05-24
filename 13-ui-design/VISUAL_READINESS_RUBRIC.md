# Visual Design Readiness Rubric

**목적**: 프로젝트의 시각 시스템 완성도를 5점 척도로 자가 평가한다.

---

## 채점표

| 점수 | 기준 |
|------|------|
| 0 | 임의 색상·spacing·컴포넌트별 스타일 난립. 토큰 없음 |
| 1 | 일부 토큰은 있으나 raw value(#3B82F6, 16px 등)가 컴포넌트에 직접 사용됨 |
| 2 | 색상·타입·spacing 토큰은 있으나 semantic 계층 없음. dark mode 없거나 수동 override |
| 3 | 3-Tier Token 구조 완성 (Primitive→Semantic→Component). state 4종 구현. motion 토큰 있음 |
| 4 | check:raw-values, check:theme-split 등으로 raw value 사용 자동 차단. dark mode semantic remapping |
| 5 | Brand Emotion Axis, Image Direction, Page Narrative Rhythm이 프로젝트 인스턴스에 정의됨 |

**Synaxion UI Constitution 책임 범위**: 4점까지
**5점은 Project Brand Experience Guide와 함께 완성** — 14-experience-direction 인스턴스

---

## 4점 달성 체크리스트

- [ ] `check:raw-values` — 컴포넌트에서 CSS 변수 없는 색상/px 값 금지
- [ ] `check:theme-split` — 라이트/다크 전환이 semantic token만으로 처리됨
- [ ] `check:motion-tokens` — transition/animation이 토큰 외 임의 값 사용 금지
- [ ] `check:font-weights` — 프로젝트에서 3종 이상의 font-weight 사용 금지
- [ ] state 4종(focus, hover, active, disabled) 모든 interactive 요소에 정의됨

**최종 업데이트**: 2026-05-24
