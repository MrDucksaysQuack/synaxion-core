# Responsive Strategy Pattern

> **레벨**: Recommended  
> **핵심 원칙**: Responsive design is not shrinking. It is priority reordering.

---

## 1. Purpose — 이 패턴이 해결하는 문제

반응형 디자인을 "큰 화면 레이아웃을 작은 화면에서 축소"로 구현하면:
- 중요하지 않은 요소가 모바일에서도 공간을 차지한다
- 텍스트가 작아지는 것이 아니라 잘린다
- 가로 배치가 세로 배치로 바뀌기만 하고 우선순위가 반영되지 않는다

올바른 반응형은 **화면 크기에 따라 어떤 콘텐츠가 더 중요한지 우선순위를 재정의**하는 것이다.  
데스크탑에서는 보조적이던 요소가 모바일에서 핵심이 될 수 있고, 반대도 가능하다.

---

## 2. When to Use

- 마케팅 페이지, 랜딩 페이지, 콘텐츠 페이지의 레이아웃 설계 시
- 컴포넌트가 여러 breakpoint에서 다르게 배치될 때
- 모바일 퍼스트 설계 원칙을 적용할 때
- 기존 데스크탑 레이아웃을 모바일에 적용하는 소급 작업 시

---

## 3. When Not to Use

- 이미 반응형이 완성된 컴포넌트의 내부 로직 변경
- 고정 크기가 필요한 UI (모달, 팝업 등의 내부 요소)
- 앱 내부 UI에서 단일 breakpoint만 지원하는 경우

---

## 4. Required Inputs

| 항목 | 설명 |
|------|------|
| Breakpoint 체계 | `sm`, `md`, `lg`, `xl` 등 프로젝트 breakpoint 정의 |
| 콘텐츠 우선순위 | 각 breakpoint에서 어떤 요소가 더 중요한지 정의 |
| 모바일 퍼스트 CSS | `min-width` 기반으로 작성 (max-width 방향은 피함) |

---

## 5. Pattern Rules

**[R-1] 모바일 퍼스트 — 기본 스타일은 모바일**  
`sm:`, `md:`, `lg:` prefix가 붙지 않은 클래스가 모바일 기본값이어야 한다.  
`lg:hidden`으로 숨기는 것이 아니라 모바일에서 보이고 데스크탑에서 `lg:hidden` 또는 `lg:flex`.

**[R-2] Layout collapse는 콘텐츠 순서를 바꿀 수 있다**  
데스크탑에서 이미지(왼쪽) + 텍스트(오른쪽)인 Split이 모바일에서 텍스트(위) + 이미지(아래)가 될 수 있다.  
시각 순서를 바꾸는 CSS `order` 또는 DOM 순서 자체를 논리 순서에 맞게 유지한다.

**[R-3] 숨기는 것은 의미 있는 콘텐츠에 쓰면 안 된다**  
`hidden md:block` 패턴으로 중요한 정보를 모바일에서 숨기면 안 된다.  
모바일에서 숨길 수 있는 것: 장식 이미지, 보조 수치, 사이드 콘텐츠.  
모바일에서 숨기면 안 되는 것: 핵심 헤드라인, Primary CTA, 네비게이션.

**[R-4] 터치 타겟 최소 크기는 44×44px**  
모바일에서 탭 가능한 요소(버튼, 링크, 아이콘)는 최소 44×44px이어야 한다.

**[R-5] Typography는 breakpoint에 따라 단계적으로 축소된다**  
`text-4xl lg:text-6xl` 방식으로 단계적으로 조정한다. 고정 크기 금지.  
단, 최소 body 텍스트 크기는 16px 이상을 유지한다.

**[R-6] Grid는 collapse 방향이 예측 가능해야 한다**  
`grid-cols-1 md:grid-cols-2 lg:grid-cols-3` — 아이템이 어떻게 재배치될지 예측 가능.  
Auto-fill/auto-fit은 아이템 수와 min-width를 명시해야 한다.

---

## 6. Breakpoint 역할 정의

| Breakpoint | 대표 환경 | 레이아웃 역할 |
|-----------|---------|------------|
| default (0~) | 모바일 세로 | 단일 컬럼, 핵심 콘텐츠만 |
| `sm` (640px~) | 모바일 가로 | 일부 2컬럼 허용, 보조 정보 등장 |
| `md` (768px~) | 태블릿 | 2컬럼 레이아웃, 사이드바 가능 |
| `lg` (1024px~) | 소형 데스크탑 | 3컬럼 그리드, 풀 네비게이션 |
| `xl` (1280px~) | 대형 데스크탑 | 최대 콘텐츠 폭 제한, 여백 확대 |

이 값은 예시다. 프로젝트 breakpoint 정의를 우선한다.

---

## 7. Layout Collapse 규칙

### Split (텍스트 + 이미지)
```
데스크탑: flex-row — 이미지 50% | 텍스트 50%
모바일: flex-col — 텍스트 (위, 핵심이므로 먼저) → 이미지 (아래)
```

### Feature Grid
```
데스크탑: grid-cols-3
태블릿:  grid-cols-2
모바일:  grid-cols-1 (또는 horizontal scroll)
```

### Navigation
```
데스크탑: horizontal nav bar
모바일: hamburger → vertical drawer
— 모바일 nav에서 핵심 CTA는 반드시 포함
```

### Hero
```
데스크탑: 이미지 배경 + 텍스트 오버레이
모바일: 이미지 높이 축소 또는 텍스트를 이미지 아래로 — contrast 유지가 안 되면 후자 선택
```

---

## 8. Anti-patterns

**❌ "모바일에서 다 숨긴다"**  
핵심 정보를 `hidden md:block`으로 숨기면 모바일 사용자는 정보를 못 받는다.  
모바일에서 숨기는 것은 반드시 "없어도 되는 것"이어야 한다.

**❌ 고정 px 폰트 크기**  
`text-[14px]` 고정 — 사용자의 브라우저 폰트 설정이 무시된다. `rem` 또는 Tailwind 계단식 클래스 사용.

**❌ 모바일에서 overflow-x 발생**  
고정 width 요소(`w-[500px]`)가 작은 화면에서 overflow를 만든다. `max-w-*` 또는 `w-full` 사용.

**❌ 터치 타겟이 너무 작은 아이콘 버튼**  
아이콘 자체는 16–24px이지만 hit area는 44px이어야 한다. `p-3`으로 padding을 추가하거나 min-w/min-h 설정.

**❌ `flex-row`를 모바일 기본으로 설정하고 `sm:flex-col`로 변경**  
`flex-col sm:flex-row`가 올바른 방향이다. 모바일 퍼스트 원칙 위반.

---

## 9. Accessibility / Performance Notes

**접근성**
- DOM 순서는 논리적 읽기 순서를 따라야 한다. CSS `order`로 시각 순서를 바꿀 때 스크린 리더는 DOM 순서를 따른다.
- 모바일 nav에서 키보드 포커스가 drawer 안에 갇히지 않도록 focus trap 구현.
- 터치 타겟 44×44px — iOS HIG, Android Material 가이드라인 공통 기준.

**성능**
- 모바일에서 숨겨진 요소(`hidden`)는 여전히 DOM에 존재하고 파싱된다. 매우 무거운 컴포넌트는 조건부 렌더링 검토.
- 이미지는 breakpoint별 다른 크기를 `srcset` + `sizes`로 제공한다.
  ```html
  <img srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1600.webp 1600w"
       sizes="(max-width: 768px) 100vw, 50vw"
       src="hero-800.webp" alt="..." />
  ```

---

## 10. Implementation Sketch

```tsx
// Split 섹션 — 모바일 퍼스트 레이아웃
const SplitSection = ({ image, content }) => (
  <section>
    <div className="
      flex flex-col           /* 모바일: 세로 */
      lg:flex-row             /* 데스크탑: 가로 */
      gap-8 lg:gap-0
    ">
      {/* 텍스트를 DOM에서 먼저 — 스크린 리더, 모바일에서 위에 표시 */}
      <div className="lg:w-1/2 lg:order-2 px-6 lg:px-12 py-8">
        {content}
      </div>
      {/* 이미지는 DOM에서 나중 — 모바일에서 아래 표시 */}
      <div className="lg:w-1/2 lg:order-1">
        <img className="w-full h-64 lg:h-full object-cover" {...image} />
      </div>
    </div>
  </section>
);

// Feature Grid — breakpoint별 컬럼 수
const FeatureGrid = ({ features }) => (
  <ul className="
    grid
    grid-cols-1    /* 모바일: 1컬럼 */
    sm:grid-cols-2 /* 태블릿: 2컬럼 */
    lg:grid-cols-3 /* 데스크탑: 3컬럼 */
    gap-6
  ">
    {features.map(f => <FeatureCard key={f.id} {...f} />)}
  </ul>
);

// 터치 타겟 — 아이콘 버튼
const IconButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="
      min-w-[44px] min-h-[44px]  /* 터치 타겟 */
      flex items-center justify-center
      p-2
    "
  >
    {icon}
  </button>
);
```

---

## 11. Checkability

| 항목 | 방법 | 종류 |
|------|------|------|
| 고정 px 폰트 크기 없음 | grep `text-\[.*px\]` | Hard check |
| 모바일 overflow-x 없음 | Lighthouse mobile audit / 브라우저 DevTools | Soft review |
| 터치 타겟 44px 이상 | axe-core / Chrome DevTools mobile 시뮬레이터 | Soft review |
| 핵심 콘텐츠가 모바일에서 숨겨지지 않음 | 코드 리뷰: `hidden` 클래스 적용 요소 검토 | Soft review |
| DOM 순서가 논리적 읽기 순서를 따름 | 스크린 리더 테스트 | Human judgment |

---

## 11. Source Reference

| 프로젝트 | 파일 | 추출 패턴 |
|---------|------|---------|
| truefarm-website | `src/components/sections/CTASplitSection.tsx` | flex-col → lg:flex-row 모바일 퍼스트 Split |
| truefarm-website | `src/components/SiteNav.tsx` | 모바일 hamburger + desktop horizontal nav |
| truefarm-website | `src/components/sections/RoleSlider.tsx` | 모바일 단일 → 데스크탑 그리드 |

**추출 일시**: 2026-05-25  
**버전**: 1.0.0
