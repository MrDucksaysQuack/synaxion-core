# ISET Inflomatrix Field Instance

> **Tier 3 · Field instance draft · No runtime binding**

---

## Purpose

**Inflomatrix** is the first **field instance** of ISET (Information Structure Evolution Theory, ch.21).

This document records how Inflomatrix operational flows instantiate ISET vocabulary in a real host system. It is field-instance evidence — not a runtime adapter, schema contract, or implementation guide.

---

## Why Inflomatrix qualifies as a field instance

| ISET expectation | Inflomatrix expression |
|------------------|----------------------|
| External actions become internal operational structures | Guest and partner intake (`SiteSubmission`, PAL-linked requests) seed internal flow and task structures |
| Organizational work is represented as state transitions | `FlowExecution` and `TaskExecution` carry explicit lifecycle states with lawful transitions |
| Evidence is preserved as feedback | Completion, rejection, and document outputs attach as auditable feedback on transitions |
| Externally visible state is projected without exposing internals | `publicStatus` surfaces guest-safe state without leaking operator-only structure |

Inflomatrix does not claim civilization-scale fulfillment. It demonstrates a **minimal peaceful loop** where ISET principles are observable in production-shaped flows.

---

## CP-PILOT-1 — first proof pattern

**CP-PILOT-1** is the first documented proof pattern for this field instance:

```text
SiteSubmission → FlowExecution → TaskExecution → Evidence → publicStatus
```

| Step | ISET role |
|------|-----------|
| Guest submits order or intake | Structure **seed input** enters the host |
| Flow binds and progresses | **Information structure instance** evolves along a transition path |
| Operator completes or rejects task | **Transition unit** executes with evidence |
| Evidence and status update | **Feedback** is recorded; **externally visible state** is projected |

This loop is staging-verified for assignment context and board projection hygiene. It does not imply automatic diagnosis or autonomous action.

---

## Vocabulary mapping

| Inflomatrix construct | ISET role |
|-----------------------|-----------|
| **SiteSubmission** | Seed input — external action that initiates an internal structure |
| **FlowExecution** | Information structure instance — bounded path of states and bindings |
| **TaskExecution** | Transition unit — atomic lawful state change within a flow |
| **TaskAssignment** | Binding event — links actor, task, and execution surface |
| **Evidence** | Feedback proof — audit signal that a transition occurred as claimed |
| **publicStatus** | Externally visible state — guest-safe projection of structure condition |
| **PAL** (Physical Access Layer) | Physical-world contact point — QR, link, or device-mediated intake |
| **EDS** (Evidence Document System) | Official transition output — document artifact from a completed transition |
| **AICS** (ch.20) | AI collaboration structure — governed assistive surfaces over the same structures |

---

## Relationship to ISSE (ch.22)

ISET defines **what** structures are and how they evolve in theory.

ISSE defines **how** a host could expose snapshots and events for computation over those structures.

This field-instance document does **not** implement ISSE. See [ISSE_INFLOMATRIX_ADAPTER.md](../22-information-structure-engine/ISSE_INFLOMATRIX_ADAPTER.md) for the deferred adapter contract.

---

## Non-goals

- No runtime adapter in this document
- No schema changes
- No automatic diagnosis or selection automation
- No production action beyond what existing Inflomatrix flows already perform
- No replacement of Judgment Constitution (ch.12) or AICS (ch.20)

---

**최종 업데이트**: 2026-07-03 — initial (SYNAXION-ISET-ISSE-INSTANCE-DOCS-0)
