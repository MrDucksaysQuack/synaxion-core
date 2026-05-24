# Loading State Patterns

> **레벨**: Recommended  
> **핵심 원칙**: Loading state is not "please wait." It is a layout promise — the skeleton tells the user what is coming before it arrives.

---

## 1. Purpose — 이 패턴이 해결하는 문제

비동기 데이터 로딩 시 화면이 비거나, 갑자기 콘텐츠가 나타나거나, 레이아웃이 흔들리면 (CLS, Cumulative Layout Shift) 사용자는 무슨 일이 일어나는지 알 수 없다.

이 패턴이 방지하는 문제:
- 빈 화면이 에러처럼 보이는 문제
- 콘텐츠 로드 후 레이아웃이 밀리는 CLS 발생
- Spinner가 "얼마나 걸리는지" 정보를 주지 않는 문제
- Empty state와 loading state를 구분하지 못하는 문제
- 데이터가 없을 때 아무 것도 표시하지 않는 문제

---

## 2. When to Use

- 서버에서 데이터를 fetch하는 컴포넌트
- 사용자 액션 후 결과를 기다리는 UI (폼 제출, 검색, 필터링)
- 이미지나 동영상이 지연 로드되는 영역
- 리스트, 카드, 테이블처럼 데이터 크기가 가변적인 컴포넌트

---

## 3. When Not to Use

- 즉각 반응이 필요한 UI 상태 전환 (탭, 아코디언, 드롭다운 열기)
- 페이지 내 이미 렌더링된 요소의 hover/focus 상태 변경
- 500ms 이하로 완료되는 로컬 연산 (skeleton을 보여줄 시간이 없음)

---

## 4. Required Inputs

| 항목 | 설명 |
|------|------|
| 로딩 상태 구분 | `loading` / `error` / `empty` / `success` 4가지 상태 |
| Skeleton 형태 | 실제 콘텐츠와 동일한 레이아웃 구조 |
| `aria-busy` | 로딩 중임을 스크린 리더에 알림 |
| 에러 시 retry | 에러 상태에서 재시도 액션 제공 |

---

## 5. Pattern Rules

**[R-1] 4가지 상태를 항상 구분한다**

| 상태 | 표시 내용 | 사용자에게 전달하는 것 |
|------|---------|------------------|
| `loading` | Skeleton 또는 Spinner | "곧 나타납니다" |
| `error` | 에러 메시지 + Retry | "문제가 생겼습니다. 다시 시도하세요" |
| `empty` | Empty state 메시지 | "데이터가 없습니다. 이유와 다음 액션" |
| `success` | 실제 콘텐츠 | 정보 전달 |

`loading`과 `empty`를 구분하지 않으면 사용자는 아직 기다려야 하는지 포기해야 하는지 모른다.

**[R-2] Skeleton은 실제 콘텐츠의 레이아웃을 반영해야 한다**  
Skeleton의 요소 수, 크기, 배치가 실제 콘텐츠와 비슷해야 로드 후 CLS를 방지한다.  
단순 회색 사각형 하나로 모든 콘텐츠를 대체하면 안 된다.

**[R-3] Skeleton과 Spinner의 용도를 구분한다**  
Skeleton: 레이아웃이 예측 가능한 콘텐츠 (카드, 리스트, 프로필)  
Spinner: 레이아웃을 예측할 수 없거나 단발성 액션 (파일 업로드, 폼 제출, 검색)

**[R-4] 로딩 duration이 긴 경우 진행 상태를 표시한다**  
2초 이상 걸릴 수 있는 작업(파일 업로드, 대용량 처리)은 progress indicator를 제공한다.  
Spinner만으로는 "얼마나 더 걸리는지" 알 수 없다.

**[R-5] Empty state는 다음 액션을 제시해야 한다**  
"데이터가 없습니다"만 표시하면 사용자는 막힌다.  
"아직 신청 내역이 없습니다. 지금 신청하기 →" 처럼 다음 행동을 유도한다.

**[R-6] `aria-busy="true"`는 로딩 중에만 유지한다**  
로딩이 완료되면 `aria-busy="false"`로 변경한다.  
스크린 리더가 로딩 완료를 알 수 있도록 `aria-live="polite"` 영역에서 완료 알림을 제공한다.

---

## 6. Recommended Variants

### Card Skeleton
```
[gray block 100% width, 12px height]  ← 이미지 placeholder
[gray block 60% width, 16px height]   ← 제목
[gray block 80% width, 12px height]   ← 설명 첫 줄
[gray block 40% width, 12px height]   ← 설명 둘째 줄
```
실제 카드 비율과 동일하게. 애니메이션: shimmer (왼쪽→오른쪽 gradient sweep).

### List Skeleton (반복)
```
Card Skeleton × N개 (실제 예상 아이템 수 또는 고정 3–5개)
```

### Full Page Loading
페이지 전체가 로딩 중일 때: 네비게이션과 기본 레이아웃은 이미 보이고, 콘텐츠 영역만 skeleton.

### Inline Spinner (버튼 상태)
폼 제출 버튼 내부에 표시. 버튼 크기 변경 없이 텍스트를 spinner로 교체.

### Empty State
```
[아이콘 또는 일러스트]
[제목: "아직 [데이터명]이 없습니다"]
[설명: 이유 또는 시작 방법]
[CTA 버튼: 다음 액션]
```

---

## 7. Anti-patterns

**❌ 빈 화면을 로딩 상태로 사용**  
아무것도 표시하지 않으면 에러인지 로딩 중인지 알 수 없다.

**❌ Skeleton과 콘텐츠의 레이아웃이 완전히 다름**  
Skeleton이 1컬럼인데 콘텐츠가 3컬럼 그리드로 나타나면 CLS가 크게 발생한다.

**❌ 로딩 중에도 interactive 요소를 활성화**  
로딩 중 버튼을 클릭할 수 있으면 중복 요청이 발생한다. `aria-busy` + disabled 처리.

**❌ 에러 상태에서 retry 없음**  
"오류가 발생했습니다"만 표시하고 재시도 방법을 제공하지 않으면 사용자는 페이지를 새로고침해야 한다.

**❌ Shimmer 애니메이션을 `prefers-reduced-motion`에서 계속 실행**  
shimmer는 위치 이동은 없지만 opacity/gradient 변화가 있다. `prefers-reduced-motion: reduce`에서는 정적 회색으로 대체한다.

---

## 8. Accessibility / Performance Notes

**접근성**
- 로딩 컨테이너에 `aria-busy="true"` + `aria-label="로딩 중"` 또는 `role="status"`.
- 로딩 완료 시 `aria-live="polite"` 영역에서 새 콘텐츠 개수 또는 상태 알림.
- Skeleton 요소는 `aria-hidden="true"` — 스크린 리더가 "회색 사각형"을 읽으면 안 된다.
- Empty state의 CTA는 키보드로 접근 가능해야 한다.

**성능**
- Skeleton은 CSS 전용으로 구현한다 (JS 없이). GPU compositing 가능한 shimmer: `background-position` animation 또는 `transform: translateX` + mask 기법.
- CLS 방지: Skeleton의 height를 실제 콘텐츠 예상 높이와 맞춘다. `min-height` 설정 권장.
- 이미지 lazy load의 placeholder: `aspect-ratio` CSS로 공간을 미리 확보한다.

---

## 9. Implementation Sketch

```tsx
// 4가지 상태를 처리하는 컴포넌트 구조

type LoadState = 'loading' | 'error' | 'empty' | 'success';

const DataSection = ({ state, data, onRetry }) => {
  if (state === 'loading') return <CardSkeletonList count={3} />;
  if (state === 'error')   return <ErrorState onRetry={onRetry} />;
  if (state === 'empty')   return <EmptyState />;
  return <CardList data={data} />;
};

// Skeleton 컴포넌트
const CardSkeleton = () => (
  <div aria-hidden="true" className="animate-pulse rounded-lg overflow-hidden">
    <div className="bg-surface-muted h-48 w-full" />          {/* 이미지 */}
    <div className="p-4 space-y-3">
      <div className="bg-surface-muted h-4 w-3/5 rounded" />  {/* 제목 */}
      <div className="bg-surface-muted h-3 w-4/5 rounded" />  {/* 설명 1 */}
      <div className="bg-surface-muted h-3 w-2/5 rounded" />  {/* 설명 2 */}
    </div>
  </div>
);

const CardSkeletonList = ({ count }: { count: number }) => (
  <div
    role="status"
    aria-label="콘텐츠를 불러오는 중입니다"
    aria-busy="true"
    className="grid grid-cols-1 md:grid-cols-3 gap-6"
  >
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
    <span className="sr-only">로딩 중...</span>
  </div>
);

// Empty state
const EmptyState = ({ title, description, ctaLabel, ctaHref }) => (
  <div className="text-center py-16 px-6">
    <div aria-hidden="true" className="text-4xl mb-4">{/* 아이콘 */}</div>
    <h3 className="text-lg font-medium text-primary mb-2">{title}</h3>
    <p className="text-secondary mb-6">{description}</p>
    {ctaLabel && <a href={ctaHref} className="btn-primary">{ctaLabel}</a>}
  </div>
);

// prefers-reduced-motion 대응
/* globals.css */
/*
@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: none;
  }
}
*/
```

---

## 10. Checkability

| 항목 | 방법 | 종류 |
|------|------|------|
| `aria-busy` 사용 | grep `aria-busy` in async components | Hard check |
| Skeleton에 `aria-hidden="true"` | lint / grep | Hard check |
| `prefers-reduced-motion`에서 shimmer 제거 | `check:reduced-motion` | Hard check |
| 4가지 상태(loading/error/empty/success) 처리 | 코드 리뷰 | Soft review |
| Empty state에 CTA 존재 | 코드 리뷰 | Soft review |
| CLS — Skeleton height가 콘텐츠와 유사 | Lighthouse CLS 점수 | Human judgment |

---

## 11. Source Reference

| 프로젝트 | 파일 | 추출 패턴 |
|---------|------|---------|
| truefarm-website | `src/components/admin/AdminDashboard.tsx` | 로딩/에러 상태 처리 |
| truefarm-website | `src/app/[locale]/profile/page.tsx` | 제출 내역 로딩 상태 |
| synaxion-core | `04-safety-standards/SILENT_FAILURE_PREVENTION.md` | 에러 상태 사용자 통지 원칙 |
| synaxion-core | `15-component-patterns/ANIMATION_CHOREOGRAPHY.md` | prefers-reduced-motion 처리 방식 |

**추출 일시**: 2026-05-25  
**버전**: 1.0.0
