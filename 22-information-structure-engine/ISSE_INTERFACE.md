# ISSE Host Adapter Interface

> **Tier 3 · Interface draft · ISSE-1**

---

## Purpose

Define the **host adapter contract** by which a product system connects to ISSE without embedding engine logic in application code prematurely.

ISSE remains Synaxion-canonical (ch.22). The host implements three interface points; ISSE reads, computes, and returns next-state proposals.

---

## Host adapter contract

### 1. `StructureReader`

Reads the current **information structure snapshot** from the host.

| Responsibility | Notes |
|----------------|-------|
| Export structure ID, state values, relations | Must be serializable |
| Read-only | No side effects during snapshot |
| Version stamp | Snapshot time / schema version for audit |

### 2. `EventEmitter`

Emits **evolution events** to ISSE.

| Responsibility | Notes |
|----------------|-------|
| Bounded events | intake, binding, transition request, completion, rejection |
| Event payload | References structure ID + pre-state hash |
| Idempotency | Duplicate events must be detectable |

### 3. `StateWriter`

Receives ISSE **next-state** proposals and persists them in the host.

| Responsibility | Notes |
|----------------|-------|
| Apply or reject | Host may reject illegal transitions per local transition contracts |
| Transition record | Persist audit trail alongside state write |
| Fail-loud | No silent discard of ISSE output |

---

## Boundary (Patch 1)

| In scope | Out of scope |
|----------|--------------|
| Interface contract definition | Inflomatrix runtime adapter implementation |
| Deferred stream naming | `src/` changes in consumer repos |
| Adapter doc in Inflomatrix constitution | ISSE package / engine code |

**Inflomatrix runtime adapter is out of scope for Patch 1.**

Consumer instance boundary: `docs/inflomatrix-constitution/ISET_ISSE_INFLOMATRIX_ADAPTER.md`

---

## Deferred stream

`ISSE-INFLOMATRIX-RUNTIME-ADAPTER-0` — scopes runtime integration, layer placement, and verification when ISSE spec stabilizes.

---

**최종 업데이트**: 2026-07-03 — initial (ISSE-1)
