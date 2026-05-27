# 19장 — Product UI Architecture

> **Synaxion Constitution 19장**  
> 다역할·Event 기반 제품에서 "누가·어떤 순서로·무엇을 보는가"를 구조화하는 UI 지도 체계.  
> **버전**: 2.14.1 (Synaxion Constitution)

---

## 이 챕터의 핵심 명제

> **컴포넌트 패턴만으로는 누가·어떤 순서로·무엇을 보는가가 잡히지 않는다.**

역할이 여럿이고 Event가 화면 상태를 바꾸는 제품은, 컴포넌트(Ch.15)·UX flow(Ch.10)·인지 구조(Ch.18)만으로는 설계가 완결되지 않는다.  
19장은 **제품 전체의 UI 지도** — 역할 여정·핸드오프·복구 경로·이벤트→화면 반응·추적 가능성 — 을 한 장소에서 관리하는 문서 체계와 거버넌스를 정의한다.

```
Ch.07  — 상태 관리·fetch 원칙·IA 규칙        (기술 레이어)
Ch.10  — 페이지 UX 최소선·7규칙             (화면 레이어)
Ch.15  — 컴포넌트 패턴                      (컴포넌트 레이어)
Ch.18  — 인지 구조 기반 설계 언어            (인지 레이어)
Ch.19  — 제품 전체 UI 지도 (본 챕터)         (제품 아키텍처 레이어)
```

---

## 목차

| 문서 | 역할 |
|------|------|
| [README.md](./README.md) | 챕터 개요·taxonomy·프로파일·게이트·타 챕터 관계 |
| [GOVERNANCE.md](./GOVERNANCE.md) | 거버넌스 4규칙·PLAN-READINESS 3단 게이트·N/A 허용 정책 |
| [INDEX.template.md](./INDEX.template.md) | 인스턴스 시작점 — 빈 INDEX + 문서 14종 슬롯 |
| [HANDOFF_CATALOG_SCHEMA.md](./HANDOFF_CATALOG_SCHEMA.md) | 핸드오프 카탈로그 7필드 스키마 |
| [EVENT_UI_MAP_SCHEMA.md](./EVENT_UI_MAP_SCHEMA.md) | Event→UI Map 표준 열 |
| [TIME_ZONES_SCHEMA.md](./TIME_ZONES_SCHEMA.md) | 시간 3구간(TZ-NN) 항목 구조 |
| [RECOVERY_JOURNEY_SCHEMA.md](./RECOVERY_JOURNEY_SCHEMA.md) | 복구 여정 섹션 구조 |
| [STATE_MATRIX_SCHEMA.md](./STATE_MATRIX_SCHEMA.md) | 화면 상태 매트릭스 열 정의 |

---

## 문서 Taxonomy (14종)

인스턴스는 아래 14종 슬롯에서 **프로파일에 따라 선택적으로** 채운다.  
모든 슬롯이 필수는 아니다 — [GOVERNANCE.md §N/A 허용](./GOVERNANCE.md) 참조.

| # | 문서 | 핵심 질문 | 프로파일 |
|---|------|-----------|---------|
| 01 | Personas | 누가 쓰는가 | S+ |
| 02 | Journey Maps | 어떤 순서로 목표에 도달하는가 | M+ |
| 02-R | Recovery Journeys | 실패 시 어떻게 복구하는가 | M+ |
| 03 | Information Architecture | 화면 계층·사이드바 구조는 무엇인가 | S+ |
| 04 | Screen Inventory | 어떤 화면이 존재하는가 | S+ |
| 05 | State Matrix | 각 화면의 가능한 상태는 무엇인가 | M+ |
| 06 | Role Routing Rules | 역할에 따라 어느 경로가 허용되는가 | M+ |
| 07 | Cross-cutting Patterns | 전역 UX 패턴(알림·오프라인·딥링크)은 무엇인가 | M+ |
| 08 | Traceability | 화면↔spec↔여정이 추적 가능한가 | L |
| 09 | Implementation Backlog | 실행 유일 SSOT — L1~LN 체계 | S+ |
| 10 | Handoff Catalog | 역할 간 책임 이전이 양면으로 설계되었는가 | M+ |
| 11 | Event→UI Map | Event가 어떤 화면 상태를 유발하는가 | M+ |
| 12 | Time Zones | UI 시간 구간(실시간/비동기/배치)이 설계되었는가 | L |
| 14 | Object→Capability | 도메인 객체 상태가 Quest 가용성을 어떻게 제한하는가 | L |

> **번호 13은 역할 인터랙션 매트릭스** — 도메인 의존도가 높아 인스턴스 전용.  
> **번호 15~17은 인지·감정·시각 층** — 인스턴스가 Ch.18·13·14와 연계해 선택적으로 추가.

---

## 크기 프로파일 (3단계)

| 프로파일 | 대상 | 필수 문서 |
|---------|------|----------|
| **S** (소형) | 단일 역할·단순 플로우 | 01·03·04·09 |
| **M** (중형) | 2~4개 역할·Event 기반 | S + 02·02-R·05·06·07·10·11 |
| **L** (대형) | 5+ 역할·복잡 핸드오프·정산 | M + 08·12·14 |

인스턴스는 프로파일을 `INDEX.md` 첫 줄에 선언한다.  
예: `> **프로파일**: L — 11역할·21 Handoff·Event 기반`

---

## 3단 게이트

문서와 구현의 성숙도를 세 단계로 구분한다.

| 게이트 | 정의 | 선언 방법 |
|--------|------|----------|
| **Plan Complete** | taxonomy 문서가 서로 링크되고 갭이 명시됨 | PLAN-READINESS §A 체크 |
| **Implementation Ready** | P0 셸 + 핵심 API·화면이 Backlog L1~L3에 따라 동작 | Backlog 진행율 기록 |
| **Architecture승격** | Plan + L2 핵심 구현 + smoke test + REVIEWED | PLAN-READINESS §C 체크 |

> 게이트를 뛰어넘어 "Plan = 구현"처럼 표기하지 않는다.  
> 각 게이트 체크리스트는 인스턴스의 `PLAN-READINESS.md`에 유지한다.

---

## 타 Synaxion 챕터와의 관계

| 챕터 | 관계 |
|------|------|
| **Ch.07** (Frontend UI) | 기술 레이어 — 상태 관리·fetch·IA 기술 원칙. 19장은 "무엇을 보여주는가"를 다루고, 07은 "어떻게 구현하는가"를 다룬다. 상호 보완, 중복 아님. |
| **Ch.10** (Design Flow) | 페이지 단위 UX 최소선·7규칙. 19장은 제품 전체 UI 지도이고, 10은 개별 화면 품질 기준. |
| **Ch.15** (Component Patterns) | 컴포넌트 선택·패턴. 19장은 컴포넌트 조합 전에 "누가 무엇을 보는가"를 먼저 결정한다. |
| **Ch.18** (Cognitive Interface) | 인지 구조 기반 설계 언어. 19장의 State Matrix·Journey와 연계해 Logic Type을 화면별로 매핑한다. |

---

## Reference Instance

| 인스턴스 | 프로파일 | 특징 |
|---------|---------|------|
| **Agrinovation** `docs/Plan/11-ui-architecture/` | L — 11역할·21 Handoff(H-01~H-20b)·Event 기반 | 다역할 농업 운영 플랫폼. Plan Complete 96%, Implementation Ready ~82%. Ch.19 검증 레퍼런스 1호. |

> 인스턴스 번호(Agrinovation Plan **11**)는 Synaxion 챕터 번호(**19**)와 다르다.  
> `11`은 Agrinovation의 `docs/Plan/` 폴더 번호이고, `19`는 Synaxion 헌법 챕터 번호다.

---

## 버전 히스토리

| 날짜 | 변경 |
|------|------|
| 2026-05-27 | **2.14.1** — EVENT_UI_MAP·TIME_ZONES 스키마 목차 반영. Handoff 21건(H-01~H-20b) 문구 통일. |
| 2026-05-27 | **2.14.0** — 19장 신설. Agrinovation 11-ui-architecture를 레퍼런스 인스턴스 1호로 등재. |
