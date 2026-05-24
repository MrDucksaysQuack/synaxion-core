# Data / DB Constitution

**Tier**: 1 (필수)
**목적**: 데이터 계층의 구조 계약과 migration 안전성을 강제한다.

---

## §0 적용 범위

이 Constitution은 다음에 적용된다:
- DB schema 정의 (Supabase, Prisma, Drizzle 등)
- migration 파일 관리
- 쿼리 패턴 및 데이터 접근 계층

---

## §1 5개 필수 데이터 규칙

### DATA-01 — Schema as Contract
DB 스키마 변경은 반드시 migration 파일로 관리한다.
- 직접 DB 수정 금지 (수동 ALTER TABLE 등)
- 모든 스키마 변경은 버전 관리 가능해야 한다
- 검증: migration 파일 존재 여부 확인

### DATA-02 — Migration Safety
Migration은 배포 전에 검증되어야 한다.
- migration이 app deploy보다 먼저 실행 (DEPLOY-05 연계)
- rollback 가능한 migration을 권장 (down migration)
- 검증: PR 리뷰

### DATA-03 — No Direct DB Access from UI
UI 컴포넌트에서 DB를 직접 참조하지 않는다.
- 허용: server actions, API routes, server components (서버 환경)
- 금지: 클라이언트 컴포넌트에서 직접 DB 클라이언트 호출
- 검증: check:layer-boundaries (연계)

### DATA-04 — Nullable Column Contract
Null이 가능한 컬럼은 코드에서 명시적으로 처리해야 한다.
- TypeScript 타입에서 `T | null` 로 표현
- null 처리 없이 직접 사용 금지
- 검증: TypeScript strict null checks (check:types 연계)

### DATA-05 — Sensitive Data Rules
PII(개인식별정보)가 포함된 데이터는 별도 처리 규칙을 따른다.
- 로그에 PII 출력 금지 (check:silent-failures 연계)
- 클라이언트 번들에 민감 데이터 포함 금지
- 검증: PR 리뷰

---

## §2 관련 문서

- [17-data-db/DB_CONTRACT_TEMPLATE.md](./DB_CONTRACT_TEMPLATE.md) — DB 계약 템플릿
- [01-foundations/STATE_TRANSITION_CONTRACT.md](../01-foundations/STATE_TRANSITION_CONTRACT.md)
- [04-safety-standards/USER_DATA_PRINCIPLES.md](../04-safety-standards/USER_DATA_PRINCIPLES.md)
- [15-deployment/DEPLOYMENT_CONSTITUTION.md](../15-deployment/DEPLOYMENT_CONSTITUTION.md) — DEPLOY-05 Migration Order

**최종 업데이트**: 2026-05-24
