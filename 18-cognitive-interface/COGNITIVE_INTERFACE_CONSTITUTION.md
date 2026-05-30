# Cognitive Interface Constitution

> **Synaxion Constitution 18장**  
> 인지 구조 기반 UI 설계의 보편 원칙. Logic Type·감정 상태·청킹은 구조만 정의하고, 서브도메인 매핑은 인스턴스에 위임한다.

---

## §0 위치와 역할

### Aesthetics보다 Cognition이 선행

```
잘못된 순서:  시각 디자인 → 컴포넌트 배치 → 사용자 혼란
올바른 순서:  Primary Question → Logic Type → 정보 구조 → 시각 토큰(13·14장)
```

### 정의 의무

모든 Synaxion 기반 프로젝트는:

1. **Logic Type Taxonomy** — 10개 타입 중 Primary(필수)·Secondary(권장)를 **모든 활성 서브도메인**에 매핑한다.
2. **Primary Question** — 사용자가 해당 화면에서 던지는 대표 질문을 한 문장으로 정의한다.
3. **5감정 상태 패턴** — [EMOTIONAL_STATE_PATTERNS.md](./EMOTIONAL_STATE_PATTERNS.md) 중 프로젝트가 가정하는 상태를 도메인 가이드에 연결한다.

매핑 문서(`COGNITIVE_INTERFACE_MAPPING.md`)가 없거나 활성 서브도메인 커버리지가 100% 미만이면 **인지 인터페이스 미완성**으로 간주한다.

---

## §1 네 가지 원칙

### 원칙 1 — Question-First

화면 설계는 "무엇을 보여줄까"가 아니라 **"사용자가 무엇을 묻는가"**에서 시작한다.  
Primary Question이 정의되지 않은 목록·상세 페이지는 Plan Complete로 승격할 수 없다.

### 원칙 2 — Logic-Type Fidelity

각 서브도메인의 Primary Logic Type에 맞는 UI 패턴을 사용한다.  
[Hierarchical 도메인에 flat 카드 그리드만 제공] = 인지 마찰. 자세한 위반 신호는 [LOGIC_TYPE_TAXONOMY.md](./LOGIC_TYPE_TAXONOMY.md).

### 원칙 3 — Chunking 7±2

- 네비게이션·필터·행 액션 등 **동시 선택지**는 7±2를 넘지 않는다.
- 서브도메인 30+개 제품은 **매트릭스 카테고리**(entity·item·finance·…)로 1차 청킹한다.
- 도메인 가이드 본문은 3–5문장(한 청크) 이내.

### 원칙 4 — Emotion-Aware Guidance

Empty·Error·첫 진입·자동 결정(Conscious) 구간은 [EMOTIONAL_STATE_PATTERNS.md](./EMOTIONAL_STATE_PATTERNS.md)의 UI 대응을 따른다.  
감정 상태는 Ch.14 Experience Direction의 브랜드 축과 충돌하지 않아야 한다.

---

## §2 Logic Type (요약)

10개 Logic Type의 정의·권장 UI·금지 패턴은 [LOGIC_TYPE_TAXONOMY.md](./LOGIC_TYPE_TAXONOMY.md)가 SSOT이다.

| # | Logic Type | 대표 질문 형태 |
|---|------------|----------------|
| 1 | Hierarchical | "어디에 속하나?" |
| 2 | Categorical | "어떤 종류인가?" |
| 3 | Relational | "무엇과 연결되나?" |
| 4 | Proportional | "얼마나·비율은?" |
| 5 | Sequential | "다음에 무엇인가?" |
| 6 | Causal | "왜·어떻게 발생했나?" |
| 7 | Comparative | "무엇과 비교하면?" |
| 8 | Conditional | "조건이 맞나?" |
| 9 | State-based | "지금 상태는?" |
| 10 | Cyclic | "주기·반복은?" |

---

## §3 복합 Logic

대부분의 비즈니스 서브도메인은 Primary + Secondary 복합이다.  
복합 규칙·UI 우선순위는 [COMPOSITE_LOGIC_RULES.md](./COMPOSITE_LOGIC_RULES.md).

---

## §4 검증 (인스턴스)

| 검증 | 설명 |
|------|------|
| `check:cognitive-interface-completeness` | 매핑·domain-guides·Logic Type enum 정합 (Ch.18 E-stream) |
| PR 체크리스트 | 신규 SubDomain → COGNITIVE_INTERFACE_MAPPING 1행 추가 |

---

## §5 관련 문서

- [14-experience-direction/EXPERIENCE_CONSTITUTION.md](../14-experience-direction/EXPERIENCE_CONSTITUTION.md)
- [10-design-flow/UX_CONSTITUTION.md](../10-design-flow/UX_CONSTITUTION.md)
- [19-product-ui-architecture/README.md](../../synaxion-core/19-product-ui-architecture/README.md)

---

**최종 업데이트**: 2026-05-28
