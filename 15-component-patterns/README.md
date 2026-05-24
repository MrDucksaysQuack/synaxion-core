# 15장 — Component Patterns

> **Synaxion Constitution 15장**  
> UI Constitution(13장)·Experience Constitution(14장)이 "무엇이어야 하는가"를 정의한다면,  
> 이 장은 "어떻게 구현하는가"의 검증 가능한 패턴을 정의한다.

---

## 이 장의 역할

Component Patterns는 **헌법이 아니라 패턴 라이브러리**다.

| 구분 | UI Constitution (13장) | Experience Constitution (14장) | Component Patterns (15장) |
|------|----------------------|-------------------------------|--------------------------|
| 성격 | 위반 불가 규칙 | 방향 가이드라인 | 재사용 구현 패턴 |
| 검증 | CI / lint | Design Review Gate | Hard check + Soft review |
| 예시 | "semantic token만 사용" | "Hero는 Warm 온도" | "reveal 애니메이션 구현 방법" |

패턴은 헌법을 **대체하지 않는다**. 헌법이 "무엇이 금지인지"를 정하고, 패턴은 "허용된 범위 안에서 어떻게 하면 좋은지"를 정한다.

---

## 패턴 레벨

| 레벨 | 의미 | 예시 |
|------|------|------|
| **Mandatory** | 헌법 준수에 필요한 구현 방식. 따르지 않으면 헌법 위반 | Semantic token 사용, focus-visible ring |
| **Recommended** | 2개 이상 프로젝트에서 검증된 패턴. 정당한 이유 없이 이탈하면 리뷰에서 설명 요구 | Scroll reveal stagger, section composition |
| **Project-specific** | 특정 프로젝트의 브랜드/요구에 맞는 변형. Synaxion Core에 포함하지 않음 | Truefarm green overlay opacity, 농장 사진 스타일 |

---

## 패턴 채택 기준 (Pattern Adoption Rule)

Synaxion Core에 패턴을 추가하려면 아래 7개 질문 중 **5개 이상** "예"여야 한다.

| # | 질문 | 판단 기준 |
|---|------|---------|
| 1 | 이 구현은 특정 프로젝트에만 맞는가, 아니면 반복 가능한가? | 2개 이상 프로젝트에서 동일하게 쓸 수 있으면 "예" |
| 2 | 이 구현은 원칙을 구현한 것인가, 아니면 취향인가? | Synaxion 원칙에 연결되면 "예" |
| 3 | 이 구현은 token system과 연결되는가? | semantic token 또는 design variable을 사용하면 "예" |
| 4 | 이 구현은 접근성 / 성능을 해치지 않는가? | WCAG 2.1 AA + Core Web Vitals 통과하면 "예" |
| 5 | 다른 프로젝트에서 이름만 바꿔도 쓸 수 있는가? | brand-specific 의존성 없으면 "예" |
| 6 | check:* 또는 review checklist로 검증 가능한가? | 자동화 또는 리뷰 기준 작성 가능하면 "예" |
| 7 | 실패 사례와 anti-pattern을 설명할 수 있는가? | anti-pattern 최소 2개 이상 식별하면 "예" |

**5개 미만**: Project-specific으로 분류, 프로젝트 자체 문서에만 둔다.  
**5–6개**: Recommended로 Core 채택 가능.  
**7개**: Mandatory 후보 — 헌법 개정 절차 필요.

> **"Truefarm은 기준이 아니라 reference extraction source로만 둔다."**  
> Truefarm에서 추출된 패턴은 위 7개 필터를 통과해야만 Core에 들어온다.

---

## 패턴 문서 템플릿 (11섹션)

모든 패턴 문서는 아래 구조를 따른다.

```
# Pattern Name

## 1. Purpose — 이 패턴이 해결하는 문제
## 2. When to Use — 언제 써야 하는가
## 3. When Not to Use — 언제 쓰면 안 되는가
## 4. Required Inputs — 필요한 토큰, 컴포넌트, 상태, 데이터
## 5. Pattern Rules — 반드시 지켜야 하는 규칙
## 6. Recommended Variants — 허용되는 변형
## 7. Anti-patterns — 금지해야 하는 나쁜 사용
## 8. Accessibility / Performance Notes
## 9. Implementation Sketch — 프레임워크에 덜 종속적인 예시
## 10. Checkability — Hard check / Soft review / Human judgment
## 11. Source Reference — 추출된 프로젝트/컴포넌트/상황
```

섹션 5 (Pattern Rules)는 **값이 아니라 원칙**으로 작성한다.  
→ `"overlay opacity: 0.6"` (❌) → `"overlay는 텍스트 contrast ratio 4.5:1 이상을 보장해야 한다"` (✅)

---

## 패턴 목록

| 파일 | 제목 | 레벨 | 핵심 원칙 |
|------|------|------|---------|
| [ANIMATION_CHOREOGRAPHY.md](./ANIMATION_CHOREOGRAPHY.md) | 애니메이션 안무 | Recommended | Motion clarifies hierarchy, not decorates noise |
| [SECTION_COMPOSITION.md](./SECTION_COMPOSITION.md) | 섹션 구성 | Recommended | 각 섹션 타입은 고유한 서사 역할을 가진다 |
| [DARK_MODE_IMPLEMENTATION.md](./DARK_MODE_IMPLEMENTATION.md) | 다크 모드 구현 | Recommended | Dark mode is role remapping, not color inversion |
| [RESPONSIVE_STRATEGY.md](./RESPONSIVE_STRATEGY.md) | 반응형 전략 | Recommended | Responsive design is priority reordering, not shrinking |
| [FORM_UX_PATTERNS.md](./FORM_UX_PATTERNS.md) | 폼 UX 패턴 | Recommended | Form UX quality is measured by recovery, not only completion |
| [LOADING_STATE_PATTERNS.md](./LOADING_STATE_PATTERNS.md) | 로딩 상태 패턴 | Recommended | Loading state is a layout promise — the skeleton tells the user what is coming |

---

## 피해야 할 안티패턴 (공통)

**1. 헌법을 패턴으로 대체하기**  
패턴 문서가 있다는 이유로 헌법 규칙을 무시하면 안 된다.  
패턴은 헌법 위에서 동작한다.

**2. 값(value)을 패턴으로 문서화하기**  
`padding: 48px`, `opacity: 0.6` 같은 구체적 수치는 패턴이 아니다.  
왜 그 범위여야 하는지의 **원칙**을 문서화해야 한다.

**3. Truefarm 스타일을 보편 패턴으로 올리기**  
Truefarm의 농장 이미지, 필리핀 컨텍스트, 특정 색상 조합은 Project-specific이다.  
추출 필터(7개 질문) 없이 Core에 올리면 안 된다.

---

**버전**: 1.0.0  
**소속**: Synaxion Constitution 15장 (15-component-patterns)  
**최초 추출 소스**: truefarm-website 2026-05-25
