# 검증 스크립트 체계 (Verification Scripts)

> **Constitution 문서**  
> VERIFICATION_FRAMEWORK가 "언제·어떤 계층에서 검증하는가"를 정의한다면, 이 문서는 **실제 check:\* / measure:\* 스크립트 인벤토리**와 "구조 검증 런타임" 역할을 정의합니다.

**작성일**: 2026-02-15  
**목적**: Constitution 원칙을 자동으로 점검하는 스크립트 군을 한곳에 정리하여, 헌법 위반·침묵 실패·의존성·정책 드리프트·API 스키마 등을 한 번에 점검하는 인프라를 문서화

---

## 📋 개요

**모든 원칙은 자동으로 검증 가능**해야 한다는 철학에 따라, 규칙 위반은 스크립트로 탐지합니다. 프로젝트는 다음 검증 스크립트를 유지할 수 있습니다.

| 분류 | 역할 |
|------|------|
| `check:*` | 규칙 위반·일관성·드리프트 탐지 |
| `measure:*` | 영향 범위·품질·변경 면적 측정 |
| **check:all** | 핵심 검증만 묶어 한 번에 실행 |

---

## 1. 핵심 검증 (check:all 구성)

`pnpm run check:all` 은 다음을 순서대로 실행합니다:

| 스크립트 | 목적 |
|----------|------|
| **check:layer-boundaries** | 계층 경계 위반 (Core→Domain, Domain→API 등) 탐지 |
| **check:engine-imports** | `packages/lib/engines` — Utils·Domain·Web·**API** 직접 참조, utils/api 상대 경로, 엔진 간 교차 import 금지 (IDP §2.4·§2.5) |
| **check:domain-layer-idp** | `packages/lib/domain` → `lib/utils` 직접 import 금지 ([decision-registry](../../itemwiki-constitution/decision-registry.json) `domain-no-lib-utils-direct`) |
| **check:silent-failures** | 침묵 실패 위험 패턴 탐지 |
| **check:lib-console** | `packages/lib` 내 금지 `console.*` 호출 탐지 (09-observability) |
| **check:design-route-depth** | `app` 페이지 라우트 10-design-flow **3-Depth Rule** (라우트 그룹 제외) |
| **check:flow-docs** | Flow Coverage 페이지 `@flow`·`ROUTE_FLOW`·`CORE_USER_FLOWS.md` 의 `flow-map-ids` 주석 ↔ `flow-map.ts` id 일치 ([docs/flow/CORE_USER_FLOWS.md](../../flow/CORE_USER_FLOWS.md)) |
| **check:constitution** | Constitution 문서에서 정의한 위반 패턴 탐지 |
| **check:single-source-drift** | 단일 소스 드리프트 (리다이렉트·인증 경로 하드코딩) 탐지 |
| **check:ux-risks** | UX 위험 분류 |
| **check:stale-ui-risks** | Stale UI 위험 (Mutation 후 refetch/invalidate 등) |
| **check:env-access:strict** | 환경 변수 접근 규칙 (08-config, `--strict`) |
| **check:domain-top-index** | 최상위 `packages/lib/domain/*` 바렐 `index.ts` (`--fail` 포함 시 `check:all` 등) |
| **check:dependency-graph** | 의존성 그래프 규칙 위반 탐지 |
| **check:consumer-facing-judgment-decision-only** | `components/product/**`, `app/api/v1/products/**`, `packages/web/hooks/product/**` 에서 `personalizationScore`/`preferenceScore`/단독 `score` 숫자 비교·`scoreBreakdown`/`explanation.*` 기반 `if` 판단 금지 — [CONSUMER_DECISION_CONTRACT.md](../12-judgment-constitution/CONSUMER_DECISION_CONTRACT.md) |
| **verify:api-7-stages** | API 라우트 7단계·래퍼 준수 (`app/api/v1`, 이슈 시 exit 1). Level A **전부**가 아니라 [범위는 매트릭스 참고](../../itemwiki-constitution/ITEMWIKI_IDP_AUTOMATION_MATRIX.md) §4 |
| **check:api-catch-logging** | `app/api` 이하 TypeScript AST로 `try/catch`, `.catch()`, `.then(_, onRejected)` 본문에 허용 로깅 호출 존재 검사 (이슈 시 exit 1). `check:all`·`check:constitution-pr` 포함. `check:api-catch-logging:routes` = `--routes-only` |

**규칙**: PR 또는 로컬 품질 게이트에서 `check:all` 을 통과해야 함.

**PR 전용 (의존성 그래프 등 일부 제외)**: `pnpm run check:constitution-pr` — constitution-version → layer-boundaries → engine-imports → silent-failures → lib-console → **api-catch-logging** → design-route-depth → flow-docs → **page-design-flow-jsdoc** → **page-metadata-public-main** → conceptual-rot → ux-risks → stale-ui-risks → **env-access:strict** → **check:domain-top-index -- --fail** → e2e-count → monitor:test-pyramid → **decision-registry**(등록된 `check:*` 일괄 실행 — 여기에 **check:domain-layer-idp** 포함) → **check:decision-rules** → **check:decision-rules:itemwiki** → **check:judgment-runtime-rules** → **check:judgment-contracts** → **check:judgment-output-schema** → **check:decision-usage -- --fail-on-unused** → **check:decision-call-registry** → **verify:api-7-stages** (이슈 시 exit 1) → **check:field-filter-users-me-contract**·**check:field-filter-users-me-integration**·**check:input-persistence-p1-preferences-contract**·**check:input-persistence-high-risk-multi-contract**·**check:field-filter-tab-preferences-contract**·**check:product-barcode-patch-contract**·**check:pipeline-contract-anchors**·**check:pipeline-registry-domain-alignment-tests**·**check:multi-persistence-section2-pipeline-ids**·**check:pipeline-stages-doc**·**check:alignment-new-source-bundle**(신규·rename `*-alignment.ts` §4.0 정적 검사)·**check:alignment-module-pr-contract**·**check:domain-alignment-roundtrip-marker**·**check:domain-alignment-test-contract-signal**(단위 테스트에 파싱·와이어 검증 신호 최소 1종)·**check:alignment-package-path**·**check:persistence-touch-pr-contract**·**check:client-direct-persistence-pr-contract**·**check:client-direct-persistence-formdata-coverage**·**check:ui-domain-runtime-imports**·**check:alignment-roundtrip-hint -- --fail**(이름에 `alignment` 포함 단위 테스트 마커 누락 시 exit 1)·**check:input-persistence-pr-hint** (hint는 로컬 기본 알림만 exit 0; **CI** `constitution-check-pr.yml`은 `INPUT_PERSISTENCE_HINT_STRICT=true` 로 IP 핵심 파일 변경에 `docs/constitution/07-frontend-ui/*.md` 동반 요구). **`check:alignment-module-pr-contract`**: [`package.json`](../../../package.json) 스크립트가 `ALIGNMENT_MODULE_PR_CONTRACT_ROUNDTRIP_ON_MODIFY=1` 로 실행되어 로컬·PR 모두 **수정(M)** 시 대응 단위 테스트에 `describe('round-trip (structure contract)'` 필수. **`check:domain-alignment-roundtrip-marker`**: 동일 마커 문자열을 domain 이하 **전체** `*-alignment.ts`(min-bundle 태그 제외)에 대해 항상 검사. **`check:domain-alignment-test-contract-signal`**: 대응 단위 테스트에 `.parse`·`parseXxx(`·JSON 클론·`@/app/api/` 중 하나(휴리스틱). **`check:persistence-touch-pr-contract`**: OR 게이트(라우트 PATCH/PUT/POST 또는 컴포넌트 `method` 리터럴) 시 경로에 `alignment` 또는 tests; 추가 AND 게이트(같은 PR에 `PATCH/route.ts` + `components/**` 소스) 시 `packages/lib/domain/**/*-alignment.ts` 또는 tests만 — AND만 끄기 `PERSISTENCE_TOUCH_PAIR_REQUIRE_STRICT_ALIGNMENT=0`, 전체 스킵 `PERSISTENCE_TOUCH_PR_CONTRACT_SKIP=1`. Branch protection에서 "Constitution Check (PR)" 필수 시 위 항목 위반 시 머지 불가.

**로컬 푸시 전 검증**: `pnpm run verify:before-push` — type-check + check:constitution-pr (pre-push 훅에서 사용).

**Decision Registry 강제화**: `pnpm run check:decision-registry` — decision-registry.json 스키마 검증 후, 레지스트리에 등록된 check:* 스크립트를 모두 실행. 결정은 선언하고 검증은 레지스트리가 지정.

**Decision Rules (Judgment 층)**: `pnpm run check:decision-rules` — 코어 예시 [decision-rules.example.json](../decision-rules.example.json). `pnpm run check:decision-rules:itemwiki` — [itemwiki-constitution/decision-rules.json](../../itemwiki-constitution/decision-rules.json). `--rules=<path>` 지원. **판단 런타임 출력** 스키마: [judgment-output.schema.json](../judgment-output.schema.json)(현재 별도 `check:*` 없음). `check:constitution-pr`에 `check:decision-rules` 포함.

**Judgment 엔진 데모**: `pnpm run judgment:demo` — 코어 규칙 + 시나리오 6개. `pnpm run judgment:demo:itemwiki` — Itemwiki 규칙·실전형 컨텍스트·veto/weighted 실험·로그 포맷. [ENGINE_EVALUATION.md](../12-judgment-constitution/ENGINE_EVALUATION.md), [MULTI_MATCH_EXPERIMENT.md](../12-judgment-constitution/MULTI_MATCH_EXPERIMENT.md).

**코드 사용 강제**: `checkDecision(id: DecisionId)` (프로젝트의 decisions 패키지) — DecisionId 타입으로 미등록 id 컴파일 차단. **미사용 탐지**: `pnpm run check:decision-usage` — 레지스트리에 있으나 코드에서 참조되지 않는 결정 경고. **`check:constitution-pr`는 `check:decision-usage -- --fail-on-unused`** 로 미사용 ID 시 머지 차단. 로컬만 경고하려면 인자 없이 실행.

### `check:all` vs `check:constitution-pr`

로컬에서 “PR과 동일”을 목표로 하면 **`check:constitution-pr`** 를 쓴다. `check:all` 은 **다른** 묶음(예: `check:constitution`, `single-source-drift`, `dependency-graph`)을 포함한다. **둘 다** `check:domain-layer-idp`·`check:domain-top-index -- --fail`·`check:env-access:strict`·`check:api-catch-logging`·`verify:api-7-stages` 등을 포함한다.

| 포함 | check:all | check:constitution-pr |
|------|-----------|------------------------|
| check:constitution-version | ❌ | ✅ |
| check:domain-top-index (`--fail`) | ✅ | ✅ |
| check:domain-layer-idp | ✅ (명시) | ✅ (`check:decision-registry` 경유, PR 체인에서 중복 제거) |
| page-design-flow-jsdoc / page-metadata-public-main | ❌ | ✅ |
| check:conceptual-rot | ❌ | ✅ |
| check:e2e-count / monitor:test-pyramid | ❌ | ✅ |
| check:decision-registry / check:decision-usage | ❌ | ✅ |
| check:constitution (`check-constitution-violations` 등) | ✅ | ❌ |
| check:single-source-drift | ✅ | ❌ |
| check:env-access:strict | ✅ | ✅ |
| check:dependency-graph | ✅ | ❌ |

**권장**: 주간 건강검진은 `pnpm run check:all` 후 `pnpm run check:constitution-pr`(PR 전용 항목 보강)로 **둘 다** 통과 확인. pre-push는 `verify:before-push`.

---

## 2. check:* 스크립트 인벤토리

| 스크립트 | 목적 |
|----------|------|
| check:api-schemas | API 스키마·검증 일관성 |
| check:boundaries | 경계 규칙 (layer-boundaries와 연계) |
| check:cleanup | check:temporary-files + check:skip-ratio + check:todo-comments |
| check:component-patterns | 컴포넌트 패턴 준수 |
| check:conceptual-rot | 개념 부패 위험 탐지 |
| check:direct-queries, check:uid-usage, check:decision-logic | 위와 동일 스크립트 별칭 ([CONCEPTUAL_ROT_PREVENTION](../04-safety-standards/CONCEPTUAL_ROT_PREVENTION.md) 검증 절) |
| check:constitution | Constitution 위반 (직접 리다이렉트 등) |
| check:contrast | 색상 대비 접근성 |
| check:dependency-graph | 의존성 방향·순환 탐지 |
| check:design-route-depth | app 페이지 URL 깊이 3-Depth Rule (라우트 그룹 제외), [10-design-flow](../10-design-flow/DESIGN_FLOW_PRINCIPLES.md) |
| check:flow-docs | 핵심 플로우 문서·`ROUTE_FLOW`·`@flow` JSDoc 정합성 |
| check:effect-deps | Effect 의존성 배열 등 |
| check:env-access | 환경 변수 접근 (08-config: process.env 직접 사용). 기본 경고만, `--strict` 시 위반 시 실패. 점진 적용. |
| check:layer-boundaries | 계층 import 규칙 |
| check:engine-imports | 엔진 전용 import (Utils·Domain·Web·엔진 간 교차) |
| check:domain-layer-idp | `packages/lib/domain`에서 `@itemwiki/lib/utils`·상대 `utils/` import 금지 ([DOMAIN_LAYER_IDP](../../itemwiki-constitution/itemwiki-specific/architecture/DOMAIN_LAYER_IDP.md)). [decision-registry](../../itemwiki-constitution/decision-registry.json) 결정 `domain-no-lib-utils-direct` · `constitution:check`·`check:all`에도 포함 |
| check:domain-top-index | 최상위 도메인 폴더의 `index.ts`(바렐) 검사. 기본 exit 0(목록만), `--fail` 시 누락 시 실패. **`check:constitution-pr`·`constitution:check`·`check:all`·PR Checks** ([IDP 매트릭](../../itemwiki-constitution/ITEMWIKI_IDP_AUTOMATION_MATRIX.md) §3) |
| check:lib-console | packages/lib 내 console.* 금지 게이트 |
| check:logging-compliance | 로깅 규칙 준수 |
| check:permission-drift | 권한 정책·코드 간 드리프트 |
| check:provider-dependencies | Provider 의존성 |
| check:silent-failures | 침묵 실패 위험 |
| check:signup-url | signup URL 단일 소스 |
| check:single-source-drift | 단일 소스 드리프트 (리다이렉트·경로 하드코딩 등) |
| check:duplicate-code | 동일 이름 export 중복 (2개 이상 파일). 8단계 Stage 2 통합 체크. 기본 경고만, `--fail` 시 exit 1. |
| check:decision-registry | 레지스트리 스키마 검증 + 등록된 verificationScript 전부 실행 |
| check:decision-usage | 미사용 결정 ID 경고; PR 체인은 `--fail-on-unused` |
| check:judgment-contracts | `evaluateJudgment` 직접 import/호출 허용 목록 검사 ([JUDGMENT_ENTRYPOINT_POLICY.md](../12-judgment-constitution/JUDGMENT_ENTRYPOINT_POLICY.md)). `check:constitution-pr` 포함 |
| check:judgment-output-schema | `judgment-output.schema.json` + 픽스처 AJV 검증 ([G6](../../itemwiki-constitution/parallel-assessment/GROUP-06-judgment-synaxion.md)). `check:constitution-pr` 포함 |
| check:decision-call-registry | 소스의 `checkDecision('id')` 문자열이 `decision-registry.json`에 있는지. `check:constitution-pr` 포함 |
| check:judgment-runtime-rules | 배포 번들 `itemwiki-decision-rules.json` 스키마·`matcherRefReason`. `check:constitution-pr` 포함 |
| check:skip-ratio | 테스트 skip 비율 |
| check:stale-ui-risks | Stale UI 위험 |
| check:temporary-files | 임시 테스트 파일 |
| check:test-fact | 테스트 fact 주석 |
| check:todo-comments | TODO 주석 |
| check:ux-risks | UX 위험 분류 |
| **verify:api-7-stages** | API 라우트 7단계 로직 구성 주석 검증 (Handler Factory 미사용 시 ①~⑦ 주석 필수). 기본은 이슈 시 exit 1. `--warn`은 임시 완화용(exit 0). `check:constitution-pr`는 기본(엄격) 모드. **미검사**: 레거시 `logAPIError` 문자열(제거됨); 팩토리 내부의 `logUnifiedError`/`handleAPIError` 호출은 추적하지 않음 — [IDP 자동화 매핑](../../itemwiki-constitution/ITEMWIKI_IDP_AUTOMATION_MATRIX.md) §4. |
| **check:api-catch-logging** | catch 경로에 `logUnifiedError`·`handleAPIError`·`handleFailure`·`safeHandleFailure`·`handleAllowedFailure`·`executeSideEffect`·`log`(구조화 로그) 또는 `.info`/`.warn`/`.error`/`.debug` 호출이 있는지 AST 검사. 빈 catch·재던지기·if-return-then-throw·단일 `return {}`/`[]` fail-soft 등은 면제. **미검사**: 허용 목록에 없는 다른 로거 래퍼. |
| **check:e2e-ready** | E2E 준비 신호 레지스트리(ready-signals.ts)와 가이드(E2E_READY_SIGNAL_GUIDE.md) 동기화 검사. 가이드에 언급되지 않은 신호 경고. `pnpm run check:e2e-ready` |
| **check:alignment-new-source-bundle** | PR diff에서 **추가(A)** 또는 **이름 변경(R) 최종 경로**인 `packages/lib/domain/**/*-alignment.ts`에 대해 §4.0 최소 묶음을 정규식으로 검사. 탈출: 파일 주석 `@ip-alignment-min-bundle: wire-only` 또는 `api-bodies-only` ([INPUT_PERSISTENCE §4.0](../07-frontend-ui/INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md#40-신규-alignmentts-최소-묶음-복붙-체크리스트)). 우회: `ALIGNMENT_NEW_SOURCE_BUNDLE_SKIP=1`. `check:constitution-pr` 포함 |
| **check:alignment-package-path** | PR diff에서 **추가·이름변경**된 `packages/lib/domain/**/*-alignment.ts`가 `domain/<area>/<feature>/` 하위인지 검사 ([INPUT_PERSISTENCE §4.1](../07-frontend-ui/INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md#41-도메인-패키지-배치-신규)). 위반 시 exit 1. 우회: `ALIGNMENT_PACKAGE_PATH_SKIP=1`. `check:constitution-pr` 포함 |
| **check:alignment-module-pr-contract** | PR에서 `*-alignment.ts` A/M 시 대응 `tests/unit` 이하 `<stem>.test.ts` 동반·round-trip describe(신규·수정 모두; `package.json` 스크립트가 `ALIGNMENT_MODULE_PR_CONTRACT_ROUNDTRIP_ON_MODIFY=1` 로 실행). 우회: `ALIGNMENT_MODULE_PR_CONTRACT_SKIP=1` |
| **check:domain-alignment-roundtrip-marker** | `packages/lib/domain` 이하 모든 `*-alignment.ts`에 대해 `@ip-alignment-min-bundle: wire-only`·`request-builders-only` 가 아닌 파일은 대응 단위 테스트에 `describe('round-trip (structure contract)'` 마커가 있어야 함(전수·항상 실행). [scripts/check-domain-alignment-roundtrip-marker.ts](../../../scripts/check-domain-alignment-roundtrip-marker.ts). `check:constitution-pr` 포함 |
| **check:domain-alignment-test-contract-signal** | 위와 동일 stem 단위 테스트에 `.parse(`·`.safeParse(`·`parseXxx(`·`JSON.parse(JSON.stringify`·`@/app/api/` 중 최소 1종 **및** (P3) mapper·빌더 호출 패턴(`*PostBody(`·`*ToPatch(`·`*Payload(`·`sliceTo*` 등) 최소 1종(휴리스틱). Zod·mapper **전 필드** 품질은 아님. [scripts/check-domain-alignment-test-contract-signal.ts](../../../scripts/check-domain-alignment-test-contract-signal.ts). `check:constitution-pr` 포함 |
| **check:product-barcode-patch-contract** | `PATCH /api/v1/products/[barcode]` 라우트·스키마가 `product-edit-alignment`·`FIELD_FILTER_INVENTORY.md` P2·`INPUT_PERSISTENCE` 앵커를 유지하는지 정적 검사. [scripts/check-product-barcode-patch-contract.ts](../../../scripts/check-product-barcode-patch-contract.ts). `check:constitution-pr` 포함 |
| **check:alignment-roundtrip-hint** | `tests/unit` 이하 파일명에 `alignment`가 포함된 `.test.ts`의 round-trip 마커 누락 나열. 인자 없음 exit 0. `pnpm run check:alignment-roundtrip-hint -- --fail` 또는 `check:constitution-pr`에서 누락 시 exit 1 |
| **check:pipeline-registry-domain-alignment-tests** | `pipelines.registry`의 `schemaContractAnchor`·`retrieveSliceParser` 중 `packages/lib/domain/…/*-alignment.ts`마다 대응 단위 테스트 파일이 정확히 하나인지 검사. `check:constitution-pr` 포함 |
| **check:pipeline-domain-anchor-contract-export** | 레지스트리가 참조하는 domain `*-alignment.ts`에 `export …Contract`·`export function parse…`·`export type …Contract` 휴리스틱. `check:constitution-pr`·`check:input-persistence-contract-gates` 포함 |
| **check:pipeline-schema-contract-ssot** | `schemaContractAnchor`가 항상 `packages/lib/domain/**/**-alignment.ts`인지·`implementationContractAnchor` 파일 존재. `check:constitution-pr`·`check:input-persistence-contract-gates` 포함 |
| **check:pipeline-alignment-zod-surface** | 레지스트리 alignment 중 min-bundle 제외 파일에 Zod import·`z.object` 등 표면 휴리스틱. `check:constitution-pr`·`check:input-persistence-contract-gates` 포함 |
| **check:persistence-touch-pr-contract** | PR diff 기준 **OR**: PATCH·PUT·POST 각 `route.ts` 또는 컴포넌트 diff의 `method: 'PATCH'` 등 해당 리터럴 → 같은 PR에 경로에 `alignment` 포함 파일 또는 `tests/` 이하 테스트. **AND**(기본 on): `PATCH/route.ts` 변경과 `components/` 이하 `.ts`/`.tsx` 추가·수정이 같이 있으면 만족 조건을 **`packages/lib/domain/…/*-alignment.ts` 또는 tests**로 한정. 우회: `PERSISTENCE_TOUCH_PR_CONTRACT_SKIP=1`; AND만 비활성: `PERSISTENCE_TOUCH_PAIR_REQUIRE_STRICT_ALIGNMENT=0`. allowlist: `scripts/check-persistence-touch-pr-contract.ts`의 `PATH_ALLOWLIST_SUBSTRINGS`. 상세·오탐: [INPUT_PERSISTENCE §7.1](../07-frontend-ui/INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md#71-ci가-보장하는-범위-checkpersistence-touch-pr-contract). `check:constitution-pr` 포함 |
| **check:form-to-api-mapper-boundary** | `components/**`·`packages/web/**`에서 `callAPIWithJSON`·`callAPIByOperation` 호출 윈도우 안의 JSON `body`에 폼 스프레드·`body: formData` 패스스루·비어 있지 않은 `body: { … }` 리터럴 등 고신뢰 anti-pattern 금지(IP-2·Phase B·P3). `packages/web/utils/api/call-api.ts` 제외. [scripts/check-form-to-api-mapper-boundary.ts](../../../scripts/check-form-to-api-mapper-boundary.ts). 우회: `FORM_TO_API_MAPPER_BOUNDARY_SKIP=1`. `check:constitution-pr` 포함 |
| **check:contract-db-enum-sync** | 레지스트리 축의 `as const` 튜플 집합과 지정 마이그레이션 SQL의 `IN ('…')` 리터럴 집합 일치. [scripts/check-contract-db-enum-sync.ts](../../../scripts/check-contract-db-enum-sync.ts). 우회: `CONTRACT_DB_ENUM_SYNC_SKIP=1`. `check:constitution-pr` 포함 |

**규칙**: 새 규칙을 추가할 때는 해당하는 check:\* 스크립트를 추가하고, 필요 시 check:all 또는 check:pr에 포함할지 결정한다.

### allowlist·enum 드리프트 (수동 점검)

자동 스크립트는 주석·문서·테스트 픽스처에서 오탐이 나기 쉬우므로, **SSOT 상수·마이그레이션 CHECK를 바꾸는 PR** 또는 주기 점검 시 아래를 실행해 중복 배열·어긋난 `z.enum` 후보를 눈으로 확인한다.

```bash
# 인라인 z.enum([...]) 후보 (도메인 Contract와 중복 가능성)
rg 'z\.enum\(\[' packages/lib app

# 동일 문자열 리터럴 나열(취약군·탭 ID 등) — SSOT 파일과 diff 비교
rg "('infant'|'basic'|'strict')" packages/lib app --glob '*.ts' | head -80
```

알려진 SSOT 예: `SENSITIVE_GROUP_CODES`, `PRODUCT_DETAIL_KNOWN_TAB_IDS`, `VULNERABLE_GROUPS_FILTERING_STRICTNESS_LEVELS` — 이들을 수정했다면 동일 PR에서 위 검색 결과를 검토한다.

---

## 3. measure:* 스크립트

| 스크립트 | 목적 |
|----------|------|
| measure:change-surface | 변경 시 영향 받는 파일 수(변경 면적) 측정 |
| measure:wikidata-quality | Wikidata 품질 지표 (도메인 특화) |

**규칙**: 리팩토링·도입 결정 시 변경 영향 범위를 측정할 때 measure:change-surface 등을 활용한다.

---

## 4. 생성·다이어그램 (운영 OS)

| 스크립트 | 목적 |
|----------|------|
| **scaffold:constitutional-project** | Constitution 기반 새 프로젝트 스캐폴드 (--out-dir=경로). EXECUTION_CONSTITUTION 부트스트랩 자동화 |
| **generate:adr** | ADR 자동 생성 (`scripts/generate-adr.ts "제목"`) |
| **generate:domain** | 새 도메인 모듈 생성 (`scripts/generate-domain.ts <name>`) |
| **generate:api-route** | 새 API 라우트 생성 (`scripts/generate-api-route.ts v1/path [GET,POST]`) |
| **generate:from-registry** | Registry 기반 코드 생성 (decision-ids.ts 등, `scripts/generate-from-registry.ts`) |
| **diagram:structure** | 레이어 맵 Mermaid 다이어그램 출력 |
| **diagram:structure:with-violations** | 레이어 맵 + check:layer-boundaries 위반 요약 주석 |

**규칙**: 새 시스템 생성 시 `pnpm run scaffold:constitutional-project --out-dir=../my-app` 후 EXECUTION_CONSTITUTION 나머지 단계 진행. 새 도메인/API/ADR은 generate:* CLI로 생성.

---

## 5. check:pr / verify:before-push (PR·푸시 품질 게이트)

`check:pr` 는 다음을 포함합니다:

- lint, type-check, build
- check:effect-deps, check:api-schemas, check:logging-compliance

**규칙**: PR 머지 전 `check:pr` 통과를 권장. 팀 정책에 따라 check:all 포함 여부 결정.

**verify:before-push**: 푸시 전 로컬 검증. `pnpm run verify:before-push` = type-check + check:constitution-pr. pre-push 훅에서 이 검증을 실행하여 푸시 후 PR 실패를 줄인다.

---

## 6. 구조적 장점

이 스크립트 군은 **"헌법 위반·침묵 실패·의존성·정책 드리프트·API 스키마"**를 사람이 기억하지 않아도 시스템이 주기적으로 점검하는 **구조 검증 런타임** 역할을 합니다.

- 원칙 추가 시 → 해당 check:\* 구현 및 문서 반영
- CI에서 → check:all 또는 check:pr 실행으로 회귀 방지

---

## 체크리스트

새 원칙 또는 규칙 추가 시:

- [ ] 자동 검증 가능한가? 가능하면 check:\* 또는 measure:\* 스크립트를 추가했는가?
- [ ] check:all / check:pr 에 포함할지 결정했는가?
- [ ] 이 문서의 인벤토리에 스크립트를 추가했는가?
- [ ] Branch protection에 "Constitution Check (PR)" 필수 여부를 확인했는가? (메인/배포 브랜치 머지 전 검증 강제)

---

**검증 후 배포**: [DEPLOYMENT_TRIGGER.md](./DEPLOYMENT_TRIGGER.md) — check 통과 시 배포 트리거 예시.

**관련 문서**: [VERIFICATION_FRAMEWORK.md](./VERIFICATION_FRAMEWORK.md). 프로젝트 구조 헌법은 프로젝트 적용 디렉터리 참조.

**최종 업데이트**: 2026-03-19

**변경 이력**: `check:all` vs `check:constitution-pr` 차이 표 추가. `check:all`에 **verify:api-7-stages** 추가(로컬 전수 점검). check:constitution-pr의 verify:api-7-stages는 엄격 모드(이슈 시 exit 1). 과거: PR에 --warn 포함. check:ready-signals 스크립트 추가 문서화. check:all/check:constitution-pr에 check:ux-risks·check:stale-ui-risks 반영. verify:before-push 문서화.
