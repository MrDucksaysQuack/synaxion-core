# Logic Type Taxonomy

> **Synaxion Constitution 18장**  
> 복잡한 논리를 10개 유형으로 분류하고, 각 유형에 맞는 UI 패턴을 정의한다.

---

## 사용 방법

1. 설계할 화면·섹션의 **핵심 질문**을 찾는다
2. 해당 질문이 속하는 Logic Type을 선택한다
3. Logic Type의 **허용 UI 패턴** 목록에서 구현 패턴을 선택한다
4. **금지 패턴**을 적용하지 않았는지 확인한다

---

## 전체 유형 개요

| # | Logic Type | 사용자의 핵심 질문 | 인지 병목 |
|---|------------|------------------|-----------|
| 1 | Hierarchical | 이것은 어디에 속하는가? | 소속·계층 파악 |
| 2 | Sequential | 다음에 무엇을 해야 하는가? | 순서·인과 파악 |
| 3 | Conditional | 이것은 나에게 해당하는가? | 분기 선택 |
| 4 | Comparative | 어떤 것이 나에게 더 나은가? | 차이점 파악 |
| 5 | Causal | 왜 이렇게 되는가? | 원인-결과 추론 |
| 6 | Relational | 이것들은 어떻게 연결되어 있는가? | 관계·연결 파악 |
| 7 | Proportional | 이것은 얼마나 큰가/중요한가? | 규모·비율 파악 |
| 8 | Cyclic | 이것은 어떻게 반복·지속되는가? | 순환 구조 파악 |
| 9 | Categorical | 이것은 어떤 종류인가? | 분류·그룹 파악 |
| 10 | State-based | 지금 어떤 상태인가? 다음은? | 상태 변화 파악 |

---

## 유형별 상세 정의

---

### 1. Hierarchical — 계층형

**사용자 질문**: "이것은 어디에 속하는가? X가 Y 아래에 있는가?"  
**인지 병목**: 계층 깊이가 3단계 이상이면 소속 파악이 어려워진다

**공간 방향**: 수직 (위 = 상위, 아래 = 하위)

**허용 UI 패턴**:
- Concentric diagram (동심원 — 바깥이 상위)
- Layer block (레이어 쌓기 — 위가 상위)
- Tree / Org chart
- Nested accordion
- Breadcrumb

**금지 패턴**:
- 가로 병렬 나열 (관계가 사라짐)
- 균일한 카드 그리드 (계층이 보이지 않음)

**Truefarm 사례**: Trust Structure (Agrinovation OS → Truefarm → 파트너 → 농가)  
**Agrinovation 사례**: 10-Layer system, Outlet → Batch → Record 계층

---

### 2. Sequential — 순서형

**사용자 질문**: "다음에 무엇을 해야 하는가? 어떤 순서로 진행되는가?"  
**인지 병목**: 순서가 시각적으로 보이지 않으면 "지금 몇 단계야?" 를 모름

**공간 방향**: 수평 좌→우 (시간 흐름), 또는 수직 번호 (읽기 흐름)

**허용 UI 패턴**:
- Step flow (번호 + 아이콘 + 짧은 설명)
- Timeline (수평 또는 수직)
- Wizard / Stepper (현재 위치 표시 필수)
- Numbered card list
- Progress bar + 단계 레이블

**금지 패턴**:
- 랜덤 그리드 (순서가 사라짐)
- 탭 (탭은 순서 없는 카테고리)
- 번호 없는 나열

**Truefarm 사례**: How We Work, Join Wizard 진행 단계  
**Agrinovation 사례**: 작업 플로우 (수확 → 검증 → 기록 → 유통)

---

### 3. Conditional — 분기형

**사용자 질문**: "이것은 나에게 해당하는가? 나는 어느 경로를 가야 하는가?"  
**인지 병목**: 분기 기준이 명확하지 않으면 "내가 어디에 속하지?" 로 멈춤

**공간 방향**: 분기점을 중앙에, 각 경로를 바깥으로

**허용 UI 패턴**:
- Role selector / Tab (역할별 탭)
- Decision tree (시각적 분기)
- Conditional reveal (선택 후 관련 정보만 표시)
- Segmented control
- "내가 이런 사람이라면" 카드

**금지 패턴**:
- 모든 경로를 동시에 표시 (인지 과부하)
- 조건 없는 정보 나열

**Truefarm 사례**: Programs (Farmer / Buyer / Partner / Investor), Join Wizard  
**Agrinovation 사례**: 역할별 접근 권한 (Owner / Operator / Auditor)

---

### 4. Comparative — 비교형

**사용자 질문**: "어떤 것이 나에게 더 나은가? A와 B의 차이가 무엇인가?"  
**인지 병목**: 비교 기준이 정렬되지 않으면 직접 비교가 불가능

**공간 방향**: 수평 병렬 (같은 행에 같은 기준)

**허용 UI 패턴**:
- Side-by-side 비교 카드 (같은 속성이 같은 위치)
- 비교 테이블 (행 = 기준, 열 = 옵션)
- Toggle (A/B 전환)
- Highlight diff (차이점만 강조)

**금지 패턴**:
- 각 옵션을 별도 섹션으로 분리 (직접 비교 불가)
- 속성 순서가 옵션마다 다름

**Truefarm 사례**: (향후) 역할별 혜택 비교, 프로그램 비교  
**Agrinovation 사례**: 등급별 인증 조건 비교

---

### 5. Causal — 인과형

**사용자 질문**: "왜 이렇게 되는가? 이것이 저것에 어떤 영향을 주는가?"  
**인지 병목**: 원인과 결과가 분리되면 "왜?"가 답이 안 됨

**공간 방향**: 화살표 방향으로 인과 흐름 표시

**허용 UI 패턴**:
- Before → After (상태 변화 시각화)
- 화살표 플로우 (원인 → 매개 → 결과)
- 원인-결과 카드 쌍
- "이렇게 하면 → 이렇게 됩니다" 구조
- 인터랙티브 시뮬레이션

**금지 패턴**:
- 원인과 결과를 독립적으로 나열
- 화살표 없는 관계 설명

**Truefarm 사례**: "농가가 참여하면 → 검증 → 시장 접근"  
**Agrinovation 사례**: 이벤트 기반 시스템 (Event → State Change → Record)

---

### 6. Relational — 관계형

**사용자 질문**: "이것들은 어떻게 연결되어 있는가? X와 Y는 무슨 관계인가?"  
**인지 병목**: 관계가 텍스트로만 설명되면 구조가 머릿속에 그려지지 않음

**공간 방향**: 방사형 (중심 = 기준점, 바깥 = 연결 노드) 또는 거리 = 관련성

**허용 UI 패턴**:
- 네트워크 다이어그램
- 연결선 맵 (stakeholder map)
- 관계 테이블 (X → Y, 관계 유형)
- 생태계 지도

**금지 패턴**:
- 관계를 텍스트 단락으로만 설명
- 관계 없이 독립 카드 나열

**Truefarm 사례**: 생태계 참여자 관계 (Truefarm ↔ 농가 ↔ 바이어 ↔ Agrinovation)  
**Agrinovation 사례**: Layer간 데이터 흐름

---

### 7. Proportional — 비율형

**사용자 질문**: "이것은 얼마나 큰가? 이 숫자가 중요한 건가?"  
**인지 병목**: 규모가 텍스트로만 표현되면 "그래서 큰 거야 작은 거야?" 를 모름

**공간 방향**: 크기 = 중요도. 더 큰 것이 시각적으로도 더 크게 보여야 함

**허용 UI 패턴**:
- Big number callout (큰 숫자 + 작은 레이블)
- Progress bar / Gauge
- 비율 차트 (Donut, Bar)
- 카운트업 애니메이션
- 상대적 크기 블록

**금지 패턴**:
- 균일한 크기의 카드에 다른 규모의 숫자 나열
- 숫자만 있고 맥락(단위, 기준)이 없음

**Truefarm 사례**: About 섹션 임팩트 지표 (5,000+ 농가, 10 Layers, 3 Countries)  
**Agrinovation 사례**: Phase별 완성도 (Phase 1: 100%, Phase 4: 45%)

---

### 8. Cyclic — 순환형

**사용자 질문**: "이것은 어떻게 반복·지속되는가? 끝나면 어디로 돌아가는가?"  
**인지 병목**: 순환을 선형으로 표현하면 "이게 언제 끝나지?" 를 물음

**공간 방향**: 원형 (시작과 끝이 연결됨)

**허용 UI 패턴**:
- 루프 다이어그램 (원형 화살표)
- 원형 플로우 (Circular flow)
- 계절/주기 표현

**금지 패턴**:
- 선형 타임라인으로 순환 표현
- 시작·끝이 명확한 Step flow

**Truefarm 사례**: 농업 계절 사이클, 검증-기록-유통-재참여  
**Agrinovation 사례**: 이벤트 소싱 루프

---

### 9. Categorical — 분류형

**사용자 질문**: "이것은 어떤 종류인가? 비슷한 것들끼리 모여 있는가?"  
**인지 병목**: 카테고리 경계가 불명확하면 "이게 여기 있는 게 맞아?" 를 물음

**공간 방향**: 그리드 (근접성 = 같은 그룹)

**허용 UI 패턴**:
- 카드 그리드 + 필터
- 태그 / 배지
- 섹션 헤더로 구분된 리스트
- Masonry (카드 크기가 콘텐츠 양에 따라 다를 때)

**금지 패턴**:
- 카테고리 없는 긴 목록
- 카테고리 이름 없이 색깔로만 구분

**Truefarm 사례**: Programs 전체 목록, 역할별 혜택  
**Agrinovation 사례**: 이벤트 유형 분류 (생산/물류/검증/기록)

---

### 10. State-based — 상태형

**사용자 질문**: "지금 어떤 상태인가? 다음 상태로 어떻게 가는가?"  
**인지 병목**: 현재 상태가 명확하지 않으면 "내가 뭘 해야 하지?"로 멈춤

**공간 방향**: 현재 상태를 중앙/강조, 가능한 전환을 주변에

**허용 UI 패턴**:
- Status badge (색상 + 레이블)
- State indicator (단계 강조)
- Recovery CTA (실패 상태 → 다음 행동)
- Transition animation (상태 변화 시각화)
- Empty state (비어있는 상태 + 행동 유도)

**세부 상태 패턴**:

| 상태 | UI 목적 | 필수 요소 |
|------|---------|-----------|
| pending | 불확실성 제거 | Progress indicator + 예상 시간 |
| loading | 기다림 관리 | Skeleton (레이아웃 약속) |
| success | 완료 강화 | 확인 신호 + 다음 행동 |
| error / failed | 회복 경로 제시 | 원인 + Recovery CTA |
| empty | 행동 유도 | 이유 + 시작 CTA |
| inactive | 재참여 유도 | 마지막 상태 + 재시작 CTA |

**금지 패턴**:
- 상태 없는 빈 화면 (사용자가 "고장났나?" 생각)
- 에러만 표시하고 다음 행동 없음

**Truefarm 사례**: Join draft 상태, 폼 제출 상태, 관리자 대시보드  
**Agrinovation 사례**: 배치 상태 (draft → submitted → verified → closed)

---

## 논리 유형별 UI 패턴 매핑 요약

| Logic Type | 최우선 패턴 | 보조 패턴 | 절대 금지 |
|------------|------------|-----------|-----------|
| Hierarchical | 레이어 블록 / Concentric | Tree, Nested accordion | 가로 병렬 |
| Sequential | Step flow + 번호 | Timeline, Wizard | 랜덤 그리드, 탭 |
| Conditional | Role tab / Decision tree | Conditional reveal | 동시 전체 표시 |
| Comparative | Side-by-side 테이블 | Toggle, Highlight diff | 분리된 섹션 |
| Causal | 화살표 플로우 | Before→After | 독립 나열 |
| Relational | 네트워크 다이어그램 | 연결선 맵 | 텍스트 단락만 |
| Proportional | Big number callout | Progress bar, 차트 | 균일 카드 |
| Cyclic | 원형 루프 다이어그램 | 계절 표현 | 선형 타임라인 |
| Categorical | 카드 그리드 + 필터 | 태그, 섹션 헤더 | 무분류 긴 목록 |
| State-based | Status badge | Recovery CTA, Skeleton | 빈 화면 |

---

**버전**: 2.13.0  
**최종 업데이트**: 2026-05-25  
**소속**: Synaxion Constitution 18장
