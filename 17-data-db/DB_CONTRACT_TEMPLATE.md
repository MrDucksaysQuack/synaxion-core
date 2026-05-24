# DB Contract Template

**목적**: 프로젝트별 DB 계약을 작성할 때 사용하는 템플릿.
         복사 후 `docs/<project>-constitution/DB_CONTRACT.md`에 작성한다.

---

## 핵심 테이블 목록

| 테이블 이름 | 목적 | PII 포함 | 비고 |
|-----------|------|---------|------|
| | | Yes/No | |

---

## Schema 변경 절차

1. migration 파일 생성 (`pnpm run db:migration:create`)
2. down migration 작성 (가능한 경우)
3. PR에 schema 변경 사유 기록
4. staging에서 migration 실행 후 확인
5. production migration은 app 배포 전에 실행

---

## Query 패턴 규칙

(프로젝트별 정의 — 예: Supabase RLS 정책, 허용 조인 범위, N+1 방지 패턴 등)

---

## 접근 계층

| 계층 | DB 접근 허용 여부 |
|------|-----------------|
| Server Components | ✅ |
| Server Actions | ✅ |
| API Routes | ✅ |
| Client Components | ❌ |
| packages/lib/domain | ✅ (서버 환경만) |

**최종 업데이트**: 2026-05-24
