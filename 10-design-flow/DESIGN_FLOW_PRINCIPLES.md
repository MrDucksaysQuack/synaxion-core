# 디자인·플로우 원칙 (Design & Flow Principles)

**목적**: 인지과학 기반으로 페이지·플로우 구조를 일관되게 설계하여, 예측 가능한 UX와 AI/팀 협업을 가능하게 합니다.

**핵심 원칙**: *"인지과학 기반 UI 규칙을 시스템적으로 문서화해 고정한다."*

---

## 1. 한 페이지 = 한 목적 (One Page, One Purpose)

- **페이지는 단 하나의 목적만** 가져야 한다. 검색·상세·생성·편집·설정·분석 등은 목적별로 분리한다.
- **금지**: 한 페이지에 검색+수정+기여+통계를 모두 포함, 상세 페이지에서 직접 편집(별도 편집 페이지로 분리), 목록 페이지에서 상세 정보 표시(상세 페이지로 이동).
- 새 페이지 설계 시: (1) 단일 목적 정의 (2) 다른 목적 기능 혼합 여부 확인 (3) 혼합 시 별도 페이지로 분리.

---

## 2. 3-Depth Rule (최대 3단계 깊이)

- **네비게이션 깊이는 최대 3단계.** 인간이 자연스럽게 탐색 가능한 한계를 넘지 않는다.
- 예: L1 `/search`, L2 `/resources/[id]`, L3 `/resources/[id]/activities`. L4는 모달·쿼리 파라미터·또는 독립 경로로 재구성.
- 새 라우트 설계 시: 현재 깊이 계산 → 3단계 초과 시 재구성.
- **검증**: 저장소 루트에서 `pnpm run check:design-route-depth` (라우트 그룹 `(…)` 폴더는 URL 깊이에서 제외). 상세·예외는 §11.

---

## 3. 페이지 유형별 폴더 분리

- 페이지 유형(목록/상세/생성/편집/분석/설정)을 **폴더 단위로 구분**하여 일관된 구조를 유지한다.
- 목록: 복수형 또는 `-list`. 상세: 단수형 또는 `[id]`. 생성: `new`/`create`. 편집: `[id]`/`edit`. 분석: `analysis`/`analytics`. 설정: `settings`/`preferences`.
- 혼합 유형 폴더명(예: create-edit)은 금지.

---

## 4. 출발점 → 행동 → 결과 (Start → View → Act → Confirm → Done)

- 사용자 플로우는 **Start → View → Act → Confirm → Done** 순서를 따른다.
- Start: 시작 페이지. View: 정보 확인. Act: 행동(입력·수정). Confirm: 확인 단계. Done: 완료 표시.
- 단계 건너뛰기(예: Start → Done) 금지. 새 기능 설계 시 5단계로 분해 후 각 단계에 해당하는 페이지/컴포넌트 배치.

---

## 5. 목적 기반 네비게이션 (Purpose-Driven, Not Feature-Driven)

- 네비게이션은 **"기능이 어디 있는가"**가 아니라 **"사용자가 무엇을 하려는가"** 기준으로 설계한다.
- 예: "리소스 관리" 대신 "리소스 찾기", "데이터 입력" 대신 "정보 추가하기", "설정 변경" 대신 "설정 수정하기".
- 메뉴 구성 시 사용자 목적을 먼저 정의하고, 기능 단위로만 쪼개지 않는다.

---

## 6. 맥락 전이 비용 0 (Zero Cognitive Context Transfer Cost)

- 페이지 이동 시 **문맥이 이어져야** 한다. 동일 기능군은 **동일 위치**에 버튼을 두고, 생성→상세→목록 흐름을 일관되게 유지한다.
- 규칙: (1) 동일 유형 페이지에서 버튼 위치 일관(예: 상세 페이지 "뒤로 가기" 왼쪽 상단, 편집 "저장" 하단 오른쪽, 목록 "새로 만들기" 상단 오른쪽) (2) "뒤로가기"는 이전 단계 목적 유지.

---

## 7. 6하 원칙 기반 페이지 구성 (What, Why, Who, Where, How, When)

- 모든 페이지는 **What(지금 보는 것), Why(왜 중요한가), Who(관련 엔티티), Where(맥락·Breadcrumb), How(할 수 있는 행동), When(시간 정보)** 순서로 정보를 배치한다.
- 페이지 생성 시 6요소를 순서대로 채우고, 누락 요소가 없는지 확인한다.

---

## 8. 입구(Entry)와 출구(Exit) 필수

- **모든 페이지는 입구(Entry)와 출구(Exit)가 명확**해야 한다. Entry: 페이지가 왜 열렸는지, 사용자가 어디서 왔는지. Exit: 닫을 때 어디로 가는지, 어떤 변화가 있는지.
- Exit가 없는 "막힌 페이지"는 금지. 페이지 설계 시 Entry State와 Exit Path를 최소 1개 이상 정의한다.

---

## 9. Atomic → Composite → Page 계층

- 컴포넌트는 **Atoms → Molecules → Organisms → Pages → Flows** 계층을 따른다. Atom(버튼, 입력, 아이콘) → Molecule(카드, 검색바) → Organism(상세 박스, 폼) → Page → Flow(여러 페이지 연결).
- **금지**: Page 안에 Page, Organism 안에 Page, Atom 안에 Molecule(역방향). 컴포넌트 생성 시 계층을 먼저 결정하고 상위에 하위만 포함한다.

---

## 10. 모든 페이지는 세 가지 질문에 답한다

- 각 페이지는 다음 세 질문에 **반드시 답**해야 한다.
  1. **사용자는 여기서 무엇을 알고 싶은가?** (정보 목적)
  2. **무엇을 할 수 있어야 하는가?** (액션 목적)
  3. **어떤 상태가 "완성된" 상태인가?** (완료 기준)
- 답이 불명확하면 페이지 목적을 재정의하고, 답을 기반으로 구조를 설계한다.

---

## 11. 개선 로드맵 (적용·검토)

- **핵심 플로우·허브·Entry/Exit**: [CORE_USER_FLOWS.md](../../flow/CORE_USER_FLOWS.md) — Public / User / Action / System 허브, 검색→제품→기여 등 **의미 있는 흐름만** Mermaid로 고정. 핵심 5화면(`/search`, `/products/[barcode]`, `/profile`, `/preferences`, `/my-contributions`) Entry/Exit 설계 기준.
- **코드·라우트 연동**: 핵심 `page.tsx` 상단 `@flow` / `@entry` / `@exit`; `packages/lib/utils/navigation/flow-map.ts` (`USER_FLOW_DEFINITIONS`); `routes.ts` `ROUTE_FLOW`(플로우 한 줄, `flow-map`과 문장 동기화). PR 템플릿 “핵심 사용자 플로우” 체크로 문서 드리프트 방지.
- **자동 검증**: `pnpm run check:flow-docs` — `pnpm run constitution:check`·`check:constitution-pr`·`check:all`에 포함. Flow Coverage·`ROUTE_FLOW`·`CORE_USER_FLOWS.md` 의 `flow-map-ids` 주석과 코드 불일치 시 exit 1.
- **전 페이지 JSDoc**: `pnpm run check:page-design-flow-jsdoc` — `app/**/page.tsx`에 `@flow`·`@entry`·`@exit`·`@purpose`·`@stage`(제외 목록은 `scripts/design-flow-page-scope.ts`). **공개·main What/Why**: `pnpm run check:page-metadata-public-main`. 둘 다 `constitution:check`·`check:constitution-pr`·`check:all`에 포함.
- **3-Depth 자동 검증**: `pnpm run check:design-route-depth` — `app` 이하 `page.tsx`·`page.ts`를 스캔해, 라우트 그룹 `(segment)`를 제외한 URL 경로 깊이가 3을 넘으면 실패(exit 1). 예외는 스크립트 내 `ALLOWLIST_PREFIXES`(app 기준 posix prefix)에만 추가. **로컬 최소**: `constitution:check`에 포함됨. **CI/PR**: `check:all` 및 `check:constitution-pr`에 포함됨.
- **3-Depth 적용**: 4단계 이상 경로는 리다이렉트 + 쿼리/단일 경로로 재구성.  
  - 예: `/preferences/sets/[id]/edit` → 리다이렉트 `/preferences`.  
  - 예: `/products/[barcode]/update-mission/[missionId]` → 리다이렉트 `/products/update-mission-execute?barcode=&missionId=`.  
- **목적 기반 네비**: 사이드바·메뉴 라벨을 "기능" 대신 "사용자 목적" 문구로 점진 전환 검토. **메뉴별 의도(왜 누르는지)**는 코드 단일 소스 `packages/lib/utils/navigation/console-nav-intent.ts`에서 정의·UI에 노출한다.
- **Start→Done 플로우**: 주요 플로우(제품 등록, 설정 변경 등) 5단계 매핑 및 Entry/Exit 명시 검토. **Flow Map(목표별 URL 연결)**은 `packages/lib/utils/navigation/flow-map.ts`의 `USER_FLOW_DEFINITIONS`에 선언한다 (`routes.ts`와 병행).
- **6하·세 질문**: 신규 페이지 설계 시 체크리스트(What/Why/Who/Where/How/When, 세 질문) 적용 권장. → [Itemwiki 신규 페이지 설계 체크리스트](../../itemwiki-constitution/itemwiki-specific/design-flow/NEW_PAGE_DESIGN_CHECKLIST.md)

---

## 🔗 관련 문서

- [CORE_USER_FLOWS.md](../../flow/CORE_USER_FLOWS.md) — 허브·Flow Map·핵심 화면 Entry/Exit (문서)
- 코드: `packages/lib/utils/navigation/flow-map.ts` (`USER_FLOW_DEFINITIONS`), `console-nav-intent.ts` (콘솔 메뉴 의도)
- [EXPECTATION_MODEL_RULES.md](./EXPECTATION_MODEL_RULES.md) — 기대 모델·근거 표시
- [07-frontend-ui/FRONTEND_LAYER_PRINCIPLES.md](../07-frontend-ui/FRONTEND_LAYER_PRINCIPLES.md) — 계층·데이터 흐름
- [07-frontend-ui/IA_NAVIGATION_PRINCIPLES.md](../07-frontend-ui/IA_NAVIGATION_PRINCIPLES.md) — IA·네비게이션

---

**최종 업데이트**: 2026-03
