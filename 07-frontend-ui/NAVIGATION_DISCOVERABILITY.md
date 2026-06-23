# Navigation Discoverability
# 내비게이션 발견 가능성

> **페이지는 존재만으로 충분하지 않다. 발견 경로·이탈 경로·nav SSOT 정합이 측정 가능해야 한다.**

**Tier**: 3 (도입 단계 · 2.18.0)  
**상태**: Inflomatrix page-inventory + `check:nav-discoverability` + IA alignment + ScannerExemptManifest (2026-06).  
**연계**: [IA_NAVIGATION_PRINCIPLES.md](./IA_NAVIGATION_PRINCIPLES.md) · Ch.19 [GENERATION_ASSISTED_COVERAGE.md](../19-product-ui-architecture/GENERATION_ASSISTED_COVERAGE.md)

**최종 업데이트**: 2026-06-23

---

## 1. IA 깊이 vs Wayfinding Graph

[IA_NAVIGATION_PRINCIPLES.md](./IA_NAVIGATION_PRINCIPLES.md)는 **인지 부하**(3-depth, Hick's Law)를 다룬다.  
본 문서는 **그래프 정합**을 다룬다 — 서로 다른 질문이다.

| 축 | 질문 | 예 |
|----|------|-----|
| IA depth | 메뉴가 너무 깊은가? | sidebar 4단계 초과 |
| **Discoverability** | 이 URL이 nav·handoff·search에서 **연결**되는가? | orphan F-grade route |

---

## 2. 측정 차원

각 등록 route(또는 pageId)에 대해:

1. **Inbound edges** — sidebar, RBAC nav, global search, CMS slug, handoff, hub CTA에서 들어오는가?
2. **Outbound edges** — list→detail, detail→related, primary CTA 다음 화면이 있는가?
3. **Dead-end** — inbound≥1 이고 outbound=0 인 의도적 말단인가, 버그인가?
4. **Grade** — A/B/C/D/F (인스턴스 rubric; 최소 inbound+outbound 합산)
5. **Plane parity** — Business·Public·Relationship·Platform 각각 discoverability 게이트에 포함되는가?

---

## 3. SSOT 쌍 정합 (N-way)

다음 SSOT는 **쌍별로** 정합 검사를 둔다 ([N_WAY_CONSISTENCY_GATE.md](../01-foundations/N_WAY_CONSISTENCY_GATE.md)):

- Router allowlist ↔ Screen Inventory
- appMenuConfig / ia-aliases ↔ inventory pageId
- portal-page-registry ↔ portal routes
- role-page-access ↔ navigable subdomain matrix

인스턴스 예: `check:ia-alignment`, `check:portal-page-meta-alignment`, `check:inventory-router-alignment`

---

## 4. Transient Route Exempt Manifest

다음은 **제품 dead-end가 아닌** transient floor로 분류한다:

- OAuth / OIDC callback
- join/status polling
- post-redirect outcome (billing, provisioning)
- guard-only prefix routes (measurement-intentional inbound 0)

exempt는 **manifest에 코드로** 등록한다. "스캐너가 못 찾으니 무시"는 금지.

---

## 5. 검증 (인스턴스 패턴)

| 스크립트 | 목적 |
|----------|------|
| `check:nav-discoverability` | hub grade, relationship A+B %, funnel orphan |
| `check:menu-depth` | Hick's Law + sidebar depth |
| `generate-page-inventory-report` | human-readable graph report |
| `check:role-goal-coverage` | Role×Goal − inventory diff |

---

## 6. Warn → Strict

신규 discoverability 게이트는 [WARN_TO_STRICT_RATCHET.md](../06-automation/WARN_TO_STRICT_RATCHET.md)를 따른다.

---

**제안 인스턴스**: Inflomatrix nav-wayfinding-wave 1–3, F-tail exit (2026-06)
