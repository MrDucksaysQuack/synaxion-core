# Logic Type Taxonomy

> **Synaxion 18장 SSOT** — 10 Logic Type. 인스턴스 매핑·`domain-guides.json`·가이드 컴포넌트의 `LogicType` enum은 이 목록과 1:1이어야 한다.

---

## 타입 목록 (10)

### 1. Hierarchical

- **Primary Question 패턴**: "X는 어디(어느 상위)에 속하나?"
- **인지 모델**: 트리·조직도·계정과목
- **권장 UI**: 들여쓰기 트리, breadcrumb, RelationField 레이어 카드
- **금지**: flat 그리드만 — 상하 관계가 보이지 않음

### 2. Categorical

- **Primary Question 패턴**: "X는 어떤 종류/유형인가?"
- **인지 모델**: 태그·분류·SKU 유형
- **권장 UI**: 카드 그리드, 칩 필터, facet 검색
- **금지**: 순서만 강조(Sequential)하여 유형 비교 불가

### 3. Relational

- **Primary Question 패턴**: "X는 무엇과 연결/참조되나?"
- **인지 모델**: 그래프·BOM·외주·링크
- **권장 UI**: RelationField, 링크 카드, 미니 그래프
- **금지**: 연결 대상 없이 고립된 행만

### 4. Proportional

- **Primary Question 패턴**: "얼마나·비율·잔액은?"
- **인지 모델**: 수량·%, KPI·예산 소진
- **권장 UI**: Big Number, progress bar, sparkline
- **금지**: 텍스트 목록만 — 규모 감각 상실

### 5. Sequential

- **Primary Question 패턴**: "다음 단계·순서는?"
- **인지 모델**: 파이프라인·마일스톤·로그 타임라인
- **권장 UI**: Stepper, 타임라인, numbered list
- **금지**: 순서 없는 카드만

### 6. Causal

- **Primary Question 패턴**: "왜·어떤 원인으로?"
- **인지 모델**: 인과·설명·Conscious 판단 근거
- **권장 UI**: Before→After, 인과 화살표, 근거 패널
- **금지**: 결과만 — 이유 없음(신뢰 저하)

### 7. Comparative

- **Primary Question 패턴**: "A 대비 B는?"
- **인지 모델**: 예산 vs 실적·전년 대비
- **권장 UI**: side-by-side, delta badge, comparison table
- **금지**: 단일 값만 — 비교 맥락 없음

### 8. Conditional

- **Primary Question 패턴**: "조건을 만족하나·적용되나?"
- **인지 모델**: 정책·규칙·가이드라인 검증
- **권장 UI**: Decision tree, if/then 요약, pass/fail
- **금지**: 모호한 prose만

### 9. State-based

- **Primary Question 패턴**: "지금 상태는?"
- **인지 모델**: 실행 중·대기·활성 트리거
- **권장 UI**: Status badge, progress, Recovery CTA
- **금지**: 상태 없이 정적 테이블만

### 10. Cyclic

- **Primary Question 패턴**: "주기·반복·리듬은?"
- **인지 모델**: cron·리듬·반복 공연
- **권장 UI**: 루프 다이어그램, 주기 캘린더, recurrence 요약
- **금지**: 일회성 UI만

---

## TypeScript enum (인스턴스 코드 SSOT)

```typescript
export type LogicType =
  | 'Hierarchical'
  | 'Categorical'
  | 'Relational'
  | 'Proportional'
  | 'Sequential'
  | 'Causal'
  | 'Comparative'
  | 'Conditional'
  | 'State-based'
  | 'Cyclic';
```

---

## 매핑 품질 기준

| 등급 | 기준 |
|------|------|
| ✅ | Primary가 사용자 질문과 일치, Secondary가 보조 UI만 담당 |
| ⚠️ | Primary 모호 — 팀 리뷰 후 확정 |
| ❌ | Primary가 UI 편의(테이블만 있음)에서 역산됨 |

---

**최종 업데이트**: 2026-05-28
