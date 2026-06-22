# Recursive Layering Principle
# 재귀적 계층화 원칙

> **하나의 헌법 원칙은 적용 가능한 모든 추상 수준에서 *동일한 어휘로* 작동해야 한다.**  
> 어휘를 재사용하지 못하는 층이 있다면, 그 층의 추상화가 잘못된 것이다.

**Tier**: 3 (도입 단계 · 2.15.0 신규)  
**상태**: Inflomatrix 인스턴스에서 5중 중첩 매트릭스(SubDomain · Flow Internal · Stream Internal · Schema Internal · Conscious Internal · ERIC)로 실증.  
**승격 조건**: META_CONSTITUTION.md §0.3 *Pattern Promotion Model* 참조 — 6개월 내 1개 외부 인스턴스 적용 시 Tier 2, 2개 적용 시 Tier 1.  
**연계**: [CONSISTENCY_AS_SYSTEM_CONSTRAINT.md](./CONSISTENCY_AS_SYSTEM_CONSTRAINT.md) · [STRUCTURE_FIRST_PRINCIPLE.md](./STRUCTURE_FIRST_PRINCIPLE.md) · [META_CONSTITUTION.md](../META_CONSTITUTION.md)

**최종 업데이트**: 2026-05-29

---

## 1. 문제

대부분 시스템은 같은 *문제*를 여러 추상 수준에서 *다른 어휘로* 푼다.

- 도메인 간 관계 → ERD `1:N` · `M:N`
- 컴포넌트 간 관계 → Props passing · Event bubbling
- 모듈 간 관계 → import graph · dependency injection
- 마이크로서비스 간 관계 → message contract · API spec
- 헌법 원칙 간 관계 → 문서 인용 · 사람의 기억

각각의 어휘는 *그 층에서는* 최적화되어 있지만, 학습 비용·운영 비용은 *층별로 누적*된다. 새 개발자는 N개의 표현법을 익혀야 하고, 검증 도구는 N벌이 필요하며, 한 층에서 발견한 갭은 다른 층에 *자동으로* 전파되지 않는다.

---

## 2. 전환: 어휘를 추상 수준에 *불변*하게 만든다

**한 번 정의된 관계 어휘는 *모든* 적용 가능한 추상 수준에서 같은 의미로 작동해야 한다.**

- 같은 관계 타입(예: `F·R·T·D·E`)이 도메인 매트릭스에도, 도메인 *내부* 컴포넌트 매트릭스에도 동일하게 적용된다.
- 같은 액션 그룹(예: 11개 CRUD·exec·link…)이 도메인 단위에도, 컴포넌트 단위에도 동일하게 적용된다.
- 같은 헌법 원칙(예: *침묵 실패 금지*)이 API 핸들러에도, 엔진 콜백에도, 프론트 fetch에도 동일하게 적용된다.

이를 *재귀적 계층화*라 부른다.

---

## 3. 운영 원리 (Principles)

### Principle 1 — Vocabulary Invariance (어휘 불변성)

관계·액션·상태의 어휘는 추상 수준에 따라 변하지 않는다. 한 어휘 집합은 *적용 가능한 모든 층*에서 같은 의미로 작동한다.

### Principle 2 — Self-Similar Grammar (자기 닮음 문법)

한 층에서 작동하는 패턴은 *내포된 하위 층*에서도 같은 문법으로 작동해야 한다. 그렇지 못한 층은 *추상화가 부정확한* 신호다.

### Principle 3 — Cognitive Economy (인지 경제)

어휘를 한 번 익히면 *모든 층*을 즉시 읽을 수 있어야 한다. 학습 비용은 *층 수*에 비례하지 않고 *어휘 크기*에 비례한다.

### Principle 4 — Promotion-Based Adoption (점진 승격)

신규 어휘는 가장 깊은 안쪽 층에서 시작해 외곽으로 검증되며 확산된다. 외곽 어휘가 안쪽에서 깨지면 그것은 *어휘의 결함*이다.

---

## 4. Inflomatrix 실증 (2026-05-29)

| 층 | 엔티티 수 | 관계 타입 | 액션 그룹 | 매트릭스 SSOT | CI 게이트 |
|----|-----------|-----------|-----------|---------------|----------|
| **A. Outer** (SubDomain) | 44 | F·R·T·D·E | 11 | `matrix-domains.json`·`matrix-relations.json`·`matrix-actions.json` | `check:matrix-domain-alignment`·`check:matrix-action-alignment` |
| **B. Middle** (Flow Internal) | 11 | F·R·T·D·E | 11 | `matrix-flow-internal.json` | `check:matrix-flow-internal-alignment` |
| **B'. Middle** (Stream Internal) | 6 | F·R·T·D·E | 11 | `matrix-stream-internal.json` | `check:matrix-stream-internal-alignment` |
| **B''. Middle** (Schema Internal) | n | F·R·T·D·E | 11 | `matrix-schema-internal.json` | (in progress) |
| **C. Inner** (Conscious Internal) | 5 stages | F·R·T·D·E | 11 | `matrix-conscious-internal.json` | `check:matrix-conscious-internal-alignment` |
| **C'. Inner** (ERIC Judgment) | 4 axes | F·R·T·D·E | 11 | `matrix-eric-conscious.json` | `check:matrix-eric-conscious-alignment` |

다섯 층 모두에서 *같은 5종 관계 타입*과 *같은 11 액션 그룹*이 작동한다. 한 층의 학습 비용을 지불하면 나머지 네 층은 즉시 읽힌다.

---

## 5. 적용 기준

새 추상 수준을 도입할 때, 다음 세 가지를 *모두* 만족하는지 검증한다.

1. **어휘 재사용 가능성** — 기존 관계 타입·액션 그룹의 90% 이상이 새 층에서도 의미를 가지는가? 그렇지 않다면 어휘를 확장하거나 새 층의 추상화를 재검토한다.
2. **자기 닮음 검증** — 새 층의 매트릭스가 외곽 층의 매트릭스와 *같은 형태의 JSON 스키마*로 표현 가능한가?
3. **CI 게이트 동형성** — 새 층에 대해 `check:matrix-{name}-alignment` 형태의 검증 스크립트가 *기존 게이트의 코어를 재사용*해 작성 가능한가?

세 항목 중 하나라도 *원천적으로* 만족 불가능하면, 그 층은 재귀적 계층화의 적용 대상이 아니다. 별도 어휘를 두되 그 이유를 문서화한다.

---

## 6. 곱하기 효과 (Multiplicative Effect)

재귀적 계층화는 *다른 헌법 원칙들의 효과를 곱한다*.

- [ADJACENT_DEBT_RULE.md](../02-development-framework/ADJACENT_DEBT_RULE.md)(Touch-It Type-It)를 *코드 부채*뿐 아니라 *문서 부채*·*테스트 부채*·*매트릭스 부채*에도 적용하면 — 같은 한 원칙이 4개 축에서 동시 작동한다.
- [N_WAY_CONSISTENCY_GATE.md](./N_WAY_CONSISTENCY_GATE.md)(N중 정합 게이트)를 매트릭스 SSOT 간뿐 아니라 코드·문서·UI 간에도 적용하면 — 같은 한 원칙이 모든 SSOT 쌍에서 동시 작동한다.

원칙은 *덧셈*이 아닌 *곱셈*으로 확장된다. 이는 일관성의 인지 비용을 평탄화한다.

---

## 7. 한계 (Limits)

- **재귀 깊이의 비용** — 너무 깊이 들어가면 *각 층의 의미가 흐려진다*. 권장 깊이는 3~5층. 그 이상은 어휘의 의미적 정확성이 떨어지기 시작한다.
- **외부 도메인 적용 가능성** — 도메인이 *명확한 카테고리 구조*를 가져야 매트릭스 정형화 가능. 자유 텍스트·창작·실시간 신호 도메인에는 적용이 어렵다.
- **신뢰성의 후행 검증** — 어휘 재사용이 *진짜* 작동하는지는 *수개월의 실증* 후에야 확인 가능. 초기 가설 단계의 어휘는 변경에 열려 있어야 한다.

---

## 8. 검증

- **존재 검증**: 새 추상 수준의 매트릭스 JSON 파일이 `docs/data/matrix-*.json` 명명 규약을 따르는지.
- **어휘 검증**: 새 JSON이 기존 5종 관계 타입(F·R·T·D·E)과 11 액션 그룹을 사용하는지 — `check:vocabulary-coverage` (제안).
- **자기 닮음 검증**: 매트릭스 JSON 스키마가 외곽 층과 *호환 가능한 superset/subset*인지 — `check:matrix-schema-isomorphism` (제안).
- **인지 검증**: 새 팀원이 외곽 매트릭스 30분 학습 후 *안쪽 매트릭스*를 *추가 학습 없이* 읽을 수 있는지 — 측정 가능한 유저빌리티 게이트.

---

## 9. 참고

- [CONSISTENCY_AS_SYSTEM_CONSTRAINT.md](./CONSISTENCY_AS_SYSTEM_CONSTRAINT.md) — 본 원칙의 직계 상위 원리
- [META_CONSTITUTION.md](../META_CONSTITUTION.md) §0.2 — 일관성을 시스템 제약으로
- Inflomatrix `docs/data/matrix-*.json` (6개) — 실증 인스턴스
- Inflomatrix `inflomatrix-fractal-matrix-pattern.html` — 시각화

---

**제안자**: Inflomatrix instance (2026-05-29)  
**Tier 3 등재일**: 2026-05-29 (Synaxion 2.15.0)
