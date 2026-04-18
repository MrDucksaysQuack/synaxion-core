# 입력 스키마와 저장 스키마 정렬 (Input vs Persistence Alignment)

**목적**: UI에서 다루는 데이터 형태와 API·DB에 남는 형태가 어긋날 때 발생하는 증상(일부 값 증발, refetch 후 화면 불일치, “저장 안 된 것처럼 보임”)을 **구조 수준**에서 예방한다.  
**명칭**: Input Schema vs Persistence Alignment.  
**상위 보증 진술(한 페이지)**: [INPUT_PERSISTENCE_GUARANTEE.md](../04-safety-standards/INPUT_PERSISTENCE_GUARANTEE.md) — 단일 Save 권위·렌더 모델·정렬·다중 단계 저장을 원칙만 고정한다.  
**문서로 끝내지 않는다**: 아래 PR 체크리스트(IP-1~6)를 **PR 본문·리뷰에서 매번 확인**한다. 자동화(테스트·allowlist 공유)로 뒷받침한다.

**Tier**: Phase A·B·PR 체크리스트 **필수**. Phase C 이후는 성숙도에 따라 단계 도입.

---

## 1. 단일 진실 공급원 (Single Source of Truth)

- **필드 의미(와이어 키·enum·슬라이스)를 바꿀 때** 해당 기능의 `*-alignment.ts`와 `pipelines.registry`가 가리키는 앵커를 **먼저** 수정한다. UI 폼·`*-form-to-patch`·프로필↔폼 매퍼는 그 다음에 맞춘다.
- **표시·하이드레이션의 기준**은 **서버(또는 API가 반환한 프로필/리소스)** 이다. 클라이언트는 refetch·캐시 무효화 후 받은 값을 반영한다 ([STALE_UI_PREVENTION.md](../04-safety-standards/STALE_UI_PREVENTION.md)와 함께 본다).
- **로컬 state**(폼 입력·Undo·드래프트)는 **임시**다. 저장 성공 후에는 서버 스냅샷을 다시 읽어 동기화하거나, 제품 정책상 “낙관적 UI”를 쓰더라도 **어느 시점에 서버가 권위인지** 코드·문서에 명시한다.
- 이 규칙이 없으면 “저장은 됐는데 화면은 옛값” 같은 **체감 불일치**가 반복된다.

### 1.1 입력(폼) vs 표시(렌더) 권위 시점

**UI Input**(폼·드래프트·낙관적 pending)과 **UI Render**(사용자에게 보이는 값)를 구분하지 않으면, “저장했는데 옛값”, “실패했는데 잠깐 맞아 보임”이 반복된다. 낙관적 UI·로컬 드래프트가 있는 화면은 **저장(또는 mutation) 직후 누가 권위인지**, **실패 시 refetch vs 롤백**을 코드와 문서에 맞춘다.

- **상세 원칙·패턴 표**: [UI_INPUT_RENDER_AUTHORITY.md](./UI_INPUT_RENDER_AUTHORITY.md) — PR 시 절차는 동 문서 **§5.1 (IP-6 실행 루틴)**  
- **화면별 한 줄**: [INPUT_PERSISTENCE_SCREEN_MAPPINGS.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_SCREEN_MAPPINGS.md)의 **Authority matrix** 및 각 절 **권위 요약** 표  
- **낙관적 롤백·refetchOnError**: [OPTIMISTIC_UPDATE_SAFETY_GUIDE.md](../../analysis/OPTIMISTIC_UPDATE_SAFETY_GUIDE.md)  
- **프로필 계층 타입**: `profile-data-layers.ts` · `profile-render-model.ts`(Phase C)

### 1.2 기능 단위 `FooContract` (현실적 정의)

제품 전체 필드를 **하나의 전역 TypeScript 객체**에 몰아넣지 않는다. **기능(또는 persistence 파이프라인 스테이지)마다** `packages/lib/domain/**/<feature>-alignment.ts`에 `XxxContract`·mapper·(선택) Zod를 둔다. **실행 계약의 앵커**는 [`packages/lib/domain/persistence/pipelines.registry.ts`](../../../packages/lib/domain/persistence/pipelines.registry.ts)의 `schemaContractAnchor`·`retrieveSliceParser` 경로와, 그 경로가 가리키는 **도메인 모듈 묶음**이 함께 SSOT를 이룬다.

각 Contract에 **해당할 때만** 아래를 채운다(해당 없음은 코드에 `N/A` 주석으로 명시).

| 항목 | 설명 |
|------|------|
| **wire 키** | PATCH/POST/GET 슬라이스에 오가는 키 상수(`patchBodyKeys`, `postBodyKeys` 등) |
| **allowlist / enum** | 서버·클라이언트 공유 분기(취약군 코드, 탭 ID, enum) |
| **UI↔wire 맵** | 폼 키 → 와이어 키; 이름이 같아도 1:1 맵으로 고정해 IP-1 추적 |
| **loose vs canonical** | silent drop·파티션 전 느슨한 배열 vs 저장 allowlist 등 이중 경로 |
| **mapper** | `slice → form`(hydrate), `form → patch`/API 바디 — **권장 공개명**: `mapPersistenceToUI` / `mapUIToPersistence`(레거시 `profileSliceTo*`·`*ToPatch`·`*PostBody`와 **동일 역할이면 별칭 export**로 병행 가능, §3 Phase B「IP-2 이름 규약」 참고) |
| **round-trip 테스트** | 대표 입력 + `uiToWireFieldMap`·Contract 정합(취약군 단위 테스트 패턴) |

### 1.3 Contract tuple → Zod → 타입 → DB `CHECK`

- **허용 enum·allowlist**는 `*-alignment.ts`(또는 이미 SSOT인 `packages/lib/core/types/*`)의 **`as const` 튜플**을 정본으로 둔다.
- **Zod**는 `z.enum(튜플)` 등으로 그 튜플에서만 파생하고, **타입**은 `z.infer`·`(typeof TUPLE)[number]` 등으로 동일 소스에서만 파생한다.
- **Postgres** 마이그레이션의 `CHECK (… IN ('a','b',…))`는 튜플과 동일 리터럴 집합을 맞추고, CI [`check:contract-db-enum-sync`](../../../scripts/check-contract-db-enum-sync.ts)가 레지스트리 축에 대해 **SQL `IN` 집합 ≡ 튜플 집합**인지 검증한다. 신규 enum 축은 스크립트 `AXES`에 행 추가. 우회: `CONTRACT_DB_ENUM_SYNC_SKIP=1`(사유 권장).
- **교차 타입**: `packages/lib/core/types/toxicity.ts`의 `VulnerableGroup`은 취약군 코드에 한해 [`SensitiveGroupCode`](../../../packages/lib/domain/user/sensitive-groups/sensitive-groups-alignment.ts)와 동일(alignment가 SSOT).
- **제품 상세 탭 순서(`tab_order`)**: allowlist·`partitionKnownProductTabOrder`의 **SSOT**는 [`packages/lib/core/product/product-detail-tab-order-allowlist.ts`](../../../packages/lib/core/product/product-detail-tab-order-allowlist.ts)이다. [`category-tab-config.ts`](../../../packages/lib/core/product/category-tab-config.ts)의 `CATEGORY_TAB_CONFIGS.tabs[].id`는 모듈 로드 시 동일 집합에 대해 검증되며, domain [`product-tab-settings-alignment.ts`](../../../packages/lib/domain/user/product-tab-settings/product-tab-settings-alignment.ts)는 이를 re-export한다(서버가 UI만의 id를 조용히 버리는 이탈 방지).

### 1.4 주요 도메인 Contract 매니페스트 (전사 확장)

- **목적**: 선호·가입·제품 편집·취약군·기여 등 **제품 관점 주요 저장 축**마다 필수 `*-alignment.ts` 경로와 (가능하면) `MULTI_PERSISTENCE_PATHS.md` §2 행 번호를 한 파일에 고정해, 누락·드리프트를 CI에서 막는다.
- **정본**: [`scripts/major-domain-contracts.registry.json`](../../../scripts/major-domain-contracts.registry.json) — `domains[]`에 `id`, `label`, `requiredAlignmentPaths`, 선택 `pipelineSection2Rows`, 선택 `requiredUiMapperPaths`(문자열 또는 `{ path, mustContainSubstrings? }`), 선택 `goldenContract`·`goldenContractAlignmentPath`.
- **검증**: `pnpm run check:major-domain-contract-manifest` — 파일 존재, round-trip 단위 테스트(또는 `@ip-alignment-min-bundle` 예외), §2 행에 앵커 문자열 등장 여부, UI 매퍼 정적 규칙. `pnpm run check:major-domain-pipeline-crosswalk` — 레지스트리 `pipelineSection2Rows`·가입∪선호 §2 교차·관리자 면제 분류 고정. 둘 다 `check:input-persistence-contract-gates`에 포함된다.
- **얇은 UI 매퍼 파일 인벤토리(전량 SSOT)**: `components/**`·`packages/lib/api/**`·`packages/web/hooks/**` 아래 모든 `*-form-to-patch.ts`·`*-profile-to-form.ts` 경로는 [`scripts/input-persistence-form-mapper.manifest.json`](../../../scripts/input-persistence-form-mapper.manifest.json)이 SSOT이며, 디스크 목록과 대칭이어야 한다. [`major-domain-contracts.registry.json`](../../../scripts/major-domain-contracts.registry.json)에 선언한 `requiredUiMapperPaths` 중 `*-form-to-patch.ts`는 **반드시** 위 매니페스트 `formToPatch`에도 포함된다(동일 스크립트가 교차 검사). 각 파일 **선두 JSDoc**에 역할 태그 `@ip-ui-mapper form-to-patch` 또는 `@ip-ui-mapper profile-to-form`을 둔다(검색·리뷰·CI 공통). **검증**: `pnpm run check:input-persistence-form-mapper-manifest`(`check:constitution-pr`·`check:input-persistence-contract-gates` 포함). **보일러플레이트(파일 자동 생성 없음)**: `pnpm run scaffold:input-persistence-mapper -- <form-to-patch|profile-to-form> [FeatureName]` → stdout; 생성 후 매니페스트에 경로를 넣고 위 검증을 돌린다. 런타임으로 매퍼를 합치는 리팩터는 본 인벤토리와 무관하게 선택 과제다.
- **신규 사용자 대면 저장 축**을 추가할 때는 매니페스트에 도메인 행을 추가하고, 해당 `packages/lib/domain/**/<feature>-alignment.ts`·`tests/unit/**/<stem>.test.ts`·[`pipelines.registry.ts`](../../../packages/lib/domain/persistence/pipelines.registry.ts) 앵커를 함께 맞춘다.

### 1.5 골든 축(레지스트리 선언) — **PR 머지 필수 게이트**

**신규 화면·저장 UI PR**: `@ip-ui-mapper`·manifest·`align-ip2`·write-surface 등 점검 순서는 [입력–저장 README — 신규 화면·저장 경로 체크리스트](../../itemwiki-constitution/itemwiki-specific/input-persistence/README.md)를 본다.

**인덱스·매니페스트 CI**: 화면·티어 탐색은 [INPUT_PERSISTENCE_MAPPING_INDEX.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_MAPPING_INDEX.md). 매니페스트·도메인 계약·골든 검증은 `pnpm run check:input-persistence-form-mapper-manifest`, `pnpm run check:major-domain-contract-manifest`, `pnpm run check:registry-golden-input-persistence` — 통합 묶음은 `pnpm run check:input-persistence-contract-gates`, PR 게이트는 `pnpm run check:constitution-pr`(위 스크립트들이 포함되는지 `package.json`에서 확인).

다른 축을 넓히기 전에, **한 축 이상은 “구조가 개발자를 강제”하는 수준까지** 고정한다. 매니페스트에서 `goldenContract: true`인 도메인마다 아래를 동시에 만족하지 않으면 CI에서 실패한다(현재 참조 구현은 **취약 사용자군** `sensitive_groups` 한 건).

| 규칙 | 의미 |
|------|------|
| **Contract 파일** | `goldenContractAlignmentPath`가 있으면 그 경로, 없으면 해당 도메인 `requiredAlignmentPaths[0]`의 `*-alignment.ts` 존재 |
| **Mapper 공개명** | `mapUIToPersistence` · `mapPersistenceToUI` export (레거시 별칭만 남기고 공개명 삭제 시 실패) |
| **Round-trip 단위 테스트** | `tests/unit/**/<stem>.test.ts`에 `describe('round-trip (structure contract)'` 마커 + 위 두 mapper의 **실제 호출** (`mapUIToPersistence(` / `mapPersistenceToUI(`) |

- **검증**: `pnpm run check:registry-golden-input-persistence` — 레지스트리의 `goldenContract` 도메인 전수; `check:constitution-pr`·`check:input-persistence-contract-gates`에 포함.
- **구현**: [`scripts/check-registry-golden-input-persistence.ts`](../../../scripts/check-registry-golden-input-persistence.ts), 공용 로직 [`scripts/golden-input-persistence-lib.ts`](../../../scripts/golden-input-persistence-lib.ts)
- **스캐폴드·감사 CLI**: `pnpm run align:ip2-audit` — 골든 위반을 `no_mapper_in_alignment` / `no_test_or_duplicate_test` / `test_missing_roundtrip_or_calls` 요약(옵션 `--json`). `pnpm run generate:alignment-ip2 -- --domain-id <id> [--template emptyPost|identityClone|manual] [--dry-run]` 또는 동일 명령에 `--alignment packages/lib/domain/.../foo-alignment.ts`로 `@generated:ip2` 구간에 mapper·테스트 블록을 비파괴 삽입. 배치: `pnpm run generate:alignment-ip2 -- --all-violations` — 레지스트리 선택 필드 `ip2ScaffoldTemplate: manual` 인 도메인은 스킵. 상세: [`scripts/align-ip2.ts`](../../../scripts/align-ip2.ts) 상단 주석.
- **min-bundle vs 골든**: `@ip-alignment-min-bundle`(manifest 단위 테스트 완화)은 **골든 도메인에는 쓰지 않는 것**을 권장한다. 골든 축은 위 표의 mapper·round-trip 호출을 CI로 강제한다.

---

## 2. 왜 필요한가

- 흐름(로딩·에러·재시도)만 맞춰도, **필드 매핑·enum·배열/불리언 표현이 다르면** 동일한 버그가 반복된다.
- 매핑이 컴포넌트 내부에만 있으면 **사람이 바뀔 때마다** 깨지기 쉽고, PR마다 같은 실수가 재발한다.
- **단일 API 호출**이 아니라 **여러 persistence 경로**인 화면은 표 하나로는 부족하고 **파이프라인 전체**와 **부분 실패 정책**을 문서화해야 한다.

정렬은 [FRONTEND_LAYER_PRINCIPLES.md](./FRONTEND_LAYER_PRINCIPLES.md)의 사용자 입력(쓰기) 영역, [STATE_MANAGEMENT_PRINCIPLES.md](./STATE_MANAGEMENT_PRINCIPLES.md)의 Stale UI·mutation 후 갱신, [CONTRACT_TESTING.md](../05-testing-principles/CONTRACT_TESTING.md)의 계약 검증과 함께 본다.

---

## 3. 실행 단계 (로드맵)

### Phase A — 표준 정의 (필수)

- 화면(또는 기능)마다 **UI ↔ API ↔ DB(정규화)** 계약을 한 곳에서 찾을 수 있게 한다. 부담을 줄이기 위해 **IP-1 티어**를 둔다 ([INPUT_PERSISTENCE_MAPPING_INDEX.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_MAPPING_INDEX.md) § IP-1 티어).
  - **Full**: 고위험(필터·다중 persistence·낙관·드래프트·FormData 등) — [INPUT_PERSISTENCE_SCREEN_MAPPINGS.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_SCREEN_MAPPINGS.md)에 **표 + 역방향 한 줄 + 권위 요약**을 유지한다.
  - **Lean**: 단순 단발 JSON 쓰기 + alignment·테스트로 계약이 서 있으면 — 인덱스 **`WS id`** + [`write-surface-registry.ts`](../../../packages/lib/domain/input-persistence/write-surface-registry.ts) + SCREEN_MAPPINGS **스텁**(또는 SAVE 인덱스에 IP-6 위임)으로 Phase A를 충족할 수 있다.
- **역방향**: 저장 후 refetch → UI에 넣는 경로를 표·스텁·SAVE 인덱스 중 **정본으로 택한 곳**에 **이름 있는 함수/훅** 한 줄 이상으로 명시한다.
- **기계 검증**: `pnpm run check:write-surface-registry` — 레지스트리·인덱스·**Full**이면 해당 § 헤더·**Lean**이면 [SCREEN_MAPPINGS §15](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_SCREEN_MAPPINGS.md#section-15-ip-1-tier-lean-write-surface-registry-stubs) + WS id 본문.
- **문서가 없으면** 인수인계·PR 리뷰에서 동일 버그가 반복된다.

### Phase B — Mapper 분리 (**필수**: 신규·해당 영역 수정 PR)

#### 폼→API 직접 전달 금지 (form → mapper → API)

- **저장 mutation의 JSON `body`**는 **이름 있는 mapper·요청 빌더 호출 결과**만 넘긴다: `packages/lib/domain/**/<feature>-alignment.ts`의 `*To*Payload` / `*PostBody` 등, 또는 이를 재수출하는 [`packages/lib/api/*-ui.ts`](../../../packages/lib/api/)·동 패키지 요청 빌더.
- **금지**: 폼·로컬 state 객체를 와이어에 그대로 얹는 `body: { ...formState }`, JSON 의미의 `body: formData`(스프레드/패스스루), 컴포넌트·훅 안에서만 필드를 모아 만든 **무명 인라인 와이어 객체**를 그대로 `callAPIWithJSON` / `callAPIByOperation` / **`callAPI(`(옵션에 `body:`가 있는 호출)**에 넘기는 것. 변경 저장 JSON 본문은 어떤 HTTP 진입점이든 **mapper·`*-ui` 요청 빌더·alignment 경유**가 정본이다.
- **예외**: **FormData·파일 업로드**는 `callAPIWithFormData` 등 기존 경로 — [`CLIENT_DIRECT_PERSISTENCE_INVENTORY`](../../../packages/lib/api/client-direct-persistence-inventory.ts)·§12C·`check:client-direct-persistence-formdata-coverage`와 정합.
- **기계 검증(휴리스틱)**: `pnpm run check:form-to-api-mapper-boundary` — `components/**`·`packages/web/**` 전체에서 `callAPIWithJSON`·`callAPIByOperation`·**`callAPI(`** 호출 윈도우 안에 **`body:`가 있을 때만** 동일 anti-pattern 탐지(폼 스프레드·패스스루·**비어 있지 않은 `body: { … }` 객체 리터럴**). 본문 없는 `callAPI`(예: 순수 GET)는 오탐을 줄이기 위해 스킵한다. `packages/web/utils/api/call-api.ts` 구현 파일만 제외. 우회: `FORM_TO_API_MAPPER_BOUNDARY_SKIP=1`(사유 권장)·스크립트 내 allowlist.
- **요청 본문 `JSON.stringify` (UI 트리, 1차)**: 로컬 스토리지·렌더·의존성 배열 등 **비-HTTP** `JSON.stringify` 는 전면 금지 시 오탐이 크므로, 먼저 `body: JSON.stringify(` 패턴만 `pnpm run check:no-json-stringify-request-body-ui`로 강제한다. 전면 stringify 금지는 allowlist·baseline 을 두고 후속 단계에서 확장한다. 우회: `NO_JSON_STRINGIFY_REQUEST_UI_CHECK_SKIP=1`.

#### IP-2 이름 규약 (Priority 2 — `mapUIToPersistence` / `mapPersistenceToUI`)

- **목적**: 리뷰·검색 시 “UI→저장”과 “저장→UI” 진입점을 **고정된 이름**으로 찾는다. §5 Round-trip의 `mapUIToPersistence` / `mapPersistenceToUI` 개념과 동일하다.
- **적용**: **신규 기능** 또는 **저장·슬라이스 매핑을 materially 변경**하는 리팩터 PR에서는, 해당 `*-alignment.ts`(또는 `packages/lib/api/*-ui.ts` 재수출)에 아래 **쌍**을 둔다.
  - **`mapUIToPersistence(ui)`** — 폼·UI 모델 → PATCH/POST 와이어 또는 API 바디 조립(기존 `*ToPatch`·`*PostBody`·`*Payload`와 동치면 **`export const mapUIToPersistence = existingFn`** 허용).
  - **`mapPersistenceToUI(stored)`** — GET/슬라이스 → 폼·UI 모델(기존 `profileSliceTo*`·`sliceTo*`와 동치면 래퍼·별칭 허용).
- **추가 인자**: 하이드레이션이 “화면에 있는 코드만 필터” 등 **UI 맥락**을 요구하면 `mapPersistenceToUI(slice, uiSelectableCodes?)`처럼 **시그니처를 alignment 주석·PR 본문 한 줄**로 남긴다(§5 테스트 전제와 맞출 것).
- **배럴(`@itemwiki/lib/api/core`)에서 이름 충돌**: 여러 `*-ui`를 한 배럴로 묶을 때 동일 IP-2 공개명이 겹치면 TypeScript가 **중복 export**로 실패한다. **정본**(`packages/lib/domain/**/**-alignment.ts`)의 `mapUIToPersistence` / `mapPersistenceToUI` **이름은 유지**하고, UI 층에서는 축별 **별칭**을 추가로 노출한다 — 예: `mapSensitiveGroupsUIToPersistence`, `mapProductTabSettingsUIToPersistence`, `mapProfileHeaderModalUIToPersistence`, `mapProfileDisplayComponentUIToPersistence` ([`packages/lib/api/sensitive-groups-ui.ts`](../../../packages/lib/api/sensitive-groups-ui.ts) 등).
- **머지 기준(리뷰)**: `components/**`·`packages/web/**` 안에 **의미 있는 와이어 키 조립·슬라이스→폼 변환**만 두지 않는다 — 기존 Phase B·`check:form-to-api-mapper-boundary`와 동일. 본 소절은 **이름 규약**을 추가할 뿐, 기계 검증은 우선 기존 CI로 충분하다(`check:domain-alignment-test-contract-signal`에 `mapUIToPersistence(`·`mapPersistenceToUI(` 호출도 P3 신호로 인정).

- **Priority 3 (Mapper 강제화, IP-3 보강)**: full 번들 `*-alignment.ts`의 대응 단위 테스트는 `check:domain-alignment-test-contract-signal`에서 (기존) 파싱·와이어 신호에 더해 **mapper·빌더 호출 휴리스틱**(`mapUIToPersistence(`·`mapPersistenceToUI(`·`*ToPatch(`·`*PostBody(`·`*Payload(`·`sliceTo*`·`formTo*`·`build*`·`partition*`·`split*`·`*FromXxx(` 등)을 **추가로** 요구한다 — 파서만 있는 빈 계약 테스트를 줄인다.

- **필수**: **새 폼/새 저장 경로**를 추가하거나, 기존 화면에서 **저장 페이로드·하이드레이션 로직을 materially 변경**하는 PR에서는, 의미 있는 **UI ↔ persistence 매핑을 `packages/lib`(또는 도메인 모듈)의 이름 있는 함수**로 둔다. 컴포넌트는 **호출만** 한다.
- **금지(위 PR 범위)**: 위 매핑을 컴포넌트 `useEffect`·클릭 핸들러 안에만 두는 것(드래프트 직렬화 등 **순수 UI 전용** 제외).
- **레거시**는 PR 단위로 **점진 이행**하되, 터치한 영역은 가능한 한 같은 PR에서 mapper로 옮긴다.
- **효과**: 테스트·재사용·디버깅·코드 검색이 쉬워진다. 이 규칙만 지켜도 **대부분의 구조성 불일치 버그**를 예방할 수 있다.

- **UI Input 층 import 경계 (Itemwiki)**: `components/**`·`packages/web/**`에서 도메인 **런타임 값**(mapper·상수·Zod 인스턴스·POST/PATCH 빌더)은 `@itemwiki/lib/domain/...`에 직접 두지 않고, 기능별 [`packages/lib/api/*-ui.ts`](../../../packages/lib/api/) 재수출 또는 배럴 [`@itemwiki/lib/api/core`](../../../packages/lib/api/core.ts)만 사용한다. **타입만** 필요하면 당분간 `import type … @itemwiki/lib/domain/…`도 가능하나, 장기적으로는 재수출 경로만 쓰는 것이 목표다. CI: `pnpm run check:ui-domain-runtime-imports`(우회: `UI_DOMAIN_RUNTIME_IMPORT_SKIP=1`)·`pnpm run check:ui-domain-type-imports`(허용 목록 밖의 domain import 금지, 우회: `UI_DOMAIN_TYPE_IMPORT_SKIP=1`).
- **Contract 재노출 (장기 정리)**: 화면별 `*-alignment.ts`가 SSOT이더라도, 스크립트·설정·리뷰가 한 경로로 찾도록 [`preferences.ts`](../../../packages/lib/api/preferences.ts)(`UserPreferencesSettingsContract`·슬라이스/PATCH Zod)·[`product-ui.ts`](../../../packages/lib/api/product-ui.ts)(`ProductEditAlignmentContract`·알려진 키·`productBarcodePatchWireSchema`)에서 도메인 심볼을 얇게 재수출한다.

**참고 구현 (Itemwiki)**: `packages/lib/domain/user/sensitive-groups/` — allowlist·`profileSliceToSensitiveGroupsFormData`·`sensitiveGroupsFormDataToProfilePatch`·`SensitiveGroupsContract`. API `PATCH /api/v1/users/me`의 그룹 필터는 동일 모듈의 `partitionKnownSensitiveGroups`·`applySensitiveGroupsFieldFilter` 계열을 사용한다. **Junction persistence vs wire**: 멤버십은 `user_sensitive_groups` **행 집합**이고, GET/PATCH의 `sensitive_groups` **배열**은 Retrieve 슬라이스로 조립된다(PATCH 본문 스키마를 persistence 행 형태와 동일시하지 않음). 행 타입·SELECT→배열: `sensitive-groups-persistence.ts`; INSERT 행 생성만 `sensitive-groups-persistence.server.ts`.

### Phase C — 슬라이스 검증 (중급 → 고급)

- `UserProfile` 등 **passthrough·느슨한 객체**만으로는 “틀린 형태”가 통과할 수 있다.
- 전체 프로필 스키마를 한꺼번에 빡세게 하기 어렵다면, 화면별로 **좁은 Zod 스키마**를 소비 지점에 둔다.
- 목표: 잘못된 응답을 **일찍** 걸러 사용자에게 일관된 에러·재시도를 보여 준다.

**전역 경계 vs 화면 슬라이스 (Retrieved → 소비)**  
- **전역 진입**: [`useProfileInternal.ts`](../../../packages/web/hooks/auth/useProfileInternal.ts)에서 `parseProfileRetrieveWireBoundaryFromUnknown` — 캐시·`useAuthState.profile`에 넣기 직전 **식별자·신뢰도·취약군** 최소 검증만 수행한다. 나머지 필드가 와이어에 있어도 여기서는 전부 검증하지 않는다.  
- **화면 슬라이스**: GET/refetch 직후 **해당 UI가 쓰는 필드만** 이름 있는 `parse*`로 검증하고, **그 성공 타입만** 폼·렌더 props로 넘긴다. `ProfileRetrieveWire`를 자식까지 직통하면 이후 Input/PATCH/렌더 계층이 한꺼번에 깨지기 쉽다.  
- **진입점 재export**: [`packages/lib/api/profile-ui.ts`](../../../packages/lib/api/profile-ui.ts)·기타 `*-ui.ts`·[`core.ts`](../../../packages/lib/api/core.ts)가 도메인 파서·매퍼를 UI 레이어에 노출한다.

| 소비 맥락 | 파서(또는 함수) · 모듈 |
|-----------|------------------------|
| 전역 캐시·`useAuthState.profile` 진입 | `parseProfileRetrieveWireBoundaryFromUnknown` — `profile-ui-consumption-slices.ts` |
| `/profile` 본문·self 뷰 | `parseProfileSelfViewSliceFromProfile` |
| 프로필 설정 폼 하이드레이션 | `parseProfileSettingsHydrationSliceFromProfile` — `profile-settings/profile-settings-alignment.ts` |
| 헤더 프로필 모달 | `parseProfileHeaderModalSliceFromProfile` |
| 신뢰도 진행(NextLevelHint 등) | `parseProfileTrustProgressSliceFromProfile` |
| `ProfileDisplay` | 부모가 `parseProfileDisplayComponentPickFromUnknown` 성공값(`ProfileDisplayComponentPick`)만 전달 — 컴포넌트는 wire 비수용 |
| 기능 플래그 | `parseProfileFeatureFlagsSliceFromProfile` |
| OCR 자동 확인 토글 | `parseProfileOcrAutoConfirmSliceFromProfile` |
| 제품 기여·권한 trust 게이트 | `parseProductContributionTrustSliceFromProfile` / `parseProfileTrustLevelWireSliceFromUnknown` |
| 취약 사용자군 설정 | `parseSensitiveGroupsProfileSliceFromUnknown` — `sensitive-groups-alignment.ts` |
| 공개 프로필 `/u/[username]` | `parsePublicProfilePageSliceFromUnknown` — `public-profile-page-slice.ts` |
| 가입 완료·계정 active 판별 | `parseSignedUpProfilePresenceFromUnknown` / `hasSignedUp` — `profile-validation.ts` |

**잔여 점검 (UserProfile 통로·직접 읽기)**  
- **기계 검사**: `pnpm run check:phase-c-profile-optional-chain` — `components/**`·`packages/web/**`에서 `profile?.`·`userProfile?.` 로 wire 필드를 읽는 패턴을 CI에서 차단한다. 우회: `PHASE_C_PROFILE_OPTIONAL_CHAIN_SKIP=1`.  
- **기계 검사(보강)**: `pnpm run check:phase-c-profile-dot-access` — 동일 경계에서 `profile.field`·`} = profile` 구조 분해·**`(profile as Type).field`**(타입 괄호 단일 줄)·**`profile!.field`**·**`=\nprofile` 줄바꿈 할당**을 차단한다(`userProfile` 동일). `(profile as (A & B)).x` 같이 `as` 뒤 괄호 중첩·별칭 변수는 미검출일 수 있음. 우회: `PHASE_C_PROFILE_DOT_ACCESS_SKIP=1`.  
- **수동·주기**: 별칭(`const p = profile` 후 `p.x`)·복잡한 `as`·여러 줄 구조 분해 등은 정적 규칙이 완전히 못 잡을 수 있으니 PR 리뷰에서 화면 통로가 위 표의 `parse*`(또는 `toProfileRenderModel` 등 합성)인지 확인한다. **전체 객체 전달**만 하는 경우는 `getAccountState`·`checkUnifiedPermissionClient`처럼 내부에서 슬라이스/검증하는 허용 경로다.  
- **문서**: 잔여·확장 작업은 [INPUT_PERSISTENCE_SCHEMA_ALIGNMENT_REMAINING_WORK.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_SCHEMA_ALIGNMENT_REMAINING_WORK.md) 그룹 3.

**프로필 계층 (Input / Persistence / Retrieve / Render)**: DB 행·GET wire·PATCH 입력·UI 표시를 한 타입으로 섞지 않도록 `packages/lib/domain/user/profile-data-layers.ts`(`ProfilePersistenceRow`, `ProfileRetrieveWire`, `ProfilePatchInput`, `ProfileDisplayInput`)와 `profile-render-model.ts`(`ProfileRenderModel`)를 기준으로 삼는다. 클라이언트 캐시·`useAuthState.profile`은 **Retrieve(wire)** 만 담는다. API Zod 타입은 `packages/lib/api/schemas/users.ts`의 `UserProfile`(+ `Record<string, unknown>` 교차)을 따른다. 취약 사용자군 멤버십은 `ProfilePersistenceRow.sensitive_groups` 컬럼(레거시 JSONB)과 별도로 **junction** `user_sensitive_groups`에 canonical 저장될 수 있으며, 와이어 배열과의 매핑은 `user/sensitive-groups/sensitive-groups-persistence.ts`를 본다.

### Phase D — 파이프라인 감사 (다중 저장) + **부분 실패 정책 (필수 기술)**

**완료 정의(층 A/B/C)** — “모든 다중 쓰기가 fail-all / partial / retry와 문장 단위 1:1”이 아니라, 아래 층으로 나누어 주장한다.

- **층 A (필수·CI)**: `PERSISTENCE_PIPELINES` 스테이지 `policy`·`clientTransportRetry`·`schemaContractAnchor`(항상 domain `*-alignment.ts`)·`implementationContractAnchor`(해당 시), MULTI §2 `pipelineId` ↔ 레지스트리 ordinal, 앵커·실행 경로 파일 존재·alignment 단위 테스트·SSOT·Zod 표면 게이트. Phase D **머지 조건**은 기본적으로 층 A까지다.
- **층 B (제품 서술)**: MULTI §2의 “제품 정책(IP-5)·사용자 체감” 열은 스테이지 `policy`의 **사람이 읽는 요약**이며, 글자 단위 동치를 요구하지 않는다. HTTP 재시도 수치·토스트 문구는 alignment·훅·라우트 주석이 SSOT다([MULTI §1.1](../../itemwiki-constitution/itemwiki-specific/input-persistence/MULTI_PERSISTENCE_PATHS.md)).
- **층 C (행동·UI)**: 부분 저장 토스트, 두 번째 PATCH 실패, 낙관 롤백 등은 통합/E2E/수동 리뷰로 덮는다. [INPUT_PERSISTENCE_SCHEMA_ALIGNMENT_REMAINING_WORK.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_SCHEMA_ALIGNMENT_REMAINING_WORK.md) 그룹 4 표가 **의도된 갭**과 **이미 덮인 경로**를 구분한다.

한 폼 제출이 **두 개 이상의 API/테이블**에 쓰이면, “UI ↔ 한 DB 테이블” 표만으로는 부족하다.
- **다이어그램 또는 단계 표**: 필드 → 호출 A → 호출 B → …
- **필드 단위 매트릭스 (Priority 4)**: 와이어 필드→물리 저장소→「둘 다 성공해야 2xx인지 / 한쪽만 실패 시 무엇이 커밋되는지」는 해당 스테이지의 **domain `schemaContractAnchor` `*-alignment.ts` 파일 헤더 JSDoc 표**가 SSOT다. 예: 선호도 `PATCH …/users/me/preferences` — [`user-preferences-settings-alignment.ts`](../../../packages/lib/domain/user/user-preferences-settings/user-preferences-settings-alignment.ts). 파이프라인·§2 행과의 역할 분담은 [MULTI §1.3](../../itemwiki-constitution/itemwiki-specific/input-persistence/MULTI_PERSISTENCE_PATHS.md)를 본다.
- **코드·문서 쌍 (IP-5 추적)**: 스테이지별 `fail_all`·`partial_success_notify`·`retry_queue_or_compensate`·**필수** `clientTransportRetry`(`not_applicable` \| `none` \| `defer_to_operation_registry`)와 **필수** `schemaContractAnchor`(항상 `packages/lib/domain/**/**-alignment.ts`)·선택 **`implementationContractAnchor`**(라우트·훅·비-alignment 실행 파일)는 [`packages/lib/domain/persistence/pipelines.registry.ts`](../../../packages/lib/domain/persistence/pipelines.registry.ts)의 `PERSISTENCE_PIPELINES`가 정본이다. 브라우저 호출부 재시도 합성: [`packages/lib/api/persistence-stage-client-retry.ts`](../../../packages/lib/api/persistence-stage-client-retry.ts) `mergeRetryOptionsForPersistenceStage`. [MULTI_PERSISTENCE_PATHS.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/MULTI_PERSISTENCE_PATHS.md) §2 **row 1–28**의 `pipelineId`·요약 열은 레지스트리 `section2RowOrdinal`·`pipelineId`와 1:1이다(단일 쓰기 참고는 §2.1에만 둔다). 스테이지·정책·앵커 표는 [PIPELINE_STAGES_INDEX.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/PIPELINE_STAGES_INDEX.md)(`pnpm run docs:pipeline-stages`로 재생성). §3 mermaid는 대표 흐름 보조용. **완료 조건**: `check:pipeline-schema-contract-ssot`·파일 존재(`check:pipeline-contract-anchors`)·구조 불변수(`pipelines-registry.test.ts`)·alignment 테스트·export 스모크·`check:pipeline-alignment-zod-surface`(min-bundle 제외 Zod 표면). Zod **전 필드 커버**는 여전히 단위·통합이 담당한다. PR·로컬에서 `pnpm run check:pipeline-contract-anchors`·`check:pipeline-schema-contract-ssot`·`check:pipeline-alignment-zod-surface`·`check:pipeline-registry-domain-alignment-tests`·`check:pipeline-domain-anchor-contract-export`·`check:multi-persistence-section2-pipeline-ids`·`check:pipeline-stages-doc`(및 단위 `pipeline-stage-anchor-files`)를 통과한다. 인덱스 갱신은 `pnpm run docs:pipeline-stages` 후 커밋한다.
- **앵커 SSOT(리뷰)**: `implementationContractAnchor`가 `app/api/**`·`components/**` 등이면, PR에서 해당 스테이지의 **`schemaContractAnchor` alignment**와 실행 경로가 쌍으로 맞는지 확인한다([MULTI §1.2](../../itemwiki-constitution/itemwiki-specific/input-persistence/MULTI_PERSISTENCE_PATHS.md#12-schemacontractanchor-성격retrievesliceparser-ssot)).
- **레지스트리 `policy` vs 클라 재시도·완료 표현·§2 row 8 UI**: [MULTI_PERSISTENCE_PATHS.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/MULTI_PERSISTENCE_PATHS.md) **§1.1**.
- **예시 (가입 create 겹침)**: 한 번의 제출은 클라 §2 row 1(`signup.create_profile_then_optional_avatar_async`)과 서버 §2 row 3(`server.post_profile_create_rpc_then_handle_preferences`)이 **동시에** 적용된다. 서술·스테이지 표는 [`packages/lib/domain/user/signup-profile/signup-profile-api-alignment.ts`](../../../packages/lib/domain/user/signup-profile/signup-profile-api-alignment.ts) 헤더, 기계적 `policy`·앵커는 레지스트리 row 3을 본다.
- **반드시 문서·코드 중 한 곳에 명시할 것** — 다중 persistence에서 한 단계만 실패했을 때:

| 정책 | 설명 |
|------|------|
| **Fail-all (롤백)** | 이후 단계 실패 시 앞선 변경을 되돌리거나 트랜잭션으로 묶는다. 사용자에게는 단일 실패 메시지. |
| **Partial success + 알림** | 일부만 반영됨을 **명시적으로** 알린다. 어떤 단계가 성공/실패인지 내부 로그·지원용 메타를 남긴다. |
| **Retry queue / 보정 작업** | 비동기 재시도·데드 레터 등. **사용자에게 “완료”를 말하기 전**에 허용 조건을 정한다. |

정책이 없으면 **데이터 일관성 붕괴**와 **원인 불가능한 버그 리포트**로 이어진다. (예: `updatePreferences` 성공 후 `convertToFeatures` 실패.)

### Phase E — 회귀 방지 (완성 단계)

- **Round-trip 계약 테스트**(아래 5절)와 E2E/통합 시나리오로 “저장 후 화면 = 기대값”을 자동화한다.
- ESLint만으로 mapper 존재를 완전 강제하기 어렵다 → **PR 체크리스트 + 테스트**가 방어선이다.

#### Phase E 완료 층 (E0 / E1 / E2)

**`check:constitution-pr`·§7.3 게이트가 통과했다고 해서 “모든 레거시 저장 경로가 시맨틱·E2E까지 증명된 것”은 아니다.** 아래 층을 구분해 기대치를 맞춘다.

| 층 | 의미 | 대표 수단 | CI가 보장하는 범위 |
|----|------|-----------|-------------------|
| **E0 구조** | `*-alignment` 번들·대응 단위 테스트 파일·`describe('round-trip (structure contract)'` 마커·(휴리스틱) 계약 신호 | `check:input-persistence-contract-gates`·§7.3 각 스크립트 | 마커·파일 존재·문자열 신호 — **mapper·Zod 전 구현 증명은 아님** ([MULTI_PERSISTENCE_PATHS.md §6](../../itemwiki-constitution/itemwiki-specific/input-persistence/MULTI_PERSISTENCE_PATHS.md)) |
| **E1 시맨틱** | form↔patch/slice·핸들러↔저장 결과의 **의미 동치**(대표 입력 벡터·API 통합) | `tests/unit/domain/**/*-alignment.test.ts`·`tests/integration/api/**` | Jest·통합 테스트 본문 — **전 필드 조합 증명은 선택적으로 확장** |
| **E2 브라우저** | 저장 → 이탈·재진입(또는 refetch) 후 **UI 동치** | Playwright `input-persistence-*`·`*-persistence-roundtrip.spec.ts` 등 | 합의된 **상위 N개** 화면 위주 — 전 도메인 E2E는 비용상 백로그 |

**단일 진실(커버리지 표)**: [PHASE_E_COVERAGE.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/PHASE_E_COVERAGE.md) — MULTI §2 행·주요 domain alignment와 E1/E2 스펙 경로를 한눈에 맞춘다.

---

## 4. 실행 가능한 계약 (Schema Contract 파일, 권장)

텍스트 표만으로는 코드와 어긋날 수 있으므로, 도메인별로 **한 모듈**에 다음을 모은다:

- allowlist·필드명 상수 (`SensitiveGroupsContract` 등)
- `*ToForm` / `*ToPatch` mapper
- (선택) Zod 슬라이스

**효과**: 문서와 코드 동기화, 타입 연결, 테스트 재사용.

### 4.0 신규 `*-alignment.ts` 최소 묶음 (복붙 체크리스트)

**상위 원칙·표**: [§1.2 기능 단위 FooContract](#12-기능-단위-foocontract-현실적-정의).

1. **`XxxContract`** (또는 동등 상수 객체): allowlist·`profileFields` / `patchBodyKeys` 등 wire 키 나열.
2. **도메인 기준 Contract 별칭 (권장)**: 한 화면에 wire·응답 Zod·메타 스키마가 겹칠 때 **이름 있는 기준**을 하나 둔다. 예: 사용자 선호 설정 — `userPreferencesSettingsDomainContract`가 `UserPreferencesSettingsContract`와 동일 참조이며, 응답·`field_filter_meta`는 [`user-preferences-settings-alignment.ts`](../../../packages/lib/domain/user/user-preferences-settings/user-preferences-settings-alignment.ts) 헤더 «이 도메인 기준 Contract» 표가 짝을 이룬다.
3. **UI ↔ wire 필드 맵** (폼 이름과 API가 다를 때): `uiToWireFieldMap` 등 **한 객체**에만 적고 mapper가 참조 ([취약군 `SENSITIVE_GROUPS_UI_TO_WIRE_FIELD_MAP`](../../../packages/lib/domain/user/sensitive-groups/sensitive-groups-alignment.ts) 참고).
4. **`xxxWireSliceSchema` 또는 `parseXxxWireSliceFromUnknown`**: GET/캐시 직후 좁은 검증 → `{ ok, message }`.
5. **`sliceToForm` / `formToPatch`** (또는 동일 의미의 이름 있는 함수).
6. **단위 테스트**: `describe('round-trip (structure contract)'` 블록 — [check-alignment-module-pr-contract.ts](../../../scripts/check-alignment-module-pr-contract.ts)(PR diff) 및 [check-domain-alignment-roundtrip-marker.ts](../../../scripts/check-domain-alignment-roundtrip-marker.ts)(전수)와 연동.
7. **(프로필 하이드레이션)** 해당 파이프라인 스테이지에 `retrieveSliceParser` 경로를 [pipelines.registry.ts](../../../packages/lib/domain/persistence/pipelines.registry.ts)에 기재 — [check-pipeline-contract-anchors.ts](../../../scripts/check-pipeline-contract-anchors.ts)가 파일 존재를 검증.

**CI (신규·rename 파일)**: PR에 **추가(A)** 되거나 **이름 변경(R) 최종 경로**로 들어온 `*-alignment.ts`는 [check-alignment-new-source-bundle.ts](../../../scripts/check-alignment-new-source-bundle.ts)가 §4.0 **full** 묶음(Contract·맵·parse/슬라이스·폼 브리지·저장 출력)을 정규식으로 검사한다. `wire-only`·`request-builders-only` 태그 사용 시 파일 내 **`ip-reason:`** 설명도 함께 요구된다. full이 아니면 아래 태그로 범위를 명시한다.

| 파일 주석 태그 | 용도 |
|----------------|------|
| `// @ip-alignment-min-bundle: wire-only` + `// ip-reason: …` | 허용 PATCH/POST 키·바디 화이트리스트만. UI 맵·GET 슬라이스 parse·폼 하이드레이션 없음. |
| `// @ip-alignment-min-bundle: request-builders-only` + `// ip-reason: …` | Contract + (UI↔wire 맵 **또는** `*PostBody`/`*Patch*` 등 요청 조립). 파일 내 좁은 GET 슬라이스 parse가 없어도 됨. |
| (태그 없음) | **full** — 위 표 1~5 항(Contract·별칭·맵·parse·폼 브리지)에 해당하는 심볼·패턴이 코드에 있어야 한다(스크립트 주석의 정규식 설명 참고). |

**round-trip describe (로컬 = PR)**: `pnpm run check:alignment-module-pr-contract`는 [`package.json`](../../../package.json) 스크립트에서 `ALIGNMENT_MODULE_PR_CONTRACT_ROUNDTRIP_ON_MODIFY=1` 로 실행된다. 따라서 로컬 `check:constitution-pr`와 GitHub PR 워크플로 모두 `*-alignment.ts` **수정(M)** 시에도 대응 `tests/unit` 이하 `<stem>.test.ts`에 `describe('round-trip (structure contract)'` 가 있어야 한다. 임시로 끄려면 해당 env를 비우고 `tsx scripts/check-alignment-module-pr-contract.ts` 를 직접 호출한다.

**파이프라인 레지스트리 ↔ 단위 테스트**: [pipelines.registry.ts](../../../packages/lib/domain/persistence/pipelines.registry.ts)의 `schemaContractAnchor`·`retrieveSliceParser`가 가리키는 `packages/lib/domain/…/*-alignment.ts` 마다 위와 동일한 stem의 단위 테스트 파일이 **정확히 하나** 있어야 한다 — [check-pipeline-registry-domain-alignment-tests.ts](../../../scripts/check-pipeline-registry-domain-alignment-tests.ts)(`check:pipeline-registry-domain-alignment-tests`, `check:constitution-pr` 포함). round-trip **마커 문자열**은 추가로 [check-domain-alignment-roundtrip-marker.ts](../../../scripts/check-domain-alignment-roundtrip-marker.ts)가 domain 전체에 대해 검사한다(§7.3).

### 4.05 API 라우트 체크리스트 (PATCH/GET, Persistence 경계)

PATCH/GET가 Contract와 어긋나면 **왕복(refetch 후 화면 불일치)**이 난다. 아래를 **한 패턴**으로 맞춘다.

| 항목 | 규칙 |
|------|------|
| **PATCH Zod** | 루트 스키마는 `packages/lib/domain/.../*-alignment.ts`에서 조립하고, `app/api/v1/.../schemas.ts`는 **re-export만** ([`userPreferencesSettingsPatchWireSchema`](../../../packages/lib/domain/user/user-preferences-settings/user-preferences-settings-alignment.ts) → [`preferences/schemas.ts`](../../../app/api/v1/users/me/preferences/schemas.ts), [`updateUserMePatchWireSchema`](../../../packages/lib/domain/user/user-me-patch/user-me-patch-alignment.ts) → [`users/me/schemas.ts`](../../../app/api/v1/users/me/schemas.ts), [`productBarcodePatchWireSchema`](../../../packages/lib/domain/product/product-edit/product-edit-alignment.ts) → [`products/[barcode]/schemas.ts`](../../../app/api/v1/products/[barcode]/schemas.ts)). |
| **핸들러 → DB** | `patchWireSchema`에 있는 **와이어 키**는 핸들러에서 빠지지 않게 한다. 문자열·필터 컬럼은 `pickUserMeProfileTableUpdatePayload`처럼 **이름 있는 추출**로 `user_profiles` 등에 넣고, allowlist·silent drop은 **단일** `partition*` + `apply*FieldFilter`만 사용한다. |
| **loose vs canonical** | **loose**: PATCH wire(예: `sensitiveGroupsLooseStringArraySchema`) — 형태만 보고 unknown 코드는 이후 partition에서 처리. **canonical**: junction 행·가입 POST 등 엄격 enum/allowlist. |
| **GET** | Retrieve 슬라이스는 `parseXxxWireSliceFromUnknown`(예: [`parseSensitiveGroupsProfileSliceFromUnknown`](../../../packages/lib/domain/user/sensitive-groups/sensitive-groups-alignment.ts))로 검증·정규화해 응답에 반영한다(junction이 권위인 필드는 그대로 덮어쓴다). |
| **CI** | 필드 필터·PATCH 계약: `check:field-filter-registry-contract`(P0/P1/P2 일괄)·래퍼 `check:field-filter-*`·`check:product-barcode-patch-contract`가 domain·라우트 앵커를 고정한다. |

**이원화 주의**: `PATCH /api/v1/users/me`는 취약군 배열이 **loose + partition + 메타(B)** 이고, `PATCH /api/v1/users/me/profile`의 `sensitive_groups`는 **엄격 스키마**다. 통합 시 breaking 가능성이 있으므로 별도 결정 없이 바꾸지 않는다.

### 4.1 도메인 패키지 배치 (신규)

**목적**: “입력–저장 Contract는 어디를 보나”를 한눈에 고정한다. 탐색·온보딩·PR 리뷰에서 동일 규칙을 쓴다.

**신규** 입력–저장 alignment(Contract·mapper·Zod 슬라이스)는 아래 **패키지 경로**에만 둔다:

```text
packages/lib/domain/<area>/<feature>/
  index.ts                    # 공개 심볼만 re-export (권장)
  <feature>-alignment.ts      # allowlist·Contract·mapper·(선택) Zod — 파일명은 *-alignment.ts 유지
```

- **`<area>`**: `user`, `product`, `preferences` 등 기존 `domain/` 직계 디렉터리.
- **`<feature>`**: 기능 단위 하위 폴더(케밥·짧은 이름). `*-alignment.ts`는 **이 폴더 안**에 둔다.  
  - 허용 예: `packages/lib/domain/user/sensitive-groups/sensitive-groups-alignment.ts`  
  - **금지(신규)**: `packages/lib/domain/user/foo-alignment.ts`처럼 **`<area>` 바로 아래**에 두는 플랫 배치.
- **CI**: `pnpm run check:alignment-package-path` — PR에서 **추가(A)** 된 `packages/lib/domain/**/*-alignment.ts`가 위 깊이를 만족하지 않으면 실패한다. 기존 플랫 파일은 점진 이행([INPUT_PERSISTENCE_SCHEMA_ALIGNMENT_REMAINING_WORK.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_SCHEMA_ALIGNMENT_REMAINING_WORK.md) 그룹 2 백로그).
- **파일명**: [check-alignment-module-pr-contract.ts](../../../scripts/check-alignment-module-pr-contract.ts)가 `stem`으로 단위 테스트 파일명을 맞추므로 **`*-alignment.ts` 접미사를 유지**한다.
- **비대 모듈**: 필요 시 같은 폴더에서 `contract.ts`(상수·Zod만)·mapper 분리를 문서상 허용하되, 1단계 CI는 `*-alignment.ts` 추가 경로만 검사한다.

**참고 구현**: [packages/lib/domain/user/sensitive-groups/](../../../packages/lib/domain/user/sensitive-groups/) · 제품 탭 설정: [packages/lib/domain/user/product-tab-settings/](../../../packages/lib/domain/user/product-tab-settings/).

### 4.11 UI 런타임 소비 경계 (`@itemwiki/lib/api` 퍼사드)

- **구현 SSOT**는 위 §4.1대로 `packages/lib/domain/...`에 둔다(Contract·mapper·Zod 슬라이스).
- **`components/`**, **`packages/web/`**, **`app/` 페이지**(단 `app/api/` 제외)에서는 `@itemwiki/lib/domain`에서 **값**(함수·상수·런타임 객체)을 직접 가져오지 않는다. 타입만 필요하면 `import type { … } from '@itemwiki/lib/domain/...'`는 허용된다.
- UI가 필요로 하는 런타임 심볼은 `packages/lib/api/**/*-ui.ts`(또는 `missing-fields-client` 등 클라이언트 전용 모듈)에서 domain을 **re-export**하는 퍼사드를 경유한다. 여러 기능을 한데 묶은 배럴은 [`packages/lib/api/core.ts`](../../../packages/lib/api/core.ts)를 쓸 수 있다.
- **동적 import**: `import('@itemwiki/lib/domain/...')`(한 줄·여러 줄 모두)도 금지이며, 문자열 인자는 `@itemwiki/lib/api/...` 퍼사드(예: 코드 스플릿이 필요하면 해당 `*-ui` 모듈을 `import()`한다)만 쓴다.
- **CI**: [`scripts/check-layer-boundaries.ts`](../../../scripts/check-layer-boundaries.ts)가 다줄 정적 import/`export … from`과, 경로 문자열이 다음 줄에 있는 **다줄 동적 import**까지 검사한다.

---

## 5. Round-trip 계약 테스트 (구조 테스트)

**아이디어** (흐름 E2E가 아니라 **구조** 검증):

1. 대표 `initialUI` (또는 폼 상태)
2. `mapUIToPersistence(initialUI)` → API 페이로드
3. 저장 후 fetch 결과를 `stored`로 두거나, 테스트에서는 페이로드를 슬라이스로 간주
4. `mapPersistenceToUI(stored)` → `finalUI`
5. **기대**: 정책상 동치 범위에서 `finalUI` === `initialUI` (allowlist 필터·기본값은 테스트에 명시)

**깨지면** 매핑·allowlist·서버 필터 중 **계약이 깨진 것**이다.

**Itemwiki**: `tests/unit/domain/user/sensitive-groups-alignment.test.ts` 가 위 개념의 최소 예시다.

---

## 6. 서버 쪽 silent drop (위험과 대응)

**위험**: 서버가 요청 값을 필터링하고 **거절 목록을 응답에 넣지 않으면**, 클라이언트는 “다 보냈다”고 생각하고 사용자는 “저장이 안 된 것 같다”고 느낀다.

**대응 — 아래 중 하나는 반드시 적용하는 것을 권장한다.**

| 방안 | 내용 |
|------|------|
| **A. Allowlist 공유** | 허용 코드를 `packages/lib` 등 **단일 소스**로 두고 UI·서버가 **동일 상수/함수**를 쓴다. (취약 사용자군: `SENSITIVE_GROUP_CODES` / `filterKnownSensitiveGroups`) |
| **B. 거절 목록 반환** | 응답에 `accepted` / `rejected`(또는 동등 메타)를 포함해 클라이언트가 알릴 수 있다. 계약·암묵적 버전은 **§6.2** 참고. |

둘 다 없으면 운영·디버깅 비용이 커진다.

### 6.1 무손실(round-trip)과 정책의 경계 — **정책 허용 손실**

허용 목록 필터는 요청 페이로드를 줄이므로, “클라이언트가 보낸 바이트 그대로가 영구 저장된다”는 의미에서는 본질적으로 **손실**이 있다. 다만 서버·제품 정책으로 **명시된** 동작이면 버그가 아니라 **정책 허용 손실**(영문 검색·코드 주석 앵커: `policyPermittedReduction`)로 부른다. 아래 **요약**과 사용자·지원이 보는 **실제 한국어 문장**은 동일한 의미이며, 토스트·로그·문구의 단일 출처(SSOT)는 `packages/lib/utils/api/field-filter-meta-format.ts`의 `FIELD_FILTER_POLICY_PERMITTED_REDUCTION_NOTICE_PREFIX` 및 `formatFieldFilterWarningMessage` / `formatFieldFilterRejectionLogMessage`이다(교차 검증: `pnpm run check:policy-permitted-reduction-docs`). 요약 문서와의 정합을 위해 SSOT 문자열에 포함되는 구절 예: `보내신 내용과 실제로 저장된 값이 다를 수 있습니다` · `저장에서 제외되었습니다`.

5절 Round-trip 테스트에서는 “무손실”을 주장하지 않고, **정책 허용 손실 범위**(allowlist·기본값)를 테스트 전제에 명시한다.

### 6.2 방안 B 응답 계약·버전 (implicit v1)

- **위치**: 저장 성공(2xx) 표준 응답의 `data.field_filter_meta`(존재 시). 스키마 SSOT는 [`packages/lib/api/schemas/users.ts`](../../../packages/lib/api/schemas/users.ts)의 `FieldFilterMeta` / `FieldFilterMetaSchema`(Zod).
- **의미**: allowlist 등으로 **거절된 값이 있을 때만** `field_filter_meta`를 내린다. 거절이 없으면 **키 자체를 생략**한다. 하위 슬라이스(`sensitive_groups`, `product_tab_order`, `product_trust_allowlist` 등)는 각각 `{ accepted, rejected }` 문자열 배열을 가진다.
- **호환 정책**: **additive-only** — 새 슬라이스 키 추가만 허용. 기존 키의 `accepted`/`rejected` 의미를 바꾸거나 제거하면 **암묵적 v1을 깨는 변경**이므로 API·문서 버전 정리 또는 신규 엔드포인트·필드로 이행한다. **암묵적 v1** = 현재 리포지토리의 `FieldFilterMeta` 정의.
- **클라이언트**: `field_filter_meta`가 있으면 `formatFieldFilterWarningMessage`로 문구를 만들고 경고 토스트(`showWarning`) 등으로 사용자에게 알린다. P0 화면: 프로필 취약군 설정·제품 상세 탭 설정([FIELD_FILTER_INVENTORY.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/FIELD_FILTER_INVENTORY.md) 표).

---

## 7. PR 체크리스트 (**리뷰 시 강제**)

다음을 **새로 추가**하거나 **저장 페이로드·프로필 슬라이스를 바꾸는** PR에 적용한다. 리뷰어는 통과하지 않으면 **머지하지 않는다** (예외는 ADR·이슈에 근거 명시).

| ID | 통과 기준 |
|----|-----------|
| **IP-1** | UI 필드 ↔ API/DB 필드 매핑이 **티어(Full/Lean)** 에 맞게 문서·[`write-surface-registry`](../../../packages/lib/domain/input-persistence/write-surface-registry.ts)·인덱스 `WS id`로 추적된다 ([MAPPING_INDEX § IP-1 티어](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_MAPPING_INDEX.md#ip-1-티어-full-vs-lean)). |
| **IP-2** | **폼→API 직접 전달 금지** — 흐름은 **form → mapper(`*-alignment` / `*-ui` 요청 빌더) → API** 만 허용. JSON `body`는 이름 있는 빌더 반환값만; FormData·§12C 예외는 위 Phase B 소제목 표와 동일. |
| **IP-3** | 합의된 도메인은 **Round-trip 또는 mapper 단위 테스트**가 있거나, “후속 이슈 번호”가 PR에 있다. |
| **IP-4** | 서버가 값을 필터링한다면 **Allowlist 공유(방안 A)** 또는 **rejected 반환(방안 B)** 와의 정렬이 문서·코드에 있다. |
| **IP-5** | 다중 persistence면 **부분 실패 정책**(3절 Phase D 표)이 PR·문서·코드 주석 중 하나에 한 줄이라도 있다. |
| **③** | **신규 MULTI** 화면·플로 PR마다 PR 본문에 **부록 A·[MULTI 사용자 계약](../../guides/MULTI_PERSISTENCE_USER_CONTRACT.md) 정렬 한 줄** + [`check-input-persistence-high-risk-multi-contract` `CONTRACTS`](../../../scripts/check-input-persistence-high-risk-multi-contract.ts) + **(선택)** 대표 E2E 한 줄을 남긴다. 복사 블록·체크: [`.github/pull_request_template.md`](../../../.github/pull_request_template.md) «③ MULTI 화면·사용자 계약» · 인스턴스 [신규 화면 체크리스트](../../itemwiki-constitution/itemwiki-specific/input-persistence/README.md) 항목 7. 해당 없음: 한 액션에 2단계 이상 연속 저장/조회가 없음. |
| **IP-6** | **낙관적 UI·로컬 드래프트·단발 mutation 저장 동기화 경로**를 추가/변경하면 [UI_INPUT_RENDER_AUTHORITY.md](./UI_INPUT_RENDER_AUTHORITY.md)에 맞춰 **표시 권위(저장 직후)**·**실패 시(refetch / 롤백 / 이탈)** 를 PR 본문 한 줄·SCREEN_MAPPINGS 권위 표·또는 저장 진입점 **§2.1 코드 주석**으로 남긴다. CI `check:optimistic-authority-hint -- --fail`은 `useOptimistic` 외 `useSaveOperation`·`useFlowAwareDraft`·드래프트 키·`deleteDraft(` 등 신호 파일 **상단 45줄** 앵커 누락을 머지 차단한다([§4](./UI_INPUT_RENDER_AUTHORITY.md#4-stale-ui점검-스크립트)). |

### 7.1 CI가 보장하는 범위 (`check:persistence-touch-pr-contract`)

| 구분 | 내용 |
|------|------|
| **자동(머지 차단)** | **OR 게이트**: `app/api/.../PATCH/route.ts`·`.../PUT/...`·`.../POST/...` 중 하나가 바뀌었거나, `components/**` diff에 `method: 'PATCH'` 등 해당 리터럴이 있으면, 같은 PR에 **경로에 `alignment`가 포함된 파일** 변경 또는 `tests/**`의 `*.test.*`·`*.spec.*` 변경이 있어야 한다. |
| **자동(추가)** | **AND 게이트**(기본 on): 위와 별도로, 같은 PR에 **`app/api/**/PATCH/route.ts` 변경**과 **`components/**`의 `.ts`/`.tsx` 추가·수정**이 **함께** 있으면, 만족 조건이 **`packages/lib/domain/**/**-alignment.ts`** 또는 **`tests/**` 테스트**로 한정된다(IP-2와 정합). `method` 리터럴이 없는 저장 래퍼와 PATCH가 한 PR에 묶일 때 mapper 누락을 줄이기 위한 **좁은 휴리스틱**이다. |
| **CI가 대신 못 하는 것** | PATCH 라우트·컴포넌트를 **동시에 안 건드리는** 저장 경로 변경, IP-1 매핑 표 존재, IP-5 다중 persistence 정책 문구, **③** PR 본문 요약(부록/사용자 계약·`CONTRACTS`·선택 E2E) — **§7 표는 여전히 리뷰 필수**. |
| **의도적 오탐(허용)** | 예: PATCH·컴포넌트는 건드렸지만 **스타일·주석만** 바뀐 PR, alignment 모듈 없이 **테스트만**으로도 AND·OR 모두 통과 가능. |
| **우회·완화** | 전체 스크립트 스킵: `PERSISTENCE_TOUCH_PR_CONTRACT_SKIP=1`(PR 본문에 사유 권장). **AND만** 끄기: `PERSISTENCE_TOUCH_PAIR_REQUIRE_STRICT_ALIGNMENT=0`. **OR만 엄격히**(깃그레이션): `PERSISTENCE_TOUCH_OR_STRICT_ALIGNMENT=1` — OR 게이트에서 `alignment` 부분 문자열이 아니라 domain 이하 `*-alignment.ts` 만 동반으로 인정. 순수 UI·관리자 등은 [`scripts/check-persistence-touch-pr-contract.ts`](../../../scripts/check-persistence-touch-pr-contract.ts)의 `PATH_ALLOWLIST_SUBSTRINGS`로 제외 가능. `*-alignment.ts` 대신 전용 모듈만 쓰는 흐름은 해당 영역에 alignment 도입·allowlist·일회 SKIP 중 하나로 정리한다. |

### 7.2 직접 URL 클라 인벤토리·diff 힌트

| 구분 | 내용 |
|------|------|
| **자동(머지 차단)** | [`check:client-direct-persistence-pr-contract`](../../../scripts/check-client-direct-persistence-pr-contract.ts): [`CLIENT_DIRECT_PERSISTENCE_INVENTORY`](../../../packages/lib/api/client-direct-persistence-inventory.ts) 항목의 `sourceFile`이 PR diff에 있으면, 같은 PR에 **`tests/**` 테스트** 또는 **[INPUT_PERSISTENCE_SCREEN_MAPPINGS.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_SCREEN_MAPPINGS.md)** 또는 해당 항목의 **`alignmentModule` 경로**(정의된 경우) 또는 **인벤토리 TS** 변경이 있어야 한다. 우회: `CLIENT_DIRECT_PERSISTENCE_PR_CONTRACT_SKIP=1`(사유 권장). |
| **자동(머지 차단)** | [`check:client-direct-persistence-formdata-coverage`](../../../scripts/check-client-direct-persistence-formdata-coverage.ts): `app`·`components`·`packages` 이하에서 `callAPIWithFormData` **실호출**이 있는 소스 파일은 모두 인벤토리 `sourceFile`에 등록되어 있어야 한다(역방향 IP-1). 우회: `CLIENT_DIRECT_FORMDATA_COVERAGE_SKIP=1`(사유 권장). |
| **자동(머지 차단)** | [`check:form-to-api-mapper-boundary`](../../../scripts/check-form-to-api-mapper-boundary.ts): `components/**`·`packages/web/**`에서 `callAPIWithJSON`·`callAPIByOperation`·**`callAPI(`** 인근(윈도우에 `body:`가 있을 때만) JSON `body`에 폼 계열 스프레드·`body: formData` 패스스루·**비어 있지 않은 `body: { … }` 리터럴** 등 **고신뢰 anti-pattern**이 없어야 한다(IP-2·Phase B·P3). `packages/web/utils/api/call-api.ts` 제외. 우회: `FORM_TO_API_MAPPER_BOUNDARY_SKIP=1`(사유 권장)·스크립트 헤더 allowlist. |
| **자동(머지 차단)** | [`check:contract-db-enum-sync`](../../../scripts/check-contract-db-enum-sync.ts): 레지스트리 축의 Contract `as const` 튜플 집합과 지정 마이그레이션의 `IN ('…')` 리터럴 집합 일치(§1.3). 우회: `CONTRACT_DB_ENUM_SYNC_SKIP=1`(사유 권장). |
| **자동(머지 차단)** | [`check:ui-domain-runtime-imports`](../../../scripts/check-ui-domain-runtime-imports.ts): `components/**`에서 `import type`이 아닌 `@itemwiki/lib/domain` import 금지 — UI는 `@itemwiki/lib/api/core` 또는 `packages/lib/api/*-ui.ts` 경유. 우회: `UI_DOMAIN_RUNTIME_IMPORT_SKIP=1`(사유 권장). |
| **정보성(머지 차단 아님)** | [`check:input-persistence-pr-hint`](../../../scripts/check-input-persistence-pr-hint.ts): `app/api`·`packages/lib/api`·`packages/lib/domain`·`components` 변경 시 **경로별 IP 앵커** notice(GitHub Actions). stdout에 `[input-persistence-hint-summary] rules=…` 한 줄로 이번 PR에 걸린 규칙 id를 고정 포맷으로 남긴다. Strict·`CONTRACT_CORE`·문서 동반은 기존과 동일. |
| **자동(머지 차단)** | [`check:write-surface-registry`](../../../scripts/check-write-surface-registry.ts): [`WRITE_SURFACE_REGISTRY`](../../../packages/lib/domain/input-persistence/write-surface-registry.ts) 항목마다 진입 파일 존재·`INPUT_PERSISTENCE_MAPPING_INDEX.md`에 `WS id`·`mappingIndexMarker` 포함·**Full**이면 해당 § 헤더·**Lean**이면 §15 스텁 헤더 + 스텁 본문에 WS id. 우회: `WRITE_SURFACE_REGISTRY_CHECK_SKIP=1`. |
| **자동(머지 차단)** | [`check:new-ui-write-surface-pr-contract`](../../../scripts/check-new-ui-write-surface-pr-contract.ts): merge-base 대비 **추가(A)** 된 `packages/lib/api/*-ui.ts`가 있으면 같은 PR에 `write-surface-registry.ts` 또는 `INPUT_PERSISTENCE_MAPPING_INDEX.md` 변경이 있어야 한다. 오탐 시 `NEW_UI_WRITE_SURFACE_PR_CONTRACT_SKIP=1` 또는 `NEW_UI_WRITE_SURFACE_PR_CONTRACT_ALLOWLIST`(쉼표 구분 경로). |
| **자동(머지 차단)** | [`check:admin-mutation-12b-doc-hint -- --fail`](../../../scripts/check-admin-mutation-12b-doc-hint.ts): `app/api/v1/admin/**/route.ts`의 POST·PATCH·PUT·DELETE 라우트마다 [SCREEN_MAPPINGS §12B](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_SCREEN_MAPPINGS.md#12b--저장상태-변경배치-트리거) 본문에 휴리스틱 키워드가 있어야 한다. 예외: 스크립트 `EXEMPT_ADMIN_MUTATION_ROUTES`. 우회: `ADMIN_MUTATION_12B_DOC_HINT_SKIP=1`. |
| **자동(머지 차단, Phase 3.2)** | [`check:no-json-stringify-request-body-ui`](../../../scripts/check-no-json-stringify-request-body-ui.ts): `components/**`·`packages/web/**`·`app/**`(api 제외)에서 HTTP 요청 본문 축 — 한 줄 `body: JSON.stringify(` **또는** `body:` 줄바꿈 직후 `JSON.stringify(` — 만 금지(스토리지·렌더용 stringify는 제외). **직렬화 SSOT**: [`jsonRequestBody`](../../../packages/lib/api/json-request-body.ts)(`@itemwiki/lib/api/json-request-body`). 예외·우회: 스크립트 `ALLOWLIST_REL_PATHS`(비우는 것이 정상)·`NO_JSON_STRINGIFY_REQUEST_UI_CHECK_SKIP`. |
| **자동(머지 차단)** | [`check:no-json-stringify-ui-wide`](../../../scripts/check-no-json-stringify-ui-wide.ts): 동일 UI 트리에서 **그 외** `JSON.stringify` — 스토리지·`(, null, 2)`·JSX `{JSON.stringify`·deps 한 줄·`stableStringifyForComparison`(→ [`jsonRequestBody`](../../../packages/lib/api/json-request-body.ts)) 등 허용 조합 외 금지. `SKIP_PATH_PREFIXES`·`SKIP_EXACT_FILES` 비움. 리터럴 직렬화 SSOT는 **`packages/lib/api/json-request-body.ts`** 단일 파일(스캔 범위 밖). 우회: `NO_JSON_STRINGIFY_UI_WIDE_CHECK_SKIP=1`. |
| **자동(머지 차단, Phase 3.2)** | [`check:no-session-user-ui`](../../../scripts/check-no-session-user-ui.ts): **`(?<![.])session.\w+`** — `data.session.*`·문자열 리터럴 제외 후 매칭. 스캔은 `packages/web/**` 포함(`packages/web/auth/`·`utils/auth/`·allowlist 파일 제외). 토큰·주체는 `useAuthState().accessToken`·`user`·`/users/me` 경유. |
| **정보성(선택)** | [`check:registry-test-bidirectional-sync`](../../../scripts/check-registry-test-bidirectional-sync.ts): 통과 시 `REGISTRY_TEST_SYNC_VERBOSE=1`이면 등록 경로 수·마커 파일 수 요약 로그를 stdout에 남긴다(드리프트 조기 발견). |

### 7.3 테스트·CI (round-trip·계약 게이트)

| 구분 | 내용 |
|------|------|
| **로컬 일괄(요약)** | `pnpm run check:input-persistence-contract-gates` — 레이어 경계·domain utils 금지·alignment round-trip 마커 전수·**단위 테스트 파싱·와이어 신호**(`check:domain-alignment-test-contract-signal`)·파이프라인 앵커↔단위 테스트·플랫 alignment 허용 목록·`alignment` 이름 단위 테스트의 round-trip describe(`--fail`)를 한 번에 실행한다. |
| **표준 마커** | 단위 테스트에 정확히 `describe('round-trip (structure contract)'` 문자열 포함 — [check-alignment-module-pr-contract.ts](../../../scripts/check-alignment-module-pr-contract.ts)가 PR diff 기준으로 강제(`ALIGNMENT_MODULE_PR_CONTRACT_ROUNDTRIP_ON_MODIFY=1`). |
| **전수 마커** | [`check:domain-alignment-roundtrip-marker`](../../../scripts/check-domain-alignment-roundtrip-marker.ts): `packages/lib/domain` 이하 **모든** `*-alignment.ts`에 대해, 파일 상단 8KB에 `@ip-alignment-min-bundle: wire-only` 또는 `request-builders-only`가 **없으면** 대응 `tests/unit/**/<stem>.test.ts`에 위 표준 마커 필수(항상 실행·위반 시 exit 1). |
| **전수 계약 신호(휴리스틱)** | [`check:domain-alignment-test-contract-signal`](../../../scripts/check-domain-alignment-test-contract-signal.ts): 위와 동일 대상 stem의 단위 테스트에 `.parse(`·`.safeParse(`·`parseXxx(`·`JSON.parse(JSON.stringify`·`@/app/api/` 중 **최소 1종** 필수. **추가(P3)**: 동일 테스트에 mapper·빌더 호출 패턴(`*ToPatch(`·`*PostBody(`·`*Payload(`·`sliceTo*`·`formTo*`·`build*` 등) **최소 1종** 필수. **한계**: 여전히 Zod·mapper **전 필드**·폼↔슬라이스 **완전** 의미 동치는 보장하지 않음 — [MULTI_PERSISTENCE_PATHS.md §6](../../itemwiki-constitution/itemwiki-specific/input-persistence/MULTI_PERSISTENCE_PATHS.md) 표 참고. |
| **플랫 alignment 레거시** | [`check:domain-alignment-flat-allowlist`](../../../scripts/check-domain-alignment-flat-allowlist.ts): `domain/<area>/<file>-alignment.ts` 형태(§4.1 위반)는 **스크립트 내 허용 목록**에만 존재해야 한다. 신규 플랫 파일은 실패. 이행 시 폴더로 옮기고 목록에서 제거. 우회: `DOMAIN_ALIGNMENT_FLAT_ALLOWLIST_SKIP=1`. |
| **레지스트리 ↔ 테스트 파일** | [`check:pipeline-registry-domain-alignment-tests`](../../../scripts/check-pipeline-registry-domain-alignment-tests.ts): [`pipelines.registry.ts`](../../../packages/lib/domain/persistence/pipelines.registry.ts) 앵커로 등장하는 domain `*-alignment.ts`마다 **테스트 파일 1개 존재**만 검사(round-trip **문구**는 전수·PR 게이트가 담당). |
| **필드 필터·다중 persistence 계약** | [FIELD_FILTER_INVENTORY.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/FIELD_FILTER_INVENTORY.md) P0/P1/P2 행과 대응: `check:field-filter-registry-contract`·[`field-filter-contract-registry.ts`](../../../scripts/field-filter-contract-registry.ts)·통합 1건(`check:field-filter-users-me-integration`), `check:input-persistence-p1-preferences-contract`, `check:policy-permitted-reduction-docs`(§6.1 SSOT 문서 교차), 래퍼 `check:field-filter-users-me-contract`·`check:field-filter-tab-preferences-contract`·`check:product-barcode-patch-contract`, [`check-input-persistence-high-risk-multi-contract.ts`](../../../scripts/check-input-persistence-high-risk-multi-contract.ts) 고위험 앵커 파일 목록. |
| **이름에 alignment 포함한 단위 테스트** | [`check:alignment-roundtrip-hint`](../../../scripts/check-alignment-roundtrip-hint.ts): 마커 누락 경로 나열. `check:constitution-pr`는 `--fail`로 **누락 시 exit 1**(로컬에서 인자 없이 실행하면 정보성 exit 0 유지). |
| **Phase E 층별 갭(문서)** | [PHASE_E_COVERAGE.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/PHASE_E_COVERAGE.md) — E0/E1/E2 중 어디까지 채워졌는지 **수동 동기**(CI가 표 전체를 검증하지는 않음). persistence-touch PR은 표 갱신 또는 후속 이슈를 PR 템플릿으로 요구한다. |

[PAGE_FORM_UX_HEURISTICS.md](./PAGE_FORM_UX_HEURISTICS.md)의 D1~D7과 **함께** 쓴다. 전자는 인지·레이아웃, 본 문서는 **데이터 계약**이다.

---

## 8. 관련 문서

- [입력–저장 Itemwiki 인스턴스](../../itemwiki-constitution/itemwiki-specific/input-persistence/README.md) — 매핑 인덱스·SCREEN_MAPPINGS·MULTI·FIELD_FILTER·감사 백로그(IP-1~6 실행 문서)  
- [INPUT_PERSISTENCE_SCHEMA_ALIGNMENT_REMAINING_WORK.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_SCHEMA_ALIGNMENT_REMAINING_WORK.md) — **남은 작업 7개 그룹**(실행·백로그용)  
- [UI_INPUT_RENDER_AUTHORITY.md](./UI_INPUT_RENDER_AUTHORITY.md) — UI Input vs Render 권위 시점(IP-6·SCREEN_MAPPINGS 권위 표와 짝)  
- [PAGE_FORM_UX_HEURISTICS.md](./PAGE_FORM_UX_HEURISTICS.md)  
- [FRONTEND_LAYER_PRINCIPLES.md](./FRONTEND_LAYER_PRINCIPLES.md)  
- [STATE_MANAGEMENT_PRINCIPLES.md](./STATE_MANAGEMENT_PRINCIPLES.md)  
- [STALE_UI_PREVENTION.md](../04-safety-standards/STALE_UI_PREVENTION.md)  
- [CONTRACT_TESTING.md](../05-testing-principles/CONTRACT_TESTING.md)  

---

**최종 업데이트**: 2026-04-14 — 상단 [INPUT_PERSISTENCE_GUARANTEE](../04-safety-standards/INPUT_PERSISTENCE_GUARANTEE.md) 교차 링크; (이전) §7.2: `check:no-json-stringify-ui-wide`·세션 `(?<![.])session.` 검사·`stable-stringify-for-comparison` 유틸.
