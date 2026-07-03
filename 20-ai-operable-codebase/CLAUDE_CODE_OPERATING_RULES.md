# Claude Code Operating Rules

> **Synaxion Constitution 20장**  
> **Status**: Substantive  
> **Last updated**: 2026-06-29 — SYNAXION-AICS-2C  
> **Extends**: [AGENTS_OPERATING_CONSTITUTION.md](./AGENTS_OPERATING_CONSTITUTION.md)  
> **Tier**: 3 (introduction)

---

## Purpose

This document defines **Claude Code** (and similar IDE-embedded agents) as an **execution harness pattern** — not a new authority model.

Claude Code implements the three-agent workflow locally:

- May act as **investigation agent** (read-only)
- May act as **implementation agent** when given a scoped ticket
- Does **not** replace **judgment/design agent** (GPT or human) for scope and ticket authorship

Authority boundaries remain in [AGENTS_OPERATING_CONSTITUTION.md](./AGENTS_OPERATING_CONSTITUTION.md). This document adds **tool-specific conventions**: plan→confirm→execute, shell tiers, targeted read, `CLAUDE.md` entrypoint rules.

---

## Operating sequence

Every non-trivial Claude Code session follows:

```text
Plan → Confirm (when required) → Execute within scope → Verify → Report back
```

| Phase | Agent obligation |
|-------|------------------|
| **Plan** | State goal · allowed files · forbidden zones · verification commands |
| **Confirm** | Required for destructive ops · boundary changes · ambiguous scope — show commands to human |
| **Execute** | Edit only allowed files · run scoped tests/checks |
| **Verify** | Record commands and exit codes ([AI_ASSISTED_VERIFICATION.md](./AI_ASSISTED_VERIFICATION.md)) |
| **Report back** | Changed files · commands · failures · drift · deferred |

Multi-step work (3+ steps): present plan **before** broad reads or edits ([AGENTS_OPERATING_CONSTITUTION.md §4](./AGENTS_OPERATING_CONSTITUTION.md)).

Investigation-only tasks: **Plan → Read → Report** — no execute phase.

---

## Shell command approval tiers

Claude Code runs shell commands. Tier determines whether human approval is required **before** execution.

| Tier | Examples | Approval |
|------|----------|----------|
| **T0 — Safe read-only** | `git status` · `git diff` · `git log` · read-only `grep`/`find` | Proceed; show in report |
| **T1 — Targeted test/check** | Scoped `jest` · `pnpm run check:<gate>` · `tsx scripts/checks/...` | Proceed per ticket; record exit codes |
| **T2 — Write-producing** | `git add` · `git commit` · file writes via tools · `pnpm install` | Proceed only when ticket authorizes; user may require preview |
| **T3 — Destructive** | `rm` · `git reset --hard` · `git push --force` · bulk delete · `--no-verify` | **Explicit human approval required** — show command first |

Rules:

1. When uncertain, **upgrade tier** (treat as T3).
2. Never hide failed commands in report-back.
3. Destructive git on `main`/`master`: warn even with approval.

---

## Targeted read priority

Claude Code must budget context per [CONTEXT_WINDOW_OPTIMIZATION.md](./CONTEXT_WINDOW_OPTIMIZATION.md).

| Priority | Action |
|----------|--------|
| 1 | **Search** (`grep`, path glob) before opening directories |
| 2 | **Inspect owner files** — handler, page, adapter named in ticket/map |
| 3 | **Inspect nearest tests/checkers** — prove or disprove gate failure |
| 4 | **Partial read** — line ranges when file is large |
| 5 | **Full directory read** — only when ticket lists paths or search proves necessity |

Avoid: loading `src/**` trees, all of `node_modules`, entire plan archives, full generated inventory tables.

---

## `CLAUDE.md` convention

Project root `CLAUDE.md` (or equivalent) is the **instance entrypoint** for Claude Code — not a second constitution.

| Property | Rule |
|----------|------|
| **Role** | Summarize · link · project-specific boundaries |
| **Must link** | Ch.20 canonical (`synaxion-core/20-ai-operable-codebase/`) · instance working rules |
| **Must not** | Duplicate full `AGENTS_OPERATING_CONSTITUTION` · `AI_ASSISTED_VERIFICATION` · `GENERATED_INVENTORY_POLICY` prose |
| **Must not** | Contradict project SSOT or Synaxion Tier 1 rules |
| **May contain** | Layer boundaries · local `check:*` pointers · verification one-liners |

**Instance example** (Inflomatrix): `CLAUDE.md` links `docs/ai-context/` and layer boundary block — pattern for other consumers.

Canonical policies live in `synaxion-core/`. `CLAUDE.md` **points**; it does not fork.

---

## Stop conditions

Claude Code **stops** and reports (does not improvise) when:

| # | Condition |
|---|-----------|
| 1 | **Unknown file ownership** — no map/plan names owner |
| 2 | **Unexpected dirty files** outside allowed list |
| 3 | **Generated drift** — inventory changed without justified regenerate |
| 4 | **Auth / permission / RLS / billing / tenant boundary** — not in ticket scope |
| 5 | **Unclear destructive command** — tier T3 without approval |
| 6 | **Task exceeds approved scope** — new files/domains discovered mid-work |
| 7 | **Conflicting SSOT** — two docs disagree |

Stop report minimum: condition · evidence · what was **not** changed · recommended next role ([AGENTS_OPERATING_CONSTITUTION.md §7](./AGENTS_OPERATING_CONSTITUTION.md)).

---

## Relationship to other agents

| Role | Claude Code mode |
|------|------------------|
| Investigation | Read-only · classification · preflight docs |
| Implementation | Scoped ticket · allowed files only |
| Judgment / design | **Not** Claude Code default — human or GPT authors tickets |

Do not use Claude Code to silently expand judgment-agent decisions into repo edits.

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [AGENTS_OPERATING_CONSTITUTION.md](./AGENTS_OPERATING_CONSTITUTION.md) | Parent authority model |
| [CONTEXT_WINDOW_OPTIMIZATION.md](./CONTEXT_WINDOW_OPTIMIZATION.md) | Read budgeting |
| [AI_ASSISTED_VERIFICATION.md](./AI_ASSISTED_VERIFICATION.md) | Verify + report-back |
| [AI_GOVERNANCE.md](./AI_GOVERNANCE.md) | Canonical edit policy |
| [CODEBASE_NAVIGATION_MAP.md](./CODEBASE_NAVIGATION_MAP.md) | SSOT locations |

---

**최종 업데이트**: 2026-06-29 — SYNAXION-AICS-2C
