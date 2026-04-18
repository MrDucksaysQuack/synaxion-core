# 실행 헌법 (Execution Constitution) — 부트스트랩 프로토콜

> **"읽는 문서"가 아니라 실행 순서를 가진 생성 프로토콜.**  
> 새 시스템을 빠르게 만들 때 이 순서를 따르면 Constitution 기반 구조가 복제된다.

**작성일**: 2026-02-15  
**목적**: 새 프로젝트 또는 새 서비스 생성 시 단계별 실행 절차를 정의하여 운영 OS로의 전환 기반 마련

---

## 개요

이 문서는 **NEW_PROJECT_PROTOCOL** 역할을 한다. 단계를 순서대로 수행하면 lib/web/workers 분리, handler factory, policy, check:all, authority, SINGLE_SOURCE_MAP, ADR이 갖춰진 프로젝트 골격이 생긴다.

---

## 부트스트랩 프로토콜 (9단계)

### 1. 레포 생성

- 저장소 생성 (Git 등)
- 루트에 `package.json`, `tsconfig.json`, `.gitignore` 기본 설정
- (선택) pnpm workspace 루트 설정

### 2. Constitution 복사

- `docs/constitution/` 전체를 새 레포로 복사
- 새 프로젝트는 자체 적용 디렉터리(예: `docs/<project>-constitution/`)에 레지스트리·단일 소스 맵·특화 문서를 둠
- `META_CONSTITUTION.md`, `EXECUTION_CONSTITUTION.md`, `SINGLE_SOURCE_MAP.md`, `adr/`, `12-judgment-constitution/`, `decision-rules.schema.json`·`decision-rules.example.json`, `judgment-output.schema.json` 유지

### 3. lib / web / workers 분리

- **packages/lib**: 도메인·코어·유틸. React·프레임워크 의존 없음
- **packages/web**: 클라이언트·미들웨어·훅. lib만 의존
- **workers**: (필요 시) 별도 런타임. lib만 의존

계층 경계(LAYER_BOUNDARIES) 및 프로젝트의 구조 헌법(프로젝트 적용 디렉터리) §1 준수.

### 4. Handler Factory 도입

- API 라우트는 **createGetHandler** / **createPostHandler** 패턴 사용
- 권한이 필요하면 **checkAuthorization: { resource, action }** 만 전달. requireProfile은 정책에서만 읽기
- `app/api/utils/`: handler-types, api-route-wrapper, get-handler, mutation-handler, handler-common 등 참조하여 동일 패턴 구축

### 5. policy.ts 작성

- **packages/lib/core/permissions/policy.ts** (또는 동일 역할 위치)에 리소스/액션별 정책 정의
- minTrustLevel, requireProfile 등. API 라우트는 이 파일만 참조하도록

### 6. check:all 통과

- **check:layer-boundaries**, **check:silent-failures**, **check:constitution**, **check:dependency-graph** 구현 또는 복사
- `pnpm run check:all` 이 통과하는 상태로 유지
- [VERIFICATION_SCRIPTS.md](06-automation/VERIFICATION_SCRIPTS.md) 참고

### 7. Authority·그룹 생성 (E2E 사용 시)

- `tests/e2e/authority-specs.json` 생성: critical / flow / integration / legacy 배열
- E2E 스펙을 authority별로 분류
- `scripts/run-e2e-by-authority.js` (또는 동일 역할 스크립트)로 authority별 실행 가능하게

### 8. SINGLE_SOURCE_MAP 작성

- [SINGLE_SOURCE_MAP.md](SINGLE_SOURCE_MAP.md) 표 구조 유지
- "결정(축) | 단일 소스 | 검증 스크립트 | 영향 레이어" 형태로 프로젝트의 단일 소스 목록 채우기
- 인증·권한·리다이렉트 등 공통 항목은 Constitution 쪽 맵을 복사 후 프로젝트에 맞게 수정

### 9. 첫 ADR 작성

- `docs/constitution/adr/0001-...md` 로 프로젝트의 **핵심 구조 결정**(예: 3계층 채택, handler factory 채택)을 기록
- [adr/template.md](adr/template.md) 사용
- 이후 구조적 결정이 있을 때마다 ADR 추가

---

## 체크리스트 (생성 완료 기준)

- [ ] 레포·기본 설정 존재
- [ ] docs/constitution/ 복사됨 (META, EXECUTION, SINGLE_SOURCE_MAP, adr 포함)
- [ ] packages/lib, packages/web (및 필요 시 workers) 분리됨
- [ ] API는 createGetHandler/createPostHandler + checkAuthorization 패턴 사용
- [ ] policy.ts에 리소스/액션 정의
- [ ] pnpm run check:all 통과
- [ ] (E2E 시) authority-specs.json 및 authority별 실행 가능
- [ ] SINGLE_SOURCE_MAP 표가 프로젝트 단일 소스를 반영
- [ ] ADR 1편 이상 존재

---

## 요약

| 단계 | 내용 |
|------|------|
| 1 | 레포 생성 |
| 2 | Constitution 복사 |
| 3 | lib / web / workers 분리 |
| 4 | Handler Factory 도입 |
| 5 | policy.ts 작성 |
| 6 | check:all 통과 |
| 7 | Authority·그룹 생성 |
| 8 | SINGLE_SOURCE_MAP 작성 |
| 9 | 첫 ADR 작성 |

**이 프로토콜을 따르면 Constitution은 "실행 순서를 가진 생성 OS"가 된다.**

**관련**: [META_CONSTITUTION.md](META_CONSTITUTION.md), [SINGLE_SOURCE_MAP.md](SINGLE_SOURCE_MAP.md), [adr/README.md](adr/README.md)

**최종 업데이트**: 2026-03-20
