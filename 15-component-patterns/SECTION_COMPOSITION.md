# Section Composition Pattern

> **레벨**: Recommended  
> **핵심 원칙**: 각 섹션 타입은 고유한 서사 역할을 가진다. 역할이 없는 섹션은 페이지에 있을 이유가 없다.

---

## 1. Purpose — 이 패턴이 해결하는 문제

페이지를 구성할 때, 섹션을 "넣고 싶어서" 넣으면 페이지에 서사 흐름이 없어진다.  
사용자는 각 섹션에서 무엇을 기대해야 할지 알 수 없고, 페이지는 의미 없이 길어진다.

이 패턴이 방지하는 문제:
- 동일한 섹션 타입이 이름만 다르게 반복됨
- 한 섹션이 여러 서사 역할을 동시에 수행하려 함
- 섹션 구조가 페이지마다 다르게 구현되어 일관성 없음
- 필수 요소 없이 섹션이 조립됨

---

## 2. When to Use

- 마케팅/랜딩 페이지의 섹션 구조 설계 시
- 여러 페이지에 동일 섹션 타입이 반복될 때 일관성 확보
- 새 페이지 설계 시 서사 흐름 검증
- 컴포넌트를 재사용하기 전 역할 명세 확인

---

## 3. When Not to Use

- 앱 내부 UI (대시보드, 설정 화면 등) — 이 패턴은 마케팅/콘텐츠 페이지용
- 단일 섹션으로만 구성된 간단한 페이지
- 서사 흐름이 아닌 데이터 표시가 목적인 페이지

---

## 4. Required Inputs

| 항목 | 설명 |
|------|------|
| 섹션의 서사 역할 정의 | "이 섹션이 사용자에게 무엇을 말하는가" |
| 헤드라인 | 역할을 한 문장으로 표현하는 필수 요소 |
| Semantic HTML (`<section>`, `aria-labelledby`) | 접근성 구조 |
| Background token | `bg-surface-*` 계열 semantic token |

---

## 5. Pattern Rules

**[R-1] 한 섹션은 하나의 서사 역할만 수행한다**  
"문제 제시"와 "해결책 소개"를 동시에 하면 안 된다. 역할이 2개면 섹션을 분리한다.

**[R-2] 각 섹션 타입에는 Required 요소가 있다**  
아래 섹션 타입 정의에서 Required로 표시된 요소가 없으면 해당 섹션 타입을 사용하면 안 된다.

**[R-3] 섹션 간 배경색은 인접 섹션과 달라야 한다**  
동일한 배경이 연속되면 섹션 경계가 인식되지 않는다. light/surface/muted 등 교차 적용.

**[R-4] 섹션의 수직 padding은 density tier에 따라 결정된다**  
Experience Constitution의 Density Tier(Open/Balanced/Dense/Compressed)를 따른다.  
각 페이지의 감정 온도에 맞는 tier를 적용한다.

**[R-5] 모든 섹션에는 `<section aria-labelledby="...">` 마크업이 있어야 한다**  
시각적으로 숨겨진 heading이라도 접근성을 위해 필수다.

---

## 6. 섹션 타입 정의

### Hero
**서사 역할**: 첫인상 — 무엇을 하는 곳인가를 3초 안에 전달한다.

| 요소 | 상태 |
|------|------|
| Primary headline | Required |
| Sub-headline 또는 descriptor | Required |
| Primary CTA | Required |
| Background image 또는 visual | Recommended |
| Secondary CTA | Optional |
| Social proof 숫자 | Optional |

**금지**: 3개 이상의 CTA, 네비게이션 요소, 세부 설명 단락

---

### Problem
**서사 역할**: 사용자가 지금 겪고 있는 고통을 언어로 표현한다. 공감을 만든다.

| 요소 | 상태 |
|------|------|
| Problem statement headline | Required |
| 문제 상황 묘사 (텍스트 또는 이미지) | Required |
| 감정적 공감 요소 | Recommended |

**금지**: 해결책 언급, CTA, 브랜드 자랑

---

### Solution
**서사 역할**: 이 제품/서비스가 문제를 어떻게 해결하는지 설명한다.

| 요소 | 상태 |
|------|------|
| Solution statement headline | Required |
| 작동 방식 설명 (3개 이하 포인트) | Required |
| 보조 이미지 또는 다이어그램 | Recommended |
| CTA | Optional |

**금지**: 4개 이상의 포인트 (→ Feature Grid로 분리), 가격/수치 (→ Proof 섹션)

---

### Feature Grid
**서사 역할**: 기능/특성 목록을 탐색 가능한 형태로 제시한다.

| 요소 | 상태 |
|------|------|
| Grid 헤드라인 | Required |
| 3–6개 feature card | Required |
| 각 카드: 아이콘/이미지 + 제목 + 설명 | Required |

**금지**: 7개 이상 카드 (인지 부하), 카드 안 CTA 중복

---

### Split (텍스트 + 이미지)
**서사 역할**: 하나의 중심 주장을 이미지와 텍스트의 대비로 강조한다.

| 요소 | 상태 |
|------|------|
| 섹션 헤드라인 | Required |
| 이미지 (절반 영역) | Required |
| 설명 텍스트 | Required |
| CTA | Optional |

**금지**: 양쪽에 텍스트만 배치, 이미지 없이 Split 레이아웃 사용

---

### Process
**서사 역할**: 순서가 있는 절차나 단계를 순서대로 보여준다.

| 요소 | 상태 |
|------|------|
| Process 헤드라인 | Required |
| 번호 있는 스텝 (3–6개) | Required |
| 각 스텝: 번호 + 제목 + 짧은 설명 | Required |

**금지**: 순서 없는 항목에 Process 사용 (→ Feature Grid), 7개 이상 스텝

---

### Proof
**서사 역할**: 수치·증거·인용으로 신뢰를 쌓는다.

| 요소 | 상태 |
|------|------|
| Proof 헤드라인 또는 컨텍스트 | Required |
| 수치/인용/로고 중 최소 1가지 | Required |
| 출처 또는 컨텍스트 | Recommended |

**금지**: 출처 없는 수치, 검증 불가 주장

---

### CTA (Call to Action)
**서사 역할**: 사용자에게 다음 행동을 명확히 요청한다.

| 요소 | 상태 |
|------|------|
| 행동 유도 헤드라인 | Required |
| Primary CTA button | Required |
| Supporting text | Recommended |
| Secondary CTA | Optional |

**금지**: 3개 이상 CTA, CTA 없는 CTA 섹션

---

### FAQ
**서사 역할**: 잠재적 반론과 질문을 미리 해소한다.

| 요소 | 상태 |
|------|------|
| FAQ 섹션 헤드라인 | Required |
| 질문-답변 쌍 (3–8개) | Required |
| 아코디언 또는 순차 표시 | Recommended |

**금지**: 답변 없는 질문, 8개 초과 (→ 별도 FAQ 페이지로 분리)

---

## 7. Anti-patterns

**❌ "모든 것" 섹션**  
한 섹션이 헤드라인 + 기능 목록 + 수치 + CTA를 모두 담으면 사용자는 우선순위를 알 수 없다.

**❌ Hero 이후 바로 CTA**  
Hero에서 이미 행동을 요청했는데 바로 다음 섹션에서 또 요청하면 서사 없이 판매만 한다.

**❌ 동일 배경색 연속**  
`bg-white → bg-white → bg-white` — 섹션 경계가 사라지고 페이지가 하나처럼 읽힘.

**❌ Feature Grid를 Process로 사용**  
순서 없는 특성 목록에 번호를 붙이면 사용자가 순서를 기대하게 된다.

**❌ 증거 없는 Proof 섹션**  
"업계 최고", "최다 사용" 같은 주장만 있고 수치·출처가 없으면 오히려 신뢰를 해친다.

---

## 8. Accessibility / Performance Notes

**접근성**
- 모든 `<section>`에는 `aria-labelledby` 또는 `aria-label` 필수.
- 시각적으로 숨겨진 heading (`sr-only`)이라도 스크린 리더를 위해 있어야 한다.
- Hero 이미지의 장식 이미지는 `alt=""` (빈 alt). 정보 이미지는 의미 있는 alt 필수.

**성능**
- Hero 이미지: LCP(Largest Contentful Paint) 대상 → `loading="eager"` + `fetchpriority="high"`
- 접히는 영역(fold below) 이미지: `loading="lazy"`
- 이미지가 많은 섹션(Feature Grid, Proof)은 WebP + `srcset` 사용.

---

## 9. Implementation Sketch

```tsx
// Section 기본 구조 (프레임워크 독립 개념)

// 모든 섹션에 공통 적용:
// <section aria-labelledby="section-id-heading">
//   <h2 id="section-id-heading" class="sr-only | visible-heading">...</h2>
//   [내용]
// </section>

// Hero 섹션 필수 구조
const HeroSection = () => (
  <section aria-labelledby="hero-heading">
    <div className="relative">
      {/* background image with overlay */}
      <img alt="" aria-hidden="true" loading="eager" fetchPriority="high" />
      <div className="overlay" /> {/* semantic overlay token */}
    </div>
    <div className="content">
      <h1 id="hero-heading">{headline}</h1>
      <p>{subHeadline}</p>
      <a href={ctaHref}>{ctaLabel}</a> {/* Primary CTA: Required */}
    </div>
  </section>
);

// Feature Grid 필수 구조 (3–6 카드)
const FeatureGrid = () => (
  <section aria-labelledby="features-heading">
    <h2 id="features-heading">{gridHeadline}</h2>
    <ul role="list" className="grid">
      {features.map((f) => (
        <li key={f.id}>
          <img src={f.icon} alt="" aria-hidden="true" />
          <h3>{f.title}</h3>
          <p>{f.description}</p>
        </li>
      ))}
    </ul>
  </section>
);
```

---

## 10. Checkability

| 항목 | 방법 | 종류 |
|------|------|------|
| 모든 `<section>`에 `aria-labelledby` 존재 | `check:accessibility` (lint / grep) | Hard check |
| Hero에 Primary CTA 존재 | 코드 리뷰 | Soft review |
| 인접 섹션 배경색 교차 | 시각 QA | Human judgment |
| 섹션 타입 역할 준수 (한 섹션 = 한 역할) | 페이지 리뷰 | Human judgment |
| Feature Grid 카드 수 3–6 준수 | 코드 리뷰 | Soft review |

---

## 11. Source Reference

| 프로젝트 | 파일 | 추출 패턴 |
|---------|------|---------|
| truefarm-website | `src/components/sections/HomeHeroSection.tsx` | Hero 구조 (headline + CTA + image overlay) |
| truefarm-website | `src/components/sections/ProblemSection.tsx` | Problem 섹션 역할 분리 |
| truefarm-website | `src/components/sections/CTASplitSection.tsx` | Split + CTA 조합 |
| truefarm-website | `src/components/sections/HomeVisionSection.tsx` | Solution 섹션 구조 |
| truefarm-website | `synaxion-core/14-experience-direction/EXPERIENCE_CONSTITUTION.md §4` | 5단계 페이지 내러티브 리듬 |

**추출 일시**: 2026-05-25  
**버전**: 1.0.0
