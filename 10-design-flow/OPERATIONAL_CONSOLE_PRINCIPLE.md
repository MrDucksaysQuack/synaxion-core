# Operational Console Principle (OCP)

**Tier**: 3 (도입 — Pattern Promotion Model §0.3)  
**목적**: 인증 후 **운영·선택·관리 콘솔** 화면에서 반복되는 UX 구조 실패를 보편 규칙으로 고정한다.  
**제안 인스턴스**: Inflomatrix (Owner Dashboard `/platform/dashboard`, 2026-06-26)  
**등재일**: 2026-06-26

---

## §0 경계 (Constitution vs 인스턴스)

| 다룸 | 다루지 않음 |
|------|-------------|
| authenticated console · admin hub · tenant selector · ops dashboard | marketing landing · public site · 단일 목적 wizard |
| shell mode · IA 정렬 · CTA tier · surface grid · console density | 브랜드 톤·카피 감성 (Ch.14) · “자연스러운가” (UX Research) |
| 구조적으로 검증 가능한 anti-pattern | 픽셀 단위 미학 |

**관련 층**

| Synaxion 층 | 연결 |
|-------------|------|
| Structure First | plane·trust·shell 경계 — marketing chrome이 app chrome에 섞이지 않음 |
| UX Constitution | UX-01 · UX-04 · UX-05 · UX-08~12 (본 문서에서 구체화) |
| UI Design §04 | `--width-reading` vs `--width-shell` — 콘솔은 shell 너비 |
| Component Patterns | [CONSOLE_SURFACE_COMPOSITION.md](../15-component-patterns/CONSOLE_SURFACE_COMPOSITION.md) |

---

## §1 적용 대상 (Console Surface)

다음 **모두** 해당하면 OCP 적용 대상이다.

1. 사용자가 **인증된 주체**(owner · admin · operator)로 진입했다.
2. 화면 목적이 **엔티티 선택·상태 판단·운영 행동** 중 하나 이상이다.
3. 동일 host에서 **public/marketing surface**도 존재할 수 있다 (multi-surface host).

예: platform owner hub · tenant billing console · business admin settings · multi-tenant picker.

**비대상**: `/` landing · `/pricing` · onboarding wizard(단일 플로우) · relationship portal object surface.

---

## §2 다섯 가지 반패턴 (Anti-Patterns)

| ID | 이름 | 정의 | 위반 신호 |
|----|------|------|-----------|
| **OCP-A1** | Shell Mode Leakage | 인증 후 콘솔인데 public/marketing chrome이 남음 | 제품·요금·시작하기·guest nav가 owner 화면에 노출 |
| **OCP-A2** | IA Label Drift | sidebar · H1 · breadcrumb · eyebrow가 서로 다른 개념 | nav “대시보드” vs 제목 “내 조직” |
| **OCP-A3** | Sparse Console | 넓은 viewport 대비 운영 판단 정보가 희박함 | summary 없이 카드 1개만 부유 · 상태 badge 의미 모호 |
| **OCP-A4** | CTA Hierarchy Collision | primary 시각 무게가 경쟁 action에 분산 | 열기·추가·시작하기가 동시에 primary |
| **OCP-A5** | Weak Surface Grid | header · toolbar · list · footer action이 한 column에 정렬되지 않음 | 검색 640px · grid full-width · CTA 별도 행 |

---

## §3 다섯 가지 필수 패턴 (Positive Patterns)

| ID | 이름 | 규칙 |
|----|------|------|
| **OCP-P1** | AuthenticatedConsoleShell | `shellMode: 'marketing' \| 'flow' \| 'owner-console' \| 'app'` — console 모드에서는 marketing nav·guest CTA 제거, app chrome(Search · Account) 사용 |
| **OCP-P2** | NavPageTitleAlignment | sidebar active label = H1 = breadcrumb leaf (eyebrow는 영역만: Owner Console) |
| **OCP-P3** | ConsoleDensityLayout | `summary strip → toolbar → content grid/list` — form용 narrow column을 console에 재사용 금지 |
| **OCP-P4** | CtaTierSystem | P0 context primary(열기) · P1 secondary(관리) · P2 tertiary(+추가) · P3 global marketing(콘솔에서 제거) |
| **OCP-P5** | SurfaceColumnGrid | page-header · toolbar · cards · footer actions가 동일 content width·left edge |

---

## §4 UX Constitution 매핑

본 문서는 기존 Tier 1 규칙의 **공백을 메우는 Tier 3 구체화**다. 충돌 시 UX Constitution §1이 우선한다.

| OCP | UX 규칙 | 관계 |
|-----|---------|------|
| A1 · P1 | **UX-08** Shell Mode Separation | 신규 (2.19.0) |
| A2 · P2 | **UX-05** + **UX-09** Nav–Title Alignment | UX-05 구체화 |
| A3 · P3 | **UX-01** + **UX-10** Console Density | intent 문서 vs 구현 밀도 |
| A4 · P4 | **UX-04** + **UX-11** CTA Tier | UX-04 dashboard 예외와 marketing CTA 분리 |
| A5 · P3 | **UX-12** Surface Column Grid | UI Design §04 width 토큰과 연동 |
| A3 상태 | **UX-02** · **UX-02b** | 4상태는 통과해도 operational metadata 부족 가능 |

---

## §5 페이지 유형 분류

| 유형 | 역할 | OCP 필수 블록 |
|------|------|----------------|
| **Console Dashboard** | 요약 + 다음 행동 | summary strip · P0 CTA |
| **Console List** | 엔티티 선택·비교 | toolbar(검색은 N≥threshold) · entity card metadata |
| **Console Detail** | 단일 엔티티 운영 | status checklist · P0 action |
| **Form Settings** | 좁은 column 허용 | `--width-reading` OK · OCP-P3 summary 생략 가능 |

한 URL이 Dashboard와 List를 동시에 주장하면 **유형을 분리**하거나 summary layer를 추가한다 (DESIGN_FLOW §1).

---

## §6 검증

| 검증 | 레인 | CI |
|------|------|-----|
| `check:console-surface` | OCP-A1 정적 휴리스틱 (인스턴스) | warn (2.19.0) |
| PR checklist | OCP-A2~A5 · P1~P5 | soft |
| PAGE-AUDIT / PAGE-EXECUTION | 페이지 intent vs console 유형 | 인스턴스 |

인스턴스는 `consoleSurfaceManifest` 또는 shell `shellMode` prop으로 대상 파일을 등록한다.

---

## §7 승격 조건 (§0.3)

| Tier | 조건 |
|------|------|
| **Tier 3** (현재) | Inflomatrix 1 인스턴스 실증 |
| **Tier 2** | 6개월 내 1 외부 인스턴스 적용 + PR checklist 정착 |
| **Tier 1** | 2+ 외부 인스턴스 + `check:console-surface:strict` CI 차단 |

---

**최종 업데이트**: 2026-06-26
