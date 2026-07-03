# 22장 — Information Structure Simulation Engine (ISSE)

> **Synaxion Constitution 22장**  
> **Tier**: 3 (introduction) · **Status**: spec-only · **No runtime implementation**

---

## Definition

**ISSE** (Information Structure Simulation Engine) is the **computable simulation engine** derived from ISET (ch.21).

ISSE computes information structure state transitions under environmental feedback — producing next-state structures, transition records, evaluation traces, and reproduction/retention candidates.

---

## Relationship

| Layer | Role |
|-------|------|
| **ISET (ch.21)** | Theory — what structures are and how they evolve |
| **ISSE (ch.22)** | Engine spec — how to compute evolution over structure snapshots |
| **Host adapter** | Contract by which a product (e.g. Inflomatrix) exposes snapshots, events, and state writers |

ISET defines the theory; ISSE specifies the engine and host adapter contract.

---

## Documents

| Document | Purpose |
|----------|---------|
| [ISSE_SPEC.md](./ISSE_SPEC.md) | Engine identity, inputs/outputs, core model, simulation loop, roadmap |
| [ISSE_INTERFACE.md](./ISSE_INTERFACE.md) | Host adapter contract — StructureReader, EventEmitter, StateWriter |

---

## Inflomatrix adapter boundary

The Inflomatrix instance adapter is defined **outside** this submodule:

`docs/inflomatrix-constitution/ISET_ISSE_INFLOMATRIX_ADAPTER.md` (consumer repo)

**No `src/` integration** in this chapter. Runtime connection is deferred to stream `ISSE-INFLOMATRIX-RUNTIME-ADAPTER-0`.

---

## Tier 3 declaration

| Field | Value |
|-------|--------|
| **Proposing instance** | Inflomatrix |
| **Tier 3 registered** | 2026-07-03 |
| **Runtime status** | Spec-only — no package skeleton, no engine code |

---

**최종 업데이트**: 2026-07-03 — initial (ch.22 introduction · SYNAXION-ISET-ISSE-DOCS-INTRO-0)
