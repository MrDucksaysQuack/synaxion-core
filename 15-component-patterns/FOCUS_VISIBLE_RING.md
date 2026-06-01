# Focus-Visible Ring Pattern (FOCUS-R1)

> **레벨**: Mandatory (Synaxion **2.16.0** — Itemwiki ADR-0009 승격)  
> **패턴 ID**: FOCUS-R1  
> **핵심 원칙**: Focus indication is for keyboard users. Mouse clicks must not show a focus ring unless keyboard focus is active.

---

## 1. Purpose — 이 패턴이 해결하는 문제

`:focus` 스타일을 마우스·키보드에 동일하게 적용하면:

1. **마우스 사용자**에게 불필요한 링이 나타나 시각적 노이즈가 된다.
2. **`outline: none`만** 적용하면 **키보드 사용자**가 포커스 위치를 알 수 없어 WCAG 2.4.7(Focus Visible)을 위반한다.

`:focus-visible`과 전역 fallback으로 **키보드에만** 링을 보이게 한다.

---

## 2. When to Use

- 모든 인터랙티브 UI primitive (`button`, `a`, `input`, `select`, `textarea`, custom role)
- 디자인 시스템 `components/ui/*` SSOT
- 앱 전역 `globals.css` baseline

---

## 3. When Not to Use

- 순수 장식 요소(포커스 불가)
- 서드파티 위젯이 자체 포커스 정책을 제공하고 프로젝트가 대체 불가한 경우 — 예외는 ADR·allowlist에만

---

## 4. Required Inputs

| 항목 | 설명 |
|------|------|
| `--color-focus-ring` | 포커스 링 색 (semantic token) |
| 전역 `*:focus-visible` | 키보드 포커스 기본 outline |
| `*:focus:not(:focus-visible)` | 마우스 포커스 시 outline 제거 |
| UI primitive 클래스 | `focus-visible:ring-*` 또는 `focus-visible:outline-*` |

---

## 5. Pattern Rules

**[R-1] 인터랙티브 요소는 `:focus-visible`로 포커스 표시를 한다**  
`focus:ring-*`만 쓰면 마우스 클릭에도 링이 보인다. primitive는 `focus-visible:ring-*`를 사용한다.

**[R-2] `outline-none` / `outline-hidden` 단독 금지**  
대체로 `focus-visible:ring-2` (또는 전역 `*:focus-visible`)가 **같은 요소**에 있어야 한다.

**[R-3] 전역 baseline**  
`app/globals.css`(또는 동등 SSOT)에 다음을 유지한다:

```css
*:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
*:focus:not(:focus-visible) {
  outline: none;
}
```

**[R-4] UI primitive SSOT**  
`components/ui/Button`, `Checkbox`, `Tabs`, `Modal`, `CountrySelect`, `BarcodeInputModal` 등은 클래스에 `focus-visible:` 접두를 포함한다.

**[R-5] feature 컴포넌트 점진 이전**  
레거시 `focus:ring-2`는 Mandatory 게이트 Phase 1에서 차단하지 않는다. 전역 baseline이 키보드 outline을 보장한다. 신규·수정 시 `focus-visible:`로 맞춘다.

---

## 6. Recommended Variants

- Tailwind: `focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2`
- variant별 링 색: `focus-visible:ring-red-500` (Button variant map)
- skip link: `sr-only` + `focus:not-sr-only` + `focus-visible:ring-*`

---

## 7. Anti-patterns

| Anti-pattern | 이유 |
|--------------|------|
| `outline-none` without `focus-visible` replacement | 키보드 포커스 소실 |
| `focus:ring-2` only on custom controls | 마우스 클릭 시 링 노출 |
| `tabindex={0}` on non-interactive div without role | 포커스 트랩·스크린리더 혼란 |
| third-party iframe 내부만 포커스 가능 | 앱 baseline으로 보완 불가 — ADR 예외 |

---

## 8. Accessibility / Performance Notes

- WCAG 2.4.7 Focus Visible (Level AA)
- `:focus-visible`은 UA 휴리스틱 사용 — 구형 브라우저는 전역 `*:focus-visible` fallback에 의존
- 추가 box-shadow/ring은 paint 비용 미미; `motion-reduce`와 독립

---

## 9. Implementation Sketch

```tsx
const base =
  'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500';
```

```css
/* globals.css — mandatory baseline */
*:focus-visible { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
*:focus:not(:focus-visible) { outline: none; }
```

---

## 10. Checkability

| 항목 | 방법 | 종류 |
|------|------|------|
| globals baseline | `check:focus-visible-ring` | Hard check |
| UI primitive SSOT (6종) | `check:focus-visible-ring` | Hard check |
| `components/ui` outline-hidden without focus-visible | `check:focus-visible-ring` | Hard check |
| feature `focus:ring-2` 레거시 | allowlist + 점진 PR | Soft (Phase 2) |
| 키보드-only 시각 QA | Tab 탐색 스모크 | Human judgment |

---

## 11. Source Reference

| 프로젝트 | 파일 | 추출 패턴 |
|---------|------|---------|
| Itemwiki | `app/globals.css` | `*:focus-visible` · `:focus:not(:focus-visible)` |
| Itemwiki | `components/ui/Button.tsx` | `focus-visible:ring-*` variant map |
| Itemwiki | [COMPONENT_PATTERN_REGISTRY](../../../itemwiki-constitution/itemwiki-specific/ui-ux/COMPONENT_PATTERN_REGISTRY.md) | FOCUS-R1 7/7 평가 |

**승격 ADR**: Itemwiki `docs/itemwiki-constitution/adr/itemwiki-0009-focus-r1-mandatory.md`  
**추출·승격 일시**: 2026-06-02  
**버전**: 1.0.0 (Mandatory @ 2.16.0)
