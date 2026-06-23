# Indirect UX Principle
# 간접 UX 원칙

> **사용자에게 설명을 붙이지 말고, 구조가 스스로 말하게 하라.**

**Tier**: 3 (도입 단계 · 2.18.0)  
**상태**: Inflomatrix UX Remediation U0–U8 — SurfaceState, breadcrumb, label registry, ViewingContext, Operator/Admin 분리 (2026-06).  
**연계**: [COGNITIVE_INTERFACE_CONSTITUTION.md](../18-cognitive-interface/COGNITIVE_INTERFACE_CONSTITUTION.md) §0 · [UX_CONSTITUTION.md](./UX_CONSTITUTION.md) · [OPERATIONAL_MATURITY_LAYERS.md](../01-foundations/OPERATIONAL_MATURITY_LAYERS.md)

**최종 업데이트**: 2026-06-23

---

## 1. 핵심 명제

```
잘못된 순서:  기능 추가 → 가이드·투어·설명 패널 → 사용자 혼란 지속
올바른 순서:  공유 SSOT에 구조 심기 → 전 페이지 전파 → ambient understanding
```

Ch.18 "Cognition 선행"의 **운영 실행 규칙**이다. 감각 디자인(Ch.13·14) 이전에 **정보 구조·상태·위치·권한 표면**을 먼저 맞춘다.

---

## 2. 직접 telling 금지 목록 (기본)

다음은 **기본 금지**. 예외는 ADR + UX 리뷰로만 허용한다.

| 패턴 | 금지 이유 | 구조적 대체 |
|------|-----------|-------------|
| 자동 온보딩 투어 (첫 방문 강제) | telling | breadcrumb, viewing context, empty state |
| Next Action Strip / consequence 설명 패널 | telling | primary CTA hierarchy, mutation feedback |
| "여기를 클릭하세요" 단계 안내 | telling | PageHeader 위계, hub index |
| 권한 거부 이유 상세 노출 | security leak | forbidden surface (이유 비노출) |

---

## 3. 구조적 레버 (공유 SSOT)

페이지 50개를 고치지 않는다. **소수 SSOT**에 한 번 심는다.

| 레버 | 역할 |
|------|------|
| `SurfaceState` | loading · empty · not-configured · **forbidden** · error · ready |
| PageHeader contract | title → status → primary action |
| Breadcrumb | Plane > domain > subdomain > record |
| User-facing label registry | internal key → display label (UX-05) |
| ViewingContextBadge | plane + role ambient |
| Transition state machine | OAuth · redirect · mutation outcome (침묵 제거) |

---

## 4. Permission-as-Ambient

403·401은 blank가 아니라 **forbidden surface**다.  
**왜 막혔는지**는 기본 비노출 (indirect). **막혔다는 사실**만 정직하게 표시한다.

UX-02 확장: `forbidden`, `not-configured` — [UX_CONSTITUTION.md](./UX_CONSTITUTION.md) §1 UX-02b.

---

## 5. 검증

| 검사 | 목적 |
|------|------|
| `check:ux-state-coverage` | 4+2 상태 분기 |
| `check:cognitive-interface-completeness` | label·logic type 정합 |
| `check:nav-discoverability` | orientation graph |
| PR: OnboardingTour 자동 open 없음 | telling 드롭 유지 |

---

## 6. Density Governance (연계)

고밀도 UI는 **숨김 ≠ 도달불가** 불변식을 따른다. More · command palette로 expert reachability를 유지한다. (인스턴스: business-workbench density-governance)

---

**제안 인스턴스**: Inflomatrix `UX_REMEDIATION_MASTER_PLAN.md`, `INDIRECT_UX_PARALLEL_STREAM_PLAN.md` (2026-06)
