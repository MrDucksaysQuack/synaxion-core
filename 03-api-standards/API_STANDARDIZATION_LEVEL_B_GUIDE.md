# API 표준화 Level B 가이드
# API Standardization Level B Guide

> **"의미 있을 때만 적용한다"**

---

## 📋 목차

1. [Level B란?](#level-b란)
2. [적용 결정 가이드](#적용-결정-가이드)
3. [Level B 항목별 가이드](#level-b-항목별-가이드)
4. [실전 예시](#실전-예시)
5. [체크리스트](#체크리스트)

---

## Level B란?

### 정의

**Level B**는 API 성격에 따라 **선택적으로 적용**하는 표준화 항목입니다.

### Level A vs Level B

| 항목 | Level A | Level B |
|------|---------|---------|
| **적용 범위** | 모든 API | API 성격에 따라 선택 |
| **목적** | 최소 기준 (안정성) | 고급 기능 (품질) |
| **예시** | `withMetrics`, `withAuth` | Double-Submit Blocking, Optimistic Locking |

---

## 적용 결정 가이드

### 언제 Level B를 적용하는가?

다음 질문에 **"예"**라고 답할 수 있으면 Level B를 적용합니다:

1. **Double-Submit Blocking**
   - ❓ 사용자가 동일한 요청을 짧은 시간 내에 중복 제출할 가능성이 있는가?
   - ❓ CREATE 작업 (POST)인가?

2. **Optimistic Locking**
   - ❓ 동시 수정으로 인한 데이터 충돌이 발생할 수 있는가?
   - ❓ UPDATE 작업 (PATCH/PUT)인가?

3. **캐시 무효화**
   - ❓ 캐시된 데이터가 업데이트/삭제 후 무효화되어야 하는가?
   - ❓ UPDATE/DELETE 작업 (PATCH/PUT/DELETE)인가?

4. **원자적 조회 (Promise.all)**
   - ❓ 여러 데이터 소스를 동시에 조회해야 하는가?
   - ❓ 조회 간 의존성이 없는가?

---

## Level B 항목별 가이드

### 1. Double-Submit Blocking

#### 적용 대상

- ✅ CREATE 작업 (POST)
- ✅ 사용자 입력이 필요한 작업
- ✅ 중복 제출로 인한 문제가 발생할 수 있는 작업

#### 적용하지 않아도 되는 경우

- ❌ 단순 조회 API (GET)
- ❌ 삭제 API (DELETE) - 중복 삭제는 idempotent
- ❌ 읽기 전용 작업

#### 구현 예시

```typescript
import { checkDoubleSubmit, DoubleSubmitError } from '@/app/api/utils/double-submit';

export const POST = createPostHandler({
  endpoint: '/api/v1/users/me/profile',
  requireAuth: true,
  schema: createProfileSchema,
  handler: async (ctx, body) => {
    const { context, supabase } = ctx;
    
    // ① Trigger: 프로필 생성 요청
    
    // ② State Read: 요청 검증 및 기존 프로필 확인
    const existing = await getProfile(context.userId);
    
    // ③ Branching: 상태 기반 분기
    if (existing) {
      return createErrorResponse('프로필이 이미 존재합니다.', 409, 'PROFILE_EXISTS');
    }
    
    // Double-Submit Blocking (Level B)
    const requestKey = `profile:create:${context.userId}`;
    try {
      checkDoubleSubmit({ key: requestKey, ttl: 2000 }); // 2초 내 중복 제출 방지
    } catch (error) {
      if (error instanceof DoubleSubmitError) {
        return createErrorResponse(
          '요청이 너무 빠르게 반복되었습니다. 잠시 후 다시 시도해주세요.',
          429,
          'DUPLICATE_REQUEST',
          undefined,
          { startTime: ctx.startTime }
        );
      }
      throw error;
    }
    
    // ④ Action: 프로필 생성
    const profile = await createProfile(context.userId, body);
    
    // ⑤ State Mutation: 상태 변화 기록 (이미 ④에서 처리됨)
    
    // ⑦ Output: 응답 반환
    return createSuccessResponse({ profile }, { startTime: ctx.startTime });
  },
});
```

---

### 2. Optimistic Locking

#### 적용 대상

- ✅ UPDATE 작업 (PATCH/PUT)
- ✅ 동시 수정이 발생할 수 있는 리소스
- ✅ 충돌 해결이 필요한 작업

#### 적용하지 않아도 되는 경우

- ❌ 단순 조회 API (GET)
- ❌ 생성 API (POST) - 새 리소스 생성이므로 충돌 없음
- ❌ 삭제 API (DELETE) - 중복 삭제는 idempotent
- ❌ 단일 사용자만 수정하는 리소스

#### 구현 예시

```typescript
import { checkOptimisticLock, OptimisticLockError } from '@/app/api/utils/optimistic-lock';

export const PATCH = createPatchHandler({
  endpoint: '/api/v1/products/[barcode]',
  requireAuth: true,
  schema: updateProductSchema,
  handler: async (ctx, body) => {
    const { context, supabase, params } = ctx;
    const { barcode } = params;
    
    // ① Trigger: 제품 수정 요청
    
    // ② State Read: 요청 검증 및 기존 데이터 확인
    const existing = await getProduct(barcode);
    
    // ③ Branching: 상태 기반 분기
    if (!existing) {
      return createNotFoundErrorResponse('제품을 찾을 수 없습니다.');
    }
    
    // Optimistic Locking (Level B)
    if (body.expectedUpdatedAt) {
      try {
        checkOptimisticLock({
          currentUpdatedAt: existing.updated_at,
          expectedUpdatedAt: body.expectedUpdatedAt,
          entityId: barcode,
          entityType: 'product',
        });
      } catch (error) {
        if (error instanceof OptimisticLockError) {
          return createErrorResponse(
            '다른 사용자가 이미 수정했습니다. 최신 정보를 확인한 후 다시 시도해주세요.',
            409,
            'OPTIMISTIC_LOCK_ERROR',
            {
              currentUpdatedAt: error.currentUpdatedAt,
              expectedUpdatedAt: error.expectedUpdatedAt,
            },
            { startTime: ctx.startTime }
          );
        }
        throw error;
      }
    }
    
    // ④ Action: 제품 수정
    const updated = await updateProduct(barcode, body);
    
    // ⑤ State Mutation: 상태 변화 기록 (이미 ④에서 처리됨)
    
    // ⑥ Side Effect: 캐시 무효화 (Level B)
    await invalidateProductCache(barcode).catch(() => {});
    
    // ⑦ Output: 응답 반환
    return createSuccessResponse({ product: updated }, { startTime: ctx.startTime });
  },
});
```

---

### 3. 캐시 무효화

#### 적용 대상

- ✅ UPDATE 작업 (PATCH/PUT)
- ✅ DELETE 작업 (DELETE)
- ✅ 캐시된 데이터가 있는 리소스

#### 적용하지 않아도 되는 경우

- ❌ 단순 조회 API (GET) - 캐시 무효화 불필요
- ❌ 생성 API (POST) - 새 리소스 생성이므로 캐시 무효화 불필요 (또는 선택적)
- ❌ 캐시를 사용하지 않는 리소스

#### 구현 예시

```typescript
import { invalidateResourceCache } from '@/app/api/utils/cache';

export const PATCH = createPatchHandler({
  endpoint: '/api/v1/users/me/profile',
  requireAuth: true,
  schema: updateProfileSchema,
  handler: async (ctx, body) => {
    const { context, supabase } = ctx;
    
    // ① Trigger: 프로필 수정 요청
    
    // ② State Read: 요청 검증 및 기존 데이터 확인
    const existing = await getProfile(context.userId);
    
    // ③ Branching: 상태 기반 분기
    if (!existing) {
      return createNotFoundErrorResponse('프로필을 찾을 수 없습니다.');
    }
    
    // ④ Action: 프로필 수정
    const updated = await updateProfile(context.userId, body);
    
    // ⑤ State Mutation: 상태 변화 기록 (이미 ④에서 처리됨)
    
    // ⑥ Side Effect: 캐시 무효화 (Level B)
    // Side Effect는 핵심 로직과 분리되어야 하며, 실패해도 전체 로직에 영향 없어야 함
    try {
      await invalidateResourceCache({
        type: 'user_profile',
        id: context.userId,
      }).catch((error) => {
        // 캐시 무효화 실패는 로그만 남기고 계속 진행
        console.error('Cache invalidation failed:', error);
      });
    } catch (error) {
      // Side Effect 실패는 핵심 로직에 영향 없음
      console.error('Cache invalidation error:', error);
    }
    
    // ⑦ Output: 응답 반환
    return createSuccessResponse({ profile: updated }, { startTime: ctx.startTime });
  },
});
```

---

### 4. 원자적 조회 (Promise.all)

#### 적용 대상

- ✅ 여러 데이터 소스를 동시에 조회해야 하는 경우
- ✅ 조회 간 의존성이 없는 경우

#### 적용하지 않아도 되는 경우

- ❌ 단일 데이터 소스만 조회하는 경우
- ❌ 순차적 조회가 필요한 경우 (의존성 있음)

#### 구현 예시

```typescript
export const GET = createGetHandler({
  endpoint: '/api/v1/users/me',
  requireAuth: true,
  handler: async ({ context, supabase }) => {
    // ① Trigger: 사용자 정보 조회 요청
    
    // ② State Read: 원자적 조회 (Level B)
    // 여러 데이터 소스를 동시에 조회할 때 Promise.allSettled 사용
    const [profileResult, activityResult, metadataResult] = await Promise.allSettled([
      supabase
        .from('user_profiles')
        .select('*')
        .eq('id', context.userId)
        .single(),
      supabase
        .from('activities')
        .select('id, status')
        .eq('user_id', context.userId),
      supabase
        .from('user_metadata')
        .select('metadata')
        .eq('user_id', context.userId)
        .single(),
    ]);
    
    // ③ Branching: 상태 기반 분기
    if (profileResult.status === 'rejected') {
      return createErrorResponse('프로필을 찾을 수 없습니다.', 404, 'PROFILE_NOT_FOUND');
    }
    
    // ④ Action: 데이터 가공 (필요한 경우)
    const profile = profileResult.value.data;
    const activities = activityResult.status === 'fulfilled' ? activityResult.value.data : [];
    const metadata = metadataResult.status === 'fulfilled' ? metadataResult.value.data : null;
    
    // ⑦ Output: 응답 반환
    return createSuccessResponse({
      profile,
      activities,
      metadata,
    });
  },
});
```

---

## 실전 예시

### 예시 1: 프로필 생성 API (Double-Submit Blocking 적용)

```typescript
export const POST = createPostHandler({
  endpoint: '/api/v1/users/me/profile',
  requireAuth: true,
  schema: createProfileSchema,
  handler: async (ctx, body) => {
    const { context, supabase } = ctx;
    
    // ① Trigger: 프로필 생성 요청
    
    // ② State Read: 기존 프로필 확인
    const existing = await getProfile(context.userId);
    
    // ③ Branching: 상태 기반 분기
    if (existing) {
      return createErrorResponse('프로필이 이미 존재합니다.', 409, 'PROFILE_EXISTS');
    }
    
    // Level B: Double-Submit Blocking
    const requestKey = `profile:create:${context.userId}`;
    try {
      checkDoubleSubmit({ key: requestKey, ttl: 2000 });
    } catch (error) {
      if (error instanceof DoubleSubmitError) {
        return createErrorResponse(
          '요청이 너무 빠르게 반복되었습니다.',
          429,
          'DUPLICATE_REQUEST'
        );
      }
      throw error;
    }
    
    // ④ Action: 프로필 생성
    const profile = await createProfile(context.userId, body);
    
    // ⑦ Output: 응답 반환
    return createSuccessResponse({ profile });
  },
});
```

### 예시 2: 제품 수정 API (Optimistic Locking + 캐시 무효화 적용)

```typescript
export const PATCH = createPatchHandler({
  endpoint: '/api/v1/products/[barcode]',
  requireAuth: true,
  schema: updateProductSchema,
  handler: async (ctx, body) => {
    const { context, supabase, params } = ctx;
    const { barcode } = params;
    
    // ① Trigger: 제품 수정 요청
    
    // ② State Read: 기존 제품 확인
    const existing = await getProduct(barcode);
    
    // ③ Branching: 상태 기반 분기
    if (!existing) {
      return createNotFoundErrorResponse('제품을 찾을 수 없습니다.');
    }
    
    // Level B: Optimistic Locking
    if (body.expectedUpdatedAt) {
      try {
        checkOptimisticLock({
          currentUpdatedAt: existing.updated_at,
          expectedUpdatedAt: body.expectedUpdatedAt,
          entityId: barcode,
          entityType: 'product',
        });
      } catch (error) {
        if (error instanceof OptimisticLockError) {
          return createErrorResponse(
            '다른 사용자가 이미 수정했습니다.',
            409,
            'OPTIMISTIC_LOCK_ERROR',
            {
              currentUpdatedAt: error.currentUpdatedAt,
              expectedUpdatedAt: error.expectedUpdatedAt,
            }
          );
        }
        throw error;
      }
    }
    
    // ④ Action: 제품 수정
    const updated = await updateProduct(barcode, body);
    
    // ⑥ Side Effect: 캐시 무효화 (Level B)
    await invalidateProductCache(barcode).catch(() => {});
    
    // ⑦ Output: 응답 반환
    return createSuccessResponse({ product: updated });
  },
});
```

---

## 체크리스트

새로운 API 작성 시 다음을 확인합니다:

### Level A (필수)
- [ ] `withMetrics`로 래핑
- [ ] `withAuth` 또는 `withOptionalAuth` 사용
- [ ] POST/PATCH/PUT에 `validateRequestBody` 사용
- [ ] `createErrorResponse` 계열만 사용
- [ ] 모든 catch 블록에서 공통 에러 처리(handleAPIError 등)로 에러 로깅
- [ ] 7단계 로직 구성 원칙 준수

### Level B (선택적)
- [ ] Double-Submit Blocking이 필요한가? (CREATE 작업)
- [ ] Optimistic Locking이 필요한가? (UPDATE 작업, 동시 수정 가능)
- [ ] 캐시 무효화가 필요한가? (UPDATE/DELETE 작업, 캐시 사용)
- [ ] 원자적 조회가 필요한가? (여러 데이터 소스 동시 조회)

---

## 결론

Level B는 **의미 있을 때만 적용**합니다:

- ✅ Double-Submit Blocking: 중복 제출 방지가 필요한 경우
- ✅ Optimistic Locking: 동시 수정 충돌이 발생할 수 있는 경우
- ✅ 캐시 무효화: 캐시된 데이터가 있는 경우
- ✅ 원자적 조회: 여러 데이터 소스를 동시에 조회해야 하는 경우

**Level B를 적용하지 않아도 Level A만으로도 안정적인 API를 만들 수 있습니다.**

---

**다음 단계**: [API_STANDARDIZATION_LEVELS.md](./API_STANDARDIZATION_LEVELS.md)에서 전체 표준을 확인하세요.

---

**최종 업데이트**: 2026-01-25  
**버전**: 1.0.0
