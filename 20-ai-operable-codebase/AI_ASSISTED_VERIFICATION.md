# AI-Assisted Verification

> **Synaxion Constitution 20장**  
> **Status**: Substantive  
> **Last updated**: 2026-06-29 — SYNAXION-AICS-2B  
> **Principle**: [AICS_PRINCIPLES.md §5 Verification Before Trust](./AICS_PRINCIPLES.md)  
> **Tier**: 3 (introduction)

---

## Purpose

This document defines **minimum verification** for AI-assisted changes on Synaxion consumer codebases.

AI output is **untrusted input** until verified ([AI_GOVERNANCE.md §1](./AI_GOVERNANCE.md)). Completion requires **recorded commands and exit codes** — not model confidence, visual inspection alone, or chat assertions.

Cross-reference for script catalogs: [06-automation/VERIFICATION_SCRIPTS.md](../06-automation/VERIFICATION_SCRIPTS.md) · [CROSS_INSTANCE_VERIFICATION_PATTERNS.md](../06-automation/CROSS_INSTANCE_VERIFICATION_PATTERNS.md).

Agent operating handoff: [AGENTS_OPERATING_CONSTITUTION.md §4–5](./AGENTS_OPERATING_CONSTITUTION.md).

---

## Scope

| In scope | Out of scope |
|----------|--------------|
| Change-class → minimum verification matrix | Full CI pipeline design |
| Targeted-before-broad test policy | Tool-specific IDE test runners |
| Silent-failure prohibition | Generated inventory mechanics (see [GENERATED_INVENTORY_POLICY.md](./GENERATED_INVENTORY_POLICY.md)) |
| Report-back contract | API 7-stage construction detail (Ch.03) |

Consumer projects **implement** local `check:*` lanes. This document defines the **policy** those lanes must satisfy.

---

## Core rules

### 1. No “looks correct” completion

A task is complete only when:

1. Ticket completion criteria are met, **and**
2. Specified verification commands exit as required, **and**
3. Report-back includes commands, exit codes, and failures.

“Output looks right” · “tests probably pass” · “only a small change” are **not** completion.

### 2. Targeted tests before broad tests

| Order | Practice |
|-------|----------|
| **1** | Scoped unit/integration tests for touched paths |
| **2** | Plane- or layer-specific `check:*` gates |
| **3** | Broader suites **only** when ticket requires or risk demands |

Do not run full-repo suites as a substitute for scoped proof when a narrower gate exists.

### 3. Gates must match touched plane

Verification must cover the **surface the change touched**:

| Touched surface | Minimum gate pattern |
|-----------------|----------------------|
| Business workbench UI/runtime | Workbench convergence · inline parity · scoped Jest |
| Portal plane | `check:portal-plane` · portal design hygiene · scoped portal tests |
| Site / public surface | Site projection contract · scoped site tests |
| Application layer | `check:application-boundary` |
| Cross-layer imports | `check:layer-boundaries` |
| API handlers | `verify:api-7-stages` + permission fields |

Running unrelated green gates does not excuse skipping a matching gate.

### 4. Unrelated failing gates are watch items

If a gate fails but is **outside ticket scope**:

- **Do not** hide the failure or mark the ticket complete without note
- **Record** as a watch item in report-back (command, exit code, one-line summary)
- **Do not** fix unrelated failures inside a scoped ticket unless explicitly authorized

Judgment agent or human decides follow-up ticket vs rework.

### 5. Destructive and boundary changes require approval

The following require **explicit human or judgment-agent approval** before implementation:

- Auth, permission, RLS, billing, tenant boundary changes
- Destructive cleanup, bulk delete, registry purge
- Cross-plane route architecture changes
- Skipping git hooks (`--no-verify`) or bypassing CI gates

Implementation agents **stop** per [AGENTS_OPERATING_CONSTITUTION.md §7](./AGENTS_OPERATING_CONSTITUTION.md).

---

## Change classes and minimum verification

Each change belongs to a **primary class**. Apply the row's minimum verification. When multiple classes apply, use the **union** of requirements (highest bar wins).

| Change class | Description | Minimum verification |
|--------------|-------------|----------------------|
| **docs-only** | Markdown, plans, Ch.20 — no `src/**` | Manual completion-criteria checklist; link updates if status changed; no code gates unless doc references broken paths |
| **generated inventory** | Regenerated machine-produced markdown | Regenerator run + freshness check exit **0**; commit only substantive diff (see [GENERATED_INVENTORY_POLICY.md](./GENERATED_INVENTORY_POLICY.md)) |
| **test-only** | Tests/assertions only — no production logic change | Scoped test command exit **0**; confirm no accidental `src/**` production edits |
| **UI / component** | React/components/styles in a single plane | Scoped Jest/RTL; plane hygiene gate if exists; E2E only when ticket requires behavioral proof |
| **route / config** | Routers, resolvers, route config, allowlists | Plane route registry gate; scoped route tests; **no** cross-plane changes without architecture ticket |
| **permission / auth / RLS / billing boundary** | Security and tenancy surfaces | **Human approval required**; full permission-field audit; integration tests; never scope-creep from adjacent ticket |
| **cross-plane** | Business · portal · site · relationship interaction | Investigation + architecture ticket first; multiple plane gates; explicit allowed-files list |
| **deletion / cleanup** | Remove pages, routes, components, dead code | **Human approval**; prove non-production or validated candidate; no inventory-driven auto-delete |
| **scripts / checks** | `scripts/checks/**`, verification tooling | Run the check script itself exit **0**; run representative gates the check protects |

**Instance example** (Inflomatrix): `check:workbench-shell-convergence` for workbench allowlist drift; `check:portal-plane` for portal changes; `check-ai-context-freshness.ts` for generated inventories.

---

## Verification by AICS principle

| Principle | Verification obligation |
|-----------|-------------------------|
| Codebase-as-Documentation | Doc-only changes update plan/status pointers when closure requires |
| Context Window Discipline | Run narrow commands listed in ticket — not entire `check:all` by default |
| Single Source of Truth | Status docs updated once; no duplicate completion claims |
| Agent Authority Boundaries | Verification scope matches allowed-files scope |
| Verification Before Trust | This document — gates before merge/close |

---

## Silent failure prohibition

Silent failure violates Ch.04 Safety. AI-assisted work must not introduce or preserve hidden failure paths.

### Skipped tests must be explicit

| Situation | Rule |
|-----------|------|
| Test intentionally not run | Report-back states **which** test and **why** |
| Test skipped in code (`test.skip`, conditional skip) | Ticket must justify; not a default pattern |
| E2E deferred | Record as deferred with trigger — not as pass |

### Defensive skip guards

Temporary skip guards (e.g. `if (!element) return` in E2E, env-based bailouts) are **debt**.

- Allowed only while condition is genuinely unstable and ticket documents it
- **Remove** once stability is proven — follow-up ticket or same ticket criterion
- Do not accumulate permanent “pass by skipping” paths

### Pass with warning

When a gate exits **0** but emits warnings:

| Warning relevance | Action |
|-------------------|--------|
| **Relevant** to touched surface | Classify in report-back; may require follow-up ticket |
| **Unrelated** legacy warn-only | Record as watch item; do not treat as ticket failure unless criteria say otherwise |
| **Freshness markdown warnings** on exit 0 | Note in report; fix generator/template if recurring |

Exit **0** with relevant warnings is **not** equivalent to “no issues” — classify explicitly.

---

## Report-back contract

Every implementation agent report (see [AGENTS_OPERATING_CONSTITUTION.md §4.9](./AGENTS_OPERATING_CONSTITUTION.md)) must include:

| # | Field | Content |
|---|-------|---------|
| 1 | **Changed files** | Paths; separate docs vs `src/**` vs generated |
| 2 | **Commands run** | Full command strings in execution order |
| 3 | **Exit codes** | Per command — `0`, non-zero, or “not run (reason)” |
| 4 | **Failures** | stderr summary or gate name; what was not fixed |
| 5 | **Known unrelated drift** | Dirty files, timestamp-only inventory drift, submodule noise |
| 6 | **Deferred items** | Preserved bullets with owner · reason · trigger |

Missing exit codes or omitted failures invalidate the report for closure.

---

## Doc-only vs code verification

| Aspect | Doc-only | Code change |
|--------|----------|-------------|
| Automated gates | Optional unless doc integrity checks exist | **Required** per change class |
| Completion proof | Plan criteria checklist | Commands + exit codes |
| Inventory regeneration | Only if generator task | When adapter/route/detail sources touched |
| Commit scope | Docs/plans only | Allowed files only |

---

## Relationship to generated inventories

Generated AI context inventories have additional rules:

- Manual edit prohibited
- Freshness check semantics
- Timestamp-only drift handling

See [GENERATED_INVENTORY_POLICY.md](./GENERATED_INVENTORY_POLICY.md).

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [AICS_PRINCIPLES.md](./AICS_PRINCIPLES.md) | §5 Verification Before Trust |
| [AI_GOVERNANCE.md](./AI_GOVERNANCE.md) | Trust model · no silent success |
| [AGENTS_OPERATING_CONSTITUTION.md](./AGENTS_OPERATING_CONSTITUTION.md) | Ticket ritual · closure ritual · stop conditions |
| [GENERATED_INVENTORY_POLICY.md](./GENERATED_INVENTORY_POLICY.md) | Generated file verification |
| [06-automation/VERIFICATION_SCRIPTS.md](../06-automation/VERIFICATION_SCRIPTS.md) | Instance script catalog |

---

**최종 업데이트**: 2026-06-29 — SYNAXION-AICS-2B substantive verification policy
