# Build Toolchain Alignment
# 빌드 도구체인 정합

> **소스(tsconfig)와 번들러(Vite·Webpack)의 JSX·타겟·alias 설정이 어긋나면 로컬은 통과하고 staging만 터진다.**

**Tier**: 2 (권장 · 2.18.0)  
**연계**: [08-config/ENVIRONMENT_VARIABLES.md](../08-config/ENVIRONMENT_VARIABLES.md)

**최종 업데이트**: 2026-06-23

---

## 1. JSX Runtime 정합

| 설정 | 권장 |
|------|------|
| `tsconfig` `jsx` | `react-jsx` (automatic) |
| Vite `esbuild.jsx` / `react` plugin | automatic과 동일 |
| 금지 | tsconfig `react` (classic) + bundler automatic 혼용 |

**증상**: `React is not defined` — classic scope 기대와 automatic 출력 불일치.

**검증 (인스턴스)**: `check:jsx-react-scope` — `jsx: react` 잔존·classic import 패턴 스캔.

---

## 2. Path Alias Parity

`tsconfig paths` ↔ bundler `resolve.alias` ↔ Jest `moduleNameMapper` **삼중 정합**.

인스턴스 예: `@relationship/*`, `@shared/relationship/*` 추가 시 세 곳 동시 갱신.

---

## 3. Server-only Module Boundary

`jsonwebtoken`, `fs`, native crypto 등은 **FE import graph에서 차단**.  
`check:layer-boundaries` 또는 dedicated `check:browser-bundle-boundary` (인스턴스).

---

## 4. PR 체크리스트

- [ ] tsconfig jsx 변경 시 Vite/Webpack 설정 동반 변경
- [ ] 새 alias는 test runner에도 반영
- [ ] `pnpm run build` + staging smoke (해당 plane)

---

**실증**: Inflomatrix jsx-runtime-hardening J1–J3 (2026-06)
