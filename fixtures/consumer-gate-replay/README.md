# consumer-gate-replay 픽스처 (Phase 6)

JSON 파일은 `consumer.gate.replay.fixture.v1` 스키마를 따릅니다.

- **CI (Jest)**: `runConsumerGateReplayFixture` → `applyConsumerProductGates` — `pnpm run check:consumer-gate-replay-fixtures`
- **로컬 CLI (server-only 없음)**: `pnpm run replay:consumer-gate-fixture -- docs/constitution/fixtures/consumer-gate-replay/blacklist-two-products.json` — `replay-fixture-offline.ts`
- **감사 행 CLI**: `CONSUMER_GATE_AUDIT_PRODUCT_SNAPSHOT=1` 로 남긴 `consumer_gate_audit` JSON → `pnpm run replay:consumer-gate-audit-export -- row.json` — 저장소 샘플은 [`../consumer-gate-audit-export-sample/`](../consumer-gate-audit-export-sample/) (이 폴더의 `*.json` 은 픽스처 v1이 아님)
- **GHA 스모크**: `.github/workflows/consumer-gate-replay-audit-export-smoke.yml` (주간)
- **감사 일괄 export**: `pnpm run export:consumer-gate-audit -- --limit=200 --out=./audit.jsonl` (서비스 롤) 또는 Admin **`GET /api/v1/admin/consumer-gate/audit`**

- [`CONSUMER_PIPELINE_SYNAXION_CONVERGENCE_PLAN.md`](../../../analysis/CONSUMER_PIPELINE_SYNAXION_CONVERGENCE_PLAN.md) Phase 6
