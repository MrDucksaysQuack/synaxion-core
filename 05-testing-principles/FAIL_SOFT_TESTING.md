# Fail-Soft Testing
# Fail-Soft 테스트

> **"시스템은 망가져도 안전해야 한다"**  
> "Systems should be safe even when broken"

---

## 핵심 개념

**Fail-Soft**란 시스템이 완전히 멈추지 않고 **degraded response(저하된 응답)**를 반환하는 것입니다.

```
❌ Fail-Hard: 에러 발생 → 시스템 중단 → 500 Error → 사용자 차단

✅ Fail-Soft: 에러 발생 → Graceful Degradation → 503/부분 응답 → 사용자 계속 사용
```

---

## 왜 Fail-Soft 테스트가 필요한가?

### 실전 시나리오

1. **데이터베이스 다운**: 전체 시스템 멈춤 vs 캐시 응답
2. **외부 API 타임아웃**: 에러 vs 기본값 응답
3. **메모리 부족**: 크래시 vs 일부 기능 비활성화
4. **네트워크 지연**: 무한 대기 vs 타임아웃 후 fallback

**목표:**
> 최악의 상황에서도 시스템이 응답하고, 사용자가 알 수 있어야 합니다.

---

## Fail-Soft 테스트 패턴

### 패턴 1: Database Failure

```typescript
// tests/integration/fail-soft/database-failure.test.ts
describe('Database Failure Scenarios', () => {
  it('should return 503 when DB connection fails', async () => {
    // DB 연결 실패 시뮬레이션
    mockDB.from.mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({
        data: null,
        error: { code: 'CONNECTION_ERROR', message: 'Database connection failed' }
      })
    }));
    
    const response = await POST(request);
    
    // ✅ 시스템이 완전히 멈추지 않음
    expect([500, 503].includes(response.status)).toBe(true);
    
    const body = await response.json();
    expect(body).toHaveProperty('error');
    expect(body.error.message).toContain('일시적으로 사용할 수 없습니다');
  });
  
  it('should return cached data when DB is slow', async () => {
    // DB 지연 시뮬레이션
    mockDB.from.mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve({ data: mockData, error: null }), 60000);
    }));
    
    const response = await GET(request);
    
    // ✅ 타임아웃 후 캐시 응답
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.meta).toHaveProperty('fromCache', true);
  });
});
```

---

### 패턴 2: External API Failure

```typescript
// tests/integration/fail-soft/external-api-failure.test.ts
describe('External API Failure Scenarios', () => {
  it('should return default data when external API fails', async () => {
    // 외부 API 실패 시뮬레이션
    mockExternalAPI.get.mockRejectedValue(
      new Error('External API timeout')
    );
    
    const response = await POST(request);
    
    // ✅ 기본값으로 응답 (완전 실패 아님)
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.meta.degraded).toBe(true);
  });
  
  it('should use stale cache when external API is down', async () => {
    // 외부 API 완전 다운
    mockExternalAPI.get.mockRejectedValue(
      new Error('Service unavailable')
    );
    
    const response = await GET(request);
    
    // ✅ 오래된 캐시라도 반환
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.meta.stale).toBe(true);
    expect(body.meta.cacheAge).toBeGreaterThan(0);
  });
});
```

---

### 패턴 3: Timeout Scenarios

```typescript
describe('Timeout Scenarios', () => {
  it('should timeout gracefully after 30 seconds', async () => {
    // 30초 이상 걸리는 작업 시뮬레이션
    mockLongRunningTask.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 60000))
    );
    
    const response = await POST(request);
    
    // ✅ 타임아웃 후 graceful 응답
    expect(response.status).toBe(504);
    const body = await response.json();
    expect(body.error.code).toBe('TIMEOUT');
    expect(body.error.message).toContain('시간 초과');
  });
});
```

---

### 패턴 4: Partial Success

```typescript
describe('Partial Success Scenarios', () => {
  it('should return partial results when some queries fail', async () => {
    // 일부 쿼리 실패 시뮬레이션
    const results = await Promise.allSettled([
      mockDB.query1(), // 성공
      mockDB.query2(), // 실패
      mockDB.query3(), // 성공
    ]);
    
    const response = await GET(request);
    
    // ✅ 부분 성공으로 응답
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.meta.partial).toBe(true);
    expect(body.meta.failedQueries).toHaveLength(1);
  });
});
```

---

### 패턴 5: Circuit Breaker

```typescript
describe('Circuit Breaker', () => {
  it('should open circuit after repeated failures', async () => {
    // 연속 실패 시뮬레이션
    for (let i = 0; i < 5; i++) {
      mockExternalAPI.get.mockRejectedValue(new Error('Service down'));
      await POST(request);
    }
    
    // ✅ Circuit Open → 즉시 에러 응답 (외부 호출 안 함)
    const response = await POST(request);
    expect(response.status).toBe(503);
    expect(mockExternalAPI.get).not.toHaveBeenCalled(); // 호출 안 함
  });
  
  it('should close circuit after recovery', async () => {
    // Circuit 열림
    await openCircuit();
    
    // 시간 경과 후 재시도
    jest.advanceTimersByTime(60000); // 1분 후
    
    // 성공 응답으로 설정
    mockExternalAPI.get.mockResolvedValue({ data: mockData });
    
    const response = await POST(request);
    
    // ✅ Circuit 닫힘 → 정상 동작
    expect(response.status).toBe(200);
  });
});
```

---

## Fail-Soft 테스트 위치

```
tests/integration/fail-soft/
├── database-failure.test.ts      # DB 장애
├── external-api-failure.test.ts  # 외부 API 장애
├── timeout.test.ts               # 타임아웃
├── partial-success.test.ts       # 부분 성공
├── circuit-breaker.test.ts       # Circuit Breaker
└── resource-exhaustion.test.ts   # 리소스 고갈
```

---

## 테스트 시나리오

### 1. DB 실패 → graceful 503

```typescript
it('DB 연결 실패 시 503 응답 반환', async () => {
  mockDB.from.mockReturnValue({
    select: jest.fn().mockResolvedValue({
      data: null,
      error: { message: 'Connection refused' }
    })
  });
  
  const response = await POST(request);
  
  expect([500, 503].includes(response.status)).toBe(true);
  const body = await response.json();
  expect(body).toHaveProperty('error');
});
```

### 2. 외부 API 실패 → degraded response

```typescript
it('외부 서비스 실패 시 degraded response 반환', async () => {
  mockExternalAPI.get.mockRejectedValue(new Error('Timeout'));
  
  const response = await POST(request);
  
  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body.data).toBeDefined(); // 기본값 또는 캐시
  expect(body.meta.degraded).toBe(true);
});
```

### 3. 중복 요청 → idempotent

```typescript
it('중복 요청 시 동일한 결과 반환 (idempotent)', async () => {
  const response1 = await POST(request);
  const response2 = await POST(request);
  
  expect(response1.status).toBe(response2.status);
  const body1 = await response1.json();
  const body2 = await response2.json();
  expect(body1.data.id).toBe(body2.data.id);
});
```

### 4. 권한 불일치 → 안전한 403

```typescript
it('권한 없을 때 안전하게 403 반환', async () => {
  mockAuth.getUser.mockResolvedValue({
    data: { user: { id: 'user-1', role: 'user' } },
    error: null
  });
  
  const response = await DELETE(request); // Admin only
  
  expect(response.status).toBe(403);
  // ✅ 데이터 유출 없음, 안전한 에러 메시지
});
```

---

## 체크리스트

Fail-Soft 테스트 작성 시:

- [ ] DB 실패 시나리오 테스트했는가?
- [ ] 외부 API 실패 시나리오 테스트했는가?
- [ ] 타임아웃 시나리오 테스트했는가?
- [ ] 시스템이 graceful하게 응답하는가?
- [ ] 사용자에게 적절한 메시지를 전달하는가?

---

## 결론

> **"최악을 대비하면 최악이 와도 괜찮다"**

Fail-Soft 테스트를 통해:
- **시스템 안정성**: 장애 시에도 동작
- **사용자 경험**: 완전 차단 대신 degraded 서비스
- **운영 신뢰**: 새벽에 전화 안 옴
- **비즈니스 연속성**: 부분 장애가 전체 장애로 확산 방지

**Fail-Soft 테스트는 운영 환경의 현실을 반영합니다.**

---

**다음 단계:** [CONTRACT_TESTING.md](./CONTRACT_TESTING.md)에서 계약 테스트를 학습하세요.

---

**최종 업데이트**: 2026-01-22  
**버전**: 1.0.0
