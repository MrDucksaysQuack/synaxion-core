# Dark Mode Implementation Pattern

> **레벨**: Recommended  
> **핵심 원칙**: Dark mode is not darker colors. Dark mode is role remapping under changed luminance context.

---

## 1. Purpose — 이 패턴이 해결하는 문제

다크 모드를 "배경을 어둡게, 텍스트를 밝게"로 구현하면 두 가지 문제가 발생한다.

1. **색상 역할이 붕괴된다**: 라이트 모드에서 "강조"였던 것이 다크 모드에서 "억제"가 되거나, 반대가 된다.
2. **컨트라스트가 보장되지 않는다**: raw hex를 그냥 반전하면 4.5:1 contrast ratio가 보장되지 않는다.

올바른 다크 모드는 **동일한 semantic role이 다른 luminance 환경에서 어떻게 표현되어야 하는지를 재정의**하는 것이다.

---

## 2. When to Use

- 프로젝트에서 `prefers-color-scheme: dark` 또는 사용자 토글 기반 다크 모드 지원 시
- CSS variable 기반 token 시스템을 사용하는 모든 경우
- 다크 모드 추가를 기존 컴포넌트에 소급 적용할 때

---

## 3. When Not to Use

- 다크 모드 지원이 제품 요구사항에 없는 경우 — 미지원도 명시적 결정이다
- Semantic token 시스템 없이 raw hex를 직접 사용하는 경우 — token 시스템 도입이 선행되어야 한다

---

## 4. Required Inputs

| 항목 | 설명 |
|------|------|
| Semantic token 시스템 | `--color-bg-*`, `--color-text-*`, `--color-border-*` 등 역할 기반 CSS variable |
| `html.dark` 또는 `[data-theme="dark"]` 클래스 전략 | 서버 사이드에서도 theme flicker 없이 적용 가능한 방식 |
| `:root` / `html.dark` 블록 | 같은 token 이름에 다른 값을 할당하는 CSS 구조 |
| Contrast ratio 검증 | 모든 텍스트 색상 조합이 4.5:1 이상임을 확인 |

---

## 5. Pattern Rules

**[R-1] 컴포넌트는 raw color를 사용하면 안 된다**  
`bg-[#1a1a1a]`, `text-[#ffffff]` — 금지.  
`bg-surface-primary`, `text-primary` — 허용.  
컴포넌트가 raw color를 쓰면 다크 모드에서 개별 override가 필요해지고, 이것은 유지보수 지옥이 된다.

**[R-2] `dark:` Tailwind 클래스는 token이 없을 때의 임시 수단이다**  
`dark:bg-gray-900 dark:text-white` 같은 패턴은 컴포넌트마다 다크 모드 로직이 중복된다.  
Token 시스템이 있다면 `dark:` prefix 클래스를 `:root` 선언 외부에서 사용하는 것을 금지한다.

**[R-3] `:root` (라이트) + `html.dark` (다크) 에서 동일 token 이름에 다른 값**  
```css
:root {
  --color-bg-primary: #ffffff;
  --color-text-primary: #1a1a1a;
}

html.dark {
  --color-bg-primary: #0f0f0f;
  --color-text-primary: #f0f0f0;
}
```
컴포넌트는 `--color-bg-primary`만 참조한다. 모드 변경은 `:root` / `html.dark` 블록에서만 처리한다.

**[R-4] Semantic role은 모드가 바뀌어도 동일하게 유지되어야 한다**  
라이트 모드의 "강조 버튼" → 다크 모드에서도 "강조 버튼"이어야 한다.  
역할이 바뀌면 안 된다. 표현 값만 바뀐다.

**[R-5] 다크 모드에서 contrast ratio 4.5:1 이상은 필수다**  
색상 반전 후 contrast ratio를 반드시 검증한다. 어두운 배경 위 어두운 텍스트 조합은 라이트 모드보다 발생하기 쉽다.

**[R-6] 이미지 overlay의 다크 모드 처리**  
이미지 위 텍스트의 overlay는 다크 모드에서 opacity를 조정할 수 있다.  
token화 권장: `--image-hero-overlay-opacity` 변수를 `:root`/`html.dark` 블록에서 다르게 설정.

---

## 6. Recommended Variants

### 시스템 설정 자동 감지
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #0f0f0f;
    /* ... */
  }
}
```

### 사용자 토글 + 시스템 설정 조합
```
1. 시스템 설정 읽기 (기본값)
2. 사용자 토글이 있으면 localStorage에 저장
3. 페이지 초기화 시 localStorage 우선 적용
4. HTML에 html.dark 클래스를 렌더링 전에 설정 (flicker 방지)
```

### Dark 전용 alternative image
일부 이미지는 다크 배경에서 다른 버전이 필요하다 (예: 로고의 light/dark variant).  
`<picture>` + `prefers-color-scheme` media query를 사용한다.

---

## 7. Anti-patterns

**❌ color inversion**  
`filter: invert(1)` 또는 모든 색상에 `dark:` 반전 클래스 — 이미지, 아이콘, 브랜드 색이 왜곡된다.

**❌ `dark:` 클래스를 컴포넌트마다 직접 작성**  
```html
<!-- ❌ -->
<div class="bg-white dark:bg-gray-900 text-black dark:text-white border-gray-200 dark:border-gray-700">
```
이 패턴은 semantic token이 없을 때의 임시방편이다. Token 시스템에서는 금지.

**❌ 다크 모드 contrast 미검증**  
라이트 모드에서 contrast를 통과했어도 다크 모드는 별도로 검증해야 한다.

**❌ `background-color`만 바꾸고 shadow/border/overlay 방치**  
다크 모드에서 box-shadow는 어두운 배경에서 거의 보이지 않는다. 별도 처리가 필요하다.

**❌ hydration mismatch 무시**  
SSR 환경에서 서버가 라이트, 클라이언트가 다크를 렌더링하면 flicker가 발생한다.  
`html.dark` 클래스는 `<head>` 안에 인라인 스크립트로 초기화해야 한다.

---

## 8. Accessibility / Performance Notes

**접근성**
- WCAG 2.1 AA: 일반 텍스트 4.5:1, 큰 텍스트(18pt/14pt bold 이상) 3:1 이상
- 다크 모드에서 focus ring이 여전히 보여야 한다. 어두운 배경에서 어두운 ring은 보이지 않는다.  
  `--color-focus-ring` token을 다크 모드에서 밝은 색으로 재정의한다.
- 강조(accent) 색상은 라이트/다크 모두에서 contrast ratio를 통과해야 한다.

**성능**
- CSS variable 변경은 클래스 추가/제거로 일어나므로 repaint 범위가 제한적이다.
- `localStorage` 읽기는 `<head>` 인라인 스크립트로 처리 — hydration flicker 방지.
- 이미지 dark variant는 `<picture>` media query로 처리 — JS 없이 CSS 레벨에서 전환.

---

## 9. Implementation Sketch

```css
/* globals.css — 3-tier token 구조 */

/* Tier 1: Primitive (brand values) */
:root {
  --color-brand-green: #2d6a4f;
  --color-brand-green-light: #52b788;
  --color-neutral-50: #fafafa;
  --color-neutral-900: #0f0f0f;
  /* ... */
}

/* Tier 2: Semantic (roles) — Light mode */
:root {
  --color-bg-primary: var(--color-neutral-50);
  --color-bg-surface: #ffffff;
  --color-text-primary: var(--color-neutral-900);
  --color-text-secondary: #4a4a4a;
  --color-accent-primary: var(--color-brand-green);
  --color-border-default: #e5e7eb;
  --color-focus-ring: var(--color-brand-green);
  --image-hero-overlay-opacity: 0.55;
}

/* Tier 2: Semantic (roles) — Dark mode remapping */
html.dark {
  --color-bg-primary: var(--color-neutral-900);
  --color-bg-surface: #1a1a1a;
  --color-text-primary: var(--color-neutral-50);
  --color-text-secondary: #a0a0a0;
  --color-accent-primary: var(--color-brand-green-light); /* lighter variant for dark bg */
  --color-border-default: #2d2d2d;
  --color-focus-ring: var(--color-brand-green-light);
  --image-hero-overlay-opacity: 0.65; /* overlay를 어두운 배경에서 조정 */
}
```

```tsx
// Hydration flicker 방지 (Next.js <head> inline script)
// <script dangerouslySetInnerHTML={{__html: `
//   (function() {
//     const stored = localStorage.getItem('theme');
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     if (stored === 'dark' || (!stored && prefersDark)) {
//       document.documentElement.classList.add('dark');
//     }
//   })();
// `}} />
```

---

## 10. Checkability

| 항목 | 방법 | 종류 |
|------|------|------|
| 컴포넌트에서 raw hex/rgb 사용 없음 | `check:no-raw-colors` (grep `bg-\[#`, `text-\[#`) | Hard check |
| `dark:` 클래스가 `:root`/`html.dark` 외부에 없음 | `check:dark-class-usage` (grep `dark:bg-\|dark:text-`) | Hard check |
| 다크 모드 contrast ratio 4.5:1 | axe-core / Lighthouse accessibility audit | Soft review |
| focus ring이 다크 모드에서도 보임 | 시각 QA | Human judgment |
| hydration flicker 없음 | 개발/스테이징 환경에서 직접 확인 | Human judgment |

---

## 11. Source Reference

| 프로젝트 | 파일 | 추출 패턴 |
|---------|------|---------|
| truefarm-website | `src/app/globals.css` | `:root`, `html.dark` 3-tier token 구조 |
| truefarm-website | `tailwind.config.ts` | CSS variable 기반 semantic token → Tailwind class 매핑 |
| synaxion-core | `13-ui-design/UI_DESIGN_CONSTITUTION.md §01` | Token 3-tier 아키텍처 |

**추출 일시**: 2026-05-25  
**버전**: 1.0.0
