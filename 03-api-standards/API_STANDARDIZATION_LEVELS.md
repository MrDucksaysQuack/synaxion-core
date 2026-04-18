# API 라우트 표준화 헌법

> **Constitution 문서**  
> 모든 API 라우트는 반드시 이 표준을 따라야 한다.  
> 이 표준은 "규율"이 아니라 "최소 기준"이다.

**작성일**: 2025-12-23  
**목적**: API 표준화의 깊이를 API 성격에 맞게 조절하여 형식주의를 방지하고 실질적인 표준화 달성

---

## 📋 핵심 원칙

### 원칙 1: 표준화의 깊이는 API 성격에 따라 다르다

**❌ 잘못된 접근**:
- 모든 API에 동일한 깊이로 표준화 요구
- 단순 조회 API에도 Double-submit, Optimistic lock, 캐시 무효화를 모두 요구

**✅ 올바른 접근**:
- **Level A (절대 필수)**: 모든 API가 충족해야 하는 최소 기준
- **Level B (의미 있을 때만)**: API 성격에 따라 선택적으로 적용

### 원칙 2: 7단계 주석은 "존재 여부"의 문제

**❌ 잘못된 접근**:
- 모든 API에 ①~⑦ 단계를 모두 주석으로 명시 요구
- 단순 조회 API에도 모든 단계를 강제

**✅ 올바른 접근**:
- 7단계는 "논리적으로 존재"해야 함
- 주석은 비어 있어도 됨 (단, 섞이면 안 됨)
- 단순 조회 API: ① Trigger → ② State Read → ⑦ Output (끝)

---

## 🔒 Level A: 절대 필수 (모든 API)

다음 항목은 **모든 API 라우트**가 반드시 충족해야 합니다.

### 1. 미들웨어 패턴

```typescript
export const POST = (request: NextRequest) => {
  return withMetrics(request, async () => {
    const handler = withAuth(async (context, req) => {
      // 핸들러 로직
    });
    return handler(request);
  });
};
```

**필수 사항**:
- ✅ `withMetrics`로 래핑
- ✅ `withAuth` 또는 `withOptionalAuth` 사용

**위반 시**: 메트릭 수집 누락, 인증 검증 누락

---

### 2. 요청 검증 (POST/PATCH/PUT만)

```typescript
const validationResult = await validateRequestBody(req, schema);
if (!validationResult.success) {
  return validationResult.error!;
}
const validated = validationResult.data!;
```

**필수 사항**:
- ✅ POST/PATCH/PUT 메서드에 `validateRequestBody` 사용
- ✅ Zod Schema 정의

**위반 시**: 잘못된 요청 데이터로 인한 데이터 무결성 문제

**예외**: GET/DELETE는 요청 본문이 없으므로 제외

---

### 3. 에러 응답 형식

```typescript
// 표준 에러 응답 함수만 사용
return createErrorResponse('에러 메시지', 500, 'ERROR_CODE', undefined, { startTime });
return createNotFoundErrorResponse('리소스를 찾을 수 없습니다.', { startTime });
return createValidationErrorResponse(errors, '검증 실패', { startTime });
return createAuthErrorResponse('인증이 필요합니다.', { startTime });

// 참고: 이 함수들은 프로젝트의 API 응답 유틸리티에서 제공되어야 함
// 예: @/lib/api/response 또는 @/lib/utils/api-response
```

**필수 사항**:
- ✅ **에러 경로**: `createErrorResponse` 계열만 사용 (래퍼 내부·`app/api/utils/response.ts` 제외)
- ✅ **성공 경로**: `createSuccessResponse` 등 표준 성공 응답 유틸 사용
- ✅ 라우트 파일에서 `NextResponse.json` / `new NextResponse(...)` **직접 호출 금지** — 아래 **예외** 또는 `app/api/utils/response.ts`에 모은 전용 함수만 허용

**위반 시**: 에러 응답 형식 불일치, 클라이언트 파싱 실패

#### 표준 envelope를 쓰지 않는 예외 (허용)

| 경우 | 사용 | 비고 |
|------|------|------|
| OpenAPI 스펙 문서 (`GET /api/openapi.json`) | `createSpecJsonDocumentResponse` | 루트에 `openapi` 키 필요 → `success`/`data`로 감싸면 도구 호환 실패 |
| 외부 플랫폼이 고정 JSON 스키마를 요구하는 콜백 | `createRawJsonResponse` 또는 전용 유틸 | Meta 등 규격 문서 준수 |
| 상류 API 응답을 **바디·헤더 그대로** 전달하는 프록시 | `new NextResponse(body, { status, headers })` | 해당 라우트 주석에 “패스스루” 명시 (예: deprecated `set-cookies` → `sync-cookies`) |

에러가 나는 경로는 여전히 `handleAPIError` → 표준 에러 응답으로 통일한다.

**래퍼 내부(`app/api/utils`)**: `createErrorResponse` / `createSuccessResponse` 외에도, 이미 표준 본문을 조립한 경우 `createNextResponseFromStandardBody`, Web `Response`를 넘길 때 `nextResponseFromWebResponse`를 사용한다. 이들도 `response.ts`에만 `NextResponse.json`을 모은다.

`createGetHandler` / `createMutationHandler`(POST·PATCH·PUT) / `createDeleteHandler` / `createApiRoute`(`api-route-wrapper`)는 `withMetrics` 직하위에 **외곽 `try/catch`**를 두어, 인증 래퍼 밖에서 터진 예외도 `handleAPIError` → 실패 시 `GENERAL_ERROR_CODES.INTERNAL_ERROR` 폴백으로 항상 JSON 응답을 보장한다.

`./handler`에 `withMetrics(deps.withAuth(...))`처럼 합성만 하는 팩토리는 **`wrapHandlerWithOuterCatch(endpoint, method, inner)`**(`app/api/utils/handler-outer-catch.ts`)로 감싼 뒤 `withMetrics(...)`에 넘겨 동일 계약을 유지한다.

`route.ts`에서 직접 `withMetrics(withAuth(...))`를 쓰는 경우에는 **`withMetricsAndOuterCatch(endpoint, method, withAuth(...))`** 한 번으로 동일하게 맞출 수 있다. 나머지 `withMetrics(withAuth` 패턴 라우트는 트래픽·민감도 순으로 같은 방식으로 옮기면 된다.

---

### 4. 에러 로깅

에러 로깅은 **프로젝트 공통 API 에러 처리**를 통해 수행한다.  
(예: `handleAPIError` 사용 시 내부에서 `logUnifiedError` 등 통합 로거로 기록)

```typescript
// 래퍼(createGetHandler, createPostHandler 등) 사용 시: catch에서 handleAPIError 호출
return await handleAPIError(error, {
  endpoint: '/api/v1/endpoint',
  method: 'POST',
  userId: context.userId,
  action: 'action_name',
  startTime,
  request,
});
```

**필수 사항**:
- ✅ 모든 catch 블록에서 공통 에러 처리 경로 사용 (예: `handleAPIError` → 통합 로거)
- ✅ 에러 타입·심각도는 공통 핸들러 또는 옵션으로 명시

**위반 시**: 에러 추적 불가, 디버깅 어려움

---

### 5. 로직 구성 7단계 원칙 (논리적 존재)

**핵심**: 7단계는 "모두 구현해야 하는 단계"가 아니라 "논리적으로 존재해야 하는 단계"입니다.

#### 단순 조회 API (GET)

```typescript
export const GET = (request: NextRequest) => {
  return withMetrics(request, async () => {
    const handler = withOptionalAuth(async (context, req) => {
      // ① Trigger: 조회 요청
      // ② State Read: 데이터 조회
      const data = await getData();
      
      // ⑦ Output: 응답 반환
      return createSuccessResponse({ data }, { startTime });
    });
    return handler(request);
  });
};
```

**필수 단계**: ①, ②, ⑦

**선택 단계**: ③ (분기가 필요한 경우만), ④ (변환/가공이 필요한 경우만), ⑤ (없음), ⑥ (없음)

#### 복잡한 조회 API (GET with Branching)

```typescript
export const GET = (request: NextRequest) => {
  return withMetrics(request, async () => {
    const handler = withOptionalAuth(async (context, req) => {
      // ① Trigger: 조회 요청
      
      // ② State Read: 데이터 조회
      const data = await getData();
      
      // ③ Branching: 상태 기반 분기
      if (!data) {
        return createNotFoundErrorResponse('데이터를 찾을 수 없습니다.', { startTime });
      }
      
      // ④ Action: 데이터 가공
      const processed = processData(data);
      
      // ⑦ Output: 응답 반환
      return createSuccessResponse({ data: processed }, { startTime });
    });
    return handler(request);
  });
};
```

**필수 단계**: ①, ②, ③, ④, ⑦

#### 생성 API (POST)

```typescript
export const POST = (request: NextRequest) => {
  return withMetrics(request, async () => {
    const handler = withAuth(async (context, req) => {
      // ① Trigger: 생성 요청
      
      // ② State Read: 요청 검증 및 기존 데이터 확인
      const validationResult = await validateRequestBody(req, schema);
      if (!validationResult.success) {
        return validationResult.error!;
      }
      const validated = validationResult.data!;
      
      const existing = await checkExisting(validated.id);
      
      // ③ Branching: 상태 기반 분기
      if (existing) {
        return createErrorResponse('이미 존재합니다.', 409, 'DUPLICATE', undefined, { startTime });
      }
      
      // ④ Action: 데이터 생성
      const created = await createData(validated);
      
      // ⑤ State Mutation: 상태 변화 기록 (이미 ④에서 처리됨)
      
      // ⑦ Output: 응답 반환
      return createSuccessResponse({ data: created }, { startTime });
    });
    return handler(request);
  });
};
```

**필수 단계**: ①, ②, ③, ④, ⑤, ⑦

**선택 단계**: ⑥ (Side Effect가 필요한 경우만)

#### 수정 API (PATCH)

```typescript
export const PATCH = (request: NextRequest) => {
  return withMetrics(request, async () => {
    const handler = withAuth(async (context, req) => {
      // ① Trigger: 수정 요청
      
      // ② State Read: 요청 검증 및 기존 데이터 확인
      const validationResult = await validateRequestBody(req, schema);
      if (!validationResult.success) {
        return validationResult.error!;
      }
      const validated = validationResult.data!;
      
      const existing = await getExisting(validated.id);
      
      // ③ Branching: 상태 기반 분기
      if (!existing) {
        return createNotFoundErrorResponse('리소스를 찾을 수 없습니다.', { startTime });
      }
      
      // ④ Action: 데이터 수정
      const updated = await updateData(validated.id, validated);
      
      // ⑤ State Mutation: 상태 변화 기록 (이미 ④에서 처리됨)
      
      // ⑥ Side Effect: 캐시 무효화 (선택적)
      await invalidateCache(validated.id).catch(() => {});
      
      // ⑦ Output: 응답 반환
      return createSuccessResponse({ data: updated }, { startTime });
    });
    return handler(request);
  });
};
```

**필수 단계**: ①, ②, ③, ④, ⑤, ⑦

**선택 단계**: ⑥ (캐시 무효화가 필요한 경우만)

---

## 🟡 Level B: 의미 있을 때만 (선택적)

다음 항목은 **API 성격에 따라 선택적으로 적용**합니다.

### 1. Double-Submit Blocking

**적용 대상**: CREATE 작업 (POST)

**적용 조건**:
- 사용자가 동일한 요청을 짧은 시간 내에 중복 제출할 가능성이 있는 경우
- 예: 프로필 생성, 리소스 생성, 활동 생성

**적용 예시**:
```typescript
const requestKey = `resource:create:${validated.id}:${context.userId}`;
try {
  checkDoubleSubmit({ key: requestKey, ttl: 2000 });
} catch (error) {
  if (error instanceof DoubleSubmitError) {
    return createErrorResponse(
      error.message,
      429,
      'DUPLICATE_REQUEST',
      undefined,
      { startTime }
    );
  }
  throw error;
}
```

**적용하지 않아도 되는 경우**:
- 단순 조회 API (GET)
- 삭제 API (DELETE) - 중복 삭제는 idempotent

---

### 2. 낙관적 잠금 (Optimistic Locking)

**적용 대상**: UPDATE 작업 (PATCH/PUT)

**적용 조건**:
- 동시 수정으로 인한 데이터 충돌이 발생할 수 있는 경우
- 예: 프로필 수정, 리소스 정보 수정

**적용 예시**:
```typescript
if (validated.expectedUpdatedAt) {
  try {
    checkOptimisticLock({
      currentUpdatedAt: existing.updated_at,
      expectedUpdatedAt: validated.expectedUpdatedAt,
      entityId: id,
      entityType: 'resource',
    });
  } catch (error) {
    if (error instanceof OptimisticLockError) {
      return createErrorResponse(
        error.message,
        409,
        'OPTIMISTIC_LOCK_ERROR',
        {
          currentUpdatedAt: error.currentUpdatedAt,
          expectedUpdatedAt: error.expectedUpdatedAt,
        },
        { startTime }
      );
    }
    throw error;
  }
}
```

**적용하지 않아도 되는 경우**:
- 단순 조회 API (GET)
- 생성 API (POST) - 새 리소스 생성이므로 충돌 없음
- 삭제 API (DELETE) - 중복 삭제는 idempotent

---

### 3. 캐시 무효화

**적용 대상**: UPDATE/DELETE 작업 (PATCH/PUT/DELETE)

**적용 조건**:
- 캐시된 데이터가 업데이트/삭제 후 무효화되어야 하는 경우
- 예: 리소스 정보 수정, 프로필 수정

**적용 예시**:
```typescript
// ⑥ Side Effect: 캐시 무효화 (비동기, 핵심 로직과 분리)
// Side Effect는 핵심 로직과 분리되어야 하며, 실패해도 전체 로직에 영향 없어야 함
try {
  await invalidateResourceCache(id).catch(() => {
    // 캐시 무효화 실패는 로그만 남기고 계속 진행
    console.error('Cache invalidation failed');
  });
} catch (error) {
  // Side Effect 실패는 핵심 로직에 영향 없음
}
```

**적용하지 않아도 되는 경우**:
- 단순 조회 API (GET) - 캐시 무효화 불필요
- 생성 API (POST) - 새 리소스 생성이므로 캐시 무효화 불필요 (또는 선택적)

---

### 4. 원자적 조회 (Promise.all)

**적용 대상**: 여러 상태를 동시에 조회해야 하는 경우

**적용 조건**:
- 여러 데이터 소스를 동시에 조회해야 하는 경우
- 예: 프로필 + 활동 통계 + 메타데이터 동시 조회

**적용 예시**:
```typescript
// ② State Read: 원자적 조회
// 여러 데이터 소스를 동시에 조회할 때 Promise.allSettled 사용
const [profileResult, activityResult, metadataResult] = await Promise.allSettled([
  db.from('user_profiles').select('*').eq('id', userId).single(),
  db.from('activities').select('id, status').eq('user_id', userId),
  db.from('user_metadata').select('metadata').eq('user_id', userId),
]);
```

**적용하지 않아도 되는 경우**:
- 단일 데이터 소스만 조회하는 경우
- 순차적 조회가 필요한 경우 (의존성 있음)

---

## 📝 7단계 주석 가이드라인

### 원칙: 주석은 비어 있어도 됨 (단, 섞이면 안 됨)

**✅ 올바른 예시 1: 단순 조회 API (주석 최소화)**

```typescript
export const GET = (request: NextRequest) => {
  return withMetrics(request, async () => {
    const handler = withOptionalAuth(async (context, req) => {
      const startTime = measureExecutionTime();
      try {
        // ① Trigger: 조회 요청
        // ② State Read: 데이터 조회
        const data = await getData();
        
        // ⑦ Output: 응답 반환
        return createSuccessResponse({ data }, { startTime });
      } catch (error) {
        return await handleAPIError(error, { endpoint: '/api/v1/endpoint', method: 'GET', startTime, request });
      }
    });
    return handler(request);
  });
};
```

**✅ 올바른 예시 2: 복잡한 생성 API (주석 상세)**

```typescript
export const POST = (request: NextRequest) => {
  return withMetrics(request, async () => {
    const handler = withAuth(async (context, req) => {
      const startTime = measureExecutionTime();
      try {
        // ① Trigger: 생성 요청
        // (함수 호출 자체가 Trigger)
        
        // ② State Read: 요청 검증 및 기존 데이터 확인
        const validationResult = await validateRequestBody(req, schema);
        if (!validationResult.success) {
          return validationResult.error!;
        }
        const validated = validationResult.data!;
        
        const existing = await checkExisting(validated.id);
        
        // ③ Branching: 상태 기반 분기
        if (existing) {
          return createErrorResponse('이미 존재합니다.', 409, 'DUPLICATE', undefined, { startTime });
        }
        
        // ④ Action: 데이터 생성
        const created = await createData(validated);
        
        // ⑤ State Mutation: 상태 변화 기록 (이미 ④에서 처리됨)
        
        // ⑥ Side Effect: 캐시 무효화 (선택적)
        await invalidateCache(validated.id).catch(() => {});
        
        // ⑦ Output: 응답 반환
        return createSuccessResponse({ data: created }, { startTime });
      } catch (error) {
        return await handleAPIError(error, { endpoint: '/api/v1/endpoint', method: 'POST', userId: context.userId, startTime, request });
      }
    });
    return handler(request);
  });
};
```

**❌ 잘못된 예시: 주석이 섞여 있음**

```typescript
export const GET = (request: NextRequest) => {
  return withMetrics(request, async () => {
    const handler = withOptionalAuth(async (context, req) => {
      // ① Trigger: 조회 요청
      const data = await getData(); // ❌ ② State Read 주석 없음
      
      // ③ Branching: 상태 기반 분기
      if (!data) { // ❌ ② State Read가 ③ Branching보다 먼저 와야 함
        return createNotFoundErrorResponse('데이터를 찾을 수 없습니다.', { startTime });
      }
      
      // ⑦ Output: 응답 반환
      return createSuccessResponse({ data }, { startTime });
    });
    return handler(request);
  });
};
```

---

## 🎯 API 유형별 표준화 체크리스트

### 단순 조회 API (GET)

**Level A (필수)**:
- [ ] `withMetrics`로 래핑
- [ ] `withOptionalAuth` 또는 `withAuth` 사용
- [ ] `createErrorResponse` 계열만 사용
- [ ] 공통 에러 처리(handleAPIError 등)로 에러 로깅
- [ ] ① Trigger, ② State Read, ⑦ Output 논리적으로 존재

**Level B (선택)**:
- [ ] 원자적 조회 (Promise.all) - 여러 데이터 소스 조회 시

---

### 복잡한 조회 API (GET with Branching)

**Level A (필수)**:
- [ ] `withMetrics`로 래핑
- [ ] `withOptionalAuth` 또는 `withAuth` 사용
- [ ] `createErrorResponse` 계열만 사용
- [ ] 공통 에러 처리(handleAPIError 등)로 에러 로깅
- [ ] ① Trigger, ② State Read, ③ Branching, ④ Action, ⑦ Output 논리적으로 존재

**Level B (선택)**:
- [ ] 원자적 조회 (Promise.all) - 여러 데이터 소스 조회 시

---

### 생성 API (POST)

**Level A (필수)**:
- [ ] `withMetrics`로 래핑
- [ ] `withAuth` 사용
- [ ] `validateRequestBody`로 요청 검증
- [ ] `createErrorResponse` 계열만 사용
- [ ] 공통 에러 처리(handleAPIError 등)로 에러 로깅
- [ ] ① Trigger, ② State Read, ③ Branching, ④ Action, ⑤ State Mutation, ⑦ Output 논리적으로 존재

**Level B (선택)**:
- [ ] Double-Submit Blocking - 중복 제출 가능성이 있는 경우
- [ ] 원자적 조회 (Promise.all) - 여러 데이터 소스 조회 시
- [ ] 캐시 무효화 - 관련 캐시가 있는 경우

---

### 수정 API (PATCH/PUT)

**Level A (필수)**:
- [ ] `withMetrics`로 래핑
- [ ] `withAuth` 사용
- [ ] `validateRequestBody`로 요청 검증
- [ ] `createErrorResponse` 계열만 사용
- [ ] 공통 에러 처리(handleAPIError 등)로 에러 로깅
- [ ] ① Trigger, ② State Read, ③ Branching, ④ Action, ⑤ State Mutation, ⑦ Output 논리적으로 존재

**Level B (선택)**:
- [ ] 낙관적 잠금 - 동시 수정 가능성이 있는 경우
- [ ] 분산 잠금 - 동시 수정 가능성이 있는 경우
- [ ] 캐시 무효화 - 캐시된 데이터가 있는 경우
- [ ] 원자적 조회 (Promise.all) - 여러 데이터 소스 조회 시

---

### 삭제 API (DELETE)

**Level A (필수)**:
- [ ] `withMetrics`로 래핑
- [ ] `withAuth` 사용
- [ ] `createErrorResponse` 계열만 사용
- [ ] 공통 에러 처리(handleAPIError 등)로 에러 로깅
- [ ] ① Trigger, ② State Read, ③ Branching, ④ Action, ⑤ State Mutation, ⑦ Output 논리적으로 존재

**Level B (선택)**:
- [ ] 캐시 무효화 - 캐시된 데이터가 있는 경우

---

## ⚠️ 위반 시나리오 및 해결

### 위반 1: Level A 필수 항목 누락

**예시**: `withMetrics` 없이 `withAuth`만 사용

```typescript
// ❌ 잘못된 예시
export const POST = withAuth(async (context, req) => {
  // 핸들러 로직
});
```

**해결**:
```typescript
// ✅ 올바른 예시
export const POST = (request: NextRequest) => {
  return withMetrics(request, async () => {
    const handler = withAuth(async (context, req) => {
      // 핸들러 로직
    });
    return handler(request);
  });
};
```

---

### 위반 2: Level B를 모든 API에 강제 적용

**예시**: 단순 조회 API에 Double-Submit Blocking 적용

```typescript
// ❌ 잘못된 예시
export const GET = (request: NextRequest) => {
  return withMetrics(request, async () => {
    const handler = withOptionalAuth(async (context, req) => {
      // Double-Submit Blocking (불필요)
      const requestKey = `get:data:${context?.userId || 'anonymous'}`;
      checkDoubleSubmit({ key: requestKey, ttl: 2000 });
      
      const data = await getData();
      return createSuccessResponse({ data }, { startTime });
    });
    return handler(request);
  });
};
```

**해결**: Double-Submit Blocking 제거 (GET은 idempotent)

---

### 위반 3: 7단계 주석이 섞여 있음

**예시**: ② State Read 주석 없이 ③ Branching 주석만 있음

```typescript
// ❌ 잘못된 예시
export const GET = (request: NextRequest) => {
  return withMetrics(request, async () => {
    const handler = withOptionalAuth(async (context, req) => {
      const data = await getData(); // ❌ ② State Read 주석 없음
      
      // ③ Branching: 상태 기반 분기
      if (!data) {
        return createNotFoundErrorResponse('데이터를 찾을 수 없습니다.', { startTime });
      }
      
      // ⑦ Output: 응답 반환
      return createSuccessResponse({ data }, { startTime });
    });
    return handler(request);
  });
};
```

**해결**: ② State Read 주석 추가

```typescript
// ✅ 올바른 예시
export const GET = (request: NextRequest) => {
  return withMetrics(request, async () => {
    const handler = withOptionalAuth(async (context, req) => {
      // ② State Read: 데이터 조회
      const data = await getData();
      
      // ③ Branching: 상태 기반 분기
      if (!data) {
        return createNotFoundErrorResponse('데이터를 찾을 수 없습니다.', { startTime });
      }
      
      // ⑦ Output: 응답 반환
      return createSuccessResponse({ data }, { startTime });
    });
    return handler(request);
  });
};
```

---

## 📚 참고 문서

- [로직 구성 7단계 절대 원칙](./LOGIC_CONSTRUCTION_CONSTITUTION.md)
- [API 표준화 상태 분석](../analysis/API_STANDARDIZATION_ANALYSIS.md)

---

## 🎯 결론

이 헌법을 따르면:

1. **형식주의 방지**: API 성격에 맞는 적절한 깊이의 표준화
2. **실질적 표준화**: 모든 API가 최소 기준(Level A)을 충족
3. **유연성 보장**: Level B는 필요할 때만 적용

**이 표준이 무너지면 시스템은 불안정해진다.**  
**이 표준이 완벽하면 어떤 API도 절대 무너지지 않는다.**

---

**작성일**: 2025-12-23  
**문서 타입**: Constitution (절대 원칙)  
**적용 범위**: 모든 API 라우트

---

## Status

**As of 2026-03-19, every `app/api/**/route.ts` entrypoint either applies Level A in-file (`withMetrics` + `withAuth` / `withOptionalAuth`) or delegates to a colocated `./handler` (or equivalent) factory that wraps the same.**  
헬스·OpenAPI·웹훅·크론·deprecated auth 등 특수 라우트도 동일 패턴으로 정렬됨.  
**Further Level B standardization is applied opportunistically on modification.**

이 선언으로 되돌림을 방지합니다.

