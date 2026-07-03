# Codebase Navigation Map

> **Synaxion Constitution 20장**  
> **Status**: Substantive  
> **Last updated**: 2026-06-29 — SYNAXION-AICS-2C  
> **Principle**: [AICS_PRINCIPLES.md §1 Codebase-as-Documentation](./AICS_PRINCIPLES.md) · [§3 Single Source of Truth](./AICS_PRINCIPLES.md)  
> **Tier**: 3 (introduction)

---

## Purpose

This document helps agents **find SSOT quickly** without loading the entire repository.

It defines **navigation patterns** — not a file listing. Consumer projects implement instance paths locally (e.g. `docs/ai-context/maps/`).

Navigation answers: *Where is the rule? Where is the plan? Where is the proof?*

Load discipline: [CONTEXT_WINDOW_OPTIMIZATION.md](./CONTEXT_WINDOW_OPTIMIZATION.md).

---

## SSOT layers (pattern)

Agents navigate **layers** in order. Each layer has one authority type.

| Layer | Pattern location | Authority | Agent rule |
|-------|------------------|-----------|------------|
| **Canonical constitution** | `synaxion-core/` submodule | Synaxion Ch.01–20 | Edit only via constitution process |
| **Constitution mirror** | `doc/constitution/` (consumer) | Read-only copy of submodule | **Do not edit** |
| **Instance working rules** | e.g. `docs/ai-context/` | Project extensions of Ch.20 | Must not contradict canonical |
| **Active plans** | e.g. `.cursor/plans/active/` | Current execution SSOT | Prefer over archived |
| **Plan status index** | e.g. `.cursor/plans/PLANS_STATUS.md` | Active · next · recent | Pointer — not full plan text |
| **Maps** | e.g. `docs/ai-context/maps/` | Domain/plane navigation | Instance-specific paths |
| **Inventories** | e.g. `docs/ai-context/inventories/` | **Generated** compressions | Never hand-edit; see [GENERATED_INVENTORY_POLICY.md](./GENERATED_INVENTORY_POLICY.md) |
| **Product / planning docs** | e.g. `docs/` | Product SSOT | Separate from codebase operability |
| **Source planes / modules** | e.g. `src/` layer tree | Runtime truth | Layer boundaries (Ch.01) |
| **Tests / check scripts** | e.g. `scripts/checks/` · `**/__tests__/` | Verification proof | [AI_ASSISTED_VERIFICATION.md](./AI_ASSISTED_VERIFICATION.md) |
| **Reports / archive** | e.g. `docs/archive/reports/` | Historical snapshots | Not current SSOT |

**Instance example** (Inflomatrix): `docs/ai-context/README.md` indexes instance entry · maps · inventories — other repos define equivalent roots.

---

## Layer → directory pattern (Synaxion consumer)

Typical mapping — **adjust per project**:

```text
synaxion-core/                    → canonical principles (Ch.20)
doc/constitution/                 → mirror (read-only)
docs/ai-context/                  → instance entry · rules · maps · inventories (pattern)
docs/DOCUMENT_INDEX.md            → document registry (pattern)
.cursor/plans/PLANS_STATUS.md     → execution status (pattern)
.cursor/plans/active/{domain}/    → active stream plans (pattern)
src/core · engines · domain ·     → layer-ordered source (Ch.01)
  application · api · tenant
scripts/checks/                   → verification gates
```

Do not treat this tree as universal paths — treat it as **what to look for**.

---

## Navigation decision tree

Use the first matching branch. Stop when SSOT is found.

### “What is current status?”

```text
→ Instance next-actions / current-state pointer
→ PLANS_STATUS (active · next · blocked)
→ NOT archived plans · NOT chat memory
```

### “What is the active plan?”

```text
→ PLANS_STATUS → active/{domain}/ plan file
→ Plan completion criteria + allowed files
→ NOT orchestrator unless stream points there
```

### “Which map or inventory owns this surface?”

```text
→ Instance maps/ (plane · adapter · runtime)
→ inventories/ README + policy (if generated list)
→ Freshness check if inventory may be stale
→ NOT full grep of src/ as first step
```

### “Which source file owns the behavior?”

```text
→ Map/inventory row → exact path
→ grep symbol if map silent
→ Nearest test names owner
→ Layer README if cross-cutting
```

### “Which checker or test proves it?”

```text
→ Ticket verification section
→ AI_ASSISTED_VERIFICATION change-class table
→ scripts/checks/ or scoped jest path
→ Record exit code in report-back
```

---

## SSOT separation (hard rules)

| X is NOT Y | Rule |
|------------|------|
| Canonical doc ≠ instance status | Ch.20 does not list active streams — instance PLANS_STATUS does |
| Active plan ≠ archive | `archived/` is historical reference only |
| Generated inventory ≠ manual policy | Edit generator — not inventory markdown |
| Checker output ≠ product decision | Gate pass/fail ≠ UX approval |
| Conversation ≠ evidence | Report-back cites repo artifacts |
| Map ≠ source code | Map points — code proves |
| Investigation classification ≠ deletion order | Candidates need human validation |

---

## Instance map relationship

| Canonical (this doc) | Instance |
|---------------------|----------|
| Layer patterns | Project-specific paths in `docs/ai-context/maps/` |
| Decision tree | Same questions; local file names |
| Generated inventory rules | Local `inventories/README` implements Ch.20 policy |

Inflomatrix paths (`docs/ai-context/maps/plane-map.md`, `workbench-runtime-map.md`, etc.) are **examples** of instance maps — not requirements for every Synaxion consumer.

Promotion: instance navigation patterns may graduate to canonical via [AI_GOVERNANCE.md §5](./AI_GOVERNANCE.md) — not by copying project paths into this file.

---

## Common task → first file (pattern)

| Task | First navigation stop |
|------|----------------------|
| New Cursor ticket | Active plan + instance working rules |
| Investigation | Investigation template + exact path list |
| Portal/workbench/site change | Relevant plane map |
| Adapter/registry | Adapter map + generated adapter inventory |
| Inventory stale | GENERATED_INVENTORY_POLICY + freshness command |
| Doc-only seal | Plan completion criteria |
| Boundary touch | Stop — AGENTS_OPERATING_CONSTITUTION §7 |

---

## Anti-patterns

- Navigating by **grep alone** without layer/plan context
- Using **archived** plan as current stream
- Treating **generated inventory** rows as deletion targets
- Loading **entire** `src/tenant/` because task mentions “frontend”
- Creating **root-level** agent markdown instead of instance tree

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [CONTEXT_WINDOW_OPTIMIZATION.md](./CONTEXT_WINDOW_OPTIMIZATION.md) | Read order · task-class sets |
| [AGENTS_OPERATING_CONSTITUTION.md](./AGENTS_OPERATING_CONSTITUTION.md) | Ticket ritual · stop conditions |
| [GENERATED_INVENTORY_POLICY.md](./GENERATED_INVENTORY_POLICY.md) | Inventory authority |
| [AI_ASSISTED_VERIFICATION.md](./AI_ASSISTED_VERIFICATION.md) | Proof location |
| [README.md](./README.md) | Ch.20 index |

---

**최종 업데이트**: 2026-06-29 — SYNAXION-AICS-2C
