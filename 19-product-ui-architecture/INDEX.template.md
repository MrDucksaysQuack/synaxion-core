# [프로젝트명] — Product UI Architecture INDEX

> **프로파일**: [S / M / L] — [역할 수·특징 한 줄]  
> **상태**: [DRAFT / Plan Complete / Implementation Ready / Architecture 승격]  
> **Plan Complete**: ~?%  
> **Implementation Ready**: ~?%  
> **최종 업데이트**: YYYY-MM-DD  
> **거버넌스**: [Synaxion Ch.19 GOVERNANCE.md](path/to/19-product-ui-architecture/GOVERNANCE.md)

---

## 문서 맵

| # | 파일 | 핵심 질문 | 상태 |
|---|------|-----------|------|
| 01 | [PERSONAS.md]() | 누가 쓰는가 | ⬜ |
| 02 | [JOURNEY-MAPS.md]() | 어떤 순서로 목표에 도달하는가 | ⬜ |
| 02-R | [RECOVERY-JOURNEYS.md]() | 실패 시 어떻게 복구하는가 | N/A — [사유 또는 ⬜] |
| 03 | [INFORMATION-ARCHITECTURE.md]() | 화면 계층·사이드바 구조는 무엇인가 | ⬜ |
| 04 | [SCREEN-INVENTORY.md]() | 어떤 화면이 존재하는가 | ⬜ |
| 04-A | [PAGE-AUDIT-MATRIX.md](./PAGE_AUDIT_MATRIX.template.md) | 각 화면의 6차원·감사 판정은 무엇인가 | ⬜ |
| — | [role-goal-matrix.json]() | 큐레이션된 Role×Goal (기계 판독) | ⬜ — [ROLE_GOAL_MATRIX_SCHEMA](../../synaxion-core/19-product-ui-architecture/ROLE_GOAL_MATRIX_SCHEMA.md) |
| 05 | [STATE-MATRIX.md]() | 각 화면의 가능한 상태는 무엇인가 | ⬜ |
| 06 | [ROLE-ROUTING-RULES.md]() | 역할에 따라 어느 경로가 허용되는가 | ⬜ |
| 07 | [CROSS-CUTTING-PATTERNS.md]() | 전역 UX 패턴(알림·오프라인·딥링크)은 무엇인가 | ⬜ |
| 08 | [TRACEABILITY.md]() | 화면↔spec↔여정이 추적 가능한가 | N/A — 프로파일 S 또는 ⬜ |
| **09** | **[IMPLEMENTATION-BACKLOG.md]()** | **실행 유일 SSOT — L1~LN 체계** | ⬜ |
| 10 | [HANDOFF-CATALOG.md]() | 역할 간 책임 이전이 양면으로 설계되었는가 | ⬜ |
| 11 | [EVENT-UI-MAP.md]() | Event가 어떤 화면 상태를 유발하는가 | ⬜ |
| 12 | [TIME-ZONES.md]() | UI 시간 구간(실시간/비동기/배치)이 설계되었는가 | N/A — 단순 또는 ⬜ |
| 14 | [OBJECT-CAPABILITY.md]() | 도메인 객체 상태가 작업 가용성을 어떻게 제한하는가 | N/A — 비해당 또는 ⬜ |

> **09 Backlog**는 굵게 표시 — 체크박스가 허용되는 유일한 문서.  
> 다른 문서의 구현 상태는 Backlog ID(`backlog: LN-ID`)로만 참조한다.

---

## 완성도 (자동 갱신)

```
Plan Complete  : [████████░░] ~??%  (§A 체크 기준)
Impl Ready     : [██████░░░░] ~??%  (L1~L3 완료 기준)
```

---

## 거버넌스 체크 (PR 전)

- [ ] 새 화면 추가 시 04 + 08 동시 갱신 (규칙 3)
- [ ] 신규·대규모 개편 화면 시 6차원 점검 (규칙 5) — [PAGE_DERIVATION_AND_AUDIT.md](./PAGE_DERIVATION_AND_AUDIT.md)
- [ ] P0 Goal·critical path 시 role-goal-matrix + diff CI (규칙 6·7) — [GENERATION_ASSISTED_COVERAGE.md](./GENERATION_ASSISTED_COVERAGE.md)
- [ ] 새 Handoff/Event/Recovery 항목 시 Backlog ID 등록 (규칙 2)
- [ ] Plan Complete 선언 전 §A 전체 체크 (규칙 4)
- [ ] 체크박스는 09 Backlog에만 (규칙 1)

---

## PLAN-READINESS 게이트

→ [PLAN-READINESS.md]() 참조

---

## 변경 이력

| 날짜 | 변경 |
|------|------|
| YYYY-MM-DD | 초안 생성 |
