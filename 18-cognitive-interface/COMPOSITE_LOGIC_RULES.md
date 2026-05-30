# Composite Logic Rules

> Primary + Secondary Logic Type 조합 시 UI 우선순위와 인지 마찰 방지 규칙.

---

## §1 기본 규칙

1. **Primary가 정보 구조(IA)를 결정**한다 — 페이지 상단·기본 뷰·첫 스캔 영역.
2. **Secondary는 보조 레이어**다 — 드릴다운·사이드 패널·필터·2차 탭.
3. Primary와 Secondary가 **동일 UI 패턴을 경쟁**하면 안 된다 (예: Primary Sequential + Secondary Sequential → Stepper 중복).

---

## §2 허용 조합 (권장)

| Primary | Secondary (자주 쓰임) | UI 우선순위 |
|---------|----------------------|-------------|
| Hierarchical | Relational | 트리 먼저 → 노드 클릭 시 Relation 카드 |
| Categorical | Proportional | 필터·그리드 → 선택 시 Big Number |
| Sequential | Conditional | Stepper → 분기 노드에서 Decision |
| Sequential | Causal | 타임라인 → 이벤트 클릭 시 근거 패널 |
| State-based | Causal | Badge/Progress → 실패 시 Recovery + 이유 |
| Proportional | Comparative | KPI → 예산 대비 delta |
| Conditional | Hierarchical | 적용 여부 → 적용 범위 트리 |
| Relational | Proportional | BOM/링크 → 수량·비율 |

---

## §3 금지·주의 조합

| 조합 | 문제 | 완화 |
|------|------|------|
| Hierarchical + Categorical (동급) | 트리 vs 그리드 충돌 | 카테고리는 트리 **내** facet으로 |
| Causal only (Secondary 없음) | 목록 화면에서 과도한 설명 | 목록은 State/Sequential, 상세에서 Causal |
| Cyclic + Sequential (동급) | 주기와 단계 혼동 | 주기는 배지, 단계는 Stepper로 분리 |

---

## §4 Inflomatrix 적용 예

| 서브도메인 | Primary | Secondary | 적용 |
|-----------|---------|-----------|------|
| finance_state | Hierarchical | Proportional | 계정 트리 + 잔액 Big Number |
| conversion_funnel | Sequential | State-based | Funnel 단계 + 단계별 badge |
| knowledge_policy | Conditional | Hierarchical | 적용 판정 → 조직 범위 트리 |

전체 매핑: `docs/inflomatrix-constitution/COGNITIVE_INTERFACE_MAPPING.md`

---

**최종 업데이트**: 2026-05-28
