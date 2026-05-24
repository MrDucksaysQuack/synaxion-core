# Operations Constitution

**Tier**: 1 (필수)
**목적**: Production 배포 후 시스템이 관측 가능하고, 장애에 대응할 수 있는 상태를 강제한다.
         운영은 "배포 후의 품질 계약"이다.

---

## §0 철학

배포가 끝이 아니다. 배포 후 시스템이 "정상인지 알 수 있어야" 운영이다.
관측 불가능한 시스템은 장애가 나도 모른다 — 이것이 가장 위험한 상태다.

연계: [09-observability/LOGGING_OBSERVABILITY_PRINCIPLES.md](../09-observability/LOGGING_OBSERVABILITY_PRINCIPLES.md)

---

## §1 9개 필수 운영 규칙

### OPS-01 — Error Tracking Connected
Production 환경에 error tracking 도구가 연결되어 있어야 한다.
- 최소 기준: Sentry 또는 동등 도구 → 런타임 에러를 자동 수집
- 검증: `check:ops-sentry` (Sentry DSN 환경 변수 존재 여부)
- 위반: 에러가 나도 알림 없음, 사용자 신고로만 인지

### OPS-02 — Structured Logging
API 에러와 critical event는 구조화된 로그(JSON 형태 또는 동등한 structured format)로 기록해야 한다.
- 검증: `check:logging-compliance` (기존 스크립트 연계)
- 연계: LOGGING_OBSERVABILITY_PRINCIPLES.md §1, SILENT_FAILURE_PREVENTION.md

### OPS-03 — Request Traceability
Production에서 특정 사용자 액션이 어떤 API 호출로 이어졌는지 추적 가능해야 한다.
- 최소 기준: request ID 또는 trace ID가 로그에 포함
- 검증: PR 리뷰 또는 `check:ops-trace-id`
- 위반: 에러 로그에서 "어떤 요청에서 발생했는지" 파악 불가

### OPS-04 — Critical Flow Event Logging
결제, 인증, 데이터 기여처럼 비즈니스 critical한 user flow에는 이벤트 로그가 있어야 한다.
- 최소 기준: 성공/실패 여부 + user ID + 타임스탬프
- 검증: PR 리뷰 체크리스트
- 연계: LOGGING_OBSERVABILITY_PRINCIPLES.md §6 이벤트 택소노미

### OPS-05 — Alert Threshold Defined
최소한 아래 두 가지에 대한 알림 기준이 정의되어 있어야 한다:
  1. 에러율 급증 (예: 5분간 5xx rate > 5%)
  2. 서비스 불능 (health check 실패)
- 검증: `check:ops-alerts` (alert 설정 파일 또는 runbook에 기준 존재)
- 위반: 서비스 다운을 사용자 신고로만 인지

### OPS-06 — SLO Defined
서비스의 최소 SLO(Service Level Objective)가 정의되어 있어야 한다.
- 최소 정의:
  - Availability: Production 가용률 목표 (예: ≥ 99.5%)
  - Error rate: 허용 에러율 (예: 5xx < 1%)
  - Latency: core endpoint p95 응답 시간 (예: < 800ms)
- 검증: `check:ops-slo` (SLO 정의 파일 존재 여부)
- 형식: SLO_TEMPLATE.md 참조

### OPS-07 — Incident Severity Defined
인시던트 심각도(severity level)가 정의되어 있어야 한다.
- 최소 기준: S1(서비스 완전 불능) ~ S3(일부 기능 저하) 3단계 이상
- 검증: INCIDENT_RUNBOOK.md 존재 여부
- 위반: 장애 대응 시 "얼마나 급한지"를 판단할 기준이 없음

### OPS-08 — Runbook Exists
주요 운영 시나리오에 대한 runbook이 존재해야 한다.
- 최소 포함: 서비스 재시작, 롤백, DB 연결 실패 대응
- 검증: `check:ops-runbooks` (runbook 문서 존재 여부)
- 위반: 장애 시 "무엇을 해야 하는지" 문서 없음

### OPS-09 — Postmortem Process
P1 이상 인시던트 후 postmortem을 작성하는 절차가 존재해야 한다.
- 최소 기준: 템플릿 + 작성 의무 명시
- 검증: POSTMORTEM_TEMPLATE.md 존재 여부 (soft check)
- 목적: 같은 장애 반복 방지

---

## §2 check:* 스크립트 정의

| 스크립트 | 검사 내용 | CI 차단 |
|---------|-----------|---------|
| `check:ops-sentry` | Sentry DSN 환경 변수 존재 (production env) | Yes |
| `check:ops-logging` | check:logging-compliance 연계 | Yes |
| `check:ops-alerts` | alert 설정 파일 또는 ops runbook의 threshold 섹션 존재 | No (경고) |
| `check:ops-slo` | SLO 정의 파일 존재 | No (경고) |
| `check:ops-runbooks` | INCIDENT_RUNBOOK.md 존재 | No (경고) |
| `check:ops-constitution` | OPS-01~OPS-04 hard rule 통과 | Yes |

---

## §3 관련 문서

- [09-observability/LOGGING_OBSERVABILITY_PRINCIPLES.md](../09-observability/LOGGING_OBSERVABILITY_PRINCIPLES.md)
- [04-safety-standards/SILENT_FAILURE_PREVENTION.md](../04-safety-standards/SILENT_FAILURE_PREVENTION.md)
- [16-operations/SLO_TEMPLATE.md](./SLO_TEMPLATE.md)
- [16-operations/INCIDENT_RUNBOOK_TEMPLATE.md](./INCIDENT_RUNBOOK_TEMPLATE.md)
- [16-operations/POSTMORTEM_TEMPLATE.md](./POSTMORTEM_TEMPLATE.md)
- [16-operations/OPERATIONS_READINESS_RUBRIC.md](./OPERATIONS_READINESS_RUBRIC.md)

**최종 업데이트**: 2026-05-24
