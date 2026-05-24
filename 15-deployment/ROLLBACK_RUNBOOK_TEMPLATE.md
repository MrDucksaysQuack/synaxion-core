# Rollback Runbook Template

**목적**: 프로젝트별 롤백 절차를 작성할 때 사용하는 템플릿.
         복사 후 `docs/<project>-constitution/ROLLBACK_RUNBOOK.md`에 작성한다.

---

## 롤백 판단 기준

아래 조건 중 하나 이상이면 롤백을 고려한다:

- [ ] 배포 후 error rate > X% (프로젝트별 임계값)
- [ ] health check 실패
- [ ] critical user flow (결제, 인증 등) 불능
- [ ] smoke test 실패

---

## 롤백 절차

### Vercel 배포 기준

1. Vercel 대시보드 → Deployments → 이전 정상 배포 선택 → "Redeploy" (Promote to Production)
2. DB migration rollback이 필요한 경우 → §DB Migration Rollback 참조
3. 롤백 완료 후 health check 확인
4. 팀 채널에 롤백 완료 공지

### DB Migration Rollback

(프로젝트별 작성 — 예: Supabase, Prisma migrate down, 등)

---

## 연락처

| 상황 | 담당자 |
|------|--------|
| 프론트엔드 배포 이슈 | |
| DB 이슈 | |
| 인프라 이슈 | |

**최종 업데이트**: 2026-05-24
