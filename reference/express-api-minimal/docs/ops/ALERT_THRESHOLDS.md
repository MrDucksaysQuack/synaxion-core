# Alert Thresholds — Express API Reference

| Alert | 조건 | 채널 |
|-------|------|------|
| Health down | `GET /health` non-200 × 3 (1m) | Ops email |
| Sentry new issue | `environment:production` | Slack `#ops` |
| Error rate | 5m window > 1% | Warning |

See [SLO](../reference-constitution/SLO.md).
