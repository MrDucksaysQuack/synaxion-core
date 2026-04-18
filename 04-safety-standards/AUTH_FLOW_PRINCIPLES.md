# 인증 플로우 원칙 (Auth Flow Principles)

**목적**: 인증·프로필·리다이렉트 관련 판단의 **개념적 순서**와 **단일 소스**를 정의하여 일관성과 유지보수성을 보장합니다.

---

## 1. 개념적 순서 준수 (절대 원칙)

**인증 플로우는 반드시 다음 순서를 따라야 합니다.**

```
Auth → Identity → Completion → Preference → Redirect
```

| 단계 | 내용 |
|------|------|
| **Auth** | 인증 여부 확인 (OAuth/세션 완료·확정) |
| **Identity** | 프로필(또는 사용자 엔티티) 존재 여부 확인, 없으면 생성 |
| **Completion** | 프로필 완성도 확인(필수 필드 등), 미완성 시 가입/완성 페이지로 리다이렉트 |
| **Preference** | 온보딩·선호도 설정 여부 확인, 미설정 시 온보딩 페이지로 리다이렉트 |
| **Redirect** | 원래 목적지 또는 기본 페이지로 이동 |

- **금지**: 순서 역전(예: Completion 확인 전에 Identity 확인 생략), 단계 건너뛰기.
- 구현 시 상태 전이도 이 개념적 순서를 따른다.

---

## 2. 단일 소스 원칙 (리다이렉트 판단)

- **"어디로 리다이렉트할지"** 판단은 **한 곳(단일 소스)**에서만 수행한다. UI·콜백·미들웨어 등 여러 곳에서 각자 `router.push(...)` 또는 리다이렉트를 결정하면 드리프트와 버그가 발생한다.
- 단일 소스는 상태 머신·전용 모듈·훅 등 프로젝트가 정한 **하나의 진입점**으로 두고, 모든 리다이렉트 결정은 그 진입점을 통해서만 이뤄진다.
- 프로젝트의 Constitution 적용 디렉터리 내 [SINGLE_SOURCE_MAP.md](../SINGLE_SOURCE_MAP.md) 및 decision-registry에 "리다이렉트 결정" 축이 있으면 해당 단일 소스와 연결한다.

---

## 3. UI는 액션만, 판단은 단일 소스

- **UI 컴포넌트(버튼·페이지)**는 인증·프로필·완성도에 대한 **판단을 하지 않고**, **액션만** 수행한다(예: "로그인 시작", "OAuth 호출").
- "세션이 있으면 A로, 프로필이 없으면 B로" 같은 **분기 판단**은 UI가 아니라 단일 소스(상태 머신·콜백 핸들러·미들웨어)에서만 수행한다.
- 이렇게 하면 리다이렉트 로직이 한곳에 모여 검증·변경이 쉬워진다.

---

## 4. 이벤트와 상태 구분

- **이벤트**: 사용자·시스템의 "행위"(예: OAuth 완료, 프로필 조회 완료). 전이를 유발한다.
- **상태**: 현재 "어디에 있는지"(예: 비인증, 인증 중, 프로필 확인 중). 이벤트 이름과 혼동되지 않도록 명명한다.
- 상태 머신을 쓸 경우, 이벤트 타입과 상태 타입을 분리하여 정의하는 것을 권장한다.

---

## 5. React 트리: 세션 구독 단일 인스턴스 (Itemwiki 장점)

**맥락**: Supabase 브라우저 클라이언트·`checkAuth`·세션 캐시·`onAuthStateChange` 연동을 컴포넌트마다 두면 구독이 중복되고, 로딩·토큰 상태가 화면마다 어긋날 수 있다.

**원칙**:

- **한 트리·한 번**: 브라우저 세션 동기화는 **루트 `AuthSessionProvider`(또는 동등)** 안에서만 실행한다. 공개 `useAuth()`는 그 Context를 **읽기만** 한다(Provider 밖 호출은 금지·명시적 실패).
- **판단 계층은 그대로**: “콘솔인가 / API를 쏴도 되는가” 등 **제품 판단**은 여전히 `useAuthState()`(및 Decision Engine·`useAuthCheck` 등) **단일 진입점**을 따른다. `useAuthState`는 내부에서 동일 Context의 `useAuth`를 사용하므로, 트리 전체가 **같은 세션 스냅샷**을 본다.
- **같은 모듈에서 `useAuth` + `useAuthState` 병용 금지(권장 강제)**: 토큰이 필요하면 `useAuthState()`의 `authState`에서만 파생한다 — `authState.status === 'authenticated' ? authState.session : null`. 예외적으로 `useAuthCheck`를 쓰는 화면은, 훅이 **`session`·`hasAuthenticatedSession`을 함께 반환**하도록 확장해 **`useAuthState`를 같은 컴포넌트에서 두 번 부르지 않는다**.

**검증·문서(참고)**: 아키텍처 레퍼런스 [`AUTH_SESSION_PROVIDER_PARALLEL_PLAN.md`](../../architecture/AUTH_SESSION_PROVIDER_PARALLEL_PLAN.md), [`AUTHENTICATION_STATE_SPEC.md`](../../architecture/AUTHENTICATION_STATE_SPEC.md). 서버·lib·API 라우트에서는 `useAuth` import 금지 등 ESLint로 경계를 둔다.

---

## 6. OAuth·부분 식별·완성(Completion) — 신원 충돌

**맥락**: 소셜 로그인 등으로 **이메일·전화만 먼저 확정**되고, 프로필·표시 이름·약관 동의는 **뒤 단계**로 미루는 경우가 많다. §1의 **Auth → Identity → Completion** 순서와 모순되지 않게, **“부분 식별” 단계**와 **“계정 완성” 단계**를 분리해 문서·상태명에 드러낸다.

**원칙**:

- **Completion 전에는** 민감 리소스·다른 사용자와 충돌할 수 있는 식별자(고정 handle, 공개 URL 등)를 **임의로 확정**하지 않는다. 필요하면 임시 값·내부 ID만 쓰고, 완성 플로우에서 확정한다.
- **신원 충돌(동일 이메일·provider subject·전화 등)**: “머지 / 거절 / 수동 검토” 중 제품 정책을 **한곳**에서 정하고, UI는 안내·선택만 담당한다(§3 단일 소스와 정합).
- **체크리스트(리뷰·설계)**  
  - [ ] 부분 로그인 직후 **어떤 API·화면이 허용**되는지 명시했는가?  
  - [ ] Completion 이후에만 열리는 경로에 **가드**가 있는가?  
  - [ ] 동일 외부 계정·이메일이 기존 사용자와 맞닿을 때 **충돌 해소 UX**가 정의돼 있는가?

**Itemwiki 인스턴스**: OAuth 개선 보고·세부 플로 — [OAUTH_SIGNUP_IMPROVEMENTS_REPORT.md](../../itemwiki-constitution/itemwiki-specific/auth/OAUTH_SIGNUP_IMPROVEMENTS_REPORT.md) (원칙은 본 §, 구현·이슈 목록은 인스턴스).

---

## 🔗 관련 문서

- [CONCEPTUAL_ROT_PREVENTION.md](./CONCEPTUAL_ROT_PREVENTION.md) — 인증·권한은 훅/정책만 사용
- [UX_SAFETY_RULES.md](./UX_SAFETY_RULES.md) — 네트워크·로딩 안전
- [SINGLE_SOURCE_MAP.md](../SINGLE_SOURCE_MAP.md) — 결정 축별 단일 소스

### Itemwiki 적용 (판단 vs 실행)

- **어디로 갈지(상태 → URL 문자열)**: `determineRedirectUrl` 등 — [Itemwiki 단일 소스 맵](../../itemwiki-constitution/SINGLE_SOURCE_MAP.md)의 「리다이렉트 URL」 행·`decision-registry.json`의 `redirect-url`과 대응.
- **라우터로 실제 이동(push/replace)**: `useAuthRedirectManager` / `requestGlobalRedirect` — URL은 위 단일 소스·`getRedirectUrlFromRequest` 경로를 따르도록 유지한다. UI 컴포넌트에서 임의로 `router.push`로 인증 분기만 구현하지 않는다(§3).

---

**최종 업데이트**: 2026-04-14 — §6 OAuth·Completion·신원 충돌 체크리스트
