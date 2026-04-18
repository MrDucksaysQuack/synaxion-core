# 리팩토링 안전 원칙 (Refactoring Safety Principle)

**목적**: 작은 변경이 예상 밖으로 퍼지는 것을 줄이기 위해, **변경 영향 범위를 선언**하고 **테스트·계약으로 고정점**을 남긴다.

**Tier**: **권장(리드·아키텍트)** — 레이어별 숫자 기준·스크립트 이름은 프로젝트가 `measure:change-surface` 등으로 정의한다.

---

## 1. 변경 전: 영향 범위(Change surface)를 가늠한다

- 식별자·공개 함수·경계 타입을 바꿀 때는 **의존 그래프 상 몇 층까지** 퍼지는지 가늠한다. “코어 한 점”이 **API·UI 전역**으로 번지면 분할·어댑터를 먼저 검토한다.
- **레이어 규칙**과 함께 쓴다 — [LAYER_BOUNDARIES.md](../01-foundations/LAYER_BOUNDARIES.md).

---

## 2. 변경 중: 인터페이스로 흡수한다

- 영향이 클수록 **직접 구현 import** 대신 **좁은 인터페이스·팩토리**로 호출부를 고정하고, 구현만 교체 가능하게 만든다.

---

## 3. 변경 후: 고정점(Fixed points)을 갱신한다

- **타입 체크·계약 테스트·대표 E2E** 중 제품이 정한 **최소 고정점**을 리팩토링 단위마다 통과시킨다 — [CONTRACT_TESTING.md](../05-testing-principles/CONTRACT_TESTING.md), [TESTING_PYRAMID.md](../05-testing-principles/TESTING_PYRAMID.md).
- 공개 API·이벤트 스키마가 바뀌면 **CHANGELOG·마이그레이션 노트**를 동일 PR에 둔다.

---

## 4. “헌법이 깨질” 확장은 목록으로 남긴다

- 트래픽·데이터 모델·정책 개수가 한계에 가까워질 때, **어떤 가정이 깨지는지**를 문서화해 두면 다음 헌법 개정의 근거가 된다(인스턴스의 “breaking scenarios” 문서와 역할이 같다).

---

## 🔗 관련 문서

- [CONSISTENCY_AS_SYSTEM_CONSTRAINT.md](../01-foundations/CONSISTENCY_AS_SYSTEM_CONSTRAINT.md) — 일관성을 시스템 제약으로  
- [CONCEPTUAL_ROT_PREVENTION.md](../04-safety-standards/CONCEPTUAL_ROT_PREVENTION.md) — 개념 드리프트 예방  
- **Itemwiki 인스턴스** — [REFACTORING_SAFETY.md](../../itemwiki-constitution/itemwiki-specific/development/REFACTORING_SAFETY.md), [BREAKING_SCENARIOS.md](../../itemwiki-constitution/itemwiki-specific/development/BREAKING_SCENARIOS.md)

---

**최종 업데이트**: 2026-04-14
