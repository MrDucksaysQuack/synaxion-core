# Object Detail Composition

**레벨**: Recommended (Tier 3 — ODSP 구현 패턴)  
**헌법**: [OBJECT_DETAIL_SURFACE_PRINCIPLE.md](../10-design-flow/OBJECT_DETAIL_SURFACE_PRINCIPLE.md)

---

## 1. Purpose

Object detail을 **업무 객체 화면**으로 읽히게 한다. DB record viewer·serialization leak·flat grid를 방지한다.

---

## 2. When to Use

- Workbench `surface: detail` for a single business object
- `UniversalDetailPage` · `ObjectWorkbenchLayout` · equivalent

---

## 3. When Not to Use

- List surface column scan → WSP-P3
- Platform console entity picker → OCP
- Raw JSON admin/debug tools (dev-only, gated)

---

## 4. Required Inputs

- `entity` with business + system fields
- `FieldDescriptor[]` with `detailSection` · `visibleInDetailDefault`
- `WorkbenchResolvedAction[]` with `placement` · `priority`
- `OperationalThread` (optional, from URL `threadId`)
- Inspector capability/risk adapters

---

## 5. Pattern Rules

### Primary vertical tiers (ODSP-P1 · P8)

```text
[Hero / Identity Card]
  name · semantic status chips · type · code/SKU · P0 action

[Business Summary Card]
  category · unit · price · stock · tax · availability

[Operational Card]
  related orders · inventory impact · documents · tasks · exceptions

[System Metadata — collapsed accordion]
  id · timestamps · seedKey · raw schema (dev toggle)
```

Forbidden: all tiers in one `Descriptions bordered` grid.

### Value rendering (ODSP-P2)

| Value type | User-facing |
|------------|-------------|
| `null` / `''` | `—` |
| `string` / `number` / `boolean` | formatted scalar |
| `object` | summary + [보기] / relation link |
| `array` | `N items` + expandable |
| unknown field | **omit** or structured fallback — never `String(value)` |

### Action bar (ODSP-P3)

```text
[P0 Primary]     [주문 시작]
[P1 Secondary]   [재고 WF] [수정] [Flow 시작]
[P2 More ▾]      삭제 · Audit · Permission decision
```

Delete: `danger` + Popconfirm + not adjacent to P0.

### Navigator in detail mode (ODSP-P4)

```text
Beef Rib Fingers
├ Summary
├ Inventory
├ Price
├ Orders
├ Documents
├ Events
├ Audit
└ Settings
```

Domain queue/exception tabs remain secondary or in header — not sole nav content.

### Inspector (ODSP-P5)

Minimum when object open:

- Name · type · semantic status row
- Quick actions (edit, start order, attach doc)
- Permission strip (allowed/restricted + reason)
- Risk/validation chips (e.g. “No linked inventory”)

### Thread bar (ODSP-P6)

```text
Thread: Sellable Item Review · Step 1 of 2 · Review
Next: Complete review · No blockers
[stepper with labels, not numbers only]
```

Map `threadId` URL param → `OperationalThread.title` · origin hint.

### Auxiliary collapsed (ODSP-P7)

```text
Timeline · Audit · Evidence
Last updated: … · Audit: 3 events · Evidence: 0 files  [열기]
```

---

## 6. Anti-patterns

See ODSP-A1~A12. Critical: `[object Object]`, flat grid, delete beside primary, inspector label-only.

---

## 7. Accessibility / Performance

- Section cards: headings (`h2`/`h3`) per tier
- Structured values: keyboard-expandable panels
- System metadata lazy in accordion
- `aria-live` on inspector when selection/entity updates

---

## 8. Implementation Sketch

```tsx
<ObjectWorkbenchLayout>
  <WorkbenchTopBar />
  <ThreadBar thread={operationalThread} />  {/* ODSP-P6 */}
  <NavigatorPanel mode="object-sections" />   {/* ODSP-P4 */}
  <DetailPrimary>
    <DetailHeroCard entity={entity} actions={p0} />
    <DetailBusinessCard fields={businessTier} />
    <DetailOperationalCard relations={...} />
    <DetailSystemAccordion fields={systemTier} />
  </DetailPrimary>
  <InspectorPanel contract="detail" />        {/* ODSP-P5 */}
  <AuxiliaryHost collapsedSummary={auditSummary} />  {/* ODSP-P7 */}
</ObjectWorkbenchLayout>
```

---

## 9. Checkability

| Check | Mode |
|-------|------|
| `check:detail-surface` | stringify leak · bordered grid · action tier |
| E2E | detail open → no `[object Object]` in DOM |
| PR | ODSP checklist |

---

## 10. Source Reference

- Inflomatrix `item/sellable/:id` detail audit 2026-06-26
- `toDetailSections` · `DetailFieldSections` · `DetailHeaderActions`

---

**최종 업데이트**: 2026-06-26
