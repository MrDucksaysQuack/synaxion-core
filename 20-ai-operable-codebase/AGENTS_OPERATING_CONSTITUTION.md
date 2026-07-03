# Agents Operating Constitution

> **Synaxion Constitution 20장**  
> **Status**: Substantive  
> **Last updated**: 2026-06-29 — SYNAXION-AICS-2A  
> **Principle**: [AICS_PRINCIPLES.md §4 Agent Authority Boundaries](./AICS_PRINCIPLES.md)  
> **Tier**: 3 (introduction)

---

## Purpose

This document defines the **canonical operating model** for multi-agent AI-assisted development on Synaxion consumer codebases.

It answers:

- Which agent role performs which class of work
- What each role may and may not do to the repository
- How work is scoped, handed off, verified, and closed
- When agents must stop and escalate

The goal is **predictable, auditable handoffs** — not ad-hoc chat improvisation.

---

## Scope

| In scope | Out of scope |
|----------|--------------|
| Three-agent role model | Tool-specific IDE configuration |
| Authority boundaries per role | Product UI design (Ch.19) |
| Ticket ritual · closure ritual | API 7-stage construction (Ch.03) |
| Deferred preservation rules | Instance harness file contents |
| Stop conditions | Runtime code patterns |

**Canonical location**: `synaxion-core/20-ai-operable-codebase/AGENTS_OPERATING_CONSTITUTION.md`.

Consumer projects **implement** this constitution locally (e.g. instance playbooks under `docs/ai-context/playbooks/`). Instance artifacts **extend** Ch.20; they do not override it ([AI_GOVERNANCE.md](./AI_GOVERNANCE.md)).

---

## The three-agent model

Synaxion AICS adopts a **fixed three-role** workflow. Do not invent additional agent roles without a constitution change.

| Role | Typical tool | Primary function |
|------|--------------|------------------|
| **Investigation agent** | Claude (read-only) | Preflight · audit · classify · report |
| **Judgment / design agent** | GPT | Decide · scope · decompose · author tickets |
| **Implementation agent** | Cursor (or equivalent IDE agent) | Scoped edit · test · report-back |

### Investigation agent

**Mission**: Reduce uncertainty before code changes.

- Read targeted paths; answer explicit questions
- Classify findings (production-connected, legacy-candidate, quarantine, unknown, etc.)
- Produce evidence tables and risk ranking
- Recommend proceed / defer / need-design
- Draft minimal next implementation ticket scope

**Does not**: modify production code, routes, adapters, or canonical documents.

### Judgment / design agent

**Mission**: Turn investigation output into a **bounded decision** and an **executable ticket**.

- Validate prior agent output against completion criteria
- Choose complete / follow-up / rework / defer
- Trim scope; split oversized work
- Author implementation tickets with explicit allowed files and forbidden zones
- Emit Cursor-ready prompts using the standard ticket ritual (§4)

**Does not**: edit the repository directly; does not bypass verification gates.

### Implementation agent

**Mission**: Execute a **scoped ticket** and prove correctness.

- Edit only files listed in the ticket's allowed-files section
- Run ticket-specified tests and checks
- Report modified files, commands, results, and uncertainty
- Follow commit hygiene (§4.10)

**Does not**: expand scope, touch forbidden zones, or mark work complete without passing gates.

### Handoff chain

```text
Investigation → Judgment/Design → Implementation → Judgment/Design (review) → Closure
```

Each handoff must leave an **artifact**: investigation report, ticket, diff summary, or closure record. Chat memory is not an artifact.

**Instance example** (Inflomatrix): playbooks at `docs/ai-context/playbooks/` map Claude → investigation template, GPT → review template, Cursor → ticket template. Those playbooks are **templates**; this document is the **rule**.

---

## Authority boundaries

Authority is **deny-by-default**. Agents operate only within explicit ticket or investigation scope.

### Investigation agent — may / may not

| May | May not |
|-----|---------|
| Read any path required for the investigation brief | Modify `src/**` or production config |
| Classify and rank risk | Implement fixes “while investigating” |
| Recommend ticket scope and do-not-touch list | Change routes, adapters, or registry |
| Write decision/preflight notes under active plans | Duplicate open-items registers |
| Update pointer docs when investigation is the deliverable | Commit without human direction |

### Judgment / design agent — may / may not

| May | May not |
|-----|---------|
| Decide proceed / defer / rework | Edit repository files directly |
| Author tickets with allowed/forbidden file lists | Weaken authority boundaries in tickets |
| Trim scope and split work | Promote deferred items to active work silently |
| Select next stream from plan SSOT | Invent new agent roles or bypass stop conditions |

### Implementation agent — may / may not

| May | May not |
|-----|---------|
| Create or modify files in **allowed files** only | Edit outside allowed scope |
| Run tests and checks specified in the ticket | Run destructive git/shell without approval |
| Stage and commit scoped changes when requested | Commit secrets, `.env`, or credential files |
| Report uncertainty and blockers | Skip verification because output “looks right” |
| Restore timestamp-only generated drift before commit | Stage unrelated dirty files |

### Cross-role rules (all agents)

1. **Structure First** — respect layer boundaries (Ch.01); no reverse imports.
2. **Canonical protection** — edit `synaxion-core/` only via constitution change process ([AI_GOVERNANCE.md §2](./AI_GOVERNANCE.md)).
3. **No mirror edits** — do not patch `doc/constitution/` in consumer repos.
4. **Verification Before Trust** — completion requires gates, not model confidence ([AICS_PRINCIPLES.md §5](./AICS_PRINCIPLES.md)).
5. **Context Window Discipline** — targeted read; plan before multi-step work ([AICS_PRINCIPLES.md §2](./AICS_PRINCIPLES.md)).

---

## Standard ticket ritual

Every implementation ticket — regardless of authoring agent — must include the sections below. Missing sections are a **scope defect**; the implementation agent should stop and request a revised ticket.

### 4.1 Goal

One sentence stating what must be true when done. Measurable; no vague “improve” or “clean up.”

### 4.2 Context

- Prior completed tickets and decisions
- Relevant maps, inventories, or plan notes (links — not pasted duplicates)
- Why this work is scheduled now

### 4.3 Before making changes

Ordered read list. Minimum pattern:

1. Instance AI context entry (if present)
2. Working rules / boundaries doc
3. Current focus / next-actions pointer
4. Relevant map or inventory
5. **Exact files to inspect** — no broad `src/**` sweeps

### 4.4 Allowed files

Explicit path list the implementation agent may create or modify.  
If the ticket is doc-only, state `no src/** changes` explicitly.

### 4.5 Do-not-touch list

Forbidden zones for this ticket. Standard defaults (always include unless ticket explicitly overrides):

- Files outside allowed list
- Auth, permission, RLS, billing, tenant boundary, approval logic
- Route renames and cross-plane route architecture (unless ticket scope allows)
- `package.json` / scripts (unless ticket allows)
- Synaxion submodule and constitution mirror
- Destructive cleanup and deletion of “candidate” pages/components

### 4.6 Implementation steps

Numbered, minimal steps. Prefer **tests over source changes** when proving existing behavior.

### 4.7 Testing

Narrow commands only. Do not run full suite unless ticket requires it.

```bash
# Example pattern — replace per ticket
pnpm exec jest path/to/scoped.test.ts
pnpm run check:layer-boundaries
```

### 4.8 Completion criteria

Checklist of measurable outcomes. Include:

- [ ] Goal criteria met
- [ ] Allowed-files scope respected
- [ ] Specified gates exit 0
- [ ] Uncertainty notes recorded (or “none”)

### 4.9 Report-back format

Implementation agent returns to judgment agent or human:

1. **Modified file list**
2. **Behavior summary** — what changed vs what was already true
3. **Test commands + results** (exit codes)
4. **`git diff --stat`** summary
5. **Uncertainty notes**
6. **Recommended next** — complete / follow-up / rework / defer (one line each)

### 4.10 Commit hygiene

- Stage **only** ticket-scoped files
- Never stage: unrelated submodule dirt, package store, worktrees, secrets
- Commit message: imperative; reflects **why**
- If generators were run incidentally, **restore timestamp-only drift** before commit (see §5.4)
- Do not amend or force-push unless human explicitly requests and safety rules allow

---

## Closure ritual

A stream, phase, or ticket is **closed** only after the ritual below — not when an agent declares “done.”

### 5.1 Verify gates

Run ticket-specified checks. Record commands and exit codes in the closure note or status doc.

| Work class | Typical gates |
|------------|---------------|
| Code change | Task-scoped `check:*`, unit/integration tests |
| Doc-only | Manual criteria checklist |
| Plan seal | Parent plan completion criteria |

“Looks correct” is not verification ([AICS_PRINCIPLES.md §5](./AICS_PRINCIPLES.md)).

### 5.2 Update status docs

Update execution SSOT for the consumer project:

- Active / canonical plan status tables
- Instance next-actions pointer (if used)
- Decision or preflight notes when the closure includes a quarantine or defer decision

Do not duplicate open-items registers — **link** to them.

### 5.3 Preserve deferred items

Every closure must **re-state** deferred work with owner, reason, and future trigger (§6).  
Closing a stream does **not** delete or silently promote deferred items.

### 5.4 Inventory regeneration need

If the ticket changed adapter paths, detail surfaces, or route mounts, regenerate instance inventories **only when the project defines them** and freshness checks exist.

If a generator was run but output is **timestamp-only drift**, restore before commit:

```bash
git restore <inventory-path>   # when diff is generated-at only
```

Stage regenerated inventories **only** when substantive content changed.

### 5.5 Closure report

Seal with:

- Changed files (docs vs code separated)
- Verification commands + results
- Deferred items preserved (bulleted)
- Default next stream or ticket (one line)

**Instance example** (Inflomatrix): post-task checklist at `docs/ai-context/playbooks/post-task-update-checklist.md` implements this ritual locally.

---

## Deferred preservation

**Deferred is not deleted. Deferred is not silently promoted.**

Deferred items are **intentionally not done** — with a recorded reason. Agents must treat them as **read-only constraints** until a new ticket explicitly activates them.

### 6.1 Required fields

Every deferred entry must retain:

| Field | Meaning |
|-------|---------|
| **Owner** | Role or stream responsible (e.g. product, Stream F, hygiene follow-up) |
| **Reason** | Why deferred now |
| **Future trigger** | What must happen before work resumes (sign-off, dependency exit, gate green) |

### 6.2 Deferred categories (keep distinct)

| Category | Meaning | Agent rule |
|----------|---------|------------|
| **Product-decision** | Behavior undefined; needs human/product sign-off | Stop; do not guess UX |
| **Architecture-decision** | Structural choice unresolved | Investigation → judgment ticket |
| **Hygiene** | Non-blocking cleanup (hook size, lint warn-only) | Do not bundle into unrelated tickets |
| **Blocked** | External dependency or gate failure | Do not workaround silently |

Do not collapse categories. Do not move deferred → active without a new ticket and explicit judgment.

### 6.3 Anti-patterns

- Removing deferred bullets during closure “for cleanliness”
- Implementing deferred scope because it is “easy”
- Treating inventory **candidates** (e.g. dead-page lists) as deletion targets
- Re-opening quarantined components without product sign-off

Consumer projects should maintain a deferral register (e.g. `KNOWN_DEFERRALS.md`, open-items register). Agents **link**; they do not fork.

---

## Stop conditions

Agents **stop immediately** and report to judgment agent or human when any condition below applies. Do not proceed with partial fixes.

| # | Condition | Typical owner |
|---|-----------|---------------|
| 1 | **Unknown ownership** — no SSOT for who owns a path, flag, or behavior | Judgment / human |
| 2 | **Auth / permission / RLS / billing / tenant boundary** change required but not in ticket scope | Human |
| 3 | **Destructive cleanup** — bulk delete, rename sweep, registry purge | Human |
| 4 | **Deletion candidates** — inventory classifies “legacy” or “dead” but no human validated deletion | Investigation only |
| 5 | **Ambiguous product behavior** — UX or business rule unclear after targeted read | Product / judgment |
| 6 | **Cross-plane route changes** — business / portal / site / relationship plane routing architecture | Architecture ticket |
| 7 | **Unscoped file drift** — dirty files outside allowed list; generator touched unrelated artifacts | Implementation agent restores or stops |

### Stop report minimum

1. Which stop condition fired
2. Evidence (paths, commands, gate output)
3. What was **not** changed
4. Recommended next role (investigation / judgment / human)

---

## Alignment with AICS principles

| Principle | How this constitution enforces it |
|-----------|-----------------------------------|
| **1. Codebase-as-Documentation** | Ticket ritual requires repo docs and plans before edits; handoff artifacts live in repo |
| **2. Context Window Discipline** | Before-making-changes lists; targeted inspect paths; no broad scans |
| **3. Single Source of Truth** | Closure updates plan SSOT; no duplicate registers; canonical wins over instance |
| **4. Agent Authority Boundaries** | Three-role model; allowed/forbidden files; deny-by-default |
| **5. Verification Before Trust** | Gates required for closure; report-back includes commands and exit codes |

---

## Instance implementation pattern

Consumer repos that adopt AICS should provide:

| Artifact | Implements |
|----------|------------|
| Instance context root | Read order, links to Ch.20 |
| Working rules | Project-specific extensions of §3 forbidden zones |
| Playbooks | Ticket / investigation / review / post-task templates |
| Plan status SSOT | Stream open · close · next default |

Inflomatrix instance paths (example only):

- `docs/ai-context/README.md` — instance entry
- `docs/ai-context/playbooks/` — role templates
- `.cursor/plans/PLANS_STATUS.md` — execution SSOT

Until instance playbooks exist, agents follow **this constitution** plus existing repo docs — with explicit verification on every change.

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [AICS_PRINCIPLES.md](./AICS_PRINCIPLES.md) | Parent principles — especially §4 and §5 |
| [AI_GOVERNANCE.md](./AI_GOVERNANCE.md) | Canonical edit policy · promotion |
| [AI_ASSISTED_VERIFICATION.md](./AI_ASSISTED_VERIFICATION.md) | Change-class verification · report-back |
| [CLAUDE_CODE_OPERATING_RULES.md](./CLAUDE_CODE_OPERATING_RULES.md) | IDE harness · shell tiers · targeted read |
| [README.md](./README.md) | Chapter 20 index |

---

**최종 업데이트**: 2026-06-29 — SYNAXION-AICS-2A substantive constitution
