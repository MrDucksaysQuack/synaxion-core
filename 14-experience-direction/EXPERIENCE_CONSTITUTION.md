# Experience Direction Constitution

> **Synaxion Constitution 14장**  
> 브랜드 경험 연출 레이어의 7개 축 스키마를 정의한다.  
> 이 문서는 구조(스키마)만 정의한다. 실제 값은 프로젝트 인스턴스 문서에 위임한다.

---

## §0 위치와 역할

### UI Constitution과의 관계

```
UI Design Constitution (13장)
= 시각 값이 무질서해지지 않도록 하는 계층 질서

Experience Constitution (14장)
= 시각 시스템이 어떤 감정으로 읽혀야 하는가를 정의하는 연출 질서
```

두 문서는 서로를 대체하지 않는다.

- UI Constitution을 준수했으나 Experience Direction이 없는 UI = 토큰은 정렬됐지만 감정이 없는 화면
- Experience Direction이 있으나 UI Constitution을 어긴 UI = 감정 의도는 있지만 시각 계층이 무너진 화면

**둘 다 완성되어야 브랜드 경험이 완결된다.**

### 정의 의무

모든 Synaxion 기반 프로젝트는 아래 §1–§7의 7개 축을 **반드시** 자신의 인스턴스 문서에 정의해야 한다. 7개 축 중 하나라도 정의되지 않은 UI는 브랜드 경험 완성 상태로 간주하지 않는다.

---

## §1 Brand Emotion Axis (브랜드 감정 축)

### 스키마 목적

브랜드가 사용자에게 전달해야 하는 감정의 좌표를 정의한다. 이 좌표는 모든 시각·카피·레이아웃 결정의 기준점이 된다.

### 필수 정의 항목

인스턴스 문서는 아래 구조로 감정 축을 정의해야 한다.

```
감정 차원 목록 (최소 3개, 권장 5–7개):
  - 차원 이름
  - 0.0–1.0 사이의 강도 값
  - 의도한 효과 한 줄 설명

명시적 제외 목록 (피해야 할 감정 클리셰):
  - 피해야 할 감정 키워드나 비주얼 패턴

포지셔닝 문장 (1–2문장):
  - "이 브랜드는 [A]하지만 [B]하지 않고, [C]하면서도 [D]하다"
```

### 검증 기준

감정 축이 정의되어 있으나 다른 산업에도 그대로 적용 가능하다면 충분히 구체적이지 않은 것이다. 재정의가 필요하다.

---

## §2 Image Treatment Matrix (이미지 처리 매트릭스)

### 스키마 목적

이미지를 사용 목적에 따라 분류하고, 각 타입별 시각 처리 기준을 고정한다. 컴포넌트별 임의 처리를 방지한다.

### 필수 정의 항목

인스턴스 문서는 아래 4가지 이미지 타입을 모두 정의해야 한다.

| 타입 | 정의해야 할 속성 |
|------|----------------|
| **Hero Image** | opacity, overlay 방식, crop 기준, 텍스트 중첩 허용 여부 |
| **Context Image** | opacity 범위, overlay 강도, 텍스트 우선순위 관계 |
| **Texture Image** | opacity 범위, blur/desaturation 허용 여부, 의미 전달 금지 명시 |
| **Evidence Image** | overlay 제한, 실제성 요건(실물/현장/사람 기준) |

### 규칙

- 정의된 4가지 타입 외 임의 opacity 또는 overlay 사용 금지
- Evidence Image에는 감정 연출 목적의 overlay를 적용하지 않는다
- 이미지 처리 기준은 CSS 변수 또는 Tailwind 클래스로 토큰화하는 것을 권장한다

### 공식

```
Image Treatment = Image Role + Narrative Weight + Text Dependency
```

---

## §3 Negative Space Density Tier (여백 밀도 계층)

### 스키마 목적

여백의 양이 아닌 **여백의 의도**를 정의한다. 동일한 8pt 그리드 안에서도 섹션마다 적절한 밀도 레벨이 다르다.

### 필수 정의 항목

인스턴스 문서는 아래 4가지 밀도 레벨을 정의해야 한다.

| 레벨 | 정의해야 할 속성 |
|------|----------------|
| **Open** | 사용 맥락(브랜드 선언, 감정 호흡), section gap 기준, 허용 content density |
| **Balanced** | 사용 맥락(일반 설명, 기능 소개), section gap 기준 |
| **Dense** | 사용 맥락(데이터, 리스트, 운영), section gap 기준 |
| **Compressed** | 사용 맥락(urgency, CTA 직전), 사용 제한 조건 |

### 공식

```
Space Amount = Message Weight − Information Density + Emotional Pause
```

### 규칙

- 프리미엄 감성은 spacing 토큰 값이 아니라 밀도 대비에서 발생한다
- Compressed 레벨은 짧은 구간에만 허용한다. 연속 사용 금지

---

## §4 Page Narrative Rhythm (페이지 내러티브 리듬)

### 스키마 목적

페이지를 "조립된 섹션 블록"이 아닌 "감정의 진행"으로 설계하기 위한 섹션 순서와 감정 전환 규칙을 정의한다.

### 필수 정의 항목

인스턴스 문서는 아래를 정의해야 한다.

```
기본 페이지 내러티브 구조 (5단계):
  - 각 단계의 이름과 감정 목적
  - 각 단계에 대응하는 실제 섹션 또는 컴포넌트

섹션별 감정 밀도 매핑:
  - 각 단계의 Density Tier (§3 참조)
  - 각 단계에 허용되는 Image Treatment 타입 (§2 참조)
```

### 권장 구조 (프로젝트별 언어로 재정의)

```
1단계: Promise   — 브랜드의 미래 비전 선언
2단계: Grounding — 현실 문제 또는 현장 근거
3단계: Mechanism — 구조적 해결 방식
4단계: Proof     — 실제성과 신뢰 증거
5단계: Action    — 참여 요청
```

이 구조는 권장 패턴이다. 프로젝트 특성에 맞게 단계명과 순서를 조정할 수 있다. 단, 5단계 구조는 유지를 권장한다.

### 공식

```
Page Flow = Emotion → Problem → Structure → Proof → Action
```

---

## §5 Component Emotional Temperature (컴포넌트 감정 온도)

### 스키마 목적

동일한 색상 토큰을 사용해도 배치·여백·이미지·카피에 따라 감정 온도가 달라진다. 컴포넌트별 의도된 감정 온도를 정의하고 일관성을 유지한다.

### 필수 정의 항목

인스턴스 문서는 아래 4가지 온도 레벨을 정의해야 한다.

| 레벨 | 정의해야 할 속성 |
|------|----------------|
| **Warm** | padding 기준, radius, shadow, 이미지 타입, 카피 톤 |
| **Neutral** | 기본 정보 전달 컴포넌트의 기준값 |
| **Cool** | 데이터·구조 설명용 기준값 |
| **Technical** | 운영·관리·프로세스용 기준값 |

그리고 프로젝트의 주요 컴포넌트 또는 섹션을 위 4가지 중 하나에 매핑해야 한다.

### 공식

```
Component Temperature =
  Color Warmth
  + Spacing Generosity
  + Shape Softness
  + Copy Humaneness
  + Image Presence
```

### 규칙

- 온도는 색상 토큰만으로 결정되지 않는다. 5개 요소의 조합이다
- 같은 페이지 안에서 Warm과 Technical이 인접하면 감정 단절이 발생할 수 있다. 전환 섹션 배치를 권장한다

---

## §6 Icon / Emoji Maturity Rule (아이콘·이모지 성숙도 규칙)

### 스키마 목적

이모지를 금지하거나 무제한 허용하는 대신, 사용 단계와 SVG 전환 조건을 정의한다.

### 필수 정의 항목

인스턴스 문서는 아래를 정의해야 한다.

```
이모지 허용 맥락 목록:
  - 어떤 UI 위치/상태에서 이모지 사용이 허용되는가

이모지 제한 맥락 목록:
  - 어떤 UI 위치/상태에서 이모지 사용이 금지되는가

SVG 전환 트리거 조건:
  - 어떤 조건이 충족되면 이모지를 SVG 아이콘으로 교체해야 하는가
```

### SVG 전환 판단 기준 (권장)

아래 조건 중 하나 이상 해당하면 SVG 전환을 강하게 권장한다.

```
- 동일 이모지가 3회 이상 반복 사용됨
- 해당 아이콘이 내비게이션 역할을 담당함
- 브랜드 신뢰를 대표하는 위치(Hero, CTA, 파트너 섹션)에 사용됨
- 데스크톱 랜딩 페이지의 주요 카드에 반복됨
```

### 공식

```
Emoji → SVG 전환 조건 = Repeated Use + Navigation Role + Brand Weight
```

### 원칙

이모지는 **임시 감정 장치**로는 허용하되, **브랜드 시스템 자산**이 될 때는 SVG로 전환한다.

---

## §7 Microcopy Voice Matrix (마이크로카피 보이스 매트릭스)

### 스키마 목적

버튼, 레이블, 오류 메시지, 빈 상태 등 짧은 텍스트의 브랜드 태도를 일관되게 유지한다. 기능적으로 동일한 카피라도 브랜드 태도가 다르면 경험이 분열된다.

### 필수 정의 항목

인스턴스 문서는 아래 4가지 카피 유형별 기준을 정의해야 한다.

| 유형 | 정의해야 할 속성 |
|------|----------------|
| **Action CTA** | 즉각 행동을 요구하는 버튼 카피 기준 |
| **Belonging CTA** | 커뮤니티·생태계 참여를 유도하는 카피 기준 |
| **Learning CTA** | 더 알아보기·탐색 유도 카피 기준 |
| **Operational CTA** | 신청·제출·관리·확인 등 운영 기능 카피 기준 |

그리고 각 유형에 대해 아래를 명시해야 한다.

```
- 허용 어조 (예: 직접적, 인간적, 중립적)
- 금지 어조 (예: 관료적, 위협적, 과도하게 캐주얼)
- 적합 UI 위치
- 예시 카피 (언어별 포함 권장)
```

### 공식

```
CTA Quality = Clarity + Emotional Fit + User Stage
```

### 원칙

- 처음 만나는 사용자에게는 비전형 카피
- 행동 직전 사용자에게는 명확한 카피
- 운영 화면에서는 감성보다 정확성
- 오류·빈 상태에서는 위협보다 회복 경로

---

## §8 Enforcement 모델

Experience Constitution은 UI Constitution(13장)과 다른 검증 구조를 갖는다.

### UI Constitution vs Experience Constitution

| 항목 | UI Constitution | Experience Constitution |
|------|----------------|------------------------|
| 위반 감지 | 자동화 가능 (lint, CI) | 자동화 불가 항목 포함 |
| 검증 방식 | check:* 스크립트 | Design Review Gate |
| 판단 주체 | CI 시스템 | 인간 (디자이너·개발자·PM) |
| 강제 레벨 | Level 1–4 | Level 1 + Design Gate |

### Design Review Gate

Experience Direction이 정의된 프로젝트에서는 아래 체크리스트를 **브랜드 완성 Gate**로 사용한다.

```
[ ] Brand Emotion Axis가 프로젝트 인스턴스 문서에 정의되어 있는가
[ ] 각 이미지 타입의 opacity/overlay 기준이 정의되어 있는가
[ ] 섹션별 Density Tier가 지정되어 있는가
[ ] 페이지 5단계 내러티브 구조가 검토되었는가
[ ] 주요 컴포넌트의 감정 온도가 매핑되어 있는가
[ ] 이모지 허용/제한 맥락과 SVG 전환 조건이 정의되어 있는가
[ ] CTA 카피 유형별 기준이 정의되어 있는가
[ ] 7개 축 중 미정의 항목이 없는가
```

위 체크리스트에서 하나 이상 미통과 시, 해당 UI는 브랜드 경험 완성 상태로 간주하지 않는다.

### 자동화 가능한 부분

아래 항목은 스크립트 또는 CI로 부분 검증이 가능하다.

```
- 인스턴스 문서(EXPERIENCE_DIRECTION.md)의 존재 여부
- 7개 축 섹션 헤딩의 존재 여부 (grep 수준)
- 이미지 컴포넌트에 타입 속성 누락 여부 (AST 분석)
```

전면 자동화는 의도하지 않는다. Experience Direction은 인간 판단을 요구하는 영역이다.

---

## §9 Synaxion Core 연결

| 이 헌법 조항 | 연결되는 Synaxion 원칙 |
|-------------|----------------------|
| §1 Brand Emotion Axis | UI Constitution §02 Color System — 색상 선택의 감정 근거 제공 |
| §2 Image Treatment | UI Constitution §08 Image/Media — overlay 필수 규칙의 감정 의도 |
| §3 Density Tier | UI Constitution §04 Spatial System — spacing 토큰의 감정 역할 |
| §4 Page Narrative | Design Flow Principles — 페이지 플로 체크리스트와 연동 |
| §5 Component Temperature | UI Constitution §07 State Expression — 상태 표현의 온도 기준 |
| §6 Icon Maturity | UI Constitution §09 Forbidden Rules — raw 이모지 남용 금지 |
| §7 Microcopy Voice | UX Feedback & Accessibility — 오류·피드백 카피 접근성 |

---

**버전**: 1.0.0  
**최종 업데이트**: 2026-05-24 — 초기 제정  
**소속**: Synaxion Constitution 14장
