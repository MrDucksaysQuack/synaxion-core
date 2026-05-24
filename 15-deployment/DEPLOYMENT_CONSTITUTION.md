# Deployment Constitution

**Tier**: 1 (필수)
**목적**: 모든 Synaxion 프로젝트의 배포 안정성을 강제한다.
         배포는 "좋다/나쁘다"가 아니라 "안전하다/위험하다"로 판단한다.

---

## §0 철학

배포는 Constitution 검증의 연장이다.
`check:constitution-pr` 통과 없이 배포가 실행되어서는 안 된다.

```
코드 → PR → check:constitution-pr + check:all → merge → 배포 트리거
                    ↑ 이 게이트가 없으면 배포가 운에 달린다
```

연계 문서: [06-automation/DEPLOYMENT_TRIGGER.md](../06-automation/DEPLOYMENT_TRIGGER.md)

---

## §1 8개 필수 배포 규칙

### DEPLOY-01 — CI Required on Every PR
모든 PR에 CI가 실행되어야 한다.
- 최소 포함: lint, typecheck, build, test:unit
- 검증: branch protection rule 설정 (`check:deployment-constitution`)
- 위반: CI 없이 main에 직접 push 또는 merge 가능한 상태

### DEPLOY-02 — Environment Variable Contract
배포 전 필수 환경 변수가 모두 존재하는지 검증해야 한다.
- 방법: startup validation (앱 기동 시 누락 env 즉시 throw) 또는 CI env-check 스크립트
- 검증: `check:deployment-env`
- 위반: 런타임에서야 "undefined" 에러 발생

### DEPLOY-03 — Build Must Pass Before Deploy
build 실패 상태의 코드가 배포되어서는 안 된다.
- 검증: CI의 build job이 deploy job의 prerequisite로 설정
- 위반: 빌드 에러를 무시하고 이전 artifact 배포

### DEPLOY-04 — Environment Separation
dev, staging(preview), production 환경이 분리되어야 한다.
- 최소 기준: production 전에 staging/preview에서 코드가 실행되어야 함
- 검증: `check:deployment-env-separation` (환경 설정 파일 존재 여부)
- 예외: 개인 프로젝트 초기 단계는 staging 생략 가능 (문서에 명시)

### DEPLOY-05 — Migration Order Contract
DB migration이 있는 경우, migration이 app deploy보다 먼저 실행되어야 한다.
- 검증: CI pipeline의 job 순서 확인 (soft check)
- 위반: app이 새 schema 없이 배포되어 runtime 오류

### DEPLOY-06 — Post-Deploy Smoke Test
Production 배포 후 최소한의 smoke test가 실행되어야 한다.
- 최소 기준: health check endpoint (GET /api/health → 200)
- 검증: `check:deployment-smoke` (health endpoint 존재 여부)
- 위반: 배포 후 서비스 불능 상태를 모니터링으로만 발견

### DEPLOY-07 — Rollback Procedure Defined
롤백 절차가 문서화되어 있어야 한다.
- 최소 기준: "이전 버전으로 어떻게 되돌아가는가" 1페이지 이상
- 검증: `check:deployment-rollback` (ROLLBACK_RUNBOOK.md 존재 여부)
- 위반: 장애 시 "어떻게 해야 하는지 모름"

### DEPLOY-08 — Deploy Failure Stops Automatically
배포 실패(smoke test 실패, health check 실패) 시 배포가 자동으로 중단되어야 한다.
- 검증: CI/CD pipeline의 failure handling 설정
- 위반: 실패한 배포가 완료로 표시됨

---

## §2 check:* 스크립트 정의

아래 스크립트는 프로젝트별로 구현한다. 존재하지 않으면 PR 리뷰로 대체한다.

| 스크립트 | 검사 내용 | CI 차단 |
|---------|-----------|---------|
| `check:deployment-env` | 필수 env 변수 정의 파일 또는 startup validation 존재 | Yes |
| `check:deployment-env-separation` | .env.staging 또는 .env.production 파일 분리 | No (경고) |
| `check:deployment-smoke` | /api/health 엔드포인트 존재 여부 | No (경고) |
| `check:deployment-rollback` | ROLLBACK_RUNBOOK.md 또는 동등 문서 존재 | No (경고) |
| `check:deployment-constitution` | 이 문서의 §1 규칙 중 hard rule 통과 | Yes |

---

## §3 관련 문서

- [06-automation/DEPLOYMENT_TRIGGER.md](../06-automation/DEPLOYMENT_TRIGGER.md) — 검증 후 배포 트리거
- [06-automation/CI_CD_INTEGRATION.md](../06-automation/CI_CD_INTEGRATION.md) — CI/CD 파이프라인 구조
- [08-config/ENVIRONMENT_VARIABLES.md](../08-config/ENVIRONMENT_VARIABLES.md) — 환경 변수 보안
- [15-deployment/DEPLOYMENT_READINESS_RUBRIC.md](./DEPLOYMENT_READINESS_RUBRIC.md) — 완성도 자가 평가
- [15-deployment/ROLLBACK_RUNBOOK_TEMPLATE.md](./ROLLBACK_RUNBOOK_TEMPLATE.md) — 롤백 절차 템플릿

**최종 업데이트**: 2026-05-24
