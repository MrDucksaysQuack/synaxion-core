# Overnight Maintenance Model

> **Synaxion Constitution 20장**  
> **Status**: Substantive  
> **Last updated**: 2026-06-29 — SYNAXION-AICS-2D  
> **Principle**: [AICS_PRINCIPLES.md §5 Verification Before Trust](./AICS_PRINCIPLES.md) · [§4 Agent Authority Boundaries](./AICS_PRINCIPLES.md)  
> **Tier**: 3 (introduction)

---

## Purpose

This document defines the **canonical policy** for safe AI-assisted **overnight / scheduled maintenance loops**.

Maintenance runs are **observation-first**: they detect drift, run diagnostics, and produce **human-review reports** — they do not silently fix production code or auto-commit changes.

Consumer projects implement runners and report paths locally. This document is the **Synaxion rule**.

Related: [GENERATED_INVENTORY_POLICY.md §Overnight](./GENERATED_INVENTORY_POLICY.md) · [AGENTS_OPERATING_CONSTITUTION.md §5](./AGENTS_OPERATING_CONSTITUTION.md) · [AI_ASSISTED_VERIFICATION.md](./AI_ASSISTED_VERIFICATION.md).

---

## Scope

| In scope | Out of scope |
|----------|--------------|
| Safe maintenance loop principles | Scheduler implementation code |
| Run mode policy categories | Project-specific step lists |
| Report artifact contract | CI pipeline design |
| Morning review ritual | Auto-remediation bots |
| Scheduling policy | Deletion authority |

---

## Safe maintenance loop

```text
Observe → Check → Scan (optional) → Report → Human/GPT review → Scoped ticket (if needed)
```

| Property | Rule |
|----------|------|
| **Observation-first** | Default action is record — not edit |
| **Checks allowed** | Freshness · narrow tests · static scans · git status |
| **Diagnostics allowed** | Bounded `check:*` · provenance discovery · drift classification |
| **Source modification** | **Forbidden** unless an explicit maintenance task authorizes it |
| **Auto-commit** | **Forbidden** — always |
| **Auto-fix production** | **Forbidden** — maintenance does not merge PRs or patch `src/**` silently |

Maintenance output is a **report artifact**, not completion of work.

**Instance example** (Inflomatrix): `run-overnight-maintenance.ts` writes reports under `docs/ai-context/reports/overnight/` — pattern only.

---

## Run modes (policy categories)

Modes are **intensity tiers** — not universal command names. Instance runners map local steps to these categories.

| Mode | Intensity | Expected use case | Typical steps (pattern) |
|------|-----------|-------------------|-------------------------|
| **quick** | Low | Nightly smoke · pre-merge hygiene · &lt; few minutes | Git status · recent activity · freshness check |
| **standard** | Medium | Regular maintenance · inventory refresh when justified · narrow contract tests | quick + freshness-driven generate (if needed) + scoped tests |
| **deep** | High | Weekly audit · time-bounded extended scans · optional extra gates | standard + static scans · provenance discovery · optional `check:*` (time-capped) |

Rules:

1. **Deep** must respect a **time budget** — skip optional steps when budget exhausted; record skips in report.
2. **Full test suite** is not default for any mode.
3. Mode selection is human or scheduler config — not agent improvisation mid-run.

---

## Hard safety constraints

Non-negotiable for any Synaxion AICS maintenance implementation:

| # | Constraint |
|---|------------|
| 1 | **No auto-commit** |
| 2 | **No destructive cleanup** (bulk delete, registry purge, `git reset --hard`) |
| 3 | **No `src/**` modification** unless explicit task authorizes |
| 4 | **No generated inventory commit** without diff review |
| 5 | **No auth / permission / RLS / billing / tenant-boundary modification** |
| 6 | **No deletion** based solely on scan or inventory candidates |
| 7 | **No `package.json` / submodule mutation** by default runner |
| 8 | **No self-repair** on scheduler failure — report and notify |

Violations must surface in the report and fail the run safe (see §Source-change safety).

---

## Report artifact contract

Report **path** is instance-specific (e.g. `docs/ai-context/reports/overnight/YYYY-MM-DD-HHMM.md`).  
Report **content** must include:

| # | Field | Requirement |
|---|-------|-------------|
| 1 | **Timestamp** | Run start / report write time (ISO) |
| 2 | **Mode** | quick · standard · deep |
| 3 | **Commands run** | Full command strings per step |
| 4 | **Exit codes** | Per step; `skipped` if intentionally not run |
| 5 | **Failures** | Non-zero exits · stderr summary |
| 6 | **Unrelated drift** | Dirty files outside maintenance scope |
| 7 | **Generated inventory status** | Fresh / stale / regenerated / timestamp-only drift flagged |
| 8 | **Source modification detection** | Protected path changes before vs after run |
| 9 | **Recommended next actions** | Role hint (investigation · Cursor ticket · watch) |
| 10 | **Deferred / watch items** | Preserved — not promoted to active work |

Reports are **not SSOT**. They are triage input for morning review.

---

## Source-change safety

Maintenance must **fail safe** if protected source changes unexpectedly.

| Scenario | Policy |
|----------|--------|
| `src/**` (or configured protected prefixes) dirty **after** run | Run **fails** · report lists paths · **no commit** |
| Expected doc/inventory drift only | Classify in report · timestamp-only → restore guidance |
| Ambiguous change | Treat as protected until human review |

Instance implementations may use a **dedicated exit code** (e.g. `2`) for protected-path change detection, distinct from check failure (`1`) and success (`0`).

Restoration or commit decisions require **human or judgment-agent review** — not the maintenance runner.

**Instance example** (Inflomatrix): runner compares `git status` before/after; protected prefixes include `src/`, `package.json`, `synaxion-core/`; exit `2` on unexpected protected changes.

---

## Generated inventory interaction

Per [GENERATED_INVENTORY_POLICY.md](./GENERATED_INVENTORY_POLICY.md):

```text
1. Run freshness check first
2. Generate only when justified (stale · source changed · mode policy allows)
3. Re-run freshness check after generate
4. Classify diff: substantive vs timestamp-only
5. Restore timestamp-only drift — do not commit
6. Substantive diff → report-back · human review before commit
```

Maintenance may **invoke** generation in standard/deep modes but must **not** commit generated output automatically.

Candidates in dead-page or similar inventories remain **review inputs** — not deletion orders.

---

## Morning review ritual

Human or judgment agent reviews the latest report and classifies each finding:

| Classification | Meaning | Next step |
|----------------|---------|-----------|
| **ready-for-cursor** | Scoped fix · clear allowed files | Author implementation ticket |
| **investigation-needed** | Unknown ownership · ambiguous classification | Claude investigation ticket |
| **watch item** | Unrelated gate failure · legacy warn-only | Record · no silent fix in unrelated ticket |
| **unrelated drift** | Dirty files outside stream | Restore or separate hygiene ticket |
| **deferred** | Product/architecture decision pending | Preserve in deferral register |
| **false positive** | Scan noise · known acceptable | Document once · do not ticket |

Rules:

1. Do **not** convert scan candidates into deletion tasks without product/human validation.
2. Do **not** mark stream closed based on maintenance report alone — ticket closure ritual still applies ([AGENTS_OPERATING_CONSTITUTION.md §5](./AGENTS_OPERATING_CONSTITUTION.md)).
3. Recommended next role in report is a **hint** — judgment agent confirms.

---

## Scheduling policy

| Phase | Policy |
|-------|--------|
| **Manual-first** | Run maintenance manually until stable for several nights |
| **Optional scheduler** | Only after manual runs are trusted |
| **Scheduler behavior** | Must preserve no-auto-commit · report-only · same safety constraints |
| **Scheduler failure** | Notify / write failure report — **no self-repair** |
| **Scheduler config** | Instance docs (e.g. launchd plist template) — not canonical paths |

Agents must not enable schedulers that commit, patch `src/**`, or run destructive commands unattended.

**Instance example** (Inflomatrix AICS-5C): `overnight-scheduler.md` documents manual-first launchd — optional after 2–3 stable manual nights.

---

## Alignment with Ch.20 documents

| Document | Maintenance alignment |
|----------|----------------------|
| [AICS_PRINCIPLES.md](./AICS_PRINCIPLES.md) | Verification before trust · authority boundaries |
| [AGENTS_OPERATING_CONSTITUTION.md](./AGENTS_OPERATING_CONSTITUTION.md) | No auto-close · deferred preservation · report-back |
| [AI_ASSISTED_VERIFICATION.md](./AI_ASSISTED_VERIFICATION.md) | Exit codes in report · watch items for unrelated failures |
| [GENERATED_INVENTORY_POLICY.md](./GENERATED_INVENTORY_POLICY.md) | Freshness · timestamp-only drift |
| [CONTEXT_WINDOW_OPTIMIZATION.md](./CONTEXT_WINDOW_OPTIMIZATION.md) | Deep mode time budget · no full-suite default |
| [CLAUDE_CODE_OPERATING_RULES.md](./CLAUDE_CODE_OPERATING_RULES.md) | T3 destructive commands never in unattended loop |
| [CODEBASE_NAVIGATION_MAP.md](./CODEBASE_NAVIGATION_MAP.md) | Reports are not SSOT |

---

## Instance implementation checklist

Consumer projects adopting overnight maintenance should provide:

| Artifact | Minimum |
|----------|---------|
| Maintenance runner script | Implements modes · safety constraints · report contract |
| Reports directory | Human-review only · not canonical |
| Reports README | How to run · mode summary · safety bullets |
| Optional scheduler doc | Manual-first policy |

Inflomatrix reference (example): AICS-5B runner · AICS-5C scheduler doc — promotion source for this policy.

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [GENERATED_INVENTORY_POLICY.md](./GENERATED_INVENTORY_POLICY.md) | Inventory drift during maintenance |
| [AI_ASSISTED_VERIFICATION.md](./AI_ASSISTED_VERIFICATION.md) | Check exit codes in reports |
| [README.md](./README.md) | Chapter 20 index |

---

**최종 업데이트**: 2026-06-29 — SYNAXION-AICS-2D
