# Incident Runbook Template

**목적**: 프로젝트별 인시던트 대응 절차 템플릿.
         복사 후 `docs/<project>-constitution/INCIDENT_RUNBOOK.md`에 작성한다.

---

## Severity 정의

| Level | 기준 | 대응 시간 목표 |
|-------|------|--------------|
| S1 | 서비스 완전 불능 / 데이터 손실 | 즉시 (15분 내) |
| S2 | 주요 기능 불가 / 에러율 급증 | 30분 내 |
| S3 | 일부 기능 저하 / 성능 저하 | 2시간 내 |

---

## S1 대응 절차

1. [ ] 상황 인지 및 S1 선언
2. [ ] 팀 채널에 공지: "S1 인시던트 발생 — [증상] — [담당자]"
3. [ ] 원인 파악: error log → Sentry → 최근 배포 확인
4. [ ] 롤백 결정: ROLLBACK_RUNBOOK.md 참조
5. [ ] 서비스 복구 확인: health check + smoke test
6. [ ] 팀 채널에 복구 공지
7. [ ] Postmortem 예약 (48시간 내)

---

## 공통 진단 명령

(프로젝트별 작성 — 예: Vercel 로그 보기, Sentry alert 확인, DB 연결 테스트 등)

**최종 업데이트**: 2026-05-24
