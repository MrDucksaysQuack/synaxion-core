# 기능 배치 가이드 (Feature Placement Guide)

**목적**: 새 기능 코드를 어느 계층에 두어야 하는지 결정 규칙을 제공한다.  
**Tier**: 2 (권장). 신규 기능 PR 시 체크리스트로 활용.

---

## 배치 결정 질문 흐름

새 코드를 작성하기 전에 아래 질문을 순서대로 답한다.

### Q1. 이 코드가 특정 UI 프레임워크(React, Next.js)에 의존하는가?

**예** → Q2로  
**아니오** → `packages/lib/` 또는 `src/lib/` (프레임워크 독립 코어)

---

### Q2. 이 코드가 사용자에게 직접 렌더링되는가?

**예** → Q3으로  
**아니오** (서버 로직, 유틸리티) → `src/lib/` 또는 API Route

---

### Q3. 이 코드가 여러 페이지/섹션에서 재사용되는가?

**예** → `src/components/shared/` 또는 `src/components/sections/shared/`  
**아니오** → Q4로

---

### Q4. 이 코드가 특정 페이지 섹션인가?

**예** → `src/components/sections/[page-name]/`  
**아니오** (레이아웃, 내비게이션 등) → `src/components/layout/`

---

## 빠른 참조표

| 코드 유형 | 올바른 위치 | 금지 위치 |
|-----------|-----------|---------|
| 비즈니스 로직 (순수 함수) | `src/lib/` | `src/components/` |
| 정적 데이터, 카피 | `src/content/` | `src/components/` |
| 재사용 UI 컴포넌트 | `src/components/shared/` | `src/app/` |
| 페이지별 섹션 | `src/components/sections/[page]/` | `src/lib/` |
| API 엔드포인트 | `src/app/api/` | `src/components/` |
| 레이아웃 (헤더, 푸터) | `src/components/layout/` | `src/app/` |
| 폰트, 전역 CSS | `src/app/` | `src/components/` |

---

## 위반 패턴 예시

```
❌ src/components/ProductCard.tsx 안에서 직접 fetch() 호출
→ 서버 컴포넌트로 변환하거나 src/lib/에 fetcher 분리

❌ src/lib/formatPrice.ts 안에서 React hook 사용
→ hooks/ 디렉터리로 이동

❌ src/app/[locale]/page.tsx 안에 200줄의 컴포넌트 코드
→ src/components/sections/[page]/로 분리
```

---

## 검증

- **자동**: `pnpm run check:layer-boundaries` — 역방향 import 탐지
- **PR 리뷰**: 이 가이드의 Q1~Q4 체크리스트 적용

**최종 업데이트**: 2026-05-24
