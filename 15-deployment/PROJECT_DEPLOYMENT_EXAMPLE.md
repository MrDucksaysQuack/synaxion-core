# 프로젝트별 Deployment 적용 예시

**목적**: 새 프로젝트에서 Deployment Constitution을 인스턴스화하는 예시.

---

## 0. Reference — nextjs-minimal (synaxion-core 내장)

**경로**: [reference/nextjs-minimal/](../reference/nextjs-minimal/)  
**검증**: `cd synaxion-core && pnpm run verify:reference`

적용된 것:
- `docs/reference-constitution/` — ROLLBACK, SLO, INCIDENT, DB/ENV contract stubs
- `src/app/api/health/route.ts`, `src/lib/env.ts`, `.env.example`
- `instrumentation-client.ts` — OPS-01 문서화 패턴

---

## 1. Truefarm Website (Vercel + Next.js, 정적 사이트)

**프로필**: `nextjs-monorepo` 기반 정적/서버리스  
**배포 플랫폼**: Vercel Git 연동

적용된 것:
- `.env.example` — 필수 환경 변수 목록
- `src/app/api/health/route.ts` — health check
- `docs/truefarm-constitution/ROLLBACK_RUNBOOK.md` — Vercel 롤백 절차
- CI: `.github/workflows/ci.yml` — typecheck + lint + check:deployment

생략된 것 (이유):
- DB migration order (Truefarm은 정적 데이터 사용)
- staging 환경 (MVP 단계, Vercel preview로 대체)

---

## 2. Itemwiki (Vercel + Next.js 모노레포, Supabase DB)

**프로필**: `nextjs-monorepo`  
**배포 플랫폼**: Vercel + Supabase

적용된 것:
- `.env.example` — 모노레포 필수 환경 변수
- `/api/health` — health check
- migration order: Supabase migration → Vercel deploy
- `check:deployment-constitution` — CI 차단 게이트
- rollback: Vercel 이전 배포 + Supabase migration down

**최종 업데이트**: 2026-05-24
