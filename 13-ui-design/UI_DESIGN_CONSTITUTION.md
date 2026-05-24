# UI Design Constitution

> **위상**: Synaxion Engineering Constitution(층 A)의 시각 표현 레이어 확장.  
> 코드 아키텍처 헌법과 동일한 강제력을 가지며, Tier 1 규칙은 `check:ui-*` 스크립트로 검증되어야 한다.
>
> **보편성**: 특정 브랜드·프레임워크·색상에 종속되지 않는다.  
> 토큰의 값은 프로젝트마다 다르다. 토큰의 구조와 의존 규칙은 변경 불가다.

**제정일**: 2026-05-24  
**Tier 기본값**: 이 장 전체는 Tier 1 (명시적 예외 제외)

---

## 핵심 명제

```
UI 스타일은 취향의 누적이 아니라, 토큰 계약의 실행 결과여야 한다.
시각 표현도 SSOT를 가져야 한다.
```

---

## 01 — 토큰 아키텍처 ★ Tier 1

### 1.1 Token Layer 독립성

토큰은 CSS 캐스케이드와 빌드 설정에 존재하는 독립 파운데이션 레이어다.
Token Layer는 `src/lib`, `src/content`, `src/components`, `src/app` 중 어느 레이어에도 의존하지 않는다.
모든 UI 레이어는 토큰을 참조할 수 있다. 토큰은 어떤 UI 레이어도 참조할 수 없다.
**시각 값의 흐름은 항상 Token Layer → Component Layer 방향으로만 흐른다.**

> 관련: [LAYER_BOUNDARIES.md](../01-foundations/LAYER_BOUNDARIES.md) — 단방향 의존성 원칙

### 1.2 3-Tier Token 구조

토큰은 반드시 3단계로 분리되어야 한다.

```
Primitive Token  →  원시 시각 값 보관 (raw brand values)
Semantic Token   →  제품 전체의 역할 정의 (role assignment)
Component Token  →  특정 컴포넌트 내부 역할 정의 (local contract)
```

**의존 규칙**:

| Tier | 참조 허용 | 참조 금지 |
|------|-----------|-----------|
| Component Token | Semantic Token | Primitive Token 직접 참조 |
| Semantic Token | Primitive Token | — |
| Primitive Token | 없음 (raw value만) | — |

예시:

```css
/* 1. Primitive */
--color-green-900: #1b3a28;
--color-gold-400:  #c9a84c;

/* 2. Semantic */
--color-bg-app:       var(--color-gray-50);
--color-text-primary: var(--color-gray-950);
--color-accent:       var(--color-green-900);

/* 3. Component */
--button-bg:   var(--color-accent);
--button-text: var(--color-text-inverse);
--card-bg:     var(--color-surface-raised);
```

### 1.3 파일 구조

```
src/styles/
  tokens/
    primitive.css    ← raw 값 (브랜드 색상, 고정 수치)
    semantic.css     ← 역할 정의
    component.css    ← 컴포넌트 로컬 역할
    motion.css       ← 애니메이션 토큰
    typography.css   ← 폰트 슬롯, 스케일
    spacing.css      ← 공간 토큰
    themes.css       ← 다크모드·테마 재매핑
  globals.css        ← @import 순서 관리

tailwind.config.*    ← Semantic Token → utility class 매핑 (해당 시)

src/lib/tokens/
  css-vars.ts        ← CSS 변수명 TS wrapper (raw value 보관 금지)
```

### 1.4 TypeScript 토큰 접근 규칙

JS/TS 파일은 CSS 토큰의 raw value를 중복 정의할 수 없다.
CSS가 원천이며, TS는 타입 안전한 참조 통로다.

```typescript
// 금지 — raw value 중복 정의
export const colors = { accent: "#1b3a28" };

// 허용 — CSS 변수명 wrapper
export const cssVars = {
  colorAccent:      "var(--color-accent)",
  colorTextPrimary: "var(--color-text-primary)",
} as const;

// 타입 강화 (선택)
export type CssVarToken = `var(--${string})`;
export const token = <T extends string>(name: T): `var(--${T})` =>
  `var(--${name})`;
```

---

## 02 — 색상 시스템 ★ Tier 1

### 2.1 테마 재매핑 원칙

다크 모드와 브랜드 테마는 **컴포넌트 조건 분기가 아닌** Semantic Token 재매핑으로 구현한다.
컴포넌트는 테마의 존재를 알지 못해야 한다.

```css
/* themes.css */
:root {
  --color-bg-app:       var(--color-gray-50);
  --color-text-primary: var(--color-gray-950);
  --color-accent:       var(--color-brand-primary);
}
.dark {
  --color-bg-app:       var(--color-gray-950);
  --color-text-primary: var(--color-gray-50);
  --color-accent:       var(--color-brand-secondary); /* 역할 유지, 값 재정의 */
}
```

금지:

```tsx
// 금지 — 컴포넌트가 테마를 직접 인지
className={isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}

// 금지 — 유틸리티 접두사로 컴포넌트 단위 테마 분기 (예: Tailwind dark:)
className="bg-white dark:bg-gray-900"
```

### 2.2 필수 Semantic Color 역할

모든 프로젝트는 아래 역할을 반드시 정의한다:

```
배경:    bg-app / bg-subtle / bg-surface / bg-surface-raised
텍스트:  text-primary / text-secondary / text-muted / text-inverse
경계:    border-subtle / border-default / border-strong / border-focus
강조:    accent / accent-strong
상태:    success / warning / danger / info
```

### 2.3 Inverse 패턴 (Ink)

강조색 배경 위 텍스트는 `--color-text-inverse`를 사용한다.
`text-inverse`는 배경 계열 색상을 참조해 다크 모드에서 자동으로 대비를 유지한다.

```css
--color-text-inverse: var(--color-bg-app);
```

---

## 03 — 타이포그래피 ★ Tier 1 (weight) / Tier 2 (scale)

### 3.1 Font Weight 제한 ★ Tier 1

프로젝트당 font-weight는 최대 3종으로 제한한다.

권장 조합:

```
400 Regular   → 본문
500 Medium    → 레이블, 보조 강조
600 Semibold  → 헤딩, 주요 강조
```

4종 이상 사용 → Enforcement Level 2.

### 3.2 다국어 폰트 슬롯 ★ Tier 1

다국어 프로젝트에서 언어별 폰트는 CSS 변수 슬롯으로 분리한다.
컴포넌트는 슬롯 변수만 참조한다.

```css
--font-sans-latin: "Inter", system-ui, sans-serif;
--font-sans-kr:    "Pretendard", "Apple SD Gothic Neo", sans-serif;
--font-sans-jp:    "Noto Sans JP", sans-serif;

/* 역할 슬롯 (컴포넌트 참조 대상) */
--font-display: var(--font-sans-latin);
--font-body:    var(--font-sans-latin);
--font-mono:    "JetBrains Mono", monospace;
```

### 3.3 Letter-spacing 규칙

Display 텍스트는 기본적으로 음수 letter-spacing을 사용한다.
CJK 텍스트는 별도 tracking 토큰을 사용하며 가독성을 우선한다.

```css
--tracking-display-latin: -0.03em;
--tracking-display-cjk:   -0.01em;
--tracking-heading:        -0.01em;
--tracking-body:            0em;
--tracking-label:           0.05em;  /* uppercase label */
```

---

## 04 — 공간 시스템 ★ Tier 1

### 4.1 너비 토큰 분리

Reading column과 page shell은 반드시 별개의 토큰으로 분리한다.

```css
--width-reading: 720px;    /* 본문 텍스트 컬럼 */
--width-content: 960px;    /* 일반 콘텐츠 */
--width-shell:   1200px;   /* 페이지 크롬 */
--width-wide:    1440px;   /* 대형 랜딩 섹션 */
```

### 4.2 Spacing Tier 분리

Layout 간격과 Component 내부 간격에 다른 규칙을 적용한다.

```
Layout / Section 간격  →  Semantic Spacing 토큰만 허용
Component 내부 padding/gap  →  Primitive Spacing 허용
```

```css
/* Primitive (8pt grid) */
--space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
--space-4: 1rem;     --space-6: 1.5rem;   --space-8: 2rem;
--space-12: 3rem;    --space-16: 4rem;    --space-24: 6rem;

/* Semantic (layout 전용) */
--section-gap-sm: var(--space-12);
--section-gap-md: var(--space-20);
--section-gap-lg: var(--space-32);
```

임의 수치로 섹션 간격을 직접 정의하는 것은 금지한다.

---

## 05 — 형태 언어 ★ Tier 1

### 5.1 Border Radius 제한

프로젝트당 border-radius 토큰은 3종 이하로 제한한다.
각 토큰은 반드시 Semantic 역할 이름을 가진다.

```css
/* Primitive */
--radius-sm:   0.375rem;
--radius-md:   0.75rem;
--radius-full: 9999px;

/* Semantic Role (컴포넌트 참조 대상) */
--radius-surface:     var(--radius-md);    /* 카드, 패널, 이미지 컨테이너 */
--radius-interactive: var(--radius-sm);    /* 입력 필드, 내부 컨트롤 */
--radius-pill:        var(--radius-full);  /* 버튼, 배지, nav 링크 */
--radius-indicator:   var(--radius-full);  /* 아이콘 원, 아바타, 도트 */
```

컴포넌트는 primitive radius 토큰이 아닌 semantic role 토큰을 참조한다.

---

## 06 — 모션 ★ Tier 1

### 6.1 Easing 제한

프로젝트당 easing 함수는 원칙적으로 1종으로 제한한다.
exit motion이 필요한 경우 Constitution에 정의된 exit easing 1종만 추가 허용한다.

```css
--ease-standard: cubic-bezier(0.2, 0, 0, 1);   /* 기본 — deceleration */
--ease-exit:     cubic-bezier(0.4, 0, 1, 1);    /* exit 전용 (선택) */
```

### 6.2 Duration Tier

임의 ms 값을 직접 사용하는 것은 금지한다.

```css
--duration-micro:    120ms;   /* 색상, 아이콘 등 micro interaction */
--duration-standard: 200ms;   /* 대부분의 hover, 상태 전환 */
--duration-slow:     400ms;   /* 패널 열기, 전환 */
--duration-reveal:   600ms;   /* scroll reveal */
```

### 6.3 Scroll Reveal 기본값 ★ Tier 2

```
rootMargin:  "0px 0px -8% 0px"
threshold:   0.08
y-offset:    14px → 0
opacity:     0 → 1
duration:    var(--duration-reveal)
easing:      var(--ease-standard)
once:        true
```

### 6.4 prefers-reduced-motion ★ Tier 1

모든 프로젝트는 아래 CSS를 반드시 포함한다.
JS 기반 애니메이션도 `prefers-reduced-motion` 감지 후 초기 visible 상태로 설정한다.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration:        1ms !important;
    animation-iteration-count: 1  !important;
    transition-duration:       1ms !important;
    scroll-behavior:           auto !important;
  }
}
```

---

## 07 — 상태 표현 ★ Tier 1

### 7.1 필수 상태 4종

모든 인터랙티브 요소는 아래 4가지 상태가 시각적으로 구분되어야 한다.

```
hover    → 조작 가능함을 인지
focus    → 키보드/포인터 포커스 위치 명시
active   → 클릭/탭 진행 중
disabled → 조작 불가
```

### 7.2 상태 토큰

```css
--state-hover-opacity:    0.88;
--state-active-opacity:   0.76;
--state-disabled-opacity: 0.48;
--focus-ring-width:        2px;
--focus-ring-offset:       2px;
--focus-ring-color:        var(--color-border-focus);
```

### 7.3 Focus 접근성 규칙 ★ Tier 1

focus 상태는 색상만으로 표현하는 것을 금지한다.
`outline` 또는 `ring`과 반드시 함께 구현해야 한다.

```tsx
// 금지
className="focus:bg-accent"

// 허용
className="focus-visible:outline-none
           focus-visible:ring-[var(--focus-ring-width)]
           focus-visible:ring-[var(--focus-ring-color)]
           focus-visible:ring-offset-[var(--focus-ring-offset)]"
```

### 7.4 Disabled 규칙

opacity만으로 disabled를 표현하지 않는다.
`cursor-not-allowed` + `pointer-events-none` + `disabled` 속성 + `aria-disabled`를 함께 사용한다.

---

## 08 — 이미지 · 미디어 ★ Tier 1

### 8.1 Overlay 의무

배경 이미지 위에 텍스트를 렌더링하는 경우, 반드시 가독성 overlay 레이어를 가져야 한다.
overlay 없이 배경 이미지 위에 직접 텍스트를 렌더링하는 것은 금지한다.

```css
--overlay-soft:   0.24;
--overlay-medium: 0.48;
--overlay-strong: 0.72;
```

```tsx
<div className="relative overflow-hidden">
  <Image src={src} alt="" fill aria-hidden />
  <div className="absolute inset-0"
       style={{ background: `rgba(0,0,0,var(--overlay-medium))` }}
       aria-hidden />
  <div className="relative z-[1]">{children}</div>
</div>
```

### 8.2 Decorative vs. Informative 구분 ★ Tier 1

모든 `<img>` 요소는 두 종류 중 하나로 명시적으로 분류해야 한다.

```tsx
// Decorative — 스크린리더 무시
<Image src={bgImage} alt="" aria-hidden fill />

// Informative — 의미 있는 alt 필수 (빈 문자열 금지)
<Image src={heroImage} alt="농부가 논에서 벼를 수확하는 장면" />
```

### 8.3 Shadow 최소화

프로젝트당 shadow 토큰은 1~2종으로 제한한다.
정의되지 않은 `box-shadow` 값을 직접 사용하는 것은 금지한다.

```css
--shadow-card:    0 4px 16px rgba(0, 0, 0, 0.08);
--shadow-overlay: 0 8px 32px rgba(0, 0, 0, 0.16);
```

---

## 09 — 금지 규칙 ★ Tier 1

아래 항목들은 [LAYER_BOUNDARIES.md](../01-foundations/LAYER_BOUNDARIES.md)의 계층 경계 위반과 동일하게 처리된다.

### 시각 값 직접 사용 금지

```
JSX/TSX 파일 내 hex, rgb, hsl 직접 사용
CSS/유틸리티 내 arbitrary color 값 직접 사용
임의 px/rem 수치로 layout/section 간격 직접 정의
Constitution에 없는 box-shadow 값 직접 사용
Constitution에 없는 easing 함수 직접 사용
정의되지 않은 border-radius 수치 직접 사용
```

### 테마 분기 금지

```
컴포넌트 코드에서 utility 접두사(예: dark:)로 테마 분기
theme 상태 변수를 조건으로 시각 클래스 교체
JS에서 테마별 raw color 값을 직접 반환하는 함수 작성
```

### 토큰 tier 위반 금지

```
Component Token에서 Primitive Token 직접 참조
TS 파일에서 CSS 토큰 raw value 중복 정의
CSS 변수 없이 JS 상수에만 시각 값 저장
```

### 접근성 누락 금지

```
인터랙티브 요소의 focus 상태 미구현
focus 표현을 색상 변화만으로 처리
disabled 상태에서 aria-disabled 누락
배경 이미지 위 텍스트에 overlay 누락
prefers-reduced-motion 처리 누락
```

---

## 10 — 검증 (Enforcement) ★ Tier 1

> Synaxion Core 원칙 연장: **침묵 실패는 허용되지 않는다.**

### Enforcement Level

```
Level 1 — document rule    (문서화, 자동 검사 없음)
Level 2 — lint warning     (빌드 통과, 경고 출력)
Level 3 — CI failure       (빌드 실패, PR 블록)
Level 4 — pre-commit block (커밋 자체 차단)
```

### 규칙별 Level

| 규칙 | Level |
|------|-------|
| JSX 내 hex/rgb 하드코딩 | 3 |
| 임의 px spacing (layout 간격) | 3 |
| 정의되지 않은 easing | 3 |
| 정의되지 않은 shadow | 3 |
| 테마 조건 분기 (dark: 등) | 3 |
| `prefers-reduced-motion` 누락 | 3 |
| focus 상태 미구현 | 3 |
| Component → Primitive 직접 참조 | 3 |
| TS 파일 raw value 중복 정의 | 3 |
| font weight 4종 이상 | 2 |
| Decorative 이미지 alt="" 누락 | 2 |
| disabled aria-disabled 누락 | 2 |
| overlay 없는 배경 이미지 위 텍스트 | 2 |

### 필수 check 스크립트

```
check:ui-tokens        — 토큰 tier 구조 및 참조 방향 검증
check:ui-raw-values    — JSX/CSS 내 raw visual value 탐지
check:ui-motion        — easing/duration 토큰 외 값 탐지
check:ui-accessibility — focus/aria/alt 패턴 검증
check:ui-theme-split   — 컴포넌트 내 테마 조건 분기 탐지
check:ui-constitution  — 위 전체를 한 번에 실행
```

`check:ui-constitution`은 `check:all` 또는 CI 파이프라인에 포함되어야 한다.

> 관련: [VERIFICATION_SCRIPTS.md](../06-automation/VERIFICATION_SCRIPTS.md) — 스크립트 등록 및 관리 규칙

---

## 11 — Synaxion Core와의 연결

이 장은 별개의 디자인 가이드가 아니다.
**시각 표현 레이어의 계층 질서를 정의하는 Synaxion 헌법의 확장이다.**

| Synaxion Core 원칙 | UI Constitution 대응 |
|---|---|
| 침묵 실패 금지 | focus 누락 금지 / overlay 누락 금지 |
| 역방향 의존성 금지 | Component → Primitive 직접 참조 금지 |
| SSOT 위반 금지 | TS 파일 raw value 중복 정의 금지 |
| 계층 경계 위반 금지 | 토큰 tier 위반 금지 / raw value 직접 사용 금지 |
| 계약 없는 구현 금지 | 테마 분기를 컴포넌트 조건문으로 처리 금지 |

---

## 부록 A — 토큰 최소 요구 목록

모든 Synaxion 기반 프로젝트가 반드시 정의해야 하는 최소 토큰 집합.
값은 프로젝트마다 다르며, 이 목록은 역할 이름의 계약이다.

```
색상 (Semantic)
  --color-bg-app / bg-subtle / bg-surface / bg-surface-raised
  --color-text-primary / text-secondary / text-muted / text-inverse
  --color-accent / accent-strong
  --color-border-subtle / border-default / border-focus
  --color-success / warning / danger / info

공간
  --space-1 ~ --space-32  (8pt grid)
  --section-gap-sm / md / lg
  --width-reading / content / shell

형태
  --radius-surface / interactive / pill

모션
  --ease-standard
  --duration-micro / standard / slow / reveal

그림자
  --shadow-card  (최소 1종)

타이포그래피
  --font-body / display / mono  (언어별 슬롯 포함)
  --tracking-display-latin / cjk / body
```

---

**최종 업데이트**: 2026-05-24 — 초기 제정 (Synaxion Constitution 2.8.0)
