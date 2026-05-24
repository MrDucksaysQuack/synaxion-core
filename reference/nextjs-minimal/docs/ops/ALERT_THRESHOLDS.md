# Alert Thresholds — Reference Instance

> **SSOT**: 운영 알림 임계값. 인스턴스는 `docs/<project>-constitution/SLO.md`와 함께 유지한다.

---

## Sentry

| Alert | 조건 | 채널 | 비고 |
|-------|------|------|------|
| New issue (production) | 첫 발생, `environment:production` | Email / Slack `#ops` | Critical flow 태그 우선 |
| Error rate spike | 5분 창 error rate > **1%** of transactions | Slack `#ops` | [SLO](../reference-constitution/SLO.md) error rate |
| P95 latency | `transaction.duration` p95 > **3s** (5분) | Warning only | Join·Contact 라우트 필터 권장 |

**Verify**: `GET /api/ops/sentry-test` (인스턴스 구현 시) — [OPS-01](../../../16-operations/OPERATIONS_CONSTITUTION.md)

---

## Vercel

| Alert | 조건 | 채널 |
|-------|------|------|
| Deployment failed | Production deploy job failed | Email on-call |
| Production down | External monitor `/api/health` non-200 × 3 (1분 간격) | Pager (인스턴스) |

---

## Health smoke (post-deploy)

| Check | 기대 | 실패 시 |
|-------|------|---------|
| `GET /api/health` | 200, body `ok` | 배포 중단·롤백 ([ROLLBACK_RUNBOOK](../reference-constitution/ROLLBACK_RUNBOOK.md)) |

---

## 연계

- [drill-001.md](./drill-001.md) — postmortem drill 기록
- [SLO.md](../reference-constitution/SLO.md) — availability 99.5%

**최종 업데이트**: 2026-05-24
