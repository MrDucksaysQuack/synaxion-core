# Rollback Runbook (Reference)

Synaxion reference instance — see `synaxion-core/15-deployment/ROLLBACK_RUNBOOK_TEMPLATE.md`.

## Rollback trigger

- Health check failure after deploy
- Error rate above threshold

## Procedure

1. Redeploy previous known-good deployment
2. Verify `GET /api/health` returns 200
3. Notify team channel
