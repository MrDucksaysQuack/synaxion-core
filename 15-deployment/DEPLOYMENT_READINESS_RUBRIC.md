# Deployment Readiness Rubric

**목적**: 프로젝트의 배포 완성도를 5점 척도로 자가 평가한다.

---

## 채점표

| 점수 | 기준 |
|------|------|
| 0 | 수동 배포. 체크리스트만 존재 |
| 1 | build 명령은 있으나 PR/CI와 연결되지 않음. 직접 서버 업로드 |
| 2 | CI에서 lint/build/typecheck 일부 실행되나 test 없음 |
| 3 | test, env validation, preview/staging deploy가 CI에 연결됨 |
| 4 | DEPLOY-01~08 모두 만족. smoke test, rollback 절차 존재 |
| 5 | Progressive rollout, rollback automation, deployment observability까지 완성 |

**Synaxion 최소 요구 기준**: 4점 (배포는 사용자 피해와 직접 연결)
**3점 이하이면 "완성" 선언 불가**

---

## 4점 달성 체크리스트

- [ ] DEPLOY-01: 모든 PR에 CI 실행 (lint + typecheck + build + test)
- [ ] DEPLOY-02: 환경 변수 누락 시 배포 전 감지
- [ ] DEPLOY-03: build 실패 시 deploy job 실행 안 됨
- [ ] DEPLOY-04: staging / preview 환경 분리
- [ ] DEPLOY-05: migration이 app보다 먼저 실행
- [ ] DEPLOY-06: 배포 후 health check 실행
- [ ] DEPLOY-07: ROLLBACK_RUNBOOK.md 존재
- [ ] DEPLOY-08: smoke test 실패 시 배포 중단

**최종 업데이트**: 2026-05-24
