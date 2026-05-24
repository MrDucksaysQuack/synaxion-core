# Incident Runbook (Reference — Express API)

1. Acknowledge alert (Sentry / platform monitor)
2. Check `GET /health`
3. Roll back per [ROLLBACK_RUNBOOK.md](./ROLLBACK_RUNBOOK.md) if user-facing
4. Record timeline in `docs/ops/drill-*.md` or postmortem
