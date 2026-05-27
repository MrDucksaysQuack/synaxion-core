# 19장 — 거버넌스 규칙

> **Synaxion Constitution 19장 · GOVERNANCE**  
> 인스턴스가 Product UI Architecture 문서를 관리할 때 지켜야 할 4규칙과 PLAN-READINESS 패턴.

---

## 거버넌스 4규칙

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

---

### 규칙 4 — Plan Complete 주장 시 PLAN-READINESS 체크

> **"문서 완성됐다"고 말하려면 인스턴스의 `PLAN-READINESS.md` §A를 모두 체크해야 한다.**

- "거의 완성됐다"는 표현 금지. 남은 갭은 §B(의도적 후속)에 명시한다.
- Plan Complete ≠ Implementation Ready. 게이트 혼동 금지.

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
