# 개념 부패 방지 규칙

**작성일**: 2025-12-25  
**목적**: 개념 부패(Conceptual Rot)와 리팩토링 불가능성(Structural Lock-in) 위험을 방지하기 위한 규칙

---

## 개요

이 문서는 Itemwiki 코드베이스에서 개념 부패와 리팩토링 불가능성을 방지하기 위한 규칙을 정의합니다.

### 개념 부패란?

- 같은 개념을 다른 이름으로 반복 생성
- Account / User / Profile / Member 개념이 섞임
- 문서화 불가능한 상태

### 리팩토링 불가능성이란?

- 코드 중복이 아니라 판단 중복
- 구조가 아니라 상황 대응 코드만 존재
- 기능은 돌아가지만 고칠 수 없음

---

## 규칙 1: 통합 함수 사용 강제

### 1.1 프로필 조회

**규칙**: 프로필 조회는 반드시 `getUserProfile()` 함수를 사용해야 합니다.

**금지 사항**:
- `supabase.from('user_profiles').select(...)` 직접 사용 금지
- `.eq('uid', ...)` 직접 사용 금지
- `.eq('account_id', ...)` 직접 사용 금지

**허용 사항**:
- `getUserProfile(supabase, authUserId, options)` 사용

**파일**: `packages/lib/utils/profile/profile-query-builder.ts`

**예시**:
```typescript
// ❌ 잘못된 예시
const { data: profile } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('uid', userId)
  .single();

// ✅ 올바른 예시
const { data: profile } = await getUserProfile(supabase, userId);
```

### 1.2 Account 조회

**규칙**: Account 조회는 반드시 `getUserAccount()` 함수를 사용해야 합니다.

**금지 사항**:
- `supabase.from('user_accounts').select(...)` 직접 사용 금지

**허용 사항**:
- `getUserAccount(supabase, authUserId)` 사용

**파일**: `packages/lib/utils/account/account-utils.ts`

**예시**:
```typescript
// ❌ 잘못된 예시
const { data: account } = await supabase
  .from('user_accounts')
  .select('user_id')
  .eq('auth_user_id', userId)
  .maybeSingle();

// ✅ 올바른 예시
const account = await getUserAccount(supabase, userId);
```

### 1.3 uid 사용 금지 및 fallback 패턴 제거

**규칙**: `uid` 필드를 직접 사용하면 안 되며, uid fallback 패턴도 완전히 제거해야 합니다.

**금지 사항**:
- `.eq('uid', ...)` 직접 사용 금지
- `.or(\`account_id.eq.${accountId},uid.eq.${authUserId}\`)` 패턴 금지
- `profile?.account_id || profile?.uid` 패턴 금지
- `profile.uid` 직접 접근 금지 (통합 함수 사용)

**허용 사항**:
- `getUserProfile()` 함수를 통한 간접 접근만 허용
- `account_id`만 사용 (uid fallback 완전 제거)

**이유**:
- `uid`는 레거시 필드입니다.
- `account_id`만 사용해야 합니다.
- 모든 프로필에 `account_id`가 있어야 합니다.
- uid fallback 패턴은 개념 오염을 유발합니다.

---

## 규칙 2: 판단 로직 중앙화

### 2.1 인증 판단

**규칙**: 클라이언트 사이드에서 인증 판단은 `useAuthState()`만 사용해야 합니다.

**금지 사항**:
- 컴포넌트 내부에서 `checkAuth` 함수 직접 구현 금지
- 다른 곳에서 인증 판단 로직 구현 금지

**허용 사항**:
- 클라이언트 사이드: `useAuthState()` 사용
- 서버 사이드(API 라우트): `getAuthContext()` 사용

**파일**:
- 클라이언트: `packages/web/hooks/auth/useAuthState.ts`
- 서버: `packages/web/auth/get-auth-context.ts`

**세션 값·토큰 (Context 단일 인스턴스와 정렬)**  
`useAuth()`는 **AuthSessionProvider 트리 안에서만** 호출되며, 실질적 세션 동기화는 Provider **한 곳**에서만 돈다(아키텍처: AuthSessionProvider). **같은 컴포넌트/훅 파일**에서 `useAuth()`와 `useAuthState()`를 **나란히 두어 `session`만 따로 가져오지 않는다.** Bearer가 필요하면 `useAuthState()`가 돌려주는 **`authState`에서만 파생**한다.

```typescript
const { hasAuthenticatedSession, authState } = useAuthState();
const session = authState.status === 'authenticated' ? authState.session : null;
```

- **`useAuthCheck`를 이미 쓰는 화면**: 그 훅이 내부에서 `useAuthState`를 호출하므로, 같은 파일에서 `useAuthState`를 **또** 호출하면 구독·프로필 조회가 중복될 수 있다. 이 경우 **`useAuthCheck`가 `session`·`hasAuthenticatedSession`을 함께 반환**하도록 확장하는 패턴을 쓴다([AUTH_FLOW_PRINCIPLES.md](./AUTH_FLOW_PRINCIPLES.md) §5).

**예시**:
```typescript
// ❌ 잘못된 예시
const checkAuth = useCallback(async () => {
  if (!user) {
    router.replace('/login');
  }
}, [user, router]);

// ✅ 올바른 예시
const { state, canAccessConsole } = useAuthState();
if (!canAccessConsole) {
  router.replace('/login');
}
```

### 2.2 가입 완료 / 프로필 존재 판단 (단일 소스)

**규칙**: “가입 완료(서비스 사용 가능)”는 **`hasSignedUp(profile)`** 또는 **`getAccountState(authUserId, profile) === 'active'`** 만 사용한다. 클라이언트 콘솔 진입은 `useAuthState()`·`useAccountState()`와 [SINGLE_SOURCE_MAP](../../itemwiki-constitution/SINGLE_SOURCE_MAP.md)의 콘솔 접근 행과 정합시킨다.

**금지 사항**:
- `profile !== null`만으로 가입 완료를 판단하는 분기
- `username_slug`·`display_name`을 직접 조합해 “완성도”를 새로 정의하는 것 (Trust Boundary가 아닌 일반 로직에서)

**허용 사항**:
- 비즈니스/서버: `hasSignedUp(profile)` ([`profile-validation.ts`](../../../packages/lib/utils/profile/profile-validation.ts))
- auth+profile 동시에 있을 때: `getAccountState(authUserId, profile)`
- 네트워크 응답 방어: `isValidProfileData(profile)` (Trust Boundary 전용)
- **하위 호환**: `isProfileSetupComplete` / `isSignupComplete`는 `hasSignedUp`에 위임된 **deprecated 별칭**이며, 신규 코드에서는 사용하지 않는다.

**예시**:
```typescript
// ❌ 잘못된 예시
const isComplete = profile?.username_slug && profile?.display_name;

// ✅ 올바른 예시
if (!hasSignedUp(profile)) {
  redirect('/signup');
}
```

### 2.3 권한 체크

**규칙**: 권한 체크는 `checkPermission()` 또는 `checkUserPermissionClient()` 함수만 사용해야 합니다.

**금지 사항**:
- 컴포넌트 내부에서 `trust_level` 기반 권한 체크 로직 직접 구현 금지

**허용 사항**:
- 서버 사이드: `checkPermission(resource, action, trustLevel)` 사용
- 클라이언트 사이드: `checkUserPermissionClient(profile, requiredTrustLevel)` 사용

**파일**:
- 서버: `packages/web/auth/permissions.ts`
- 클라이언트: `packages/lib/utils/auth/permission-check.ts`

**예시**:
```typescript
// ❌ 잘못된 예시
if (profile?.trust_level < 6) {
  router.replace('/');
}

// ✅ 올바른 예시
const result = checkUserPermissionClient(profile, 6);
if (!result.authorized) {
  router.replace('/');
}
```

---

## 규칙 3: 개념 통합

### 3.1 ID 개념 통합 및 변수명 표준

**규칙**: 사용자 ID는 다음 계층 구조를 따라야 하며, 변수명도 표준을 준수해야 합니다.

```
OAuth Identity (auth.users.id) → authUserId
  → Service Account (user_accounts.user_id) → accountId
    → Service Profile (user_profiles.account_id) → profileId
```

**변수명 표준**:
- OAuth Identity ID: `authUserId` (타입: `AuthUserId`)
- Service Account ID: `accountId` (타입: `AccountId`)
- Service Profile ID: `profileId` (타입: `ProfileId`)

**금지 사항**:
- `uid` 직접 사용 금지
- `userId`, `user_id` 변수명 사용 금지 (OAuth Identity ID인 경우 `authUserId` 사용)
- `auth_user_id`, `user_id`, `account_id`, `uid` 혼재 사용 금지
- `profile?.account_id || profile?.uid` 패턴 금지

**허용 사항**:
- `account_id`만 사용
- 통합 함수를 통한 간접 접근만 허용
- 표준 변수명 사용: `authUserId`, `accountId`, `profileId`

**참고**: [USER_ID_TERMINOLOGY.md](./USER_ID_TERMINOLOGY.md)

**AI Prompt 규칙**:
- 모든 코드 생성 시 Gateway 함수 사용 필수
- 변수명은 반드시 표준 준수 (`authUserId`, `accountId`, `profileId`)
- 직접 테이블 접근 금지 (`supabase.from('user_profiles')`, `supabase.from('user_accounts')`)
- uid fallback 패턴 사용 금지

---

## 검증

### ESLint 규칙

다음 ESLint 규칙이 적용되어 있습니다:

1. **직접 쿼리 사용 금지**: `user_profiles`, `user_accounts` 테이블 직접 쿼리 금지
2. **uid 직접 사용 금지**: `.eq('uid', ...)` 패턴 금지
3. **uid fallback 패턴 금지**: `.or()` 패턴에서 uid 사용 금지
4. **profile?.uid 패턴 금지**: `profile?.account_id || profile?.uid` 패턴 금지
5. **변수명 표준**: `userId` 변수명 사용 시 경고 (authUserId 사용 권장)

**파일**: `.eslintrc.json`

### 검증 스크립트

위 규칙(직접 쿼리·`uid`·판단 분산 등)은 **`scripts/check-conceptual-rot.ts`**에서 한 번에 검증합니다.

```bash
pnpm run check:conceptual-rot
```

`check:constitution-pr`·`check:all`·`constitution:check`에 포함되는 경우가 많습니다.

헌법 문서·구 스크립트명과의 호환을 위해 다음 **별칭**도 동일 검사를 실행합니다(실행 시마다 동일 스크립트 1회).

```bash
pnpm run check:direct-queries
pnpm run check:uid-usage
pnpm run check:decision-logic
```

---

## 예외 사항

### 업데이트 쿼리

업데이트 쿼리는 복잡하므로 현재는 직접 쿼리를 허용합니다. 하지만 다음 규칙을 따라야 합니다:

1. `account_id`만 사용 (uid fallback 완전 제거)
2. `account_id`가 없으면 에러 처리 (프로필 재생성 안내)

계정 삭제 유틸([`packages/lib/utils/account/delete-account.ts`](../../../packages/lib/utils/account/delete-account.ts))의 `user_profiles` update/select는 이 예외에 해당하며, [`scripts/check-conceptual-rot.ts`](../../../scripts/check-conceptual-rot.ts) `excludePatterns`의 `delete-account\.ts$`와 동일합니다.

### 특수 케이스

다음 케이스는 직접 쿼리를 허용합니다:

1. `username_slug`로 검색 (공개 프로필 조회)
2. 통합 함수로 불가능한 복잡한 쿼리

하지만 가능한 한 통합 함수를 사용하도록 노력해야 합니다.

---

## 참고 자료

- [USER_ID_TERMINOLOGY.md](./USER_ID_TERMINOLOGY.md) - 사용자 ID 용어집
- [VIBE_CODING_ASSESSMENT.md](../analysis/VIBE_CODING_ASSESSMENT.md) - 바이브코딩 평가
- [ACCOUNT_AUTH_PROFILE_BACKEND_ANALYSIS.md](../analysis/backend/ACCOUNT_AUTH_PROFILE_BACKEND_ANALYSIS.md) - 백엔드 분석

---

## 변경 이력

- 2026-03-21: §2.1 `authState`에서 session 파생·`useAuthCheck` 확장 패턴·AuthSessionProvider와 정렬
- 2026-03-20: §2.2 가입 완료 판단을 `hasSignedUp` / `getAccountState` 단일 소스로 정리, deprecated 별칭 명시
- 2026-03-19: Itemwiki 검증 명령을 `pnpm run check:conceptual-rot` 및 별칭 스크립트로 정리
- 2025-12-25: 초기 작성

