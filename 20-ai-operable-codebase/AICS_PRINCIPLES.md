# AICS Principles — AI Context System Core Principles

> **Synaxion Constitution 20장**  
> Five principles that govern how codebases are prepared for AI-assisted operation.  
> **Tier**: 3 (introduction) · **Status**: canonical

---

## Overview

These principles apply to **every Synaxion consumer** that allows AI agents to read or modify the repository. Instance-specific docs implement them locally; they do not replace them.

Priority when principles tension with speed: **Verification Before Trust** and **Agent Authority Boundaries** defer to **Structure First** (Ch.01) and **Safety** (Ch.04) — see [META_CONSTITUTION.md §5](../META_CONSTITUTION.md).

---

## 1. Codebase-as-Documentation

**Statement**: The repository structure, naming, and colocated docs are the **primary interface** for agents — not chat history.

| Implication | Agent obligation | Maintainer obligation |
|-------------|------------------|------------------------|
| Domain boundaries visible in paths | Read layer READMEs before cross-cutting edits | Keep `src/` layout aligned with architecture docs |
| Plans and SSOT paths discoverable | Follow `.cursor/plans/` · `docs/DOCUMENT_INDEX.md` (instance) | Register active tracks; no orphan execution docs |
| Code adjacent stubs point to canonical docs | Follow redirects; do not invent parallel SSOT | Stub → canonical link, not duplicate prose |

**Anti-patterns**

- Relying on conversation memory instead of repo docs
- Creating one-off markdown at repo root for agent instructions
- Duplicating constitution text outside `synaxion-core/`

---

## 2. Context Window Discipline

**Statement**: Agents must **budget context** — load only what the task requires, in dependency order.

| Rule | Practice |
|------|----------|
| **Targeted read** | Prefer grep / path-scoped read over full-file sweeps |
| **Layer order** | Core → engines → domain → application → api (Ch.01) |
| **Plan first** | Multi-step work: read active plan before code |
| **Stop on ambiguity** | Missing SSOT → note + ask; do not guess canonical paths |

**Anti-patterns**

- Loading entire directories “for context”
- Skipping plan/constitution because the task “looks small”
- Filling the window with archived or superseded plans

Detail patterns: [CONTEXT_WINDOW_OPTIMIZATION.md](./CONTEXT_WINDOW_OPTIMIZATION.md) (skeleton).

---

## 3. Single Source of Truth

**Statement**: Each decision axis has **one canonical document**. Agents must not create competing sources.

| SSOT type | Canonical location (pattern) |
|-----------|------------------------------|
| Synaxion constitution | `synaxion-core/` submodule |
| Instance mirror | `doc/constitution/` — read-only; submodule wins |
| Product / planning | `docs/` |
| Execution plans | `.cursor/plans/active/{domain}/` |
| Version | `synaxion-core/VERSION` |

**Rules**

1. If two docs disagree, **newer canonical SSOT wins**; file a fix — do not blend.
2. Instance AI context (`docs/ai-context/`) **indexes and extends** — does not fork Ch.20.
3. Promotion from instance → canonical follows [AI_GOVERNANCE.md](./AI_GOVERNANCE.md).

Synaxion map: [SINGLE_SOURCE_MAP.md](../SINGLE_SOURCE_MAP.md).

---

## 4. Agent Authority Boundaries

**Statement**: Agents operate within **explicit authority** — what they may read, edit, run, and commit.

| Boundary | Default |
|----------|---------|
| **Edit scope** | Files required by the task; no drive-by refactors |
| **Constitution** | Edit `synaxion-core/` only via constitution change process |
| **Production code** | Respect layer boundaries; no reverse imports |
| **Destructive ops** | Shell/git destructive commands require human approval |
| **Secrets** | Never commit credentials; never exfiltrate env values |

Alignment with execution authority: [01-foundations/EXECUTION_AUTHORITY_ALIGNMENT.md](../01-foundations/EXECUTION_AUTHORITY_ALIGNMENT.md).

Detail workflows: [AGENTS_OPERATING_CONSTITUTION.md](./AGENTS_OPERATING_CONSTITUTION.md) (skeleton).

---

## 5. Verification Before Trust

**Statement**: **No AI-generated change is trusted** until verified by project-defined gates.

| Change class | Minimum verification |
|--------------|----------------------|
| Type/lint touch | Relevant `check:*` for touched layers |
| API / handler | `verify:api-7-stages` + permission fields |
| Cross-layer | `check:layer-boundaries` |
| Plan-only | Completion criteria in plan doc |

**Rules**

1. “Looks correct” is not completion.
2. Silent failure fixes must prove observability — Ch.04.
3. Skipping hooks (`--no-verify`) requires explicit human request.

Detail lanes: [AI_ASSISTED_VERIFICATION.md](./AI_ASSISTED_VERIFICATION.md) (skeleton).

---

## Summary table

| # | Principle | One-line test |
|---|-----------|---------------|
| 1 | Codebase-as-Documentation | Can an agent find SSOT without chat? |
| 2 | Context Window Discipline | Did the agent read the minimum sufficient set? |
| 3 | Single Source of Truth | Is there exactly one canonical source per axis? |
| 4 | Agent Authority Boundaries | Did the agent stay inside edit/run authority? |
| 5 | Verification Before Trust | Did verification run and pass? |

**최종 업데이트**: 2026-06-28 — initial principles (AICS-2)
