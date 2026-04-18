# UI Input vs UI Render (표시 권위 시점)

**목적**: 폼 state·로컬 드래프트·낙관적 UI가 있을 때 **어느 시점의 값이 화면에 “맞다”고 간주되는지**(서버 스냅샷 vs 로컬 입력)를 팀이 동일한 언어로 말하게 한다.  
**정렬**: [INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md](./INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md) 1절 SSOT·Phase C 계층과 한 세트다.  
**화면별 한 줄**: [INPUT_PERSISTENCE_SCREEN_MAPPINGS.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_SCREEN_MAPPINGS.md)의 **권위 요약** 표(내 프로필·헤더 읽기 경로는 §3C).  
**진입점 색인**: [SAVE_MUTATION_AUTHORITY_INDEX.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/SAVE_MUTATION_AUTHORITY_INDEX.md) (`useOptimistic` 전수·FormData 인벤토리).  
**IP-1 Lean + 단순 저장(IP-6)**: SCREEN_MAPPINGS 권위 표 **풀 중복** 없이 SAVE 인덱스에만 Post-save 한 줄을 둘 수 있다 — [SAVE_MUTATION_AUTHORITY_INDEX § Tier Lean](../../itemwiki-constitution/itemwiki-specific/input-persistence/SAVE_MUTATION_AUTHORITY_INDEX.md#tier-lean-ip-6-중복-완화-screen_mappings와의-역할-분담).

---

## 1. 용어 (코드베이스 대응)

| 말하기 | 의미 | 타입·모듈 힌트 |
|--------|------|----------------|
| **UI Input** | 사용자가 바꾼 값, 아직 서버에 확정되지 않은 쓰기 의도 | 폼 state, `ProfilePatchInput` 방향 payload, 로컬 스토리지 드래프트, 낙관적 pending |
| **UI Render** | 사용자에게 보이는 “현재값” | [profile-render-model.ts](../../../packages/lib/domain/user/profile-render-model.ts)의 `ProfileRenderModel` 등 표시 투영; **저장 직후에는 보통 서버가 권위** |

대부분 화면은 **폼 state = 표시 state**로 충분하다. **드래프트**나 **낙관적 UI**가 생기는 순간부터는 아래를 명시한다.

**Phase C( Retrieve )와 구분**: GET/cached wire의 좁은 슬라이스(예: `trust_level`) 검증은 “깨진 응답을 UI 깊숙이 보내지 않기”용이며, **mutation 직후 누가 진실인지**(refetch·invalidate·응답 본문·롤백)는 아래 §2·SCREEN_MAPPINGS 권위 표와 별개로 유지한다.

### 1.1 한 절(§N) = 두 층 체크리스트 (Retrieve + Post-save)

화면마다 [INPUT_PERSISTENCE_SCREEN_MAPPINGS.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_SCREEN_MAPPINGS.md) **동일 §** 아래에서 아래 두 축을 함께 맞춘다. 한 테스트로 합치기보다 **같은 절에서 서로를 가리키게** 두는 것이 유지비에 유리하다.

| 층 | 목적 | 실무 앵커 |
|----|------|-----------|
| **Retrieve (Phase C)** | GET·캐시 wire가 UI에 들어가기 전 **형태·필드**가 허용 범위인지 | 절별 **역방향** 줄, `parse*` 슬라이스, `FooContract`·`retrieveSliceParser`, round-trip·슬라이스 단위 테스트 |
| **Post-save UI Render (IP-6)** | mutation 성공 직후 사용자에게 보이는 값이 **서버 진실**과 맞는지 | **권위 요약** 표 4칸, §2 패턴(refetch·응답 본문·`setData` 등), 저장/낙관 훅 **§2.1 코드 주석** |

§5.1 실행 시 “새 문단을 쓰는” 대신, 위 표에 따라 **기존 Contract·테스트·주석을 식별해 PR 한 줄 또는 SCREEN_MAPPINGS 한 줄로 인덱싱**하면 된다.

---

## 2. 저장 성공 직후 (권위)

가능한 패턴 예시 (화면마다 하나를 택해 [SCREEN_MAPPINGS](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_SCREEN_MAPPINGS.md)에 적는다).

| 패턴 | 설명 |
|------|------|
| **refetch / invalidate + GET** | 프로필·설정류: `refetch()`, `cacheInvalidator`, `loadPreferences` 등으로 **서버 스냅샷**을 다시 읽어 폼·표시에 반영 |
| **mutation 응답 본문** | 제품 편집 등: PATCH 응답의 `product`로 폼 문자열 재동기화 (`useProductEdit` `onSuccess`) |
| **낙관 성공 → 응답으로 교체** | `useOptimistic` / `useOptimisticUpdate`: 성공 시 **`setData(serverResult)`** 필수 ([OPTIMISTIC_UPDATE_SAFETY_GUIDE.md](../../analysis/OPTIMISTIC_UPDATE_SAFETY_GUIDE.md) §2.1) |
| **이탈·목록 갱신** | 기여 승인/거부 후 `goBack()` — 상세 화면은 떠나고, 목록은 별도 무효화로 다음 진입 시 권위 맞춤 |

### 2.1 코드 앵커 주석 (복붙 템플릿)

저장 핸들러·`useSaveOperation` `saveFn`·낙관 훅 설정 **직상단**에 한 줄을 둔다. SCREEN_MAPPINGS 절 번호는 실제 §로 바꾼다.

```ts
/** Post-save UI Render authority: <한 문장: refetch | invalidate+GET | mutation 응답 필드 | goBack+재진입> (SCREEN_MAPPINGS §N). */
```

낙관 전용 예:

```ts
/** Post-save UI Render authority: useOptimistic 성공 시 setData(serverResult); 추가 refetch는 <없음|경로> (SCREEN_MAPPINGS §6E). */
```

---

## 3. 저장(또는 mutation) 실패 시

| 패턴 | 적합한 경우 |
|------|-------------|
| **refetchOnError** | 같은 리소스에 **연타·동시 요청**이 있을 수 있는 액션(좋아요 등). 에러 시 서버 기준으로 덮어써 롤백이 최신 성공을 덮어쓰지 않게 함 |
| **이전 스냅샷 롤백** | 단일 요청 위주, `useOptimistic` 기본 경로 |
| **드래프트만 유지** | 제출 실패 시 폼·로컬 드래프트는 그대로 두고 서버 반영만 안 된 상태로 안내 |

상세·예외: [OPTIMISTIC_UPDATE_SAFETY_GUIDE.md](../../analysis/OPTIMISTIC_UPDATE_SAFETY_GUIDE.md) §2.2~2.3.

---

## 4. Stale UI·점검 스크립트

mutation 후 refetch·invalidate 누락은 [STALE_UI_PREVENTION.md](../04-safety-standards/STALE_UI_PREVENTION.md)와 `scripts/check-stale-ui-risks.ts`와 함께 본다. **E2E 성공 토스트 문구**: `pnpm run check:e2e-success-toast-allowlist` — `tests/e2e/**/*.spec.ts` 의 `expectSuccessToast(..., '…')` 문자열이 `scripts/e2e-success-toast-messages.allowlist.json` 과 **쌍을 이루는지** 고정(문구 변경 시 스펙·allowlist 동시 갱신).

**SAVE 인덱스 풀 경로**: `pnpm run check:save-mutation-authority-index-paths` — [SAVE_MUTATION_AUTHORITY_INDEX.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/SAVE_MUTATION_AUTHORITY_INDEX.md) 표에 백틱으로 적힌 `components/`·`packages/` 경로가 레포에 존재하는지 고정(`check:constitution-pr`·`check:input-persistence-contract-gates`·`check:g8-cross-cutting`).

**IP-6 앵커**(`Post-save UI Render authority` / `Post-save UI Render:` / `SCREEN_MAPPINGS §`)는 `scripts/check-optimistic-authority-hint.ts`가 `components/**`·`packages/web/**`에서 아래 **신호**가 있으면 파일 **상단 45줄**에 요구한다: `useOptimistic<`, `useSaveOperation(`, `useFlowAwareDraft(`, `useSignupDraft(`, `deleteDraft(`, `useProductEdit(` / `useProductEditPage(`, 및 로컬스토리지 드래프트 키 패턴(`settings_draft`·`product-form-`·`brand_info_draft` 등 — `check-input-persistence-pr-hint`의 `COMPONENT_IP6_SIGNALS`와 정합; `data-testid`와 겹치는 `product-edit-` 문자열은 제외). 훅 **정의 파일**·`draft-storage`·`flow/examples` 등은 제외. **PR·`check:constitution-pr`**: `pnpm run check:optimistic-authority-hint -- --fail`(누락 시 exit 1). 로컬 정보만: 인자 없이 실행(exit 0). 우회: `OPTIMISTIC_AUTHORITY_HINT_SKIP=1`(드물게 일회).

**저장 직후 state 동기화(단위)**: 공통 `useOptimistic`·`useSaveOperation`과 고위험 진입 `useProductEdit`·`useContributionReview`는 `tests/unit/web/hooks/useOptimistic-post-save-sync.test.tsx`·`useSaveOperation-post-save-sync.test.tsx`·`useProductEdit-post-save-sync.test.tsx`·`useContributionReview-post-save.test.tsx`로 성공 경로를 봉인한다. 동일 패턴의 신규 훅은 여기에 케이스를 추가하거나 인접 파일을 둔다.

---

## 5. PR·리뷰

[INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md](./INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md) **IP-6**: 낙관·드래프트가 있으면 권위 시점·실패 시 정책을 PR 본문 또는 SCREEN_MAPPINGS 갱신으로 남긴다.

### 5.1 IP-6 실행 루틴 (신규 PR·운영)

| 단계 | 내용 |
|------|------|
| 1 | 해당 화면이 [INPUT_PERSISTENCE_SCREEN_MAPPINGS.md](../../itemwiki-constitution/itemwiki-specific/input-persistence/INPUT_PERSISTENCE_SCREEN_MAPPINGS.md) **어느 절(§N)** 에 해당하는지 식별한다. |
| 2 | 그 절의 **권위 요약** 표 4칸(표시 권위·낙관·실패 시·드래프트)을 코드와 맞춘다. 없으면 **한 표 추가**한다. |
| 3 | PR 본문 한 줄 **또는** 저장/낙관 진입점 **§2.1 코드 주석**으로 남긴다: 예) `IP-6: §6E — 저장 직후 refetchOnError=true, Render=서버 목록` |
| 4 | 신규 **관리자 쓰기**면 §12B(또는 별도 admin 문서)에 **행 추가**; 조회만이면 §12A 또는 **12A 보강** 표에 넣는다. |

[PR 템플릿](../../../.github/pull_request_template.md) 입력–저장 정렬 체크리스트 **IP-6** 체크박스와 동일하다.

---

**최종 업데이트**: 2026-03-23 — §4 post-save 단위 테스트 경로; §4 확장 신호·훅 정의 제외·`product-edit-` testid 충돌 회피; §5.1 제목(신규 PR·운영)
