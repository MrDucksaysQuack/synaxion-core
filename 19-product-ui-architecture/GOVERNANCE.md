# 19장 — 거버넌스 규칙

> **Synaxion Constitution 19장 · GOVERNANCE**  
> 인스턴스가 Product UI Architecture 문서를 관리할 때 지켜야 할 **7규칙**과 PLAN-READINESS 패턴.  
> **2.17.0**: [GENERATION_ASSISTED_COVERAGE.md](./GENERATION_ASSISTED_COVERAGE.md) — complete generation formula는 **비목표**.

---

## 명시적 비목표 (2.17.0)

- Role×Goal×Data×Stage **카르테시안 자동 URL 생성**
- Split/Tab/Modal **닫힌 함수 도출**
- 인간 배제 **완전 폐루프** (assisted + CI 게이트만)

---

## 거버넌스 7규칙

### 규칙 1 — Backlog = 유일 실행 SSOT

> **체크박스는 `09-IMPLEMENTATION-BACKLOG.md`(또는 상당 파일)에만 둔다.**

- 다른 문서(여정·핸드오프·상태 매트릭스 등)는 설계를 기술하되, "완료/미완료" 체크박스를 직접 두지 않는다.
- 구현 상태가 궁금하면 Backlog ID를 `backlog: LN-ID` 형식으로 인용한다.
- 이유: 체크박스가 여러 파일에 분산되면 어떤 것이 최신인지 알 수 없다.

```markdown
<!-- ❌ 다른 문서에서 직접 체크박스 -->
- [x] H-01 구현됨

<!-- ✅ Backlog ID 인용 -->
backlog: L2-H-01
```

---

### 규칙 2 — 카탈로그 항목 추가 시 Backlog ID 동시 등록

> **새 Handoff·Event·Recovery Journey 항목을 카탈로그에 추가하면, 같은 PR 또는 직후 PR에서 Backlog에도 해당 행을 추가한다.**

- Backlog 없는 카탈로그 항목은 "설계는 있으나 구현 경로가 없는" 고아 상태다.
- 우선순위를 모르면 🟢(낮음)로 일단 등록하고 나중에 올린다.

---

### 규칙 3 — 화면·여정·Event 변경 시 동기화 쌍

> **04 Screen Inventory 또는 11 Event→UI Map을 바꾸면, 같은 PR에서 08 Traceability도 갱신한다.**

| 변경 | 동반 갱신 |
|------|----------|
| 새 화면 추가 | 04 + 08 |
| 여정 단계 추가/수정 | 02 + 08 |
| 새 Event 행 | 11 + 10(핸드오프) + 08 |
| 역할 라우팅 변경 | 06 + 04 + 08 |
| 6차원 감사 판정 변경 (Split/Tabs/Missing 등) | PAGE-AUDIT-MATRIX + 04 + 08 |
| Role×Goal matrix 변경 (규칙 6) | matrix JSON + sources 문서 + 04 + 08 |

---

### 규칙 4 — Plan Complete 주장 시 PLAN-READINESS 체크

> **"문서 완성됐다"고 말하려면 인스턴스의 `PLAN-READINESS.md` §A를 모두 체크해야 한다.**

- "거의 완성됐다"는 표현 금지. 남은 갭은 §B(의도적 후속)에 명시한다.
- Plan Complete ≠ Implementation Ready. 게이트 혼동 금지.

---

### 규칙 5 — 화면 추가·개편 시 6차원 점검

> **신규 URL·화면 ID 추가 또는 Goal/Role/Stage를 크게 바꾸는 PR**에서는 [PAGE_DERIVATION_AND_AUDIT.md](./PAGE_DERIVATION_AND_AUDIT.md) §2 질문 6개에 답한다.

- 프로파일 **S**: PR 설명 또는 04 Inventory 행에 6차원 **한 줄 요약**
- 프로파일 **M+**: `PAGE-AUDIT-MATRIX` 행 추가·갱신 + Needs Split/Tabs 시 분리 계획 또는 Backlog ID
- **Wrong Role**·**Broken Workflow** 발견 시 merge 전 수정 또는 §B 갭·Backlog 등록

6차원이 과밀하면 URL 분리 **또는** 탭/섹션 분리를 명시하고, Ch.10 [한 페이지 한 목적](../10-design-flow/DESIGN_FLOW_PRINCIPLES.md#1-한-페이지--한-목적-one-page-one-purpose)과 정합을 확인한다.

---

### 규칙 6 — Role×Goal matrix = 큐레이션 SSOT (2.17.0)

> **프로파일 M+** 인스턴스는 큐레이션된 Role×Goal을 [ROLE_GOAL_MATRIX_SCHEMA.md](./ROLE_GOAL_MATRIX_SCHEMA.md) JSON(또는 YAML)로 유지한다.

- Critical path·Journey·Handoff에서 파생 — **카르테시안 곱으로 자동 생성하지 않는다**.
- `sources` 필드에 markdown SSOT 링크를 남긴다.
- `suggestedArchetype`은 scaffold **제안**일 뿐 — merge 게이트가 아니다.

---

### 규칙 7 — Missing-Journey diff · 3-way drift CI (2.17.0)

> **P0 Goal**이 matrix에 있으면 Router·04 Inventory와 **결정적 정합**을 CI로 검증한다 ([GENERATION_ASSISTED_COVERAGE §3](./GENERATION_ASSISTED_COVERAGE.md#3-기계화하는-네-가지-우선-roi)).

| 변경 | 동반 갱신 |
|------|----------|
| 신규 P0 Goal / critical path | role-goal-matrix + `sources` 문서 + 04 + 08 |
| 라우트 삭제·이동 | matrix `routeHints` + 04 + 06 + 08 |
| Workflow queue **후보** 발견 | matrix `notes` 또는 09 Backlog — **자동 URL 생성 금지** |

인스턴스는 `check:role-goal-coverage`(또는 동등 스크립트)를 제공하는 것을 권장한다.

---

## PLAN-READINESS 패턴

인스턴스는 아래 템플릿을 `PLAN-READINESS.md`로 두고, 세 게이트를 독립적으로 추적한다.

```markdown
## 두 축 (혼동 금지)

| 축 | 정의 | 현재 |
|----|------|------|
| Plan Complete | 문서가 서로 링크되고 갭이 명시됨 | ~?% |
| Implementation Ready | P0 셸 + 핵심 API·화면이 Backlog L1~L3에 따라 동작 | ~?% |
| Architecture 승격 | Plan + L2 핵심 + smoke test + REVIEWED | ⬜ |

## §A — Plan Complete 체크리스트
(프로파일에 맞는 문서 슬롯 전부 체크)

## §B — 의도적 후속 (갭 명시)
(구현 백로그에 위임된 항목 목록)

## §C — Architecture 승격 게이트
- [ ] L2 핵심 Handoff 구현 완료
- [ ] L7 E2E smoke test 통과
- [ ] ui-logic 핵심 파일 REVIEWED
- [ ] 역할·라우팅·이벤트 문서 REVIEWED
```

---

## N/A 허용 정책

아래 조건에 해당하면 taxonomy 슬롯을 생략(`N/A`)할 수 있다.

| 슬롯 | N/A 허용 조건 |
|------|-------------|
| 02-R Recovery Journeys | 실패 복구 경로가 단순 재시도 1단계뿐인 경우 |
| 08 Traceability | 프로파일 S — 화면 5개 이하 |
| 10 Handoff Catalog | 역할 간 책임 이전이 없는 단일 역할 제품 |
| 11 Event→UI Map | Event 없이 폴링 기반인 경우 |
| 12 Time Zones | 실시간/비동기 구분이 없는 경우 |
| 14 Object→Capability | 도메인 객체 상태가 Quest/작업 가용성에 영향을 주지 않는 경우 |

N/A 선언은 INDEX.md 해당 슬롯에 `N/A — [사유]` 한 줄로 명시한다.

---

## 챕터 번호 매핑 (혼동 방지)

Agrinovation 인스턴스의 Plan 폴더 번호와 Synaxion 챕터 번호는 다르다.

| Synaxion 챕터 | Agrinovation 파일 | 설명 |
|--------------|-------------------|------|
| Ch.19 | `docs/Plan/11-ui-architecture/` | Agrinovation의 "11"은 Plan 폴더 번호 |
| Ch.19 §Handoff | `10-HANDOFF-CATALOG.md` | 파일 내 번호 "10"은 문서 내 순서 |
| Ch.19 §State | `05-STATE-MATRIX.md` | 파일 내 번호 "05"는 문서 내 순서 |

다른 인스턴스는 자체 폴더 이름을 자유롭게 쓸 수 있다.  
`docs/ui-architecture/`, `docs/product-design/` 등 모두 허용.
