# 로깅·관측 기본 원칙 (Logging & Observability)

**목적**: 로깅 패턴의 최소 기준을 정의하여 일관성과 관측 가능성을 보장합니다.  
**Tier**: 1 (필수. catch에서 로그 누락 금지 등은 SILENT_FAILURE와 연계. 검증은 스캔·리뷰로 가능)

---

## 1. 핵심 원칙

### 1.1 실행 환경에 따른 구분

- **로깅 함수는 실행 환경(API Route / 서버 일반 / 클라이언트)**에 따라 구분한다.
- **금지**: 모든 환경에서 `console.error`만 사용, API Route에서 `console.log`/`console.error`로 에러 기록.
- **필수**:  
  - API Route·서버 에러: 프로젝트가 정한 **서버용 에러 로깅 함수**만 사용.  
  - 클라이언트 에러: 프로젝트가 정한 **클라이언트용 에러 로깅** 사용.  
  - 개발 전용 디버깅: 환경 체크 후 `console.debug` 등 사용(프로덕션에서 제거되도록).

### 1.2 목적에 따른 구분

- **에러 로깅**: 구조화된 에러 정보 + 컨텍스트(라우트, 메서드, 사용자·액션 등). 외부 모니터링(Sentry 등) 연동은 프로젝트별.
- **정보성 로그**: 레벨 명시(info/warn/error), 필요한 컨텍스트 포함. 프로젝트별 저장소·형식 적용.
- **개발 디버깅**: 프로덕션에서 실행되지 않도록 환경 체크 필수.

### 1.3 catch에서 로그 누락 금지

- **모든 catch 블록**에서 에러를 "삼키지" 않는다.  
  → 사용자 피드백 또는 **시스템 로그** 중 최소 한 곳에는 반드시 전달.  
  (상세: [SILENT_FAILURE_PREVENTION](../04-safety-standards/SILENT_FAILURE_PREVENTION.md))
- API Route·서버 핸들러의 catch에서는 **반드시** 프로젝트 정한 에러 로깅 함수 호출 후, 응답 반환.

---

## 2. 에러 로깅 시 필수 요소 (범용)

- **에러 객체**(또는 메시지)
- **컨텍스트**: 발생 위치(라우트/함수), HTTP 메서드(해당 시), 사용자/액션 식별자(가능한 경우)
- **심각도/타입**(프로젝트별 분류) — 모니터링·알림 정책에 활용

구체적 파라미터명·함수 시그니처는 프로젝트 인스턴스에서 정의.

---

## 3. 금지 패턴

- catch 블록에서 아무 로깅도 하지 않음.
- API Route에서 `console.error`만 사용하고 구조화된 로깅 미사용.
- 프로덕션에서 불필요한 `console.log`/`console.info` 출력(환경 체크 없이).

---

## 4. 검증

- **스캔**: catch 블록 내 로깅/재throw 누락 탐지.
- **리뷰**: API Route·핸들러에서 에러 로깅 함수 사용 여부 확인.

**Itemwiki**: `pnpm run check:logging-compliance`는 `app/api`에서 **줄 단위 실제 호출** `console.(error|log|warn)(` 만 검사해 주석·문자열 속 문구 오탐을 줄인다. `pnpm run constitution:check`·`check:constitution-pr`에는 `check:silent-failures`(내부적으로 `--strict` 포함)·`check:lib-console`·`check:api-catch-logging`이 포함된다. PR 기본 워크플로(`.github/workflows/pr-checks.yml`)에는 `check:api-catch-logging`·`check:logging-compliance`가 포함된다.

---

## 5. 관련 문서

- [04-safety-standards/SILENT_FAILURE_PREVENTION.md](../04-safety-standards/SILENT_FAILURE_PREVENTION.md) — 에러 피드백 의무
- [08-config/ENVIRONMENT_VARIABLES.md](../08-config/ENVIRONMENT_VARIABLES.md) — 환경별 설정 접근

---

## 6. 개선 로드맵

- **Phase 1**: API 라우트에서 `console.error`/`warn`/`log` 제거 → `logUnifiedError`/`logUnifiedWarn` 사용 (health, webhook 등). ✅ 적용됨.
- **Phase 2**: API 전용 console 금지 — `.eslintrc.json`에 `local/no-console-in-api` 적용됨.
- **Phase 3**: `packages/lib` 도메인에서 `console.error`/`console.warn` → `createLogger()`/`logUnifiedError` 등 구조화 로깅으로 교체. Phase 3a·3b·외부 API·Redis·Supabase server·engines·domain/utils 일괄 적용 완료.
- **Phase 3c**: `packages/lib`용 console 금지 — `local/no-console-in-lib` **error**. 예외(명시): `core/config/env/**`, `core/logger/unified-logger.ts`, `utils/logger/unified-logger.ts`, `supabase/browser-client.ts`, `core/error-handling/unified-error-handler.ts`(최후 폴백), `core/logger/unified-logger-server.ts`(DB 저장 실패 보조).
- **Phase 4 (SILENT_FAILURE)**: `check-silent-failures.ts`를 CI에 포함해 empty catch·로깅 없는 catch 지속 탐지. ✅ `check:all`에 포함됨.
- **Phase 5 (lib console 게이트)**: `scripts/check-lib-console.ts` — 위 예외 경로를 제외한 `packages/lib/**/*.ts`에서 `console.log`/`error`/`warn`/`info` 호출 금지. ✅ `check:lib-console`, `check:all`, `check:constitution-pr`에 포함됨.
- **UnifiedLogger**: 레거시 `console.*` 다인자 호환을 위해 `warn`/`error`/`debug`/`info`가 가변 인자 및 비정형 두 번째 인자를 `metadata` 등으로 흡수할 수 있음(`utils/logger/unified-logger.ts`).

---

**최종 업데이트**: 2026-03-19
