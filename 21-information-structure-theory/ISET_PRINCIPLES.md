# ISET Principles

> **Tier 3 · Draft · ISET-1**

---

## Core loop

```text
InformationStructure → State → Environment → Feedback → Transition → Selection → Reproduction → Evolution
```

---

## Axioms

1. **Every analyzable entity can be represented as an information structure.**
2. **Every information structure has a state.**
3. **Every analyzable change can be represented as a state transition.**
4. **Every information structure interacts with one or more other information structures.**

---

## Definitions

| Term | Definition |
|------|------------|
| **Information Structure** | A bounded set of entities, states, relations, and transition rules that persist and produce outcomes. |
| **State** | A named condition of a structure at a point in time (values, relations, bindings). |
| **Environment** | External structures and variables that exert pressure, constraints, or feedback on a structure. |
| **Feedback** | Evaluation signal returned from environment interaction (fitness, cost, risk, capacity). |
| **State Transition** | A lawful change from one state to another, optionally requiring actors, evidence, or approval. |
| **Selection** | Preferential retention of structures or transitions that improve evaluated outcomes under current environment. |
| **Reproduction / Retention** | Persistence of a structure, its bindings, or its transition record across time and hosts. |
| **Evolution** | Cumulative change in structure complexity, fidelity, coupling, scope, or lifecycle under selection pressure. |
| **Operating System** | A host system that maintains structures, enforces transition contracts, and exposes execution surfaces. |

---

## Principles

### P1 — Information Structure

Every analyzable operational entity — order, task, flow, document, assignment, public status — should be representable as an information structure with explicit state and bindings.

### P2 — Evolution Axes

Structures evolve along measurable axes:

| Axis | Question |
|------|----------|
| **Complexity** | How many entities, relations, and rules does the structure carry? |
| **Fidelity** | How accurately does recorded state reflect real-world condition? |
| **Coupling** | How tightly is this structure bound to other structures? |
| **Scope** | What boundary of actors, tenants, and surfaces does the structure span? |
| **Lifecycle** | Where is the structure in seed → evolving → stable → deprecated? |

### P3 — Transition Contracts

A lawful transition specifies:

- **Pre-state** — conditions that must hold before transition
- **Post-state** — conditions that must hold after transition
- **Evidence** — feedback proof that the transition occurred as claimed
- **Feedback** — evaluation signal used for selection or audit

Arbitrary state jumps without record violate structural integrity.

### P4 — Recursive Constraint Principle

An information structure can become part of the **environment** that constrains the structures that created it.

Example: an operating system built to serve organizations eventually constrains how those organizations design their own workflows — the created structure feeds back as environmental pressure on its creators.

### P5 — Inflomatrix Field Instance

Inflomatrix operational flows are the **first field instance** where ISET vocabulary is applied:

- Guest **SiteSubmission** as structure seed input
- **Flow** as state transition path
- **TaskExecution** as transition unit
- **Evidence** as feedback source
- **Public status** as externally visible state

Proof streams (e.g. CP-PILOT-1) demonstrate a minimal peaceful loop without claiming civilization-scale fulfillment.

---

## Non-goals (ISET-1)

- No runtime ISSE implementation in this document
- No humanoid or autonomous execution claims
- No replacement of Judgment Constitution (ch.12) or AICS (ch.20)

---

**최종 업데이트**: 2026-07-03 — initial (ISET-1)
