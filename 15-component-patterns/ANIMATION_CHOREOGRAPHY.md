# Animation Choreography Pattern

> **레벨**: Recommended  
> **핵심 원칙**: Motion clarifies hierarchy, not decorates noise.

---

## 1. Purpose — 이 패턴이 해결하는 문제

화면에 여러 요소가 동시에 나타날 때, 사용자는 무엇을 먼저 봐야 할지 알 수 없다.  
애니메이션은 **읽기 순서와 정보 계층을 움직임으로 전달하는 도구**다.

이 패턴이 방지하는 문제:
- 모든 요소가 동시에 등장해 시선 흐름이 없음
- 불필요한 모션이 집중을 방해함
- `prefers-reduced-motion`을 무시한 접근성 위반
- 페이지 로드 성능을 해치는 과도한 애니메이션

---

## 2. When to Use

- 스크롤로 뷰포트에 처음 진입하는 섹션의 콘텐츠 요소
- 리스트, 카드, 그리드처럼 동일 계층 요소가 반복되는 경우 (stagger)
- 모달, 드로어, 오버레이처럼 레이어가 변경될 때
- 페이지 전환 시 콘텍스트 연속성 표현
- hover/focus 상태 전환으로 인터랙션 피드백 제공

---

## 3. When Not to Use

- 이미 화면에 있는 요소가 다시 진입하는 게 아닌 경우
- 사용자 액션(클릭, 입력)의 즉각 반응이 필요한 경우 — 딜레이는 반응성을 해침
- 로딩 상태 — 별도 skeleton/spinner 패턴 사용
- 텍스트 콘텐츠가 많아 읽기 방해가 될 수 있는 경우

---

## 4. Required Inputs

| 항목 | 설명 |
|------|------|
| `prefers-reduced-motion` 감지 | CSS 미디어 쿼리 또는 JS `window.matchMedia` |
| Intersection Observer | 뷰포트 진입 감지 (scroll reveal용) |
| CSS transition/animation 변수 | `--duration-*`, `--ease-*` semantic token 사용 |
| `will-change` 최소화 | 실제 애니메이션이 시작되기 직전에만 적용 |

---

## 5. Pattern Rules

**[R-1] Motion은 계층을 따라야 한다**  
중요한 요소가 먼저, 보조 요소가 나중에 나타나야 한다. 시각적 계층과 등장 순서를 일치시킨다.

**[R-2] `prefers-reduced-motion: reduce`이면 모든 위치 이동·opacity 변화 모션을 제거해야 한다**  
즉각 표시(`opacity: 1`, transform 없음)로 대체한다. `transition: none`으로 전환 자체를 끈다.

**[R-3] Stagger는 지연 누적을 제한한다**  
아이템이 많을수록 마지막 아이템의 대기 시간이 길어진다. 최대 지연 상한(예: 400ms)을 설정한다.

**[R-4] Duration은 요소의 이동 거리에 비례해야 한다**  
작은 요소의 작은 이동 = 짧은 duration. 큰 요소의 큰 이동 = 긴 duration. 고정값 남용 금지.

**[R-5] Easing은 의도를 표현해야 한다**  
진입(enter): `ease-out` — 빠르게 시작해 부드럽게 착지  
퇴장(exit): `ease-in` — 느리게 시작해 빠르게 사라짐  
상호작용(interaction): `ease-in-out` — 자연스러운 왕복

**[R-6] Layout에 영향을 주는 property는 animate하지 않는다**  
`width`, `height`, `margin`, `padding` 애니메이션 금지.  
`transform: translate/scale` + `opacity`만 사용한다. (GPU compositing 가능)

---

## 6. Recommended Variants

### Scroll Reveal
```
초기 상태: opacity 0, translateY +16~24px
진입 후: opacity 1, translateY 0
duration: 400–600ms, ease-out
트리거: Intersection Observer threshold 0.15
```

### Stagger (리스트/카드 그룹)
```
각 아이템 delay: index × 80ms (최대 누적 400ms)
모든 아이템이 동일한 진입 방향 사용
첫 아이템이 가장 먼저, 나머지가 순서대로
```

### Hover State
```
duration: 150–200ms (즉각적 피드백)
ease-in-out
scale, color, shadow만 변경
```

### Modal/Overlay 진입
```
backdrop: opacity 0 → 1, duration 200ms
content: opacity 0 + scale 0.96 → opacity 1 + scale 1, duration 200ms, ease-out
```

### Page Transition
```
퇴장: opacity 1 → 0, duration 150ms
진입: opacity 0 → 1, duration 200ms
(위치 이동보다 opacity 전환 권장 — reduced-motion 대응 용이)
```

---

## 7. Anti-patterns

**❌ Bounce / Spring 남용**  
콘텐츠 사이트에서 bounce easing은 장난스러운 인상을 준다. 명확한 의도 없이 쓰면 안 된다.

**❌ Loop 애니메이션을 콘텐츠 영역에 배치**  
지속적으로 움직이는 요소는 읽기를 방해한다. 배경 텍스처, 아이콘 강조 외에는 금지.

**❌ 동일 페이지에서 3가지 이상의 animation duration 혼용**  
통일된 리듬 없이 각기 다른 timing을 쓰면 무질서하게 느껴진다.

**❌ `setTimeout`으로 수동 지연 구현**  
Intersection Observer가 아닌 고정 timeout으로 reveal을 구현하면 스크롤 위치에 무관하게 실행된다.

**❌ `will-change: transform` 전체 요소에 선제 적용**  
필요하지 않은 요소에 선제적으로 적용하면 GPU 메모리 낭비가 발생한다.

---

## 8. Accessibility / Performance Notes

**접근성**
- `prefers-reduced-motion: reduce` — 모든 위치 이동과 opacity 페이드 제거. 요소는 즉시 표시.
- `prefers-reduced-motion: no-preference` — 정상 애니메이션 실행.
- 애니메이션이 정보 전달의 유일한 수단이 되어서는 안 된다. 모션 없이도 동일한 정보가 전달되어야 한다.

**성능**
- `transform`과 `opacity`만 GPU compositing 가능. `top`, `left`, `width` 등의 layout property 변경은 reflow를 발생시킨다.
- `requestAnimationFrame` 기반 JS 애니메이션보다 CSS transition/animation 우선.
- 화면 밖 요소에 `will-change` 적용 금지.

---

## 9. Implementation Sketch

```tsx
// ScrollReveal 컴포넌트 — 프레임워크 독립 개념

// 1. prefers-reduced-motion 감지
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// 2. 초기 상태 설정
element.style.opacity = prefersReducedMotion ? '1' : '0';
element.style.transform = prefersReducedMotion ? 'none' : 'translateY(20px)';

// 3. Intersection Observer로 진입 감지
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.transition =
          'opacity 500ms ease-out, transform 500ms ease-out';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // 한 번만 실행
      }
    });
  },
  { threshold: 0.15 }
);

observer.observe(element);

// 4. Stagger (그룹 적용)
items.forEach((item, index) => {
  const delay = Math.min(index * 80, 400); // 최대 400ms 상한
  item.style.transitionDelay = prefersReducedMotion ? '0ms' : `${delay}ms`;
});
```

**CSS 변수 활용 (semantic token)**
```css
:root {
  --duration-fast: 150ms;
  --duration-base: 300ms;
  --duration-slow: 500ms;
  --ease-enter: cubic-bezier(0, 0, 0.2, 1);   /* ease-out */
  --ease-exit:  cubic-bezier(0.4, 0, 1, 1);   /* ease-in */
  --ease-inout: cubic-bezier(0.4, 0, 0.2, 1); /* ease-in-out */
}
```

---

## 10. Checkability

| 항목 | 방법 | 종류 |
|------|------|------|
| `prefers-reduced-motion` CSS 미디어 쿼리 존재 | `check:reduced-motion` (grep CSS) | Hard check |
| JS 레벨 `matchMedia` 감지 | grep ScrollReveal/Carousel 컴포넌트 | Hard check |
| `will-change` 선제 남용 | grep `will-change` — 리뷰어 확인 | Soft review |
| Layout property 애니메이션 없음 | grep `transition.*width\|height\|margin\|padding` | Hard check |
| Stagger delay 상한 준수 | 코드 리뷰 | Soft review |
| 실제 UX에서 motion이 계층을 표현하는지 | QA/디자인 리뷰 | Human judgment |

---

## 11. Source Reference

| 프로젝트 | 파일 | 추출 패턴 |
|---------|------|---------|
| truefarm-website | `src/components/ScrollReveal.tsx` | prefers-reduced-motion JS 체크, Intersection Observer scroll reveal |
| truefarm-website | `src/app/globals.css:80,127` | prefers-reduced-motion CSS 미디어 쿼리 |
| truefarm-website | `src/components/sections/RoleSlider.tsx` | stagger + hover state transition |

**추출 일시**: 2026-05-25  
**버전**: 1.0.0
