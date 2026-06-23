# Operational Maturity Layers
# 운영 성숙도 층

> **기능이 많아질수록 화면·라우트·권한·신원이 무너지지 않도록, 제품 위에 교차하는 네 가지 층을 명시적으로 둔다.**

**Tier**: 3 (도입 단계 · 2.18.0 신규)  
**상태**: Inflomatrix 인스턴스에서 UX Remediation Phase 0–2 + nav-wayfinding + identity federation + plane separation으로 실증 (2026-06).  
**승격 조건**: [META_CONSTITUTION.md](../META_CONSTITUTION.md) §0.3 — 외부 인스턴스 1개 적용 시 Tier 2.  
**연계**: [INDIRECT_UX_PRINCIPLE.md](../10-design-flow/INDIRECT_UX_PRINCIPLE.md) · [NAVIGATION_DISCOVERABILITY.md](../07-frontend-ui/NAVIGATION_DISCOVERABILITY.md) · [IDENTITY_FEDERATION_SPINE.md](../04-safety-standards/IDENTITY_FEDERATION_SPINE.md) · [HOST_TRUST_SURFACE_SEPARATION.md](./HOST_TRUST_SURFACE_SEPARATION.md) · [EXECUTION_AUTHORITY_ALIGNMENT.md](./EXECUTION_AUTHORITY_ALIGNMENT.md)

**최종 업데이트**: 2026-06-23

---

## 1. 문제

기능·페이지·역할이 늘면 다음이 동시에 깨진다.

- 사용자는 **이 화면이 무엇인지** 모른다 (의미 부재)
- 권한이 막혀도 **왜 막혔는지** 모른다 (권한 부재)
- 페이지는 있으나 **들어오고 나가는 길**이 없다 (내비게이션 그래프 부재)
- 로그인·tenant·plane이 **흩어져** 운영이 복잡해진다 (신원 척추 부재)

이 네 가지는 개별 버그가 아니라 **층이 없을 때 나타나는 구조적 증상**이다.

---

## 2. 네 가지 층

| 층 | 질문 | 최소 산출물 | Synaxion 참조 |
|----|------|-------------|---------------|
| **Meaning** | 이 화면·용어·위치가 무엇을 뜻하는가? | PageHeader 계약, breadcrumb, user-facing label registry, viewing context | Ch.18 Question-First, UX-05, [INDIRECT_UX_PRINCIPLE](../10-design-flow/INDIRECT_UX_PRINCIPLE.md) |
| **Permission** | 이 주체가 보고·실행할 수 있는 범위는? | forbidden/not-configured surface, plane guard, authority boundary | [EXECUTION_AUTHORITY_ALIGNMENT](./EXECUTION_AUTHORITY_ALIGNMENT.md), Ch.19 Permission 축 |
| **Navigation Graph** | 이 페이지는 어디서 발견되고 어디로 이어지는가? | discoverability scanner, handoff catalog, IA parity | [NAVIGATION_DISCOVERABILITY](../07-frontend-ui/NAVIGATION_DISCOVERABILITY.md), Ch.19 GAC |
| **Identity Spine** | 이 사용자는 어느 tenant·plane·role로 들어왔는가? | central OAuth callback, signed state, one-time handoff | [IDENTITY_FEDERATION_SPINE](../04-safety-standards/IDENTITY_FEDERATION_SPINE.md), [AUTH_FLOW_PRINCIPLES](../04-safety-standards/AUTH_FLOW_PRINCIPLES.md) |

**Shell Layer**(공통 레이아웃·UX-02 상태)는 위 네 층의 **전제**이지, 네 층 자체가 아니다.

---

## 3. 운영 원리

### Principle 1 — Layers Before Pages

페이지를 먼저 늘리지 않는다. **공유 SSOT에 층을 심고** 전 페이지에 전파한다.

### Principle 2 — Indirect by Default

Meaning·Permission·Navigation은 **설명문·투어·next-step 패널**보다 **구조**(breadcrumb, badge, surface state, graph edge)로 전달한다.

### Principle 3 — Measurable Graph

Navigation Graph는 감각이 아니라 **inbound/outbound edge, dead-end, grade**로 측정한다.

### Principle 4 — Single Identity Spine

멀티-tenant 제품은 OAuth·session·handoff를 **하나의 spine**으로 수렴한다. tenant별 callback 분산은 예외로 문서화한다.

---

## 4. 인스턴스 실증 (Inflomatrix 2026-06)

| 층 | 실증 산출물 | 검증 |
|----|-------------|------|
| Meaning | `SurfaceState`, breadcrumb, `user-facing-label-registry`, `ViewingContextBadge` | `check:ux-state-coverage`, `check:cognitive-interface-completeness` |
| Permission | `BusinessListSurfaceGate`, `RelationshipPlaneGuard`, `check:subdomain-persona-coverage` | `check:auth-boundary`, plane E2E |
| Navigation Graph | page-inventory, `check:nav-discoverability`, handoff-links | `check:ia-alignment`, discoverability CI |
| Identity Spine | `UnifiedGoogleOAuthCallbackPage`, `tenant-oauth-callback-ssot` | `check:oauth-redirect-policy`, staging E2E |

---

## 5. 적용 체크리스트 (인스턴스)

- [ ] 네 층 각각에 **단일 SSOT 문서 또는 모듈**이 있는가?
- [ ] Meaning: jargon이 nav·header에 노출되지 않는가? (UX-05)
- [ ] Permission: 403이 blank가 아닌 **forbidden surface**인가?
- [ ] Navigation: P0 route가 discoverability에서 **C 이상** 또는 exempt 사유가 있는가?
- [ ] Identity: OAuth redirect URI가 **한 모듈**에서만 정의되는가?

---

## 6. 한계

- 층 이름·plane enum·capability matrix는 **인스턴스**에 둔다.
- Completion scorecard·제품별 %는 헌법이 아니라 **인스턴스 성숙도 지표**다.

**제안 인스턴스**: Inflomatrix (2026-06-23)
