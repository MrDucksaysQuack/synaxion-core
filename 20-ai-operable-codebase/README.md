# 20장 — AI-Operable Codebase

> **Synaxion Constitution 20장**  
> AI가 코드베이스를 탐색·수정·검증할 때 필요한 **구조·문서·거버넌스** 원칙.  
> **버전**: 2.19.0 (Synaxion Constitution) · **Tier**: 3 (도입 단계)

---

## Purpose

Chapter 20 defines how a codebase must be **structured, documented, navigated, and verified** so that AI-assisted development remains **safe, auditable, and aligned with canonical Synaxion rules**.

The goal is not “more prompts.” The goal is a **machine-legible operating surface**: boundaries agents can see, sources they must respect, and verification they cannot skip.

---

## Scope

| In scope (Ch.20 canonical) | Out of scope (instance / other chapters) |
|------------------------------|------------------------------------------|
| Cross-project AI operability **principles** | Product UI maps (Ch.19) |
| Agent authority & governance **rules** | API 7-stage construction (Ch.03) |
| Context-window & SSOT **discipline** | Project-specific domain docs |
| Verification-before-trust **policy** | Harness file contents (instance `.ai/`, `.cursor/rules/`) |
| Navigation & context **patterns** (Ch.20 substantive) | Runtime code changes |

**Canonical location**: `synaxion-core/20-ai-operable-codebase/` (this directory).  
**Do not** mirror-edit `doc/constitution/` in consumer repos — submodule is SSOT.

---

## Relationship to AICS

**AICS** (AI Context System) is the **program** that connects Synaxion canonical rules with per-project instance context.

```text
AICS (program)
├── Synaxion canonical layer   → synaxion-core/20-ai-operable-codebase/  (this chapter)
└── Project instance layer     → e.g. docs/ai-context/ (Inflomatrix — separate ticket)
```

| Layer | Owner | Content |
|-------|-------|---------|
| **AICS canonical** | Synaxion submodule | Principles, governance, promotion model |
| **AICS instance** | Consumer repo | Domain maps, check lanes, local navigation |

Chapter 20 is the **Synaxion-side** of AICS. Instance layers **extend** but must not **contradict** it ([AI_GOVERNANCE.md](./AI_GOVERNANCE.md)).

---

## Relationship to project-specific AI context layers

Consumer projects (e.g. Inflomatrix) may maintain an **instance AI context tree** — commonly under `docs/ai-context/` or equivalent — containing:

- Layer boundaries and import rules for *this* repo
- Domain/module navigation maps
- Local `check:*` lanes and verification recipes
- Track-specific Cursor plan pointers

**Rules**

1. Instance docs are **lower tier** until promoted ([AI_GOVERNANCE.md §Promotion](./AI_GOVERNANCE.md)).
2. Instance docs **must not contradict** Ch.20 principles or Tier 1 Synaxion rules.
3. When instance and canonical conflict, **canonical wins**; instance doc is fixed or demoted.
4. Harness entrypoints (`.ai/AGENTS.md`, `CLAUDE.md`) **summarize and link** — they do not duplicate full canonical text.

---

## Required project-level implementation

Each Synaxion consumer that adopts AICS should eventually provide (instance layer — separate from Ch.20 canonical docs):

| Artifact | Minimum expectation |
|----------|---------------------|
| **Instance context root** | e.g. `docs/ai-context/README.md` — scope, links to Ch.20, local SSOT index |
| **Navigation map** | Instance maps implementing [CODEBASE_NAVIGATION_MAP.md](./CODEBASE_NAVIGATION_MAP.md) pattern |
| **Verification recipe** | Which `check:*` / E2E lanes apply per change type ([AI_ASSISTED_VERIFICATION.md](./AI_ASSISTED_VERIFICATION.md)) |
| **Agent operating rules** | Project-specific constraints that **extend** Ch.20 ([AGENTS_OPERATING_CONSTITUTION.md](./AGENTS_OPERATING_CONSTITUTION.md)) |
| **Maintenance reports** | Overnight/maintenance runner + reports dir implementing [OVERNIGHT_MAINTENANCE_MODEL.md](./OVERNIGHT_MAINTENANCE_MODEL.md) |
| **Promotion register** | **Deferred** — track promoted vs experimental instance docs; criteria until register exists: [AI_GOVERNANCE.md §5](./AI_GOVERNANCE.md) |

Until instance artifacts exist, agents rely on Ch.20 principles + existing repo docs — with **explicit verification** on every change.

---

## Document index

| Document | Status | Role |
|----------|:------:|------|
| [README.md](./README.md) | substantive | Chapter overview (this file) |
| [AICS_PRINCIPLES.md](./AICS_PRINCIPLES.md) | substantive | Six core principles |
| [AI_GOVERNANCE.md](./AI_GOVERNANCE.md) | substantive | Trust, canonical edit policy, promotion |
| [CONTEXT_WINDOW_OPTIMIZATION.md](./CONTEXT_WINDOW_OPTIMIZATION.md) | substantive | Task-class read sets · layer order · anti-patterns · stop/split rules |
| [AGENTS_OPERATING_CONSTITUTION.md](./AGENTS_OPERATING_CONSTITUTION.md) | substantive | Three-agent model · ticket/closure ritual · deferred · stop conditions |
| [CLAUDE_CODE_OPERATING_RULES.md](./CLAUDE_CODE_OPERATING_RULES.md) | substantive | IDE harness · shell tiers · CLAUDE.md entrypoint · targeted read |
| [AI_ASSISTED_VERIFICATION.md](./AI_ASSISTED_VERIFICATION.md) | substantive | Change-class verification · report-back · silent-failure rules |
| [GENERATED_INVENTORY_POLICY.md](./GENERATED_INVENTORY_POLICY.md) | substantive | Generated inventories · freshness · timestamp-only drift |
| [CODEBASE_NAVIGATION_MAP.md](./CODEBASE_NAVIGATION_MAP.md) | substantive | SSOT layers · decision tree · instance map pattern |
| [OVERNIGHT_MAINTENANCE_MODEL.md](./OVERNIGHT_MAINTENANCE_MODEL.md) | substantive | Safe maintenance loops · run modes · report contract · morning review |

**Cross-chapter links** (`../` to other Synaxion chapters) resolve only when the full `synaxion-core` checkout is present; sparse consumer checkouts may omit non–Ch.20 paths.

---

## Tier & promotion

- **Tier 3 (introduction)** — principles bind by governance policy; automated `check:*` for Ch.20 is future work.
- **Proposer instance**: Inflomatrix (AICS program).
- **Promotion**: [META_CONSTITUTION.md §0.3](../META_CONSTITUTION.md) — external instance adoption + verification reuse.

---

## Related chapters

| Chapter | Relationship |
|---------|--------------|
| **Ch.01** Foundations | Structure First · layer boundaries — agent edits must respect |
| **Ch.06** Automation | Verification scripts · check tiers |
| **Ch.11** Protocols | Forward/reverse planning — agent task decomposition |
| **Ch.12** Judgment | Decision output types — when agents produce judgments |
| **Ch.19** Product UI | Product maps — separate from codebase operability |

**최종 업데이트**: 2026-08-27 — SYNAXION-AICS-3 (doc-index sync: AICS_PRINCIPLES now six principles); previous: 2026-06-29 SYNAXION-AICS-2E (Ch.20 substantive · hygiene pass)
