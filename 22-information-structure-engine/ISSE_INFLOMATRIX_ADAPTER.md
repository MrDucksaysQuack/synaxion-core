# ISSE Inflomatrix Adapter Contract

> **Tier 3 · Adapter contract draft · No runtime implementation**

---

## Purpose

This document defines what **Inflomatrix** would need to expose for **ISSE** (Information Structure Simulation Engine, ch.22) to compute over Inflomatrix information structures.

It extends the generic host contract in [ISSE_INTERFACE.md](./ISSE_INTERFACE.md) with Inflomatrix-specific **source hints** and **deferred status**. It does not implement adapters, packages, or `src/` integration.

---

## Consumption boundary

ISSE may only consume **read-side snapshots** from Inflomatrix until a future runtime adapter stream is explicitly scoped.

| Allowed now | Deferred |
|-------------|----------|
| Documented adapter points and source mappings | Live `StructureReader` / `EventEmitter` / `StateWriter` wiring |
| Read-side projection and audit evidence as design inputs | Automatic state writes from ISSE output |
| Evaluation trace **design** for future persistence | `EvaluationTraceStore` runtime persistence |

No consumer repo or Synaxion submodule change in this stream implements these interfaces.

---

## Adapter points

### 1. `StructureReader`

| Field | Value |
|-------|--------|
| **Purpose** | Export a serializable information-structure snapshot (ID, state values, relations, transition rules) for ISSE input |
| **Possible Inflomatrix source** | `FlowAssigneeBoardProjectionService` read models; `FlowExecution` / `TaskExecution` aggregate queries; `SiteSubmission` linkage via flow binding |
| **Status** | **deferred** |

### 2. `EventEmitter`

| Field | Value |
|-------|--------|
| **Purpose** | Emit bounded evolution events (intake, binding, transition request, completion, rejection) with structure ID and pre-state reference |
| **Possible Inflomatrix source** | Order/intake API handlers; flow assignment write path; task completion/rejection application events |
| **Status** | **deferred** |

### 3. `StateWriter`

| Field | Value |
|-------|--------|
| **Purpose** | Apply or reject ISSE next-state proposals per local transition contracts; persist transition record alongside state |
| **Possible Inflomatrix source** | `TaskExecution` status transitions; `FlowExecution` progression; evidence attachment on completion |
| **Status** | **deferred** |

### 4. `EvaluationTraceStore`

| Field | Value |
|-------|--------|
| **Purpose** | Persist ISSE evaluation traces (fitness, cost, risk, information capacity, adaptability, reproduction potential) for audit and selection replay |
| **Possible Inflomatrix source** | Observability event stream; judgment output records (ch.12); future dedicated trace table or append-only log |
| **Status** | **deferred** |

---

## Proof-pattern alignment (CP-PILOT-1)

The CP-PILOT-1 loop provides the first field-instance trace for adapter design:

```text
SiteSubmission → FlowExecution → TaskExecution → Evidence → publicStatus
```

Adapter scoping should treat this loop as the **minimal horizontal slice** — not the full Inflomatrix domain surface.

---

## Deferred stream

`ISSE-INFLOMATRIX-RUNTIME-ADAPTER-0`

Scopes runtime integration, layer placement (`src/` boundaries), verification lanes, and explicit opt-in for `StateWriter` side effects when the ISSE spec stabilizes.

---

## Non-goals

- No `src/` integration in this document
- No ISSE package or engine code
- No UI surfaces for simulation control
- No decision automation — ISSE output remains proposal until host transition contracts approve
- No database writes from this documentation stream

---

## Related documents

| Document | Role |
|----------|------|
| [ISSE_SPEC.md](./ISSE_SPEC.md) | Engine inputs, outputs, simulation loop |
| [ISSE_INTERFACE.md](./ISSE_INTERFACE.md) | Generic host adapter contract |
| [ISET_INFLOMATRIX_INSTANCE.md](../21-information-structure-theory/ISET_INFLOMATRIX_INSTANCE.md) | Field-instance vocabulary mapping |

---

**최종 업데이트**: 2026-07-03 — initial (SYNAXION-ISET-ISSE-INSTANCE-DOCS-0)
