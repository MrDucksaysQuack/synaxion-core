# Identity Federation Spine
# 신원 연합 척추

> **멀티-tenant SaaS에서 OAuth·세션·handoff는 하나의 spine으로 수렴한다. tenant마다 callback이 흩어지지 않는다.**

**Tier**: 3 (도입 단계 · 2.18.0)  
**상태**: Inflomatrix unified Google OAuth (`/auth/oauth/callback/google`), signed state, one-time handoff, `check:oauth-redirect-policy` 실증.  
**연계**: [AUTH_FLOW_PRINCIPLES.md](./AUTH_FLOW_PRINCIPLES.md) · [CONCEPTUAL_ROT_PREVENTION.md](./CONCEPTUAL_ROT_PREVENTION.md) · [EXECUTION_AUTHORITY_ALIGNMENT.md](../01-foundations/EXECUTION_AUTHORITY_ALIGNMENT.md)

**최종 업데이트**: 2026-06-23

---

## 1. 문제

tenant별 OAuth callback·redirect URI·state 검증이 분산되면:

- IdP 등록 URI가 tenant 수만큼 늘어난다
- state·nonce·flow dispatch가 drift한다
- platform / genesis / tenant login이 **서로 다른 보안 모델**을 쓴다
- 서버 전용 모듈(`jsonwebtoken` 등)이 **브라우저 번들**로 새는 위험이 생긴다

---

## 2. Spine 토폴로지 (구현 이름 없음)

```
User → IdP (Google 등)
  → Central callback host (platform 또는 dedicated auth host)
  → Verify signed stateless state (HMAC + exp + nonce, single-use)
  → Flow dispatch (platform_owner | genesis_intake | tenant_oauth | …)
  → Mint session OR one-time handoff token
  → Tenant host exchanges handoff → local scoped session
```

**불변식**

1. **Redirect URI SSOT** — callback path literal은 **한 모듈**(+ 단위 테스트)에서만 정의한다.
2. **State is signed** — 클라이언트가 flow·returnOrigin을 신뢰하지 않는다. 서버가 검증한다.
3. **Handoff is one-time** — tenant session은 handoff token **1회 교환** 후 폐기한다.
4. **Entry ≠ Issuing authority** — 로그인 UI 위치와 키·세션 발급 주체를 분리 문서화한다 (Access Key lifecycle과 짝).
5. **Browser bundle boundary** — JWT·crypto 서버 모듈은 FE import graph에서 차단한다.

---

## 3. AUTH_FLOW와의 관계

| AUTH_FLOW 단계 | Spine에서의 위치 |
|----------------|------------------|
| Auth | IdP callback + state verify |
| Identity | flow dispatch 후 profile/entity resolve |
| Completion | genesis/intake/onboarding gates |
| Redirect | **단일 SSOT** (`resolveLoginSuccessPath` 등) |

[AUTH_FLOW_PRINCIPLES.md](./AUTH_FLOW_PRINCIPLES.md) §2 단일 소스 원칙은 spine의 **Redirect** 단계에 적용된다.

---

## 4. 검증 (인스턴스 패턴)

| 검사 | 목적 |
|------|------|
| `check:oauth-redirect-policy` | callback path 하드코딩 금지 |
| `check:single-source-drift` | auth redirect 경로 drift |
| `check:api-origin-ssot` | API origin 하드코딩 금지 |
| `check:prod-mock-guard` | prod에서 mock auth provider 차단 |
| E2E oauth callback recovery | transient route가 dead-end가 아님 |

---

## 5. Transient Routes

OAuth callback은 **inbound nav edge 0**이 정상이다. discoverability scanner는 **exempt manifest**에 등록한다. ([NAVIGATION_DISCOVERABILITY.md](../07-frontend-ui/NAVIGATION_DISCOVERABILITY.md) §4)

---

**제안 인스턴스**: Inflomatrix — `tenant-oauth-callback-ssot.ts`, G1 genesis-funnel streams (2026-06)
