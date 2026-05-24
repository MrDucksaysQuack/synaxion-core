# Rollback Runbook (Reference — Express API)

## Rollback trigger

- `GET /health` non-200 after deploy
- Error rate above SLO

## Procedure

1. Redeploy previous container/image or platform revision
2. Verify `GET /health` returns 200
3. Post in team ops channel
