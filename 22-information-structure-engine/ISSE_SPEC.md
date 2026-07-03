# ISSE Specification

> **Tier 3 · Spec-only · ISSE-1**

---

## Engine identity

ISSE computes **information structure state transitions** under **environmental feedback**.

Given a structure snapshot, environment snapshot, evolution event, and evaluation model, ISSE produces:

- next-state structure
- transition record
- evaluation trace
- reproduction / retention candidate

---

## Inputs

| Input | Description |
|-------|-------------|
| **Information structure snapshot** | Current structure state, relations, and transition rules |
| **Environment snapshot** | External variables and peer structures exerting pressure |
| **Evolution event** | Bounded stimulus (binding, completion, rejection, external intake) |
| **Evaluation model** | Function mapping state + environment to fitness, cost, risk, capacity |

---

## Outputs

| Output | Description |
|--------|-------------|
| **Next-state structure** | Lawful post-transition structure |
| **Transition record** | Auditable record of pre-state, post-state, actor, evidence |
| **Evaluation trace** | Fitness, cost, risk, information capacity, adaptability, reproduction potential |
| **Reproduction / retention candidate** | Structure or binding selected for persistence or replication |

---

## Minimal core model

```ts
type ID = string;

type Relation = {
  from: ID;
  to: ID;
  type: string;
  weight?: number;
};

type State = {
  values: Record<string, number>;
  relations: Relation[];
};

type Evaluation = {
  fitness: number;
  cost: number;
  risk: number;
  informationCapacity: number;
  adaptability: number;
  reproductionPotential: number;
};

type Environment = {
  id: ID;
  variables: Record<string, number>;
  feedback: (state: State) => Evaluation;
};

type InformationStructure = {
  id: ID;
  state: State;
  transition: (
    state: State,
    env: Environment,
    evaluation: Evaluation
  ) => State;
};
```

---

## Simulation loop

```ts
function step(system: InformationStructure, env: Environment): InformationStructure {
  const evaluation = env.feedback(system.state);

  return {
    ...system,
    state: system.transition(system.state, env, evaluation),
  };
}
```

---

## Evolution helper

```ts
function evolve(
  system: InformationStructure,
  env: Environment,
  steps: number
): { final: InformationStructure; trace: Evaluation[] } {
  const trace: Evaluation[] = [];
  let current = system;

  for (let i = 0; i < steps; i++) {
    const evaluation = env.feedback(current.state);
    trace.push(evaluation);
    current = step(current, env);
  }

  return { final: current, trace };
}
```

---

## Structure lifecycle states

| State | Meaning |
|-------|---------|
| **seed** | Initial structure created from external input |
| **evolving** | Active transitions under feedback |
| **stable** | Transitions slow; structure retained with high fidelity |
| **deprecated** | Structure retained for audit only; no new transitions |

---

## Roadmap levels

| Level | Name | Scope |
|-------|------|-------|
| 1 | Core Model | Types above — structure, environment, evaluation |
| 2 | Simulation Loop | `step()` / `evolve()` over snapshots |
| 3 | Scenario Models | Domain-specific structure templates (e.g. order processing) |
| 4 | Metrics Engine | Aggregate evaluation traces across runs |
| 5 | Visualization | Structure graph and transition timeline |
| 6 | Comparative Simulator | Side-by-side structure variants under same environment |
| 7 | Diagnostic Engine | Detect broken structures (silent failure, orphan bindings) |
| 8 | Design Engine | Propose transition contract improvements |
| 9 | Adaptive OS | Host system that evolves its own structure maintenance rules |

**ISSE-1 delivers levels 1–2 as spec-only pseudocode.** Levels 3+ are deferred streams.

---

## First scenario recommendation

**CCMP Order Processing as InformationStructure**

Map guest order intake → operator task → evidence → public status as a single evolving information structure under shared environment feedback. Deferred to stream `ISSE-V0-CCMP-ORDER-PROCESSING-SCENARIO-0`.

---

## Non-goals (ISSE-1)

- No TypeScript package in `synaxion-core/` or consumer `src/`
- No database schema or API endpoints
- No Inflomatrix runtime adapter implementation

Inflomatrix mapping: [ISSE_INTERFACE.md](./ISSE_INTERFACE.md) + consumer `ISET_ISSE_INFLOMATRIX_ADAPTER.md`.

---

**최종 업데이트**: 2026-07-03 — initial (ISSE-1)
