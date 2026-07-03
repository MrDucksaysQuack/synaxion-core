# Workbench Surface Principle (WSP)

**Tier**: 3 (도입 — Pattern Promotion Model §0.3)  
**목적**: **다중 zone 운영 workbench**(list · detail · flow)에서 zone 의미·레이어·데이터 우선순위·placeholder 누출을 보편 규칙으로 고정한다.  
**제안 인스턴스**: Inflomatrix Business Workbench (`/item/sellable` list surface, 2026-06-26)  
**등재일**: 2026-06-26  
**제품 SSOT (인스턴스)**: `BUSINESS_WORKBENCH_NORTH_STAR_V3` 6-zone · L0/L1/L2 — 본 문서는 **Synaxion 보편화** 층

---

## §0 경계

| 다룸 | 다루지 않음 |
|------|-------------|
| Workbench zone semantics · layer stack · list scan priority · zone-level inspector shell | Detail Primary tier·값 렌더 → [OBJECT_DETAIL_SURFACE_PRINCIPLE.md](./OBJECT_DETAIL_SURFACE_PRINCIPLE.md) |
| | Platform owner console → [OPERATIONAL_CONSOLE_PRINCIPLE.md](./OPERATIONAL_CONSOLE_PRINCIPLE.md) |
| Plane 분리 (public vs business) | [HOST_TRUST_SURFACE_SEPARATION.md](../01-foundations/HOST_TRUST_SURFACE_SEPARATION.md) |
| Kernel action density · capability | 인스턴스 `check:workbench-governance` (계약) |
| 픽셀 미학·브랜드 톤 | Ch.13 · Ch.14 |

**OCP vs WSP**: OCP = **선택·관리 콘솔**(tenant picker). WSP = **업무 수행 조종석**(entity list/detail/flow).

---

## §1 적용 대상

1. 인증된 **Business(또는 동등) plane** 운영 surface  
2. 화면이 **Navigator + Primary work area + Inspector** (± Auxiliary · Thread) 구조  
3. 사용자가 **판단 → 행동** 반복 (list/detail/flow execution)

---

## §2 반패턴 (Anti-Patterns)

| ID | 보편 명칭 | 정의 | 위반 신호 |
|----|-----------|------|-----------|
| **WSP-A1** | Weak Zone Semantics | zone 역할이 시각·라벨로 즉시 읽히지 않음 | Inspector/Auxiliary가 빈 placeholder · Primary와 동급 강조 없음 |
| **WSP-A2** | Navigation Compression | Navigator가 “렌즈”가 아니라 압축된 구식 메뉴 | &lt;220px · Queue/Exception 동급 텍스트 |
| **WSP-A3** | Technical Metadata Dominance | 내부 ID가 human label보다 먼저 스캔됨 | `entity_178…`가 name보다 시각적으로 큼 |
| **WSP-A4** | Over-emphasized Metadata | 보조 메타가 알림처럼 튐 | 밝은 “Core Fields” 배너 · 튜토리얼 박스 톤 |
| **WSP-A5** | Dead Panel / Placeholder Leakage | Inspector/Auxiliary에 dev stub 노출 | “lazy stub” · “Batch N” 사용자 문자열 |
| **WSP-A6** | Dead Space / Theme Inconsistency | 빈 zone이 과대 · 다크 shell에 light panel | `#fafafa` fallback stepper · 큰 빈 Auxiliary |
| **WSP-A7** | Context Anchor Misplacement | Thread/Flow anchor가 work 맥락과 분리 | ThreadBar가 하단 wizard 카드처럼 부유 |
| **WSP-A8** | Search Scope Ambiguity | Global command vs surface vs table filter 혼동 | Cmd+K와 table search 역할 미분리 |
| **WSP-A9** | Layer Boundary Blur | App chrome / runtime header / surface toolbar 혼합 | tenant bar와 `domain/subdomain` 동일 밴드 |
| **WSP-A10** | Weak Semantic Color | accent 색이 role 없이 분산 | mint·cyan·green·white가 각각 다른 임시 의미 |
| **WSP-A11** | Unresolved Composition | 컴포넌트는 있으나 하나의 조종석으로 안 묶임 | zone·토큰·stub 스타일이 제각각 |

---

## §3 필수 패턴 (Positive Patterns)

| ID | 이름 | 규칙 |
|----|------|------|
| **WSP-P1** | Zone Semantic Grid | Top · Thread · Navigator · Primary · Inspector · Auxiliary 각각 `data-zone` + aria-label + 최소 1줄 역할 힌트 |
| **WSP-P2** | Navigator Lens | min-width ≥ 인스턴스 토큰(권장 240px) · Queue ≠ Exception 시각 분리(Exception = signal) |
| **WSP-P3** | List Human-First Scan | column order: name/label → status → business fields → **muted** id · row action visible |
| **WSP-P4** | Inspector Selection Contract | no selection → domain hint · single row → identity strip + actions · never dev stub |
| **WSP-P5** | Auxiliary Lightweight | default collapsed/compact · timeline은 lazy load · 빈 상태는 작은 empty |
| **WSP-P6** | Layer Stack L0/L1/L2 | L0 App chrome · L1 Runtime header(domain·surface·intent) · L2 Surface toolbar · Thread **L1 아래** |
| **WSP-P7** | Search Scope Lanes | Global(Command) · Surface · Table filter · Object command — 라벨·placeholder로 구분 |
| **WSP-P8** | Semantic Token Alignment | status·primary·info·warning — Ch.13 semantic token only; light fallback on dark 금지 |

---

## §4 UX Constitution 매핑 (2.20.0+)

| WSP | UX 규칙 |
|-----|---------|
| A1 · P1 | **UX-13** Workbench Zone Semantics |
| A9 · P6 | **UX-14** Workbench Layer Stack |
| A3 · P3 | **UX-15** List Human-First Columns |
| A5 · A6 · P4 · P5 | **UX-16** Panel Non-Placeholder |
| A8 · P7 | **UX-17** Search Scope Separation |
| A11 · P8 | **UX-18** Workbench Composition Readiness |

기존 **UX-02** 4상태 통과 ≠ WSP 충족. mechanical shell covered와 **운영 조종석 완성도**는 별도.

---

## §5 인스턴스 제품 문서와의 관계

| Synaxion (보편) | Inflomatrix (구체) |
|-----------------|-------------------|
| WSP-P1 Zone grid | WB3 §7 6-zone diagram |
| WSP-P6 Layer stack | WB3 App Chrome L0 + WorkbenchTopBar L1 |
| WSP-P2 Queue/Exception | WB3 §9 Exception Surface |
| WSP-P3 List scan | Progressive table · field projection |
| Detail surface | → ODSP (UX-19~24) · `check:detail-surface` |

제품 north-star는 **WHAT**. WSP는 **WHY 실패하는지** + **최소 불변식**.

---

## §6 검증

| 검사 | 대상 |
|------|------|
| `check:workbench-surface` (인스턴스, warn) | stub leakage · theme fallback · zone testids |
| `check:workbench-governance` | kernel·density 계약 (UX 아님) |
| PR checklist | WSP-A1~A11 |

---

## §7 승격

| Tier | 조건 |
|------|------|
| Tier 3 (현재) | Inflomatrix WB3 file럿 실증 |
| Tier 2 | 외부 1 인스턴스 + PR checklist |
| Tier 1 | 2+ 인스턴스 + `check:workbench-surface:strict` |

---

**최종 업데이트**: 2026-06-26
