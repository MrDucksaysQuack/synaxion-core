# E2E 테스트 권한 및 그룹 (E2E Test Authority & Grouping)

> **Constitution 문서**  
> 테스트 피라미드(TESTING_PYRAMID)가 "단위·통합·E2E 비율"을 정의한다면, 이 문서는 "어떤 E2E를 얼마나 신뢰할지"와 "CI/회귀에서 어떻게 나눠 돌릴지"를 정의합니다.

**작성일**: 2026-02-15  
**목적**: E2E authority(권한 등급)와 테스트 그룹 구조를 명시하여 CI·회귀 제어의 구조적 장점을 문서화

---

## 📋 개요

이 문서는 Constitution이 정의하는 E2E 테스트 체계이다. 프로젝트(예: Itemwiki)는 다음을 적용할 수 있다:

| 개념 | 설명 |
|------|------|
| **Authority** | critical / flow / integration / legacy — "이 테스트 실패 시 머지 가능 여부" |
| **Spec 목록** | `tests/e2e/authority-specs.json` 에서 authority별 스펙 목록 관리 |
| **그룹** | group1(인증·가입) ~ group5(에러·엣지케이스), L1~L6 등 단계별 실행 |
| **Trust 매니페스트** | 테스트별 trust 등급(A/B/C) 및 가정(assumptions) 메타데이터 (선택) |

---

## 1. Authority (권한 등급)

### 1.1 정의

| Authority | 의미 | 실패 시 CI 동작 |
|-----------|------|-----------------|
| **critical** | **제품 계약**이 깨졌을 때 반드시 잡히는 관문(API·저장→GET 수렴·인증·B실패 계약 등). 브라우저 E2E이므로 “절대 deterministic”이 아니라, **타이밍만 깨면 되는 스펙**(순수 셸/hydration·토스트 노출만)은 critical에 두지 않는다. | **머지 불가** (exit 1) |
| **flow** | 탐색·상세 로드·교차 시퀀스 등. **완벽한 `[FAIL][…]`만 허용**이 아니라, Timeout·flaky·Playwright 원시 에러가 **섞일 수 있음**. 다만 **핵심 도메인 경로**(wire·수렴)는 태그로 식별 가능하도록 유지하는 것이 목표. | 경고·요약 후 exit 0 허용 |
| **integration** | API·통합 수준 E2E | flow와 동일 또는 별도 실행 |
| **legacy** | 단계적 제거 대상 | 기본 실행에서 제외 가능 |

### 1.2 Spec 목록

- **파일**: `tests/e2e/authority-specs.json`
- **형식**: `{ "critical": [...], "critical_contract": [...], "critical_experience": [...], "flow": [...], "integration": [...], "legacy": [...] }` — 후자 두 배열은 **critical 내부 분류**용(§1.3.1). CI 머지 게이트는 **`critical` 전체**를 그대로 쓴다.
- **관리**: 새 E2E 스펙 추가 시 적절한 authority에 목록 추가

### 1.3 Critical 관문 (현실 기준)

**정의**: “전수 E2E”도, “100% deterministic”도 아니다. **제품·데이터 계약**과 **인증**을 PR에서 반드시 막을 최소 집합이다. 목록 SSOT는 `authority-specs.json`의 `critical`이며, `scripts/run-by-authority.js`는 `test-trust-manifest.json`의 E2E `critical`과 **합집합**으로 병합한다.

| 관문 | 의도 | 대표 스펙 (`authority-specs.json` critical) |
|------|------|-------------------------|
| **인증·가입** | 로그인·콜백·비인증 계약·가입 완료·프로필 식별자 | `pages/login`, `pages/signup`, `pages/auth-callback`, `flows/authentication`, `errors/authentication`, `flows/signup-full` |
| **핵심 CRUD 진입** | 제품 생성/등록 플로우 진입 | `flows/product-creation` |
| **저장→수렴** | PATCH/저장 후 GET·UI 동치(선호·편집) | `pages/input-persistence-save-reentry`, `pages/product-edit-persistence-roundtrip` |
| **B실패·계약** | 기여 승인·낙관적 투표 등 의도적 실패 계약 | `pages/contribution-approve-b-failure`, `pages/final-3-contribution-vote-optimistic-failure` |

**MULTI B 체감·와이어 플레이크**(`pages/final-3-critical-multi-b-failure`)는 **flow(⚠️)** — 장애 주입·콘솔 WIRE/DATA가 환경·부하에 더 민감해 PR 머지 차단에서 제외한다.

**탐색·셸·제품 상세 로드·탭 순서 UI**(`home`, `search`, `product-detail-*`, `product-lookup`, `product-tab-order-persistence` 등)는 **flow(⚠️)** — 하이드레이션·네트워크·렌더 타이밍에 더 민감하므로 머지 차단에서 제외한다.

**참고**: `test-trust-manifest.json`이 E2E를 critical로 표기해도, `authority-specs.json`의 **`legacy`**에 경로가 있으면 `run-by-authority`는 해당 파일을 **critical·flow 어느 단계에서도 실행하지 않는다**(합집합에서 제외). 예: `tests/e2e/api/reputation-score.spec.ts`, `tests/e2e/api/users-advanced.spec.ts`.

**결제(Order/Payment)**: 현재 제품 범위에 없으면 critical에 넣지 않는다.

### 1.3.1 Critical 내부 계층 (contract vs experience)

**배경**: `critical` 한 덩어리 안에 **정보·수렴·API 계약**을 증명하는 스펙과 **토스트·낙관적 UI·오류 문구 표면**을 증명하는 스펙이 함께 있으면, “critical이 왜 항상 deterministic하지 않은가?”처럼 **서로 다른 실패 역학**이 한 라벨에 묶인다.

**분리(토스트를 제거하지 않고 위치만 고정)**:

| 계층 | `authority-specs.json` | 의미 |
|------|-------------------------|------|
| **contract**(정보·계약) | `critical_contract` | 핵심 단언이 **UI 토스트 없이도 성립** — PATCH/GET 수렴, 리다이렉트, 세션·콜백, 본문 기반 검증 등. |
| **experience**(제품 UX) | `critical_experience` | 핵심 단언이 **표면(토스트·상태 알림·role=alert 등)** 에 묶임 — 타이밍·표현 구현에 더 민감. |

**불변식**: `critical_contract` ∪ `critical_experience` = `critical`(동일 집합). 상세·토스트 헬퍼 매핑: [E2E_CRITICAL_TOAST_DEPENDENCY.md](../../../e2e/E2E_CRITICAL_TOAST_DEPENDENCY.md).

**정보 시스템 “완료” vs 제품 “완료”**: 전자는 [E2E_INFORMATION_UNITS.md](../../../e2e/E2E_INFORMATION_UNITS.md) 축(수렴·권위 GET)에 가깝고, 후자는 UX 표면 검증 — 둘 다 가치가 있으나 **기대치와 트러블슈팅 언어를 섞지 않기 위해** 위 계층으로 라벨한다.

### 1.4 Flow 단계 기대치

- **허용**: 일부 `TimeoutError`, 간헐 실패, Playwright 원시 스택 — “100% 설명 가능”을 요구하지 않는다.
- **목표**: **핵심 로직**(wire·수렴·DATA) 구간은 실패 시 **`[FAIL][WIRE …]` / `[FAIL][CONVERGENCE …]`** 등으로 원인을 좁힐 수 있게 유지한다.
- **실행**: `test:authority:all`의 ② 단계에서 돌며 **실패해도 exit 0**(경고·요약). critical에 없는 나머지 E2E 전부가 여기 포함된다.

### 1.5 성공 토스트 단언 정책

- **원칙**: 저장이 성공해도 토스트는 **필수 UX 신호가 아닐 수 있음** — **권위는 PATCH/응답·GET 수렴·필드 동치**다.
- **권장**: 선호·프로필 저장 계열에서 성공 토스트는 **hard assert 하지 않음**(soft·생략). 구현 예: `pages/input-persistence-save-reentry.spec.ts` — PATCH OK 후 수렴을 단언하고, 토스트는 `try`/`catch`로 보조만 확인.

### 1.6 실행

- **스크립트**: `scripts/run-e2e-by-authority.js`
- **사용**: `pnpm test:e2e:critical` / `pnpm test:e2e:flow` / `pnpm test:e2e:integration`
- **규칙**: critical 실행 시 선행 시드(예: E2E 제품 생성) 시도 후 스펙 실행

**CI(PR)**: `.github/workflows/e2e-pr.yml` → `pnpm run test:authority:all:chromium` → ① critical(🔥) 실패 시 **job 실패** ② flow(⚠️) 실패 시 **요약만, exit 0** ([TEST_AUTHORITY_PLAN.md](../../../testing/TEST_AUTHORITY_PLAN.md) 동일 정책).

---

## 2. 테스트 그룹 (group1 ~ group5)

E2E 스펙을 **도메인·플로우별**로 묶어 단계적(staged) 실행할 수 있습니다.

| 그룹 | 대표 내용 | 예시 스크립트 |
|------|-----------|----------------|
| **group1** | 인증·가입·온보딩 | test:e2e:group1, test:e2e:group1:L1~L5 |
| **group2** | 제품·검색·생성·편집·이미지 | test:e2e:group2, test:e2e:group2:L1~L6 |
| **group3** | 기여·투표·승인·미션 | test:e2e:group3, test:e2e:group3:L1~L5 |
| **group4** | 프로필·스캔이력·선호도·랭킹 | test:e2e:group4 |
| **group5** | 관리자·에러·엣지케이스·모바일 | test:e2e:group5 |

**목적**: 전체 E2E를 한 번에 돌리지 않고, 변경 영향 범위에 맞는 그룹만 선택 실행하여 피드백 속도 확보.

---

## 3. Trust·Authority 매니페스트 (선택)

- **검증**: `pnpm test:trust:validate` — 테스트 trust 매니페스트 유효성
- **가정 추출**: `pnpm test:trust:extract-flow-assumptions` — 플로우 가정 추출
- **의미**: "이 테스트가 어떤 가정에 의존하는지", "신뢰 등급(A/B/C)"을 메타데이터로 관리

**규칙**: 새 E2E 스펙은 가능하면 해당 authority·그룹·trust에 반영한다.

---

## 4. CI에서의 사용

- **critical 먼저**: `test:authority:critical` — 실패 시 즉시 실패 처리
- **flow 이어서**: `test:authority:flow` — 실패 시 요약만 출력하고 exit 0 허용 가능
- **전체**: `test:authority:all` — critical → flow 순으로 실행, critical 실패 시 exit 1

---

## 체크리스트

새 E2E 스펙 추가 시:

- [ ] `authority-specs.json`의 적절한 authority 배열에 파일 경로를 추가했는가?
- [ ] **critical vs flow**: 셸·hydration·토스트 타이밍만이 본질인 스펙을 critical에 넣지 않았는가? ([§1.3](#13-critical-관문-현실-기준))
- [ ] 저장·선호 스펙에서 **성공 토스트를 유일/핵심 단언**으로 두지 않았는가? ([§1.5](#15-성공-토스트-단언-정책))
- [ ] 필요 시 group1~group5 중 해당하는 npm 스크립트에 스펙을 포함했는가?
- [ ] trust/authority 매니페스트를 사용하는 경우 해당 메타데이터를 갱신했는가?

---

**관련 문서**: [TESTING_PYRAMID.md](./TESTING_PYRAMID.md), [E2E_CRITICAL_FLOWS.md](./E2E_CRITICAL_FLOWS.md)

**최종 업데이트**: 2026-04-11
