# 프론트엔드·UI (Frontend & UI)

> **범용 원칙**: 어떤 프로젝트에나 적용 가능한 프론트엔드·UI 원칙을 정의합니다.  
> **상세 UI 구성·패턴·컴포넌트 규칙**은 프로젝트 인스턴스(예: `docs/<project>-constitution/` 내 ui-ux)에서 정의합니다.

---

## 📋 이 섹션에서 다루는 것

| 문서 | 역할 |
|------|------|
| [FRONTEND_LAYER_PRINCIPLES.md](./FRONTEND_LAYER_PRINCIPLES.md) | 프론트엔드 계층 역할, 페이지·데이터 흐름 원칙 |
| [STATE_MANAGEMENT_PRINCIPLES.md](./STATE_MANAGEMENT_PRINCIPLES.md) | 훅 vs 직접 vs 전역, Stale UI 방지, **`useAsyncState` deps(§2)** |
| *(01과 짝)* [STATE_TRANSITION_CONTRACT.md](../01-foundations/STATE_TRANSITION_CONTRACT.md) | 로딩 수렴·전이 가시성·이벤트/상태 분리 **불변식**(훅 이름 없음) |
| [UX_FEEDBACK_AND_ACCESSIBILITY.md](./UX_FEEDBACK_AND_ACCESSIBILITY.md) | 피드백(로딩·에러·결과), 접근성 기본 원칙 |
| [DATA_FETCH_INITIATION.md](./DATA_FETCH_INITIATION.md) | 데이터 조회 시점: 접근 행동(클릭)에서 fetch, 모달/탭 진입 |
| [IA_NAVIGATION_PRINCIPLES.md](./IA_NAVIGATION_PRINCIPLES.md) | 정보 구조·네비게이션: 3-Depth, Hick's Law(카테고리 3~7개) |
| [PAGE_FORM_UX_HEURISTICS.md](./PAGE_FORM_UX_HEURISTICS.md) | **Tier 2**: 설정·긴 폼 화면 공통 UX 검증(결정 밀도·목적 분리·위계·카피 등 7축 + 체크리스트) |
| [INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md](./INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md) | **필수**: SSOT, mapper 필수(신규/수정), 다중 persistence 부분 실패 정책, allowlist 공유, Round-trip·PR IP-1~6 |
| *(04와 짝)* [INPUT_PERSISTENCE_GUARANTEE.md](../04-safety-standards/INPUT_PERSISTENCE_GUARANTEE.md) | 입력–저장 **보증**(단일 Save 권위·렌더=저장 결과·정렬·다중 단계) — 원칙만 |
| [UI_INPUT_RENDER_AUTHORITY.md](./UI_INPUT_RENDER_AUTHORITY.md) | 낙관·드래프트 시 **표시 권위**·실패 시 refetch/롤백 — [SCREEN_MAPPINGS](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_SCREEN_MAPPINGS.md) 권위 표와 짝(IP-6) |
| [입력–저장 Itemwiki 인스턴스](../../itemwiki-constitution/itemwiki-specific/input-persistence/README.md) | 매핑 인덱스·화면별 표·다중 persistence·필드 필터 인벤토리·감사 백로그·남은 작업(실행 백로그) — [INPUT_PERSISTENCE_SCHEMA_ALIGNMENT](./INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md) 원칙과 짝 |
| [OBSERVABILITY_AND_PAGE_STATE.md](./OBSERVABILITY_AND_PAGE_STATE.md) | **Tier 2**: 아웃바운드 호출 operation ID 의무, 관측성 스키마·콘솔 페이지 상태 계약 |

---

## 🧩 코어 vs 인스턴스

| 구분 | 위치 | 내용 |
|------|------|------|
| **코어 (Constitution)** | 이 폴더 `07-frontend-ui/` | 계층 역할, 한 페이지 한 목적, 데이터 흐름 방향, 상태·피드백·접근성 **범용 원칙** |
| **안전 (Constitution)** | [04-safety-standards/](../04-safety-standards/UX_SAFETY_RULES.md) | 네트워크 타임아웃, 로딩 고정 방지, fetch 사용 규칙 |
| **인스턴스 (프로젝트별)** | `docs/<project>-constitution/` 내 ui-ux | 레이아웃(F/Z 패턴), 버튼 체계, 구체적 UI 패턴, 페이지 설계 12기준, 상태 훅 이름 등 |

**예: Itemwiki**  
- UI 헌법·페이지 헌법·데이터 흐름 가이드·상태 관리 헌법: [docs/itemwiki-constitution/itemwiki-specific/ui-ux/](../../itemwiki-constitution/itemwiki-specific/ui-ux/), [state-management/](../../itemwiki-constitution/itemwiki-specific/state-management/)  
- 적용 가이드: [docs/guides/UI_PATTERN_APPLICATION.md](../../guides/UI_PATTERN_APPLICATION.md)

---

## 🔗 관련 Constitution 문서

- [LAYER_BOUNDARIES.md](../01-foundations/LAYER_BOUNDARIES.md) — Frontend Layer 정의 및 의존성 방향  
- [10-design-flow/](../10-design-flow/README.md) — 디자인·플로우 (한 페이지 한 목적, 입구/출구, 기대 모델)  
- [UX_SAFETY_RULES.md](../04-safety-standards/UX_SAFETY_RULES.md) — 네트워크·로딩 안전 (타임아웃, finally)  
- [CONCEPTUAL_ROT_PREVENTION.md](../04-safety-standards/CONCEPTUAL_ROT_PREVENTION.md) — 인증·권한은 훅/정책만 사용  
- [CONTRACT_TESTING.md](../05-testing-principles/CONTRACT_TESTING.md) — API·클라이언트 계약 검증  
- [NETWORK_RESILIENCE_PRINCIPLES.md](../03-api-standards/NETWORK_RESILIENCE_PRINCIPLES.md) — 타임아웃·재시도·멱등·에러 구조화(구현 이름 없음)  

---

## Itemwiki 점검 요약 (검토일: 2026-03)

### Frontend → Domain 직접 사용

- **정책**: [LAYER_BOUNDARIES.md](../01-foundations/LAYER_BOUNDARIES.md) § Frontend Layer에 **"Domain Layer는 클라이언트 사이드에서만 직접 접근 가능 (선택적)"**, **"✅ 허용 (선택적): Domain Layer 직접 사용"** 명시.
- **결론**: 선택적 허용으로 프로젝트 정책이 정의되어 있으며, 현재 Frontend의 Domain 직접 사용은 해당 정책과 일치함. Engine 직접 의존만 금지.

### DATA_FETCH_INITIATION (접근 행동에서 fetch)

- **적용됨**: `openRequestId` 패턴으로 "열기 버튼 클릭 → fetch → 모달 open"을 구현한 모달 3개.
  - `IngredientDetailModal`: 부모 `ToxicityScoreDisplay`가 `detailOpenRequestId` 전달·클릭 시 증가.
  - `IngredientHistoryModal`: 부모 `IngredientRiskTab`이 `historyOpenRequestId` 전달·클릭 시 증가.
  - `FeatureSelectionModal`: 부모 `ProductDetail`이 `featureOpenRequestId` 전달·클릭 시 증가.
- **강화 (코드)**: 위 세 모달의 `openRequestId`는 **필수 prop**으로 정리하여, `isOpen`만으로 선조회하는 폴백을 제거함.
- **정렬 기준**: `Modal`/`PhotoReuploadModal` 등은 `isOpen === false`일 때 **자식을 마운트하지 않으면**, 열기 행동 직후 첫 마운트에서 fetch가 일어나므로 접근 행동과 인과가 맞음. API만 쓰는 모달(예: `RecommendationExplanationModal`)은 props 기반이면 별도 fetch 없음.
- **추가 패턴 도입 시**: 동일 뷰에 `isOpen`만으로 자식이 항상 마운트되는 경우에 한해 `openRequestId` 등으로 클릭 시점에 조회를 묶을 것.

### OBSERVABILITY (operationId · Tier 2)

- **적용 현황**:
  - `packages/lib/api` 전반: `retryFetch(..., { operation: NetworkOperations.* })` 사용 (products, contributions, comments, preference-sets, users, features, images 등). 클라이언트가 이 API 함수들을 호출하면 operationId가 전달됨.
  - 컴포넌트·훅: `callAPIByOperation`, `callAPI(..., { operation })` 사용처 다수 (AccountDeleteButton, ProfileSettings, RecommendationCard, IngredientCorrectionModal, LearningLoopFeedback 등).
  - 권한·캐시·재시도: `permission-matrix`, `caching-policy-registry`, `retry-policy-registry`가 operationId 기준으로 동작.
- **2026-03 후속**: `callAPI` / `callAPIWithJSON` / `callAPIWithFormData`의 `operation`은 **타입상 필수**이며, 누락된 엔드포인트는 `network-operations.ts`에 ID를 추가해 매핑함. `NetworkOperationId`는 연산 수 증가에 따른 TS 한도를 피하도록 **2단계 그룹에서 leaf만 추출**하는 방식으로 정의됨.

### 페이지 상태 계약 (`PageLoadingWrapper`)

- **보강 (코드·문서)**: `PageLoadingWrapper` 사용처 전반에 **`screen`** 식별자를 부여(콘솔·공개 홈/검색/인증/프로필 등)해 사용자 뷰 로깅을 경로와 분리함. 상세는 [OBSERVABILITY_AND_PAGE_STATE.md §2.4](./OBSERVABILITY_AND_PAGE_STATE.md#24-화면-식별자-screen-권장).

- **보강 (코드)**: 콘솔 `products/update-missions`의 `UpdateMissionsPageContent`에 `PageLoadingWrapper` + `LoadingState`(`wrapperState`) 매핑을 적용해, 인증·Flow·목록 로딩·빈 목록·에러를 동일 계약으로 표시함.
- **보강 (코드)**: `contributions/[id]/review`의 `ContributionReviewPageContent`에 동일 계약 적용. 에러 시 `ErrorMessage` 가이드·이중 액션(뒤로/재시도)은 `PageLoadingWrapper`의 `errorGuide` / `errorAction` / `errorSecondaryAction`으로 전달.
- **보강 (코드)**: `PageLoadingWrapper`가 에러 분기에서 선택적 `errorGuide`·`errorType`·주/보조 액션을 지원해 Flow 실패 시 단계 안내를 유지함.
- **보강 (코드)**: `profile/corrections`, `preferences/recommendation-history`, `preferences/ocr-features` 콘솔 페이지에 동일 계약 적용(로딩·에러·재시도·`screen` 로깅). 추천/OCR 페이지는 빈 목록·통계는 `ready` 하위 UI로 유지.
- **보강 (코드)**: `preferences/recommendations`, `preferences/history`는 `FeatureRecommendations` / `FeatureHistoryChart`에 `pageLoadingSurface`·`onFetchUiChange`·`reloadSignal`을 두어 부모 `PageLoadingWrapper`와 연동(에러 시 재시도로 `reloadSignal` 증가).

### 접근성·랜드마크 (기본)

- 루트 `app/layout.tsx`: 단일 `main#main-content` (스킵 링크 목표).
- `PageLayout`: 루트 `main`과 **중복 ID 방지**를 위해 본문 래퍼는 `role="region"` + `aria-label="페이지 본문"`.
- `Header`: `role="banner"` + `aria-label`. `MobileBottomNav`: `aria-label="콘솔 하단 주요 메뉴"`.

---

### 페이지·폼 UX 검증 (표준화)

- **문서**: [PAGE_FORM_UX_HEURISTICS.md](./PAGE_FORM_UX_HEURISTICS.md) — 취약 사용자군 설정 분석에서 일반화한 **D1~D7** 축과 PR용 체크리스트. IA·Design Flow·UX Feedback과 정렬.
- **용도**: `/preferences`, 프로필 설정, 온보딩 등 “결정이 많은 화면”을 페이지마다 같은 잣대로 평가할 때 사용.

---

**최종 업데이트**: 2026-03-22 — STATE_MANAGEMENT §2·README 표 갱신
