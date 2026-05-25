# 18장 — Cognitive Interface Design

> **Synaxion Constitution 18장**  
> 복잡한 논리를 인간의 인지 패턴에 맞춰 인터페이스로 번역하는 설계 언어.  
> **버전**: 2.13.0

---

## 이 챕터의 핵심 명제

> **Interface must match cognition before it matches aesthetics.**  
> 인터페이스는 예쁘기 전에, 사람이 이해하는 방식과 일치해야 한다.

대부분의 UI 시스템은 **컴포넌트** 기준으로 설계된다 (카드, 테이블, 모달, 차트).  
이 챕터는 **사용자의 사고 방식** 기준으로 설계한다.

```
기존: "어떤 컴포넌트를 쓸까?"
18장: "사용자는 지금 어떤 논리를 이해하려 하는가?"
```

---

## 목차

| 문서 | 역할 |
|------|------|
| [COGNITIVE_INTERFACE_CONSTITUTION.md](./COGNITIVE_INTERFACE_CONSTITUTION.md) | 핵심 원칙 4개 + 설계 규칙 + check:cognitive 게이트 |
| [LOGIC_TYPE_TAXONOMY.md](./LOGIC_TYPE_TAXONOMY.md) | 논리 유형 10개 정의 + 인지 병목 + UI 패턴 매핑 |
| [COMPOSITE_LOGIC_RULES.md](./COMPOSITE_LOGIC_RULES.md) | Primary/Secondary 복합 로직 처리 규칙 |
| [EMOTIONAL_STATE_PATTERNS.md](./EMOTIONAL_STATE_PATTERNS.md) | 감정 상태 레이어 — 불안·탐색·확신·신뢰·압박 |

---

## 다른 챕터와의 관계

```
18 Cognitive Interface  ← 이 챕터: "무엇을 어떻게 구조화할 것인가"
        ↓
15 Component Patterns   ← "그 구조를 어떤 패턴으로 구현할 것인가"
        ↓
13 UI Design            ← "어떤 토큰·색·타이포로 표현할 것인가"
        ↓
14 Experience Direction ← "어떤 브랜드 톤과 무드로 감싸는가"
```

18장은 **설계 결정의 최상위 레이어**다.  
컴포넌트나 토큰을 고르기 전에, 논리 유형을 먼저 정의한다.

---

## 빠른 참조: 논리 유형 → UI 패턴

| 논리 유형 | 대표 UI 패턴 |
|-----------|-------------|
| Hierarchical | 레이어 블록, Concentric diagram, Tree |
| Sequential | Step flow, Timeline, 번호 카드 |
| Conditional | Role tab, Decision tree, Conditional reveal |
| Comparative | Side-by-side 카드, 비교 테이블, Toggle |
| Causal | Before→After, 화살표 플로우, 원인-결과 카드 |
| Relational | 네트워크 다이어그램, 연결선 맵 |
| Proportional | Big number callout, Progress bar, 비율 차트 |
| Cyclic | 루프 다이어그램, 원형 플로우 |
| Categorical | 카드 그리드 + 필터, 태그, 섹션 헤더 |
| State-based | Status badge, Progress bar, Recovery CTA |

→ 상세: [LOGIC_TYPE_TAXONOMY.md](./LOGIC_TYPE_TAXONOMY.md)

---

## Truefarm 적용 예시

| 섹션 | Primary Logic | Secondary Logic | 대표 패턴 |
|------|--------------|----------------|-----------|
| Trust Structure | Hierarchical | Relational | 레이어 다이어그램 |
| How We Work | Sequential | Causal | 번호 스텝 플로우 |
| Programs | Conditional | Categorical | 역할 탭 + 카드 그리드 |
| About | Proportional | — | Big number callout |
| Join Wizard | Conditional | Sequential | Decision tree + Step |
| Admin Dashboard | Hierarchical | Proportional | 레이어 + 통계 |

---

**소속**: Synaxion Constitution 18장  
**최종 업데이트**: 2026-05-25
