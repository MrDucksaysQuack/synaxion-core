# Context Window Optimization

> **Synaxion Constitution 20장**  
> **Status**: Substantive  
> **Last updated**: 2026-06-29 — SYNAXION-AICS-2C  
> **Principle**: [AICS_PRINCIPLES.md §2 Context Window Discipline](./AICS_PRINCIPLES.md)  
> **Tier**: 3 (introduction)

---

## Purpose

The context window is a **scarce execution budget** — not unlimited memory.

Agents must load the **minimum sufficient source set** to complete the task. Every file read consumes budget; every omitted SSOT risks wrong edits.

**Conversation memory is not a source of truth.** Prior chat turns may be stale, incomplete, or wrong. The repository — plans, maps, inventories, code — is the interface ([AICS_PRINCIPLES.md §1](./AICS_PRINCIPLES.md)).

Alignment: [AGENTS_OPERATING_CONSTITUTION.md §4.3](./AGENTS_OPERATING_CONSTITUTION.md) (before-making-changes) · [CODEBASE_NAVIGATION_MAP.md](./CODEBASE_NAVIGATION_MAP.md) (where to look).

---

## Core rules

| Rule | Practice |
|------|----------|
| **Budget consciously** | Stop loading when SSOT for the decision is found |
| **Plan before sweep** | Multi-step work: read active plan before code trees |
| **Targeted over broad** | Grep/path-scoped read before directory loads |
| **Layer order** | Status → plan → map → inventory → source → test/checker |
| **One stream per window** | Do not mix unrelated tracks in one context load |

---

## Task-class → minimum read set

Each task has a **primary class**. Load the union of the row's read set. Do not load entire repos “for context.”

| Task class | Minimum read set (in order) |
|------------|----------------------------|
| **docs-only** | Instance entry · working rules · active plan status · target doc · DOCUMENT_INDEX (if new area) |
| **investigation** | Instance entry · working rules · next-actions · relevant map/inventory · **exact paths in brief only** |
| **test-only** | Ticket · nearest test file(s) · implementation under test · related checker if gate failure |
| **UI / component** | Plan · plane map · owner component + tests · plane hygiene gate docs |
| **route / config** | Plan · route/registry map or inventory · resolver/router owner · route tests |
| **permission / auth / RLS / billing boundary** | Plan · boundary policy · **stop** — human approval before code |
| **generated inventory** | [GENERATED_INVENTORY_POLICY.md](./GENERATED_INVENTORY_POLICY.md) · inventories README · freshness script header · **not** full generated tables |
| **deletion / cleanup** | Plan · deferral register · investigation classification · **stop** without human approval |

**Instance example** (Inflomatrix): `docs/ai-context/CURRENT_STATE.md` · `NEXT_ACTIONS.md` · `maps/plane-map.md` — pattern only; other consumers define their own paths.

---

## Layer-ordered loading

Load in this order. **Stop** when the task's question is answerable.

```text
1. Current state / working rules     — what is true now; what is forbidden
2. Active plan / next actions        — what stream owns this work
3. Relevant map                    — plane, adapter, runtime (instance layer)
4. Relevant inventory              — generated compression (read policy first)
5. Targeted source files           — exact paths from ticket or map
6. Tests / check scripts           — prove behavior; gate definitions
7. Broad search                    — only if steps 1–6 insufficient
```

Do not skip to step 7 because it feels faster.

### Archive and stale plan exclusion

| Source | Rule |
|--------|------|
| `.cursor/plans/active/**` | **Binding** for current execution |
| `.cursor/plans/archived/**` | **Reference only** — do not treat as current SSOT |
| Superseded plan in chat | **Ignore** — read repo plan file |
| Generated inventory timestamp | Trust freshness check — not chat recall |

---

## Targeted read recipes

| Situation | Recipe |
|-----------|--------|
| Unknown symbol location | `grep` / ripgrep → open **matching files only** |
| Bug in one module | Nearest owner file → direct imports → test file |
| Gate failure | Read **checker script** and failure message → then touched source |
| Test-only ticket | Test file first → minimal implementation slice |
| Inventory stale | [GENERATED_INVENTORY_POLICY.md](./GENERATED_INVENTORY_POLICY.md) + inventories README → freshness command → generate **only if justified** |
| Cross-layer change | Layer boundary doc → plan → **stop** if architecture ticket missing |
| Large file | Grep for symbol · read line range — not full file unless editing |

**Nearest owner before global**: prefer the file that **owns** the behavior (handler, page, adapter) over shared utilities until ownership is clear.

---

## Anti-patterns

| Anti-pattern | Why it fails |
|--------------|--------------|
| **Full-tree loading** | Burns budget; hides signal in noise |
| **Stale plan reliance** | Chat or archived plan ≠ current SSOT |
| **Generated file as source truth** | Inventories are compressions — authority is source graph + generator |
| **Edit before ownership** | Wrong file, scope creep, layer violations |
| **Broad refactor from narrow symptom** | Violates authority boundaries |
| **Conversation memory as evidence** | Unverifiable; not in repo |
| **Mixed streams in one window** | FE + BP + portal in one load → confused scope |
| **Reading all playbooks every task** | Link when role requires — do not preload all templates |

---

## Stop-and-ask / split-ticket rules

Stop loading and escalate to judgment agent or human when:

| Condition | Action |
|-----------|--------|
| **Unknown ownership** | Investigation ticket — do not guess paths |
| **Conflicting SSOTs** | Stop · fix doc or escalate — do not blend |
| **Context budget exceeded** | Split ticket · reduce scope · report what was not read |
| **Boundary-sensitive change** | Auth/RLS/billing/tenant — approval before read→edit |
| **Ambiguous product behavior** | Investigation · not implementation |
| **Two task classes equally primary** | Split into two tickets |

Splitting is preferred over **partial reads across too many domains**.

---

## Alignment with AICS principles

| Principle | Context discipline |
|-----------|-------------------|
| Codebase-as-Documentation | Read repo SSOT — not chat |
| Context Window Discipline | This document |
| Single Source of Truth | One plan · one map axis — no blending |
| Agent Authority Boundaries | Read scope matches edit scope |
| Verification Before Trust | Read checker before claiming pass |

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [CODEBASE_NAVIGATION_MAP.md](./CODEBASE_NAVIGATION_MAP.md) | Where to look first |
| [AGENTS_OPERATING_CONSTITUTION.md](./AGENTS_OPERATING_CONSTITUTION.md) | Ticket before-making-changes |
| [CLAUDE_CODE_OPERATING_RULES.md](./CLAUDE_CODE_OPERATING_RULES.md) | IDE harness targeted read |
| [AI_ASSISTED_VERIFICATION.md](./AI_ASSISTED_VERIFICATION.md) | Change-class verification |
| [GENERATED_INVENTORY_POLICY.md](./GENERATED_INVENTORY_POLICY.md) | Inventory read policy |

---

**최종 업데이트**: 2026-06-29 — SYNAXION-AICS-2C
