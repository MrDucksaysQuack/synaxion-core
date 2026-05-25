# Cognitive Interface Constitution

> **Synaxion Constitution 18장 — 핵심 헌법**  
> 복잡한 논리를 인간의 인지 패턴에 맞춰 인터페이스로 번역하는 설계 원칙과 규칙.

---

## §0 목적

이 헌법은 다음 질문에 답한다:

> **"이 화면에서 사용자는 지금 어떤 논리를 이해하려 하는가?"**

이 질문이 먼저 정의되어야, 올바른 레이아웃·컴포넌트·정보 구조를 선택할 수 있다.

### 인터페이스 실패의 실제 원인

대부분의 UI 문제는 "못생겨서"가 아니라 **인지 구조 불일치**에서 발생한다:

| 증상 | 실제 원인 |
|------|-----------|
| "읽어도 이해가 안 된다" | 논리 유형과 다른 UI 패턴 사용 |
| "어디를 먼저 봐야 할지 모르겠다" | Anchoring 없음 |
| "너무 복잡하다" | 청킹 실패, 한 화면에 정보 과다 |
| "나한테 해당하는 게 뭔지 모르겠다" | Conditional 논리에 Categorical UI 사용 |
| "신뢰가 안 간다" | Hierarchical 구조가 시각화되지 않음 |

---

## §1 핵심 원칙 4개

### 원칙 1 — 청킹 (Chunking)

사람의 작업 기억은 한 번에 **7±2개** 항목을 처리한다.

```
규칙: 한 화면(또는 한 섹션)에서 독립적 정보 단위는 3–5개를 초과하지 않는다.
위반 증상: "스크롤해도 끝이 없다", "다 비슷해 보인다"
```

적용:
- 7개 이상의 항목은 반드시 카테고리로 묶거나 필터를 제공한다
- 한 섹션의 카드·항목이 5개를 넘으면 Progressive Disclosure를 적용한다

---

### 원칙 2 — 공간 은유 (Spatial Metaphor)

인간은 공간적 관계를 통해 논리적 관계를 직관한다.

```
위↑      = 상위, 더 중요함, 먼저 일어남
아래↓    = 하위, 세부사항, 나중에 일어남
왼→오른  = 시간 흐름, 순서, 인과
가까움   = 관련성, 같은 그룹
크기     = 중요도, 규모
```

**규칙**: 논리 관계가 공간 배치와 일치해야 한다. 공간 은유를 역행하면 인지 마찰이 생긴다.

위반 예시:
```
❌ 순서형 논리 (Sequential)를 세로 그리드로 배치 — 순서가 보이지 않음
❌ 계층형 논리 (Hierarchical)를 가로 나열 — "위아래" 관계가 사라짐
❌ 비율형 논리 (Proportional)를 균일한 카드 크기로 표현 — 크기가 의미를 잃음
```

---

### 원칙 3 — 점진적 노출 (Progressive Disclosure)

사용자는 **단계적으로** 이해한다. 처음부터 전부 보여주면 인지 과부하가 발생한다.

```
레벨 1: 제목 / 핵심 키워드만 — 탐색 단계
레벨 2: 요약 한 줄 + 아이콘 — 관심 확인 단계
레벨 3: 상세 설명 + 행동 유도 — 결정 단계
```

**규칙**: 복잡한 논리 유형(Hierarchical, Relational, Causal)은 항상 3레벨 이상의 노출 구조를 갖는다.

적용 패턴:
- Accordion / Expand
- Hover→Detail
- Tab → Card → Modal
- Scroll reveal (스크롤로 단계적 등장)

---

### 원칙 4 — 앵커링 (Anchoring)

첫 번째로 본 정보가 이후 해석의 **기준점**이 된다.

```
규칙: 논리 유형에 따라 올바른 정보를 첫 번째로 보여준다.
```

| 논리 유형 | 첫 번째로 보여줄 것 |
|-----------|-------------------|
| Hierarchical | 가장 큰 단위 (최상위 레이어) |
| Sequential | 1번 스텝 |
| Conditional | "나는 누구인가" 선택지 |
| Comparative | "내가 속한 옵션" |
| Proportional | 가장 큰 숫자 / 가장 중요한 지표 |
| Relational | 중심 노드 (사용자와 가장 가까운 것) |

위반 예시:
```
❌ Comparative 화면에서 "추천" 옵션을 마지막에 배치
❌ Sequential 화면에서 3번 스텝을 먼저 보여줌
❌ Hierarchical 화면에서 세부 항목으로 시작
```

---

## §2 설계 규칙

### 규칙 R-01: Logic-First

모든 화면·섹션 설계는 **논리 유형 정의**로 시작한다.

```
✅ 올바른 순서:
  1. 이 화면의 Primary Logic Type은? → 결정
  2. 해당 Logic Type의 인지 병목은? → 확인
  3. 매핑된 UI 패턴 중 선택
  4. 컴포넌트·토큰 적용 (15장, 13장)

❌ 잘못된 순서:
  1. "카드로 만들자"
  2. 내용 채우기
```

---

### 규칙 R-02: Single Primary Logic

한 화면에 **Primary Logic은 1개**다.

```
❌ 금지: Hierarchical + Comparative를 동시에 Primary로 사용
✅ 허용: Hierarchical (Primary) + Proportional (Secondary)
```

복합 논리가 필요한 경우 → [COMPOSITE_LOGIC_RULES.md](./COMPOSITE_LOGIC_RULES.md)

---

### 규칙 R-03: Spatial Alignment

선택한 Logic Type에 맞는 **공간 방향**을 준수한다.

| Logic Type | 권장 공간 방향 |
|------------|--------------|
| Hierarchical | 수직 (위→아래) |
| Sequential | 수평 (왼→오른) 또는 수직 번호 |
| Comparative | 수평 병렬 |
| Relational | 방사형 또는 연결 선 |
| Categorical | 그리드 |
| Proportional | 크기 차이 또는 수직 바 |

---

### 규칙 R-04: Anchor First

논리 유형별 **앵커 요소를 첫 번째**로 배치한다. (§1 원칙 4 참고)

---

### 규칙 R-05: Emotional Layer

논리 유형만으로 UI를 결정하지 않는다.  
사용자의 **감정 상태**를 Secondary 레이어로 고려한다.

→ [EMOTIONAL_STATE_PATTERNS.md](./EMOTIONAL_STATE_PATTERNS.md)

---

### 규칙 R-06: 3–5 Chunk Limit

한 화면·섹션의 독립 정보 단위는 **최대 5개**다.  
초과 시 그룹화 또는 Progressive Disclosure를 강제한다.

---

## §3 check:cognitive 게이트

화면·섹션 설계 검토 시 아래를 확인한다.

```
[ ] Primary Logic Type이 명시되어 있는가?
[ ] 선택된 UI 패턴이 해당 Logic Type의 매핑 목록에 있는가?
[ ] 공간 배치가 Logic Type의 공간 방향과 일치하는가?
[ ] 앵커 요소가 첫 번째로 배치되어 있는가?
[ ] 한 화면에 독립 정보 단위가 5개 이하인가?
[ ] Primary Logic이 2개 이상이면 → COMPOSITE_LOGIC_RULES 적용했는가?
[ ] 사용자 감정 상태가 고려되었는가? (EMOTIONAL_STATE_PATTERNS 참고)
```

모든 항목이 체크될 때 해당 화면은 Cognitive Interface Constitution을 준수한다.

---

## §4 위반 분류

| 등급 | 기준 | 예시 |
|------|------|------|
| Critical | 논리 유형과 UI 패턴이 완전히 불일치 | Sequential 내용을 랜덤 그리드로 표시 |
| Major | Anchoring 없음, 첫 화면에서 앵커 누락 | Comparative에서 추천 옵션이 마지막 |
| Minor | 청킹 위반 (6–8개) | 섹션에 항목 7개, 그룹화 없음 |
| Warning | 공간 방향 부분 불일치 | 순서형인데 좌우 방향이 혼재 |

---

## §5 다른 챕터와의 관계

| 챕터 | 관계 |
|------|------|
| 15 Component Patterns | Logic Type 결정 후, 해당 UI 패턴의 구현 디테일은 15장에서 |
| 13 UI Design | 토큰·색상·타이포 — Logic Type과 무관하게 적용 |
| 14 Experience Direction | 브랜드 톤·무드 — 인지 구조 위에 감정 레이어로 추가 |
| 12 Judgment | Conditional Logic이 복잡한 규칙 기반이면 12장 Judgment Engine 연결 |
| 10 Design Flow | UX 플로우 설계 시 Logic Type을 플로우 단계별로 정의 |

---

**버전**: 2.13.0  
**최종 업데이트**: 2026-05-25  
**소속**: Synaxion Constitution 18장
