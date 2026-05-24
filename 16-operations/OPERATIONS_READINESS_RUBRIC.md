# Operations Readiness Rubric

**목적**: 프로젝트의 운영 완성도를 5점 척도로 자가 평가한다.

---

## 채점표

| 점수 | 기준 |
|------|------|
| 0 | 장애가 나도 알 수 없음. 로그 없음 |
| 1 | console.log 또는 수동 확인이 전부. 알림 없음 |
| 2 | Sentry 또는 로그 도구는 연결됐으나 기준(임계값, SLO)이 없음 |
| 3 | OPS-01~04 만족. 주요 에러와 critical event에 로그와 알림 기준이 있음 |
| 4 | OPS-01~09 전부 만족. SLO, alert threshold, runbook, incident severity 완비 |
| 5 | Error budget, automated escalation, postmortem loop까지 운영 인텔리전스 완성 |

**Synaxion 최소 요구 기준**: 4점 (운영은 "배포 후의 품질 계약")
**3점 이하이면 production 완성 불가**

---

## 4점 달성 체크리스트

- [ ] OPS-01: error tracking production 연결
- [ ] OPS-02: API 에러 구조화 로깅
- [ ] OPS-03: request traceability (trace ID / request ID)
- [ ] OPS-04: critical flow event logging
- [ ] OPS-05: 에러율 + 서비스 불능 alert threshold 정의
- [ ] OPS-06: SLO 정의 (availability, error rate, latency)
- [ ] OPS-07: incident severity level 정의
- [ ] OPS-08: runbook 존재
- [ ] OPS-09: postmortem 절차 정의

**최종 업데이트**: 2026-05-24
