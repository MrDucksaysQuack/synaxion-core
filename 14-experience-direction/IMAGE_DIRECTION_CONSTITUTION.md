# Image Direction Constitution

> **Synaxion Constitution 14장 부속 문서**  
> AI 이미지 생성 거버넌스와 시각 내러티브 시스템의 보편 스키마를 정의한다.  
> 이 문서는 구조(스키마)만 정의한다. 실제 프롬프트·로케이션·브랜드 값은 프로젝트 인스턴스 문서에 위임한다.

---

## §0 위치와 역할

### Experience Constitution §02와의 관계

```
Experience Constitution §02 Image Treatment Matrix
= UI 안에서 이미지를 어떻게 처리할 것인가
  (opacity, overlay, crop 기준, 텍스트 우선순위)

Image Direction Constitution
= 이미지를 어떻게 생성·조달·배정할 것인가
  (프롬프트 구조, 장면 분류, 에너지 리듬, 내러티브 소유권)
```

두 문서는 서로를 대체하지 않는다. 완결된 이미지 시스템을 위해 둘 다 필요하다.

### 정의 의무

AI 이미지 생성을 사용하는 Synaxion 기반 프로젝트는 아래 §1–§5의 스키마를 자신의 인스턴스 문서에 반드시 정의해야 한다.

---

## §1 4-Layer Prompt Architecture (프롬프트 4층 구조)

### 원칙

모든 AI 이미지 프롬프트는 4개 층의 조합으로 구성해야 한다. 층 없이 자유 텍스트로만 작성된 프롬프트는 브랜드 일관성을 보장할 수 없다.

### 4층 구조

| 층 | 이름 | 역할 | 범위 |
|----|------|------|------|
| **Layer 1** | Brand Layer | 색상·분위기·촬영 스타일·인물 설정 — **모든 이미지 공통** | 프로젝트 전체 |
| **Layer 2** | Scene Layer | 감정 카테고리 + Visual Tempo (에너지) | 슬롯 그룹별 |
| **Layer 3** | Narrative Layer | 슬롯별 "영화 장면" 소유권 | 슬롯 단위 |
| **Layer 4** | Slot Layer | 파일 경로, 구체 장면, Negative Prompt | 슬롯 단위 |

### 조합 공식

```
최종 프롬프트 = [Brand Layer] + [Scene + Tempo block] + [Slot prompt] + [Category negatives] + [Quality tags]
```

### 규칙

- Layer 1(Brand Layer)은 모든 슬롯에 공통으로 적용한다. 슬롯별 예외 금지
- Layer 2는 Scene Category 1개를 Primary로, 최대 1개를 Secondary로 지정한다
- Layer 3(Narrative)은 각 슬롯이 소유하는 장면 장르를 단 하나 정의한다
- Layer 4의 Negative Prompt는 Global negatives + Category negatives를 반드시 포함한다

---

## §2 Scene Categories (장면 감정 분류)

### 목적

이미지를 감정 역할에 따라 분류한다. 페이지마다 의도된 감정이 다른데 이미지가 같은 감정으로 수렴하면 브랜드 경험이 균질화된다. Scene Categories는 이를 방지하는 분류 체계다.

### 스키마 — 인스턴스 문서에서 정의해야 할 항목

인스턴스 문서는 프로젝트에 필요한 모든 Scene Category를 아래 구조로 정의해야 한다.

```
Category 이름:
  emotion: 이 장면이 전달하는 핵심 감정 (한 단어 또는 짧은 구)
  composition: 구도 지침 (앵글, 피사체 배치, 네거티브 스페이스)
  people: 인물 수·거리·역할 지침
  motion_focus: 정지·움직임·집중 지침
  primary_slots: 이 카테고리를 Primary로 사용하는 슬롯 목록
```

### 권장 Category 유형 (프로젝트별 조합·이름 조정 가능)

| 유형 | 전형적 감정 | 전형적 쓰임 |
|------|-----------|-----------|
| Vision | 웅장함·가능성 | 브랜드 홈, OG 이미지 |
| Human | 따뜻함·신뢰 | 소개·연락·인물 |
| Work | 활동성·전문성 | 작업 과정 소개 |
| Technology | 미래감·정밀 | 기술·도구 설명 |
| Logistics | 신뢰·질서 | 공급망·구조 |
| Community | 참여감·포용 | 참여 유도 |
| Nature | 생명력·공간 | 배경·생태계 |
| Governance | 구조감·안정 | 신뢰 구조·시스템 |

이 목록은 예시다. 프로젝트 도메인에 따라 카테고리를 추가·제거·이름 변경할 수 있다.

### 규칙

- **각 페이지의 Hero 슬롯은 Primary Category 1개만 지정한다.** 두 Hero가 같은 Primary를 공유하면 Narrative Collision이 발생한다
- "Collaboration(협력)"과 같이 여러 카테고리에 걸치는 감정은 독립 카테고리로 두지 않는다. 기존 카테고리 조합으로 표현한다

---

## §3 Visual Tempo (시각 에너지 리듬)

### 목적

Scene Category가 "무엇을 보여주는가"를 정의한다면, Visual Tempo는 "어떤 에너지로 보여주는가"를 정의한다. 사이트 전체가 같은 에너지로 수렴하면 방문자는 이미지를 구분하지 못한다.

### 5가지 Tempo 레벨

| Tempo | 의미 | 카메라 느낌 |
|-------|------|-----------|
| **Slow** | 공간감, 숨 고르기, 스케일 | 고정 와이드, 최소 모션 블러 |
| **Medium** | 인간적 리듬, 자연스러운 정지 | 아이레벨, 자연스러운 포즈 |
| **Active** | 현장 미드모션, 에너지 | 1/250s 느낌, 손·발 움직임 |
| **Structured** | 정적·기하학적 | 시메트릭, 탑다운, 블러 없음 |
| **Warm Social** | 레이어드 사회적 에너지 | 와이드 24mm, 전경/배경 레이어 |

### Site Tempo Arc 원칙

페이지 내비게이션 순서에 따라 에너지가 의도적으로 변해야 한다. 모든 페이지가 동일 Tempo이면 사이트가 단조로워진다.

인스턴스 문서에서는 주요 페이지 순서에 따른 Tempo 흐름을 정의해야 한다.

```
예: Slow → Medium → Active → Structured → Warm Social
```

### 규칙

- Scene Category와 Visual Tempo는 독립적으로 지정한다. 같은 Category라도 Tempo가 다르면 완전히 다른 이미지가 나온다
- 한 페이지 내 여러 슬롯이 모두 동일 Tempo이면 리듬 검토를 권장한다

---

## §4 Narrative Ownership (내러티브 소유권)

### 원칙

각 페이지의 Hero 이미지는 **하나의 영화 장면 장르를 소유한다.** 다른 페이지의 장면을 빌리지 않는다.

이 원칙이 없으면 여러 페이지가 시각적으로 같은 "회의 장면"이나 "악수 장면"으로 수렴한다.

### 스키마 — 인스턴스 문서에서 정의해야 할 항목

```
페이지/슬롯별:
  narrative: 이 슬롯이 소유하는 장면 장르 (영화적 설명 1줄)
  owns: 이 슬롯이 독점 소유하는 시각 요소 (예: 수평선, 초상, 군중)
  must_not_steal_from: 다른 슬롯의 시각 요소 중 이 슬롯에 등장하면 안 되는 것
```

### Collision Matrix 요건

Narrative Ownership 정의 후, 반드시 Collision Matrix를 작성해야 한다.

```
Collision Matrix:
  - 페이지 A의 Hero가 페이지 B처럼 보이면 안 되는 이유
  - 교차 검수 항목 (A → B, B → A 양방향)
```

이 매트릭스는 이미지 생성 후 QA 체크리스트로 사용한다.

---

## §5 Image Slot System (이미지 슬롯 체계)

### 목적

프로젝트의 모든 이미지 사용처를 슬롯으로 등록하고, 각 슬롯의 메타데이터를 고정한다. 슬롯 없이 이미지를 임의로 배치하면 해상도·비율·감정 역할이 제각각이 된다.

### 슬롯 타입 분류

| 타입 | 역할 | 해상도 가이드 |
|------|------|-------------|
| **Hero** | 페이지 첫 감정 앵커 | 1200×900 (4:3) 또는 와이드 |
| **Profile** | 인물 신뢰 표현 | 600×600 (1:1) |
| **Section Background** | 섹션 분위기 보조, overlay 하단 | 1440×810 (16:9) |
| **Strip Background** | 와이드 파노라믹 스트립 | 1440×480 (3:1) |
| **Role / Detail** | 역할·카드·슬라이더 배경 | 800×600 (4:3) |
| **OG / Social** | 소셜 공유 | 1200×630 (OG 표준) |

### 슬롯 등록 스키마

인스턴스 문서에서 각 슬롯은 아래 항목을 포함해야 한다.

```
슬롯 ID:
  file_path: 실제 파일 경로
  component: 사용 컴포넌트명
  resolution: 생성 해상도 (px)
  slot_type: Hero / Profile / Section Background / Strip / Role / OG
  scene_primary: Primary Scene Category
  scene_secondary: Secondary Scene Category (선택)
  tempo: Visual Tempo 레벨
  narrative: Narrative Ownership 한 줄
  collision_avoid: 피해야 할 다른 슬롯의 시각 요소
  status: 생성완료 / 재생성권장 / 생성필요
```

### 파일 저장 규칙

인스턴스 문서에서 정의하되, 아래 원칙은 보편 적용한다.

```
- 포맷: 웹용 .jpg (lossy) 또는 .webp
- 파일명: 소문자, 하이픈 분리, 타입별 접두사 (hero-, bg-, role-, og-)
- 위치: 프레임워크의 정적 파일 디렉터리 (예: /public/images/)
```

---

## §6 Negative Prompt Governance (네거티브 프롬프트 거버넌스)

### 원칙

AI 이미지 생성기는 특정 조합(예: "농업 + 사람 + 디바이스")에서 특정 시각 패턴으로 반복 회귀하는 경향이 있다. Negative Prompt 없이 생성하면 슬롯별 Narrative Ownership이 무너진다.

### 2층 Negative Prompt 구조

```
Global negatives: 모든 슬롯에 공통 적용하는 금지 요소
  - 브랜드 이미지를 손상하는 요소 (예: 빈곤 이미지, 과도한 어둠)
  - 기술적 결함 (예: 워터마크, 텍스트 오버레이, HUD)

Category negatives: Scene Category별로 정의하는 금지 요소
  - 해당 카테고리로 회귀하기 쉬운 잘못된 패턴
  - 다른 카테고리의 시각 요소가 침범하는 것
```

### 규칙

- Global negatives는 모든 슬롯 프롬프트 끝에 반드시 포함한다
- 각 Scene Category는 독립적인 Category negatives를 가져야 한다
- Slot Layer에서 해당 슬롯의 Narrative를 위협하는 추가 요소를 명시할 수 있다

---

## §7 OG / Social Share Image System

### 역할과 범위

OG(Open Graph) 이미지는 URL이 소셜 미디어, 메신저, 이메일에서 공유될 때 나타나는 시각 대표 이미지다. 사용자가 사이트를 방문하기 전에 보는 첫 번째 인상이며, 클릭률에 직접 영향을 준다.

이 섹션은 Slot System(§5)의 확장이다. OG 슬롯은 웹 UI에 표시되지 않지만 동일한 Brand Layer와 Scene Category 체계를 따른다.

### 기술 규격 (보편 적용)

| 항목 | 규격 | 이유 |
|------|------|------|
| 크기 | **1200 × 630px** | Facebook/Twitter/LinkedIn/KakaoTalk 공통 권장 |
| 포맷 | JPEG (.jpg) 또는 PNG | WebP는 일부 플랫폼 미지원 |
| 파일 크기 | **8MB 이하** (권장 1MB 이하) | 플랫폼 업로드 제한 |
| 파일명 접두사 | `og-` | § 파일 저장 규칙 준수 |
| Safe zone | 상하좌우 **60px 내부** | 플랫폼별 크롭 마진 |

### Text Safe Zone

```
┌─────────────────────────────────────────┐
│  60px margin                            │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │   이 영역 안에만 텍스트/로고 배치  │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│  60px margin                            │
└─────────────────────────────────────────┘
1200 × 630px
```

### OG 슬롯 타입

| 슬롯 타입 | 사용 시점 | 레이아웃 |
|---------|---------|--------|
| **Site Default** | OG 태그가 없는 모든 페이지 | 브랜드 이미지 + 로고 + 사이트명 |
| **Page-specific** | 중요 페이지 (홈, 프로그램, 모집 등) | 페이지 고유 이미지 + 페이지 제목 |
| **Dynamic** | 사용자별 콘텐츠 (프로필, 신청 완료 등) | 서버사이드 생성 (Satori, Canvas API 등) |

### 인스턴스 문서 정의 의무

프로젝트 OG 이미지 인스턴스 문서는 아래 항목을 정의해야 한다.

```
1. Site Default OG 이미지 파일 경로
2. Page-specific OG 슬롯 목록 (페이지 경로 + 파일 경로)
3. Dynamic OG 생성 여부 및 방법 (생성 안 하면 명시적 제외 결정)
4. 텍스트 포함 시 폰트/색상/배치 기준
5. 각 슬롯의 Brand Layer (§1) + Scene Category (§2) 지정
```

### 패턴 규칙

**[R-1] Site Default는 반드시 존재해야 한다**  
Page-specific이 없는 페이지에 Site Default OG 이미지가 없으면 플랫폼이 임의로 이미지를 선택한다.

**[R-2] OG 이미지의 텍스트는 safe zone 안에 위치해야 한다**  
모바일 앱(KakaoTalk, iMessage)은 이미지를 더 작게 크롭한다. 60px margin 안쪽만 안전하다.

**[R-3] OG 이미지는 Brand Layer 값을 따른다**  
인스턴스의 Brand Layer에 정의된 감정 좌표, 색상 팔레트, 폰트가 OG 이미지에도 적용되어야 한다.  
브랜드 컬러가 없는 generic stock photo 금지.

**[R-4] 텍스트 contrast는 4.5:1 이상이어야 한다**  
이미지 위에 텍스트를 올릴 때 overlay 또는 텍스트 색상으로 contrast를 보장한다.

### Design Review Gate 추가 체크리스트

```
[ ] Site Default OG 이미지가 존재하는가
[ ] 각 주요 페이지에 page-specific OG 슬롯이 지정되었는가
[ ] 모든 OG 이미지가 1200×630px 규격을 충족하는가
[ ] 텍스트가 있는 경우 safe zone(60px) 안에 위치하는가
[ ] OG 이미지가 Brand Layer 색상/감정 좌표와 일관되는가
[ ] 실제 소셜 플랫폼에서 미리보기 확인이 완료되었는가
```

---

## §8 Enforcement 모델 (기존 §7)

Image Direction Constitution의 검증은 EXPERIENCE_CONSTITUTION.md §8과 동일하게 Design Review Gate로 처리한다.

### 자동화 가능한 부분

```
- 인스턴스 문서(AI_IMAGE_DIRECTION.md 또는 동등물)의 존재 여부
- 모든 슬롯이 슬롯 등록 스키마의 필수 항목을 포함하는지
- 이미지 파일이 지정된 경로에 실제로 존재하는지
- 파일명이 접두사 규칙을 따르는지 (grep 수준)
```

### Design Review Gate 체크리스트 (이미지 관련)

```
[ ] 4-layer 프롬프트 구조가 모든 슬롯에 적용되었는가
[ ] 각 Hero 슬롯이 고유한 Primary Scene Category를 갖는가 (중복 없는가)
[ ] Site Tempo Arc가 정의되어 있고 단조롭지 않은가
[ ] 모든 Hero 슬롯에 Narrative Ownership이 정의되어 있는가
[ ] Collision Matrix가 작성되어 있고 생성 후 교차 검수를 통과했는가
[ ] Global negatives가 모든 슬롯에 포함되어 있는가
[ ] Category negatives가 각 Scene Category별로 정의되어 있는가
[ ] 모든 슬롯이 슬롯 등록 스키마를 충족하는가
```

---

## §9 Synaxion Core 연결

| 이 헌법 조항 | 연결되는 Synaxion 원칙 |
|-------------|----------------------|
| §1 4-Layer Prompt Architecture | Experience Constitution §1 Brand Emotion Axis — Brand Layer의 감정 좌표 제공 |
| §2 Scene Categories | Experience Constitution §4 Page Narrative Rhythm — 각 단계의 허용 이미지 타입 |
| §3 Visual Tempo | Experience Constitution §3 Negative Space Density — 섹션 밀도와 이미지 에너지의 정합 |
| §4 Narrative Ownership | Experience Constitution §5 Component Emotional Temperature — 슬롯별 온도 일관성 |
| §5 Image Slot System | UI Constitution §08 Image/Media — overlay 필수 규칙과 슬롯 타입 정합 |
| §6 Negative Prompt Governance | UI Constitution §09 Forbidden Rules — 금지 패턴의 프롬프트 레벨 확장 |
| §7 OG / Social Share Image System | 15-component-patterns/RESPONSIVE_STRATEGY.md — 이미지 srcset/sizes 반응형 처리; META 태그는 08-config 참조 |

---

**버전**: 1.0.0  
**최종 업데이트**: 2026-05-24 — 초기 제정  
**소속**: Synaxion Constitution 14장 (14-experience-direction)
