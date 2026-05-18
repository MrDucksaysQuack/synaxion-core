# 목록 길이 처리 전략 — 페이지네이션 vs 무한 스크롤

**목적**: 같은 코드베이스 안에서 어떤 목록은 `pagination`, 어떤 목록은 `loadMore`/무한 스크롤로 구현되는 **정책 부재**를 없애고, [단일 목적 원칙](./FRONTEND_LAYER_PRINCIPLES.md)(한 페이지·한 목적)과 정렬된 **일관된 선택 규칙**을 둔다.

**티어**: **Tier 2** — 신규·개편 시 준수 권장. 기존 불일치는 배포 블로킹 아님, 점진 정렬.

**프로젝트 인스턴스**: Itemwiki UI 헌법 §3.5(리스트/피드)와 함께 읽는다 — [`docs/itemwiki-constitution/itemwiki-specific/ui-ux/UI_CONSTITUTION.md`](../../itemwiki-constitution/itemwiki-specific/ui-ux/UI_CONSTITUTION.md).

---

## 1. 결정 축: 목록의 목적(사용자 과업)

헌법 §2 단일 목적과 맞추려면 **컴포넌트 이름·라우트가 아니라 “사용자가 그 목록으로 무엇을 하려는가”**로 고른다.

| 목록 유형 | 정의 | 권장 패턴 | 이유(익숙한 레퍼런스) |
|-----------|------|-----------|------------------------|
| **탐색형 (exploration)** | 결과 집합 안에서 **항목을 고르고**, 링크 공유·재방문 시 **같은 위치**를 기대 | **페이지네이션** (페이지 번호 또는 이전/다음 + 고정 `offset`/`page`) | 검색·카탈로그는 **결과의 위치**가 중요 (예: 상위 검색 결과의 Amazon식 페이지 나열) |
| **소비형 (consumption)** | **시간순 흐름**을 읽고, “몇 페이지째”보다 **최신 연속 스트림**이 중요 | **무한 스크롤** 또는 **명시적 “더 보기”** (동일 스트림 연장) | 피드·알림 스트림은 **위치보다 흐름** (예: Instagram 계열 카드 피드) |
| **관리형 (management)** | **내 데이터**를 찾고, 상태·필터와 함께 **정확히 재탐색** | **페이지네이션** | 내 기여·내 제품·모더레이션 큐는 **정확한 오프셋·재현 가능한 목록**이 유리 (예: GitHub Issues 목록) |

### 1.1 애매한 경우

- **탐색 + 소비가 섞임** (예: 검색 결과에 “최신 활동” 탭): 탭·세그먼트 **마다** 유형을 나눠 적용한다.
- **모바일만 무한 스크롤**: 허용은 가능하되, **데스크톱과 과업 유형이 같아야** 한다. 단순히 화면 크기만으로 유형을 바꾸지 않는다.
- **서버가 페이지네이션만 지원**: UI는 페이지네이션으로 맞춘다. 무한 스크롤은 API와 짝을 맞춘 뒤에만 도입한다.

---

## 2. 코드베이스 표기 — `@pagination-strategy`

신규·수정하는 **목록을 그리는 페이지·컨테이너 컴포넌트** 파일 상단 블록 주석에 다음을 둔다.

```text
@pagination-strategy <exploration | consumption | management> — 권장: <pagination | infinite-scroll | load-more>. 구현: <실제 훅/패턴>. (불일치 시: Tier2 백로그)
```

- **권장**: 위 표에 따른 표준.
- **구현**: 실제 코드(`useProductSearch.loadMore`, `offset/limit` 페이지 버튼 등). 권장과 같으면 “구현: pagination”만으로 충분.
- 불일치가 있으면 **한 줄로 명시**해 드리프트를 추적 가능하게 한다.

---

## 3. Itemwiki 예시(참고만, SSOT는 유형 판단)

| 화면 | 유형 | 권장 패턴 |
|------|------|-----------|
| 제품 검색 결과 | 탐색형 | 페이지네이션 |
| 내 기여 목록 | 관리형 | 페이지네이션 |
| 기여 대시보드(모더레이션 목록) | 관리형 | 페이지네이션 |
| 시간순 활동·피드(전용 스트림) | 소비형 | 무한 스크롤 / 더 보기 |

구현이 아직 `loadMore`만 있는 경우에도 **유형·권장**을 주석에 고정해 두면, 이후 PR에서 페이지네이션으로 바꿀 근거가 된다.

---

## 4. 관련 문서

- [FRONTEND_LAYER_PRINCIPLES.md §2](./FRONTEND_LAYER_PRINCIPLES.md) — 단일 목적·한 화면 한 기능  
- [IA_NAVIGATION_PRINCIPLES.md](./IA_NAVIGATION_PRINCIPLES.md) — 정보 구조·깊이  
- Itemwiki [UI_CONSTITUTION.md §3.5](../../itemwiki-constitution/itemwiki-specific/ui-ux/UI_CONSTITUTION.md) — 익숙한 패턴 매핑  

---

## 5. `@pagination-strategy`·연계 주석이 붙은 코드 (점진 확대)

| 영역 | 파일(예) |
|------|-----------|
| 검색 | `components/search/SearchPageContent.tsx`, `ProductSearchResults.tsx`, `packages/web/hooks/product/useProductSearch.ts` |
| 공통 훅 | `packages/web/hooks/common/usePagination.ts`, `useContributionsList.ts` |
| 기여·관리 | `app/(console)/my-contributions/page.tsx`, `PendingContributionsPageContent.tsx`, `contributions/pending/page.tsx`, `ContributionsDashboardContent.tsx`, `contributions/dashboard/page.tsx` |
| 제품·브랜드 맥락 목록 | `app/(console)/products/[barcode]/contributions/page.tsx`, `app/(public)/brands/[id]/contributions/page.tsx`, `components/product/tabs/ContributionsTab.tsx` |
| 소비형 이력 | `components/profile/ReputationLogDisplay.tsx`, `components/settings/AutoProcessingHistory.tsx`, `app/(console)/scan-history/page.tsx` |
| 댓글·커뮤니티 | `components/product/tabs/CommentsTab.tsx`, `components/profile/UserComments.tsx`, `packages/web/hooks/user/useUserComments.ts` |
| 탐색형 순위표 | `components/rankings/RankingsPageContent.tsx`, `app/(public)/rankings/page.tsx` |
| 렌더 전용 리스트 | `components/product/lists/ProductList.tsx`(정책은 부모 SSOT) |
| 관리·운영(어드민) | `components/admin/SynaxionJudgmentsContent.tsx` |
| 미션 목록 | `components/product/update-mission/UpdateMissionsPageContent.tsx`, `packages/web/hooks/product/useUpdateMissions.ts` |
| 홈·허브(비단일 목록) | `components/home/HomePageContent.tsx` — 단일 offset 스트림 아님, 정책은 하위·다른 라우트 |
| 제품 맥락 추천·대체 | `components/product/detail/AlternativeProducts.tsx`, `RecommendedProducts.tsx`, `packages/web/hooks/product/useAlternatives.ts` |
| 선호·피처 추천 | `components/recommendations/FeatureRecommendations.tsx`, `RecommendationSection.tsx` |

신규 목록 화면 추가 시 위 표와 같은 위치에 한 줄을 부착하면 된다.

---

**최초 정리**: 2026-05-06 — 목록 페이징 정책 부재·구현 드리프트 방지.

**갱신**: 2026-05-06 — §5 표·주석(홈 허브·대체·추천 제품·Feature 추천·RecommendationSection·useAlternatives·댓글·랭킹·스캔·ProductList·Synaxion 등) 병기.
