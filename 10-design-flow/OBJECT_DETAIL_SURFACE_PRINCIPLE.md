# Object Detail Surface Principle (ODSP)

**Tier**: 3 (도입 — Pattern Promotion Model §0.3)  
**목적**: Workbench **object detail** surface에서 raw schema 노출·정보 평탄화·약한 inspector/thread를 보편 규칙으로 고정한다.  
**제안 인스턴스**: Inflomatrix Business Workbench (`/item/sellable/:id` detail, 2026-06-26)  
**등재일**: 2026-06-26  
**제품 SSOT (인스턴스)**: WB3 detail surface · `UniversalDetailPage` · `ObjectWorkbenchLayout`

---

## §0 경계

| 다룸 | 다루지 않음 |
|------|-------------|
| Detail Primary 정보 계층 · 값 렌더링 · action tier · object nav · thread 번역 | List/flow zone 배치 → [WORKBENCH_SURFACE_PRINCIPLE.md](./WORKBENCH_SURFACE_PRINCIPLE.md) |
| Platform owner console | [OPERATIONAL_CONSOLE_PRINCIPLE.md](./OPERATIONAL_CONSOLE_PRINCIPLE.md) |
| Field descriptor SSOT · capability kernel | 인스턴스 domain contract · `check:workbench-governance` |
| 브랜드 톤·픽셀 미학 | Ch.13 · Ch.14 |

**WSP vs ODSP**: WSP = **다중 zone 조종석**(list/detail 공통 shell). ODSP = **단일 객체를 판단·행동**하는 detail Primary·Inspector·Navigator·Thread·Auxiliary **내용 계약**.

---

## §1 적용 대상

1. Workbench `surface === detail` (또는 동등 object detail route)  
2. 사용자가 **하나의 업무 객체**를 열어 판단·행동  
3. Primary에 field grid / sections / tabs 중 하나 이상

---

## §2 반패턴 (Anti-Patterns)

| ID | 보편 명칭 | 정의 | 위반 신호 |
|----|-----------|------|-----------|
| **ODSP-A1** | Raw Data Exposure | schema/system 필드가 business 필드와 동급 노출 | `statusChangedAt` · `seedKey`가 name 옆 동일 grid |
| **ODSP-A2** | Serialization Leak | object/array가 `String(value)` 등으로 렌더 | `[object Object]` · comma-joined objects |
| **ODSP-A3** | Flat Information Hierarchy | Hero · Business · Operational · System tier 없음 | ID·createdAt·customFields 동일 시각 무게 |
| **ODSP-A4** | Action Priority Ambiguity | context별 primary action 없이 pill 나열 | 주문·수정·Flow·삭제가 동급 default button |
| **ODSP-A5** | Danger Action Misplacement | destructive action이 primary row에 동거 | 삭제가 주문 시작 옆 같은 줄·무게 |
| **ODSP-A6** | Underpowered Detail Inspector | Inspector가 name/id만 표시 | quick actions · permission · risk signal 없음 |
| **ODSP-A7** | Missing Object Navigation | detail에서 Navigator가 domain-only | 객체 section tree(Summary·Orders·Audit) 없음 |
| **ODSP-A8** | Thread Wizard Fragmentation | ThreadBar가 단계 번호만 표시 | “1 검토 — 2 완료”만 · thread 맥락·blocker·next 의미 약함 |
| **ODSP-A9** | Passive Auxiliary | collapsed Auxiliary가 기록 요약 없음 | “열으면 표시됩니다”만 · last updated·event count 없음 |
| **ODSP-A10** | Admin Grid Aesthetic | bordered cell grid가 DB viewer처럼 보임 | `Descriptions bordered` 전체 필드 · section header 약함 |
| **ODSP-A11** | Low Semantic Status | 단일 “활성”만으로 업무 판단 불가 | sales/inventory/document/workflow 신호 없음 |
| **ODSP-A12** | State Without UX Translation | URL/runtime state가 사용자 언어로 안 번역 | `threadId` in URL · UI에 flow title·origin 없음 |

---

## §3 필수 패턴 (Positive Patterns)

| ID | 이름 | 규칙 |
|----|------|------|
| **ODSP-P1** | Business-First Field Tiering | **Hero/Identity** → **Business Summary** → **Operational** → **System Metadata**(collapsed/accordion) |
| **ODSP-P2** | Structured Value Renderer | object/array → summary count · badge · link · expandable JSON(dev-only) — **never raw stringify** |
| **ODSP-P3** | Detail Action Tier | P0 primary 1개 · P1 secondary row · P2 more menu · **danger** isolated |
| **ODSP-P4** | Object Navigator Tree | detail mode Navigator = **object sections** + optional domain context |
| **ODSP-P5** | Detail Inspector Contract | identity · semantic status chips · quick actions · permission · risk/validation |
| **ODSP-P6** | Operational Thread Bar | thread title · step N of M · active step · next action · blocker reason — not bare wizard |
| **ODSP-P7** | Auxiliary Evidence Summary | collapsed: last change · audit count · evidence count · [열기] |
| **ODSP-P8** | Section Card Composition | card/section per tier — grid는 business summary 내부만; system은 accordion |

---

## §4 UX Constitution 매핑 (2.21.0+)

| ODSP | UX 규칙 |
|------|---------|
| A1 · A3 · A10 · P1 · P8 | **UX-19** Business-First Detail Hierarchy |
| A2 · P2 | **UX-20** Structured Value Rendering |
| A4 · A5 · P3 | **UX-21** Detail Action Tier |
| A7 · P4 | **UX-22** Object Navigator Mode |
| A8 · A12 · P6 | **UX-23** Operational Thread Translation |
| A6 · A9 · A11 · P5 · P7 | **UX-24** Detail Panel Contracts |

WSP zone semantics(UX-13) 통과 ≠ detail 업무 완성도. List WSP-P3와 ODSP-P1은 **상호 보완**.

---

## §5 인스턴스 제품 문서와의 관계

| Synaxion (보편) | Inflomatrix (구체) |
|-----------------|-------------------|
| ODSP-P1 Field tiering | `toDetailSections` · `DETAIL_SECTION_ORDER` |
| ODSP-P2 Structured renderer | `fieldRendererRegistry` · unknown field policy |
| ODSP-P3 Action tier | `DetailHeaderActions` · `placement` |
| ODSP-P4 Object nav | `NavigatorPanel` detail variant (미구현) |
| ODSP-P6 Thread bar | `ThreadBar` · `OperationalThread` |
| ODSP-P7 Auxiliary summary | `WorkbenchAuxiliaryHost` collapsed props |

---

## §6 검증

| 검사 | 대상 |
|------|------|
| `check:detail-surface` (인스턴스, warn) | String(object) · bordered grid · action tier heuristic |
| `check:workbench-surface` | zone-level (WSP) |
| PR checklist | ODSP-A1~A12 |

---

## §7 승격

| Tier | 조건 |
|------|------|
| Tier 3 (현재) | Inflomatrix sellable detail audit |
| Tier 2 | 외부 1 인스턴스 + PR checklist |
| Tier 1 | 2+ 인스턴스 + `check:detail-surface:strict` |

---

**최종 업데이트**: 2026-06-26
