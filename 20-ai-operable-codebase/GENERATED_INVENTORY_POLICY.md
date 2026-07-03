# Generated Inventory Policy

> **Synaxion Constitution 20장**  
> **Status**: Substantive  
> **Last updated**: 2026-06-29 — SYNAXION-AICS-2B  
> **Principle**: [AICS_PRINCIPLES.md §3 Single Source of Truth](./AICS_PRINCIPLES.md) · [§5 Verification Before Trust](./AICS_PRINCIPLES.md)  
> **Tier**: 3 (introduction)

---

## Purpose

This document defines the **canonical policy** for machine-generated AI context inventories:

- What “generated” means vs source-bound summaries
- Freshness check contract and exit semantics
- Timestamp-only drift handling
- When to regenerate
- What agents must not do with candidate classifications

Instance playbooks and post-task checklists **implement** this policy locally. This document is the **Synaxion rule**.

Verification alignment: [AI_ASSISTED_VERIFICATION.md](./AI_ASSISTED_VERIFICATION.md) · closure ritual: [AGENTS_OPERATING_CONSTITUTION.md §5](./AGENTS_OPERATING_CONSTITUTION.md).

---

## Scope

| In scope | Out of scope |
|----------|--------------|
| Generated vs source-bound document types | Generator implementation code |
| Freshness exit semantics | Overnight maintenance runner design (high-level interaction only) |
| Timestamp-only drift | Manual navigation maps |
| Regeneration triggers | Deletion authority for candidates |
| Do-not-expand rules | Product UI inventory (Ch.19) |

---

## Document types

### Generated inventories

**Definition**: Markdown (or structured) files **produced by a generator script** from a defined source graph.

| Property | Rule |
|----------|------|
| **Authority** | Generator + source graph — not the markdown file |
| **Status marker** | Must declare `Status: Generated` (or equivalent machine header) |
| **Timestamps** | Embed `Generated At` / source reference metadata |
| **Manual edit** | **Prohibited** — fix the generator or sources, then regenerate |

Examples (instance pattern): business-page inventory, route inventory, adapter usage inventory, detail-surface mount inventory, dead-page candidate list.

### Source-bound summaries

**Definition**: Documents that **summarize specific source artifacts** without claiming to be fully regenerated on every run.

| Property | Rule |
|----------|------|
| **Authority** | Named source artifact(s) in header |
| **Update** | Edit sources or rewrite summary deliberately — not partial hand-edits inside generated tables |
| **Promotion** | May graduate to generated status when automation exists |

When a source-bound doc gains a generator, it **becomes** generated inventory and inherits all rules below.

---

## Freshness check contract

Consumer projects may provide a **freshness check** script that validates generated inventories against their sources.

### Exit semantics

| Exit code | Meaning |
|-----------|---------|
| **0** | All required generated files exist and are **fresh** vs their source graph |
| **1** | **Stale**, **missing**, **unreadable**, or **invalid** — regeneration or fix required |

Exit **0** means “safe to treat inventories as current for agent navigation,” not “no warnings anywhere.”

### Freshness comparison methods

A freshness check may use one or more of:

| Method | Description |
|--------|-------------|
| **Source mtime graph** | Generated file mtime ≥ max mtime of declared source paths |
| **Archive embedded timestamp** | Generated markdown references `generatedAt` from upstream JSON/report |
| **Partial source graph** | Static-scan sources (registry files, host components) with declared path list |
| **Markdown structure checks** | Required headers: `Status: Generated`, source reference, `## Generated At` |

**STALE** when generated output is older than any source in the graph. **ERROR** when required files are missing or unreadable.

**Instance example** (Inflomatrix): `check-ai-context-freshness.ts` — exit 0 when all five generated inventories pass mtime/structure checks; exit 1 on STALE/ERROR with regenerate command hint.

### Warnings on exit 0

A check may emit **markdown warnings** (missing optional header, etc.) while still exiting 0. Agents must:

- Record warnings in report-back if relevant
- Not treat warnings as failure unless ticket criteria require clean output
- Fix recurring warnings in generator templates — not by hand-editing generated files

---

## Timestamp-only drift policy

Regenerating inventories often changes **only** timestamp/metadata lines when sources are unchanged.

### Definition

**Timestamp-only drift**: `git diff` changes limited to:

- `Generated At` / compression timestamp rows
- `AICS compression` / `Archive report` table cells
- File mtime-driven boilerplate with **no** row/classification/path changes

### Rules

| Rule | Action |
|------|--------|
| Timestamp-only diff is **not** a meaningful content change | Do not commit as inventory update |
| Agent ran generator incidentally | `git restore <inventory-path>` before commit |
| Task **explicitly** requires regeneration | Re-run only if sources changed or generator changed; still drop timestamp-only commit if diff is empty of substance |
| Unsure if diff is substantive | Judgment agent or human reviews diff — default to restore |

**Instance example** (Inflomatrix post-task checklist):

```bash
git restore docs/ai-context/inventories/business-page-inventory.md   # if timestamp-only
git restore docs/ai-context/inventories/business-route-inventory.md
```

Stage generated inventory **only** when substantive content changed.

---

## Regeneration triggers

Regenerate generated inventories when **any** trigger applies:

| # | Trigger |
|---|---------|
| 1 | **Source graph changed** — routes, pages, adapters, detail surfaces, archive JSON |
| 2 | **Generator changed** — logic, classification, output format |
| 3 | **Freshness check exit 1** — STALE or ERROR reported |
| 4 | **Explicit AICS maintenance task** — ticket scope includes regeneration |
| 5 | **Promotion/adoption** — new inventory type added to instance AICS |

Do **not** regenerate routinely on unrelated doc-only tickets.

### Regeneration procedure (pattern)

```text
1. Run upstream source refresh (if project defines one — e.g. archive JSON)
2. Run generator script
3. Run freshness check → exit 0
4. Review diff — substantive only?
5. Commit scoped inventory files OR restore timestamp-only drift
```

---

## Do-not-expand rules

Generated inventories are **navigation and classification aids** — not action orders.

| Prohibition | Rationale |
|-------------|-----------|
| **No manual commentary** in generated tables | Creates dual SSOT; edit generator instead |
| **No manual row edits** | Next regeneration overwrites; hides drift |
| **Candidates ≠ deletion targets** | Dead-page / legacy candidates require human/product validation |
| **No promotion to cleanup ticket** without validation | Investigation classifies; judgment authorizes |
| **No paste of raw archive bodies** | Bloats context window; link to source |

### Candidate classifications

When inventories include `legacy-candidate`, `low-discovery`, `bespoke-risk`, or similar:

- Treat as **review inputs**
- **Stop** if implementation agent interprets as delete list
- Preserve in deferred register until product sign-off

---

## Overnight / maintenance interaction (high level)

Canonical policy: [OVERNIGHT_MAINTENANCE_MODEL.md](./OVERNIGHT_MAINTENANCE_MODEL.md).

Consumer projects may run **maintenance reports** that detect inventory drift, gate status, or git noise.

| Rule | Policy |
|------|--------|
| Reports are **not** SSOT | Human-review artifacts only |
| **No auto-commit** | Maintenance must not commit generated drift by default |
| **Classify before action** | Report labels timestamp-only vs substantive vs stale |
| **Recommended next role** | Report may suggest investigation / judgment / implementation — not bypass rituals |

Detailed maintenance design is instance scope. Canonical requirements:

1. Detect drift
2. Classify it
3. Leave remediation to scoped ticket + human review

**Instance example** (Inflomatrix): `run-overnight-maintenance.ts` writes `docs/ai-context/reports/overnight/*.md`; flags timestamp-only inventory diffs for manual restore.

---

## Alignment with agent operating constitution

| Constitution section | Inventory policy |
|---------------------|------------------|
| Closure ritual §5.4 | Regenerate only when needed; restore timestamp-only drift |
| Deferred preservation §6 | Candidates stay deferred — not deleted on inventory evidence |
| Stop conditions §7 | Deletion candidates · unscoped generator drift → stop |
| Report-back §4.9 | List unrelated inventory drift in known drift field |

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [AI_ASSISTED_VERIFICATION.md](./AI_ASSISTED_VERIFICATION.md) | `generated inventory` change class |
| [AICS_PRINCIPLES.md](./AICS_PRINCIPLES.md) | SSOT · verification |
| [AI_GOVERNANCE.md](./AI_GOVERNANCE.md) | Trust model |
| [AGENTS_OPERATING_CONSTITUTION.md](./AGENTS_OPERATING_CONSTITUTION.md) | Closure · commit hygiene |
| [OVERNIGHT_MAINTENANCE_MODEL.md](./OVERNIGHT_MAINTENANCE_MODEL.md) | Maintenance loops · report contract |
| [README.md](./README.md) | Chapter 20 index |

---

**최종 업데이트**: 2026-06-29 — SYNAXION-AICS-2B substantive generated inventory policy
