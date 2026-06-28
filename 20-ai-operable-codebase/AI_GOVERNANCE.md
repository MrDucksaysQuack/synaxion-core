# AI Governance — Canonical Rules for AI-Assisted Development

> **Synaxion Constitution 20장**  
> Governance policy for AI-generated artifacts, document tiers, and promotion.  
> **Tier**: 3 (introduction)

---

## 1. Trust model

### 1.1 Verification is mandatory

**AI-generated changes must not be trusted without verification.**

- Every code or doc change produced or assisted by AI requires **project-defined verification** before merge or release.
- Verification means automated gates (`check:*`, tests) where they exist, plus plan completion criteria for doc-only work.
- Reviewers treat AI output as **untrusted input** — same bar as junior contributor PRs.

### 1.2 No silent success

If verification fails or is skipped, the change is **not complete**. Agents must not mark tasks done or hide failures (Ch.04 silent-failure rules apply).

---

## 2. Canonical document protection

### 2.1 AI must not arbitrarily modify canonical documents

| Class | Path pattern | AI edit policy |
|-------|--------------|----------------|
| **Synaxion canonical** | `synaxion-core/**` | Follow [META_CONSTITUTION.md §2](../META_CONSTITUTION.md) — proposal, tier, version, ADR when required |
| **Constitution mirror** | `doc/constitution/**` | **Do not edit** in consumer repos; sync from submodule |
| **Meta constitution** | `META_CONSTITUTION.md`, `VERSION` | Human-reviewed PR; version bump per release policy |
| **Instance ops** | `docs/<project>-constitution/**` | Allowed with verification; must not contradict Ch.20 |

**Arbitrary modification** includes: drive-by reformatting, rewriting unrelated chapters, bulk moves, and “helpful” duplication of canonical text into instance trees.

---

## 3. Instance vs canonical alignment

### 3.1 No contradiction with Synaxion principles

**Project instance documents must not contradict canonical Synaxion principles.**

When conflict is detected:

1. **Stop** the agent task.
2. **Fix instance doc** or escalate for canonical clarification.
3. Record in plan or ADR if the conflict reveals a Ch.20 gap.

### 3.2 Instance layer role

Instance AI context (e.g. `docs/ai-context/`) holds **project-specific** maps, lanes, and examples. It **indexes** Ch.20; it does not override it.

---

## 4. Document tiering for new AI-context docs

### 4.1 Start lower tier

**New AI-context documents start as lower-tier / project-level documents.**

| Tier | Location (typical) | Agent weight |
|------|-------------------|--------------|
| **Experimental** | Draft plan, chat artifact | Do not treat as SSOT |
| **Project-level** | `docs/ai-context/**`, `.cursor/plans/active/**` | Binding for this repo |
| **Canonical** | `synaxion-core/**` | Binding for all consumers |

New docs default to **project-level** until promoted.

---

## 5. Promotion to canonical

**Promotion requires repeated use, verification, and no conflict with canonical rules.**

Promotion checklist (all required):

| # | Criterion | Evidence |
|---|-----------|----------|
| 1 | **Repeated use** | Used successfully across multiple tasks or sprints in the proposer instance |
| 2 | **External or second-instance trial** | Per [META_CONSTITUTION.md §0.3](../META_CONSTITUTION.md) — at least one adoption attempt outside draft |
| 3 | **Verification** | Associated checks documented; no silent-failure paths introduced |
| 4 | **No canonical conflict** | Review against Ch.01–19 and Ch.20 principles |
| 5 | **ADR or PR rationale** | Promotion PR states what moved and what instance path is deprecated |

Demotion: if an instance doc contradicts updated canonical rules, **demote or archive** — do not leave dual SSOT.

---

## 6. Agent behavior summary

| Do | Don't |
|----|-------|
| Verify every change | Trust model output |
| Edit canonical via constitution process | Patch `doc/constitution/` mirror |
| Start new AI docs at project level | Create root-level agent markdown |
| Ask when SSOT is ambiguous | Guess paths or duplicate Ch.20 |
| Promote only with evidence | Copy instance prose into `synaxion-core/` without review |

---

## Related

- [AICS_PRINCIPLES.md](./AICS_PRINCIPLES.md)
- [META_CONSTITUTION.md §0.3 Pattern Promotion Model](../META_CONSTITUTION.md)
- [EVOLUTION_STRATEGY.md](../EVOLUTION_STRATEGY.md)

**최종 업데이트**: 2026-06-28 — initial governance (AICS-2)
