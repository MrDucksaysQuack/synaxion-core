# Postmortem Drill 001 — Express API Reference

> **시나리오**: `/health` 503 after deploy · **일시**: 2026-05-24

| T+ | 이벤트 | 조치 |
|----|--------|------|
| 0 | Deploy complete, health fail | Alert per [ALERT_THRESHOLDS.md](./ALERT_THRESHOLDS.md) |
| 10 | Rollback image | [ROLLBACK_RUNBOOK](../reference-constitution/ROLLBACK_RUNBOOK.md) |
| 15 | Health 200 | All-clear |

**Result**: Pass
