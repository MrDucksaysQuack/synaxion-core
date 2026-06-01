# Constitution index (SSOT)

Single entry point for **Synaxion shared** and **Itemwiki-specific** constitution docs. Agents: read this table first; open leaf files only when the task requires it.

> **Do not** treat every file under `docs/` as constitution. Product planning lives in `docs/planning/`; one-off reports in `docs/reports/` and `.cursor/archive/docs/analysis/`.

## Shared Synaxion (`docs/constitution/`)

| Need | Path |
|------|------|
| Meta / tier-1 principles | [META_CONSTITUTION.md](./META_CONSTITUTION.md) |
| Chapter map (19 product UI + core) | [README.md](./README.md) |
| API 7-stage construction | [03-api-standards/7_STAGE_LOGIC_CONSTRUCTION.md](./03-api-standards/7_STAGE_LOGIC_CONSTRUCTION.md) |
| Verification scripts catalog | [06-automation/VERIFICATION_SCRIPTS.md](./06-automation/VERIFICATION_SCRIPTS.md) |
| Judgment (ERIC) | [12-judgment-constitution/ERIC_SPEC.md](./12-judgment-constitution/ERIC_SPEC.md) |
| Judgment output type | [12-judgment-constitution/JUDGMENT_OUTPUT_TYPE.md](./12-judgment-constitution/JUDGMENT_OUTPUT_TYPE.md) |
| Logging / observability | [09-observability/](./09-observability/) |
| Frontend UI input/render authority | [07-frontend-ui/UI_INPUT_RENDER_AUTHORITY.md](./07-frontend-ui/UI_INPUT_RENDER_AUTHORITY.md) |
| Input–persistence alignment | [07-frontend-ui/INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md](./07-frontend-ui/INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md) |
| Component patterns (15장; FOCUS-R1 Mandatory @ 2.16.0) | [15-component-patterns/README.md](./15-component-patterns/README.md) · [FOCUS_VISIBLE_RING.md](./15-component-patterns/FOCUS_VISIBLE_RING.md) |

## Itemwiki extensions (`docs/itemwiki-constitution/`)

| Need | Path |
|------|------|
| Itemwiki constitution hub | [README.md](../itemwiki-constitution/README.md) (if present) or tree root |
| Product UI architecture (Ch.19 instance) | [product-ui-architecture/](../itemwiki-constitution/product-ui-architecture/) |
| Input–persistence (FINAL_3, pipelines, field filter) | [itemwiki-specific/input-persistence/](../itemwiki-constitution/itemwiki-specific/input-persistence/) |
| UI / component patterns | [itemwiki-specific/ui-ux/](../itemwiki-constitution/itemwiki-specific/ui-ux/) |
| IDP automation matrix (checks ↔ domains) | [ITEMWIKI_IDP_AUTOMATION_MATRIX.md](../itemwiki-constitution/ITEMWIKI_IDP_AUTOMATION_MATRIX.md) |
| Page / route product rules | [product-ui-architecture/](../itemwiki-constitution/product-ui-architecture/) · [ROUTES.md](../ROUTES.md) |

## Enforcement (code ↔ docs)

| Concern | Command / artifact |
|---------|-------------------|
| Layer boundaries | `pnpm run check:layer-boundaries` |
| PR constitution gate | `pnpm run check:constitution-pr` |
| API routes | `app/api/utils/handler-factory` · `pnpm run verify:api-7-stages` |
| Local input-persistence bundle | `pnpm run local:input-persistence-contract-gates` |
| Local FINAL_3 slice | `pnpm run local:final3-constitution-slice` |

**Version:** Synaxion Constitution 2.15.0 (see `CLAUDE.md` header).
