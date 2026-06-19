# 페이지 유도·감사 (Page Derivation & Audit)

> **Synaxion Constitution 19장**  
> **Tier**: 2 (권장) — PR 체크리스트·Ch.19 Plan Complete 보조. CI `check:*` 강제는 아님.  
> **제안 인스턴스**: Inflomatrix (다역할·Flow·Entity·Permission 연결 제품)

**목적**: 페이지를 디자인 감각으로 먼저 정하지 않고, **6차원**에 답한 뒤 Screen Inventory·Route에 반영한다.  
같은 프레임으로 **기존 페이지 감사**, **분리·탭 후보 판정**, **빠진 페이지 탐지**를 수행한다.

---

## 1. 핵심 원칙

> **페이지는 UI 레이아웃의 결과물이 아니라, Role·Goal·Data·Action·Permission·Workflow Stage에 대한 답에서 파생된다.**

- `+` 는 **항상 URL 하나를 만든다**는 뜻이 **아니다**. 6차원은 **페이지(또는 탭·모달)를 정의하는 질문 축**이다.
- 6차원 중 **2~3개가 흐릿**하면 구조가 약한 신호다.
- 6차원이 **서로 다른 값을 과도하게 요구**하면 **URL 분리** 또는 **동일 URL 내 탭/섹션 분리** 후보다.

### Ch.10·Ch.19와의 관계

| 레이어 | 담당 | 이 문서와의 관계 |
|--------|------|------------------|
| **Ch.19** (본 장) | 제품 전체 UI 지도 — 누가·무엇을·어떤 순서로 | 6차원 **유도·감사** SSOT |
| **Ch.10** | 단일 화면 품질 — 한 목적·Entry/Exit·5단계 | Goal·Action·Workflow **화면 내부** 검증 |
| **Ch.07** | 구현 — fetch·상태·권한 훅 | Permission **구현** 단일 진입점 |

신규 화면: **6차원 답변 → Ch.19 슬롯(04·06·08 등) 기록 → Ch.10 체크리스트** 순서를 권장한다.

---

## 2. 6차원 유도 모델

### 2.1 차원 정의

| 차원 | 질문 | Synaxion 참조 |
|------|------|---------------|
| **Role** | 누가 쓰는가? (주 사용자·Persona) | [§01 Personas](./README.md#문서-taxonomy-14종), Role Routing §06 |
| **Goal** | 그 사람은 여기서 **무엇을 끝내려** 하는가? | [Ch.10 한 페이지 한 목적](../10-design-flow/DESIGN_FLOW_PRINCIPLES.md#1-한-페이지--한-목적-one-page-one-purpose) |
| **Data** | **어떤 객체**를 중심으로 보는가? | [§14 Object→Capability](./README.md#문서-taxonomy-14종), [Ch.10 페이지 유형별 폴더](../10-design-flow/DESIGN_FLOW_PRINCIPLES.md#3-페이지-유형별-폴더-분리) |
| **Action** | **주 행동(Primary)** 은 무엇인가? | [Ch.10 Start→Done](../10-design-flow/DESIGN_FLOW_PRINCIPLES.md#4-출발점--행동--결과-start--view--act--confirm--done), [PAGE_LAYOUT 체크리스트](../10-design-flow/PAGE_LAYOUT_AND_FLOW_CHECKLIST.md) |
| **Permission** | 그 행동·필드·경로는 **허용**되는가? | Role Routing §06, [Ch.04 Auth](../04-safety-standards/AUTH_FLOW_PRINCIPLES.md), [Ch.07 §4.3](../07-frontend-ui/FRONTEND_LAYER_PRINCIPLES.md) |
| **Workflow Stage** | 업무 흐름상 **어느 단계**인가? | [§02 Journey Maps](./README.md#문서-taxonomy-14종), [§11 Event→UI Map](./EVENT_UI_MAP_SCHEMA.md) |

### 2.2 겹치기 쉬운 축 (구분 규칙)

| 쌍 | 구분 |
|----|------|
| **Role vs Permission** | Role = **누구**의 여정인가. Permission = 그 주체가 **도달·실행 가능한 범위**(capability, scope, field-level). |
| **Goal vs Action** | Goal = 사용자 **의도·완료 기준** 한 문장. Action = 화면의 **주 CTA·주 경로** 하나. |
| **Data vs Workflow Stage** | Data = **무엇을** 다루는가(객체). Workflow Stage = 그 객체가 **프로세스 어디**에 있는가(Submitted, Approved, …). |

### 2.3 좋은 페이지 판정 (요약)

6개 질문에 **각각 한 문장으로 답**할 수 있으면 좋은 페이지다.  
답이 길어지거나 "그리고/또한"이 반복되면 **분리·탭·역할 라우팅**을 검토한다.

---

## 3. 예시: `/orders` 평가

| 차원 | 질문 | 평가 포인트 |
|------|------|-------------|
| Role | 누가 쓰는가? | Admin? Sales? Customer? Warehouse? |
| Goal | 무엇을 하려는가? | 주문 확인? 승인? 출고? 결제 확인? |
| Data | 어떤 데이터를 보는가? | Order 목록, 고객명, 상태, 금액 |
| Action | 어떤 행동을 하는가? | 생성, 수정, 승인, 취소, 출고 처리 |
| Permission | 누가 어떤 버튼을 볼 수 있는가? | Sales vs Finance capability 분리 |
| Workflow Stage | 주문 흐름상 어디인가? | Submitted / Approved / Dispatch / Paid |

**문제 신호**: `/orders` **하나**에 Sales·Admin·Warehouse·Finance의 **서로 다른 Goal·Action·Workflow Stage**가 전부 섞임.

**분리 후보** (URL 또는 role-scoped entry):

```
/orders                    — 전체 주문 목록 (조회 Goal)
/orders/new                  — 주문 생성
/orders/:id                  — 주문 상세 (View)
/orders/:id/approval         — 주문 승인 (Workflow: Approved)
/orders/:id/dispatch         — 출고 처리
/orders/:id/payment          — 수금/결제 확인
/orders/:id/issues           — 클레임/문제 처리
```

`/orders` 자체가 나쁜 것이 아니라, **서로 다른 Role + Goal + Action + Workflow Stage**가 한 화면에 과밀하면 분리 대상이다.

---

## 4. 품질 체크리스트

### A. Role이 명확한가?

**좋음**: Finance Staff 수금 페이지, Warehouse 출고 준비, Customer 내 주문, Admin 승인 대기.

**나쁨**: "모두가 보는 주문 페이지", "모두가 쓰는 관리 페이지", 목적 없는 "상세 페이지".

"모두가 본다"는 페이지는 가능하나, **Action·Permission은 Role별로 분리**되어야 한다. 버튼 숨김만으로는 부족 — **Wrong Role** 판정(§6) 참고.

### B. Goal이 하나로 정리되는가?

**좋음**: 미수금 확인, 주문 승인, 재고 이동 기록, 문서 제출, 보고서 검토 — **각각 한 문장**.

**나쁨**: 고객 조회 + 주문 + 결제 + 문서 업로드 + 승인이 한 URL. → 기능 창고. Ch.10 **한 페이지 한 목적** 위반.

### C. Data 중심이 명확한가?

페이지는 보통 **하나의 중심 Data 객체**가 있다.

```
/customers/:id   → Customer
/orders/:id      → Order
/inventory/:id   → Inventory Item
/payments/:id    → Payment
/flows/:id       → Flow
```

중심 Data가 불명확하면 (`/management` 등) UI·권한·여정 추적이 흐려진다.

### D. Action이 너무 많은가?

주문 상세에서 수정·승인·거절·출고·환불·부분 취소·재고 복구·결제 등록·세금계산서·메시지 전송이 **한 화면 Primary로 공존**하면 분리 후보.

**완화**: URL 분리 **또는** 동일 URL 내 탭/섹션 (Overview, Items, Approval, Dispatch, Payment, Documents, Activity).  
탭을 쓸 때도 **탭마다 Goal·Primary Action·Permission**을 문서화한다 ([STATE-MATRIX](./STATE_MATRIX_SCHEMA.md)).

### E. Workflow Stage가 빠지지 않았는가?

Submitted → Approved → Dispatched → Paid 흐름에서 **Approved 대기 목록·승인 화면**이 없으면 운영 공백. → **Broken Workflow** 판정(§6).

---

## 5. 역방향: 빠진 페이지 탐지

공식을 **역으로** 쓴다: **큐레이션된 Role → Goal 나열 → 필요한 URL → 현재 Inventory와 대조**.

> **2.17.0**: 역방향 탐지는 [GENERATION_ASSISTED_COVERAGE.md](./GENERATION_ASSISTED_COVERAGE.md)의 **Missing-Journey diff**로 기계화한다. Goal 목록은 카르테시안 곱이 아니라 [ROLE_GOAL_MATRIX_SCHEMA](./ROLE_GOAL_MATRIX_SCHEMA.md) JSON SSOT에서 읽는다.

**예: Finance Staff**

| Goal | 필요 페이지 (예) |
|------|------------------|
| 미수금 확인 | `/finance/receivables` |
| 수금 등록 | `/finance/payments` |
| 입금 증빙 확인 | `/finance/payment-verification` |
| 고객별 잔액 | `/customers/:id/balance` |
| 연체 고객 | `/finance/overdue` |
| 결제 조정 승인 | `/approvals/payment-adjustments` |
| Statement 출력 | `/customers/:id/statement` |

Inventory에 없으면 **Missing Page**. Ch.19 **04 Screen Inventory**·**08 Traceability**에 등록.

---

## 6. 페이지 문제 유형 (감사 판정)

| 코드 | 이름 | 정의 | 예 |
|------|------|------|-----|
| **OK** | 적정 | 6차원 명확, Ch.10 최소선 충족 | `/orders` 목록 — Sales 조회·Submitted |
| **Needs Split** | 과밀·분리 필요 | 서로 다른 Role/Goal/Stage가 한 URL에 과밀 | `/orders/:id` 에 승인·출고·결제·환불 전부 |
| **Needs Tabs** | 탭·섹션 분리 | 동일 Data·연속 Stage이나 Action 과다 | Order 상세 내 Approval/Dispatch 탭 |

> **Split/Tab은 judgment(판정)** 이지 닫힌 함수 출력이 아니다. 자동 archetype 도출의 상한은 [GENERATION_ASSISTED_COVERAGE §2](./GENERATION_ASSISTED_COVERAGE.md#2-인간이-머무는-두-자리-의도적-경계).
| **Missing** | 빠진 페이지 | Goal·Journey는 있으나 URL 없음 | payment-adjustment approval UI 없음 |
| **Duplicate** | 중복 | 동일 6차원이 다른 URL에 반복 | 두 개의 "주문 목록" |
| **Wrong Role** | 잘못된 역할 노출 | Role에 맞지 않는 경로·화면 접근 | Customer가 Admin 승인 URL 접근 |
| **Broken Workflow** | 단계 공백 | Stage 전이에 대응 화면·대기 목록 없음 | Approved 단계 UI 없음 |
| **Data Orphan** | 데이터 고아 | DB·API에 객체 있으나 UI 연결 없음 | documents 테이블만 있고 Customer Detail에 없음 |

판정은 [PAGE_AUDIT_MATRIX.template.md](./PAGE_AUDIT_MATRIX.template.md)에 기록한다.

---

## 7. 프론트엔드 페이지 감사 (Frontend Page Audit)

### 7.1 감사 정의

```
Frontend Page Audit =
  현재 페이지가
  올바른 Role에게
  올바른 Data를
  올바른 Workflow Stage에서
  올바른 Permission으로
  올바른 Action을 수행하게 하는가?
```

6차원 질문에 답할 수 있으면 **구조적으로 건전**하고, 답이 흐리면 **개선 대상**이다.

### 7.2 3단계 절차

#### Step 1 — Current Page Inventory

존재하는 경로·화면 ID 목록. Ch.19 **04 Screen Inventory** SSOT.

#### Step 2 — Formula Mapping

각 행에 6차원을 붙인다. 값이 **과다**하면 Needs Split / Needs Tabs.

#### Step 3 — Missing Journey Detection

Role별 "해야 하는 일" 목록 → 필요한 페이지 → Inventory 대조.  
Ch.19 **02 Journey Maps**·**10 Handoff Catalog**와 연동.

---

## 8. 인스턴스 책임

| 항목 | 코어 (본 문서) | 인스턴스 |
|------|----------------|----------|
| 6차원·감사 절차·판정 코드 | ✅ | — |
| 모듈 묶음 (Auth, Order, Finance…) | — | `docs/<project>/` Ch.19 INDEX |
| 구체 URL·capability ID | — | 04·06·08·코드 SSOT |
| 평가 매트릭스 실데이터 | — | `PAGE-AUDIT-MATRIX.md` (템플릿 복사) |

다역할·Event·Approval·Document·Finance가 연결된 제품(예: The Flow System)은 **Ch.19 프로파일 M 이상** + 본 감사를 권장한다.

---

## 9. 거버넌스 연동

- 신규·대규모 개편 화면: [GOVERNANCE.md §규칙 5](./GOVERNANCE.md#규칙-5--화면-추가개편-시-6차원-점검)  
- Plan Complete: 프로파일 M+에서 **04 Screen Inventory** 각 행에 6차원 요약 1줄 이상  
- PR: [PAGE_LAYOUT_AND_FLOW_CHECKLIST](../10-design-flow/PAGE_LAYOUT_AND_FLOW_CHECKLIST.md) + 6차원 표 (신규 URL 시)

---

## 10. Generation-Assisted Coverage (2.17.0)

Ch.19의 실행 목표는 **complete generation formula**가 아니라 [GENERATION_ASSISTED_COVERAGE.md](./GENERATION_ASSISTED_COVERAGE.md)다.

| 기계화 | 인간 유지 |
|--------|----------|
| Role×Goal matrix SSOT · Missing-Journey diff · 3-way drift CI | Goal 큐레이션 |
| route+guard+empty shell scaffold **제안** | Split/Tab/Modal · 정보 밀도 |

**비목표**: Role×Goal×Data×Stage 카르테시안 자동 URL 생성 · 인간 배제 완전 폐루프.

---

## 🔗 관련 문서

- [GENERATION_ASSISTED_COVERAGE.md](./GENERATION_ASSISTED_COVERAGE.md) — GAC reframe · 우선순위 · 비목표
- [ROLE_GOAL_MATRIX_SCHEMA.md](./ROLE_GOAL_MATRIX_SCHEMA.md) — 기계 판독 matrix
- [GOVERNANCE.md](./GOVERNANCE.md) — 거버넌스 7규칙  
- [PAGE_AUDIT_MATRIX.template.md](./PAGE_AUDIT_MATRIX.template.md) — 평가표 템플릿  
- [INDEX.template.md](./INDEX.template.md) — Ch.19 인스턴스 시작점  
- [DESIGN_FLOW_PRINCIPLES.md](../10-design-flow/DESIGN_FLOW_PRINCIPLES.md) — 화면 단위 품질  
- [UX_READINESS_RUBRIC.md](../10-design-flow/UX_READINESS_RUBRIC.md) — UX 완성도 4점·Ch.19 연동  

---

**최종 업데이트**: 2026-06-18 — §10 GAC 연동 (2.17.0)
