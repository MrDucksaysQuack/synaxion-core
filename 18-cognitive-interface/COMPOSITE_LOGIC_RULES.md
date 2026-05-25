# Composite Logic Rules

> **Synaxion Constitution 18장**  
> 실제 화면에서 논리 유형이 복합적으로 나타날 때의 처리 규칙.

---

## §0 왜 복합 로직이 문제인가

현실의 화면은 대부분 **논리 혼합형**이다.

예시:
- 결제 화면 = Sequential(단계) + Conditional(옵션 선택) + Comparative(플랜 비교)
- 대시보드 = Hierarchical(구조) + Proportional(지표) + State-based(현재 상태)
- 온보딩 = Conditional(역할 선택) + Sequential(단계) + Categorical(프로그램 목록)

복합 논리의 위험:

```
사용자: "지금 내가 뭘 이해해야 하는 거지?"

→ 화면이 Hierarchical과 Comparative를 동시에 Primary로 다루면
  사용자는 어느 것을 먼저 처리해야 할지 모른다.
  결과: 인지 마찰 → 이탈
```

---

## §1 Primary / Secondary 구조

### 정의

```
Primary Logic   = 이 화면에서 사용자가 반드시 이해해야 하는 핵심 논리
                  → 레이아웃, 공간 방향, 앵커링이 이것을 기준으로 결정됨

Secondary Logic = Primary를 보조하거나 풍부하게 만드는 부가 논리
                  → Primary 결정 후, 그 안에서 Secondary가 표현됨
```

### 규칙

```
R-COMP-01: Primary Logic은 화면당 반드시 1개다.
R-COMP-02: Secondary Logic은 최대 2개다.
R-COMP-03: Secondary는 Primary의 공간 구조 안에서 표현된다.
R-COMP-04: Secondary가 Primary보다 시각적으로 두드러지면 안 된다.
```

---

## §2 허용 조합

### ✅ 자연스러운 조합

| Primary | Secondary | 패턴 설명 |
|---------|-----------|-----------|
| Sequential | Conditional | 스텝 진행 중 분기 선택 (Wizard) |
| Sequential | State-based | 각 스텝의 완료/오류 상태 표시 |
| Hierarchical | Proportional | 레이어 구조에 크기/중요도 표현 |
| Hierarchical | Relational | 계층 안에서 노드 간 연결 |
| Conditional | Categorical | 역할 선택 후 해당 카테고리 표시 |
| Categorical | Comparative | 카테고리 내 옵션들 비교 |
| State-based | Causal | 상태 변화의 이유 표시 |
| Proportional | Categorical | 카테고리별 규모 비교 |

---

### ❌ 금지 조합 (충돌 조합)

| 조합 | 금지 이유 | 해결 방법 |
|------|-----------|-----------|
| Hierarchical + Comparative (동시 Primary) | 위계 파악 vs 병렬 비교 — 공간 방향 충돌 | 화면 분리 또는 Hierarchical Primary, Comparative는 레이어 내부로 |
| Sequential + Relational (동시 Primary) | 선형 흐름 vs 네트워크 — 사용자가 어느 방향을 따라야 할지 모름 | Sequential Primary, Relational은 특정 스텝의 설명 섹션으로 |
| Conditional + Comparative (동시 Primary) | "나는 누구인가" + "어떤 게 더 나은가" 동시 요구 | Conditional로 역할 결정 후, 그 역할 내에서 Comparative |
| Cyclic + Sequential (동시 Primary) | 원형 흐름 vs 선형 흐름 — 방향 개념 충돌 | 목적에 따라 하나만 선택 |

---

## §3 복합 로직 설계 순서

```
1. 이 화면의 핵심 목적은 무엇인가?
   → Primary Logic Type 결정

2. Primary Logic의 공간 방향과 앵커 요소를 먼저 배치한다

3. 보조적으로 필요한 논리가 있는가?
   → Secondary Logic Type 결정 (최대 2개)
   → 충돌 조합인지 확인

4. Secondary는 Primary 구조 안의 어느 위치에 들어가는가?
   → 섹션 내부, 카드 안, 툴팁, 서브패널 등

5. 화면 전체에서 Primary가 시각적으로 지배적인가?
   → Yes: 진행
   → No: Secondary 요소 축소 또는 Progressive Disclosure로 감춤
```

---

## §4 실제 화면별 분석

### Truefarm — Join Wizard

```
Primary:   Conditional (나는 어떤 역할인가?)
Secondary: Sequential  (몇 단계로 진행되는가?)

레이아웃:
- 화면 상단: Step indicator (Secondary — 진행 위치만 표시)
- 화면 중앙: 역할별 질문 (Primary — 이것이 주된 인지 과제)
- 하단: Next/Back (Sequential 진행)
```

### Truefarm — Trust Structure

```
Primary:   Hierarchical (레이어 구조 이해)
Secondary: Relational   (레이어 간 연결 관계)

레이아웃:
- 위에서 아래: Agrinovation OS → Truefarm → 파트너 → 농가
- 레이어 클릭 시: 해당 레이어의 관계 설명 (Secondary — Progressive Disclosure)
```

### Truefarm — Programs

```
Primary:   Conditional  (나는 어떤 역할인가?)
Secondary: Categorical  (해당 역할의 프로그램 분류)

레이아웃:
- 상단: 역할 탭 (Primary — Farmer / Buyer / Partner)
- 탭 선택 후: 카드 그리드 (Secondary — 해당 역할 프로그램들)
```

### Truefarm — About (임팩트 섹션)

```
Primary:   Proportional (규모·임팩트를 직관적으로)
Secondary: Categorical  (지표 분류)

레이아웃:
- 큰 숫자 3–4개 (Primary — 크기가 먼저)
- 각 숫자 아래 카테고리 레이블 (Secondary — 무엇인지)
```

### Agrinovation — Outlet Dashboard

```
Primary:   Hierarchical (Outlet > Batch > Record 구조)
Secondary: State-based  (각 항목의 현재 상태)
Secondary: Proportional (완료율·규모)

레이아웃:
- 좌측 패널: 계층 트리 (Primary)
- 우측 메인: 선택된 레이어의 State + 통계 (Secondary들)
```

### Agrinovation — 작업 플로우

```
Primary:   Sequential  (수확 → 검증 → 기록 → 유통)
Secondary: State-based (각 단계의 완료/진행/오류)
Secondary: Causal      (단계가 완료되어야 다음 단계 가능)

레이아웃:
- 수평 Step flow (Primary)
- 각 스텝에 Status badge (Secondary: State)
- 연결선에 잠금/활성 상태 (Secondary: Causal)
```

---

## §5 복합 로직 체크리스트

```
[ ] Primary Logic이 1개로 명확히 정의되었는가?
[ ] Secondary Logic이 2개 이하인가?
[ ] 충돌 조합 목록에 없는가?
[ ] Secondary 요소가 Primary 구조 안에 포함되어 있는가?
[ ] Primary가 시각적으로 지배적인가?
[ ] Primary의 공간 방향이 Secondary에 의해 방해받지 않는가?
```

---

**버전**: 2.13.0  
**최종 업데이트**: 2026-05-25  
**소속**: Synaxion Constitution 18장
