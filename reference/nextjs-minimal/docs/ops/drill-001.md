# Postmortem Drill 001 — Reference Instance

> **유형**: 테이블탑 (dry run)  
> **일시**: 2026-05-24  
> **시나리오**: Production health check 5xx after deploy

---

## 목표

- [INCIDENT_RUNBOOK](../../reference-constitution/INCIDENT_RUNBOOK.md) 순서가 실행 가능한지 확인
- Sentry alert → 담당자 확인 → rollback 결정까지 **30분 이내** 시뮬레이션

---

## 타임라인 (시뮬레이션)

| 시각 | 이벤트 | 조치 |
|------|--------|------|
| T+0 | Vercel deploy 완료, `/api/health` 503 | Sentry `ops` 태그 alert (see ALERT_THRESHOLDS.md) |
| T+5 | On-call 확인 | INCIDENT Runbook §1 — 심각도 P2 |
| T+10 | Preview에서 동일 commit health OK | Production env drift 의심 |
| T+15 | `ROLLBACK_RUNBOOK` — 이전 deployment promote | Vercel instant rollback |
| T+20 | Health 200 복구 | Incident 채널 all-clear |

---

## 갭·후속

| ID | 갭 | 후속 |
|----|-----|------|
| D-01 | Reference 앱에 실 Sentry DSN 없음 | `.env.example` 문서만 — 인스턴스에서 연동 |
| D-02 | PagerDuty 미연동 | Production 인스턴스에서 OPS-03 구현 |

---

## 서명

- Facilitator: (팀)
- Result: **Pass** — runbook 경로 검증됨

**최종 업데이트**: 2026-05-24
