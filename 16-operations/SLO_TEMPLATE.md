# SLO Template

**목적**: 프로젝트별 SLO를 작성할 때 사용하는 템플릿.
         복사 후 `docs/<project>-constitution/SLO.md`에 작성한다.

---

## SLO 정의

### Availability SLO
- 목표: Production web availability ≥ [X]%
- 측정 주기: 30일 rolling window
- 알림 트리거: [X]분 이상 health check 실패

### Error Rate SLO
- 목표: 5xx error rate < [X]% (10분 윈도우)
- 알림 트리거: 5분간 5xx rate > [Y]%

### Latency SLO
- 목표: core endpoint p95 응답시간 < [X]ms
- core endpoint 목록: [직접 작성]

### Critical Flow SLO
- 대상: [결제 / 인증 / 데이터 기여 등]
- 목표: failure가 [X]분 내에 감지되고 로그에 기록됨

---

## SLO 미달 시 대응

| SLO | 미달 시 행동 |
|-----|------------|
| Availability | S1 인시던트 선언 → 롤백 검토 |
| Error Rate | S2 인시던트 선언 → 원인 파악 |
| Latency | S3 인시던트 선언 → 성능 분석 |

**최종 업데이트**: 2026-05-24
