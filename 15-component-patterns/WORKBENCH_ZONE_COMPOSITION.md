# Workbench Zone Composition

**레벨**: Recommended (Tier 3 — WSP 구현 패턴)  
**헌법**: [WORKBENCH_SURFACE_PRINCIPLE.md](../10-design-flow/WORKBENCH_SURFACE_PRINCIPLE.md)

---

## 1. Purpose

다중 zone workbench를 **하나의 운영 조종석**으로 읽히게 한다. 컴포넌트 조립감·placeholder 누출·zone 무력화를 방지한다.

---

## 2. When to Use

- Business (or equivalent) plane list/detail/flow surfaces
- `Navigator + Primary + Inspector` (+ optional Auxiliary, Thread)

---

## 3. When Not to Use

- Platform owner console → [CONSOLE_SURFACE_COMPOSITION.md](./CONSOLE_SURFACE_COMPOSITION.md)
- Single-purpose wizard or marketing page
- Mobile field 1-zone variant (see product mobile preset)

---

## 4. Required Inputs

- `domain` · `subdomain` · `surface` (list | detail | flow)
- `OperationalThread` (optional)
- Selection state (none | single | multi)
- Semantic theme tokens (dark-safe)

---

## 5. Pattern Rules

### Vertical stack (L1 workbench interior)

```text
[L0 App Chrome — outside workbench shell]
[L1 WorkbenchTopBar — domain/subdomain · surface · intent]
[L1 ThreadBar — steps · next action]
[Body grid]
  [Navigator] [Primary] [Inspector]
[L1 Auxiliary — collapsed default]
```

### Zone minimum contract

| Zone | User must understand | Empty state |
|------|---------------------|-------------|
| Top/Runtime | where am I (domain/surface) | N/A |
| Thread | what am I finishing | hide or minimal hint |
| Navigator | what to work on · exceptions | skeleton, not blank |
| Primary | the work object(s) | UX-02 empty |
| Inspector | judgment on selection | domain hint, not dev stub |
| Auxiliary | audit/timeline | collapsed; small empty |

### List surface (Primary)

- First scannable columns: **name · status · business signal**
- ID: monospace, secondary, optional column toggle default-off
- Row actions: visible or progressive menu — not empty header

### Inspector

- `single_row`: name, status, quick actions, related links
- `no_selection`: “항목을 선택하면 …” + keyboard hint
- Forbidden: `lazy stub`, batch phase strings in UI

### Theme

- All zones use semantic surface tokens — **no `#fafafa` / white card fallback** on dark workbench
- Info banners (Core Fields) use `surface-subtle`, not alert-sky

---

## 6. Recommended Variants

- Inspector right dock vs bottom sheet (mobile)
- Auxiliary as drawer when viewport &lt; breakpoint
- Exception badge count on Navigator tab

---

## 7. Anti-patterns

See WSP-A1~A11. Especially: placeholder occupying &gt;15% viewport, ThreadBar at bottom, dual search without labels.

---

## 8. Accessibility / Performance

- Each zone: landmark or `aria-label`
- Inspector updates on selection: `aria-live="polite"`
- Lazy Auxiliary/Inspector content — not lazy **labels**

---

## 9. Implementation Sketch

```tsx
<BusinessWorkbenchShell>
  {/* L1 */}
  <WorkbenchTopBar />      {/* data-zone="runtime-header" */}
  <ThreadBar />            {/* data-zone="thread" — semantic bg */}
  <div className="wb-grid">
    <BusinessDomainNavigator />  {/* data-zone="navigator" */}
    <SurfaceHost />              {/* data-zone="primary" */}
    <WorkbenchInspectorHost />   {/* data-zone="inspector" */}
  </div>
  <WorkbenchAuxiliaryHost collapsedDefault />  {/* data-zone="auxiliary" */}
</BusinessWorkbenchShell>
```

---

## 10. Checkability

| Check | Mode |
|-------|------|
| `check:workbench-surface` | stub strings · light fallback · zone testids |
| E2E | select row → inspector identity visible |
| PR | WSP checklist |

---

## 11. Source Reference

- Inflomatrix `BusinessWorkbenchShell` · `item/sellable` list audit 2026-06-26
- WB3 North Star §7 6-zone

---

**최종 업데이트**: 2026-06-26
