# [프로젝트명] — Page Audit Matrix

> **SSOT**: Ch.19 [04 Screen Inventory](./INDEX.template.md) 와 **동기화**.  
> **방법**: [PAGE_DERIVATION_AND_AUDIT.md](./PAGE_DERIVATION_AND_AUDIT.md)  
> **최종 업데이트**: YYYY-MM-DD

---

## 판정 코드

| Status | 의미 |
|--------|------|
| OK | 6차원 명확 |
| Needs Split | URL 분리 검토 |
| Needs Tabs | 동일 URL 내 탭/섹션 분리 |
| Missing | Journey·Goal 대비 URL 없음 |
| Duplicate | 동일 6차원 중복 URL |
| Wrong Role | 역할에 맞지 않는 접근 |
| Broken Workflow | Workflow Stage 화면 공백 |
| Data Orphan | Data 있으나 UI 미연결 |

---

## 평가 매트릭스

| Current Page | Role | Goal | Data | Action | Permission | Workflow Stage | Status | Notes / Backlog |
|--------------|------|------|------|--------|------------|----------------|--------|-----------------|
| `/orders` | Sales, Admin | 주문 조회 | Order | View, Create | `order:read`, `order:create` | Submitted | OK | |
| `/orders/:id` | Multiple | 상세·승인·출고·결제 | Order, Payment, Inventory | Edit, Approve, Dispatch, Pay | Mixed | Multiple | Needs Split | backlog: L?-orders-detail-split |
| `/customers` | Sales, Admin | 고객 관리 | Customer | View, Create | `customer:read`, `customer:create` | Registration | OK | |
| `/customers/:id` | Sales, Finance, Admin | 고객 상세 | Customer | Edit, Credit, Docs | Mixed | Multiple | Needs Tabs | |
| `/inventory` | Warehouse, Admin | 재고 조회 | Item, Stock | View, Adjust | `inventory:read`, `inventory:update` | Stock Control | OK | |
| `/dashboard` | All (personalized) | 요약 확인 | Mixed | View | role-based | Monitoring | OK | Role별 위젯 SSOT 필요 |
| _(example)_ `/approvals/payment-adjustments` | Finance, Admin | 결제 조정 승인 | Payment, Approval | Approve, Reject | `payment:adjust:approve` | Pending Approval | Missing | 기능 API만 존재 |

---

## Role별 Missing Journey (Step 3)

### [Role: Warehouse Staff]

| 해야 하는 일 | 필요 페이지 | Inventory에 있음? |
|--------------|-------------|-------------------|
| 오늘 출고할 주문 확인 | `/warehouse/dispatch` | ⬜ |
| 피킹 리스트 출력 | `/warehouse/picking-list` | ⬜ |
| 품절/부족 표시 | `/inventory/shortage` | ⬜ |
| 출고 완료 처리 | `/orders/:id/dispatch` | ⬜ |

---

## Formula Mapping 예시 (`/orders/:id`)

```yaml
page: /orders/:id
role:
  - Sales
  - Admin
  - Warehouse
  - Finance
goal:
  - 주문 확인
  - 주문 수정
  - 승인
  - 출고 확인
  - 결제 확인
data:
  - Order
  - OrderItems
  - Customer
  - Inventory
  - Payment
action:
  - Edit
  - Approve
  - Dispatch
  - RecordPayment
permission:
  - order:read
  - order:update
  - order:approve
  - inventory:dispatch
  - payment:create
workflow_stage:
  - Submitted
  - Approved
  - Dispatch
  - Paid
verdict: Needs Split  # Goal·Role·Stage 과다
```

---

## 변경 이력

| 날짜 | 변경 |
|------|------|
| YYYY-MM-DD | 템플릿에서 인스턴스 복사 생성 |
