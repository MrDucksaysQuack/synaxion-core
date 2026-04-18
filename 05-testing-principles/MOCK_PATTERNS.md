# Mock Patterns
# Mock 패턴

> **"Mock은 테스트 가능성을 높이는 도구이지, 복잡성을 추가하는 것이 아니다"**

---

## 핵심 원칙

### Mock의 목적

1. **외부 의존성 제거**: DB, API, 파일 시스템 등
2. **테스트 속도 향상**: 실제 호출 없이 즉시 결과
3. **결정론적 테스트**: 항상 같은 결과
4. **엣지 케이스 검증**: 실제로 재현 어려운 상황 테스트

---

## Mock 레이어 규칙

### 규칙 1: Mock에서는 절대 throw/reject 하지 않음

**핵심 원칙:**
> Mock은 데이터 레이어의 응답을 시뮬레이션할 뿐, 에러를 던지지 않습니다.

```typescript
// ❌ 금지
mockDatabase.query.mockImplementation(() => {
  throw new Error('Database error');
});

// ✅ 올바른 방법
mockDatabase.query.mockImplementation(() => ({
  data: null,
  error: { code: 'PGRST301', message: 'Database error' }
}));
```

**이유:**
- 환경 문제와 로직 문제 분리
- 에러 핸들링 로직 테스트 가능
- 일관된 에러 표현

---

### 규칙 2: 표준화된 Mock 헬퍼 사용

**금지:**
```typescript
// ❌ 매번 직접 Mock 구현
const mockDB = {
  query: jest.fn().mockReturnValue({
    data: [],
    error: null
  })
};
```

**권장:**
```typescript
// ✅ 표준 Mock 헬퍼 사용
import { createMockDatabase } from '@/tests/helpers/mock-database';
import { createMockAuth } from '@/tests/helpers/mock-auth';

const mockDB = createMockDatabase();
const mockAuth = createMockAuth();
```

---

## Mock 패턴

### 패턴 1: Query Builder Mock

**용도:** 데이터베이스 쿼리 Mock

```typescript
// helpers/mock-query-builder.ts
export function createQueryBuilder(result: { data: any; error: any }) {
  return {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(result),
    insert: jest.fn().mockResolvedValue(result),
    update: jest.fn().mockResolvedValue(result),
    delete: jest.fn().mockResolvedValue(result),
  };
}

// 사용
mockDB.from.mockReturnValue(
  createQueryBuilder({ data: mockUser, error: null })
);
```

---

### 패턴 2: Auth Context Mock

**용도:** 인증 컨텍스트 Mock

```typescript
// helpers/mock-auth.ts
export function createMockAuth(userId?: string) {
  return {
    getUser: jest.fn().mockResolvedValue({
      data: {
        user: userId ? { id: userId, email: 'test@example.com' } : null
      },
      error: null
    }),
    getSession: jest.fn().mockResolvedValue({
      data: { session: userId ? { user: { id: userId } } : null },
      error: null
    })
  };
}

// 사용
const mockAuth = createMockAuth('user-123');
```

---

### 패턴 3: Data World Pattern

**용도:** 각 테스트가 독립적인 데이터 세계를 가지도록

```typescript
// helpers/data-world.ts
export function enterDataWorld(config: {
  users?: User[];
  products?: Product[];
  orders?: Order[];
}) {
  beforeEach(() => {
    // 모든 테이블 Mock 설정
    if (config.users) {
      mockDB.from('users').select.mockResolvedValue({
        data: config.users,
        error: null
      });
    }
    
    if (config.products) {
      mockDB.from('products').select.mockResolvedValue({
        data: config.products,
        error: null
      });
    }
    
    // ... 기타 테이블
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
}

// 사용
describe('Product API', () => {
  enterDataWorld({
    users: [{ id: 'user-1', name: 'Test User' }],
    products: [{ id: 'prod-1', name: 'Test Product' }]
  });
  
  it('should get product', async () => {
    // 테스트는 격리된 데이터 세계에서 실행
  });
});
```

---

### 패턴 4: 유연한 상태 코드 검증

**용도:** 미들웨어가 상태 코드를 변경할 수 있는 경우

```typescript
// ✅ 여러 상태 코드 허용
it('should handle error gracefully', async () => {
  const response = await GET(request);
  
  // double-submit blocker나 다른 미들웨어가 429나 503을 반환할 수 있음
  expect([404, 429, 503].includes(response.status)).toBe(true);
  
  const body = await response.json();
  expect(body).toHaveProperty('error');
});
```

---

### 패턴 5: Fail-Soft 테스트

**용도:** 시스템이 망가져도 안전한지 검증

```typescript
// tests/integration/fail-soft/database-down.test.ts
describe('Database Failure', () => {
  it('should return 503 when DB connection fails', async () => {
    // DB 연결 실패 시뮬레이션
    mockDB.from.mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({
        data: null,
        error: { code: 'CONNECTION_ERROR', message: 'Database down' }
      })
    }));
    
    const response = await POST(request);
    
    // 시스템이 완전히 멈추지 않고 graceful 응답
    expect([500, 503].includes(response.status)).toBe(true);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});
```

---

## Mock 초기화

### beforeEach 패턴

```typescript
describe('API Test', () => {
  beforeEach(() => {
    // 1. Mock 초기화
    jest.clearAllMocks();
    
    // 2. 기본 Mock 설정
    mockDB.from.mockReturnValue(createQueryBuilder({ data: [], error: null }));
    mockAuth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });
  
  afterEach(() => {
    // 3. 정리 (필요 시)
    jest.restoreAllMocks();
  });
});
```

---

## 체크리스트

Mock 작성 시 확인:

- [ ] Mock에서 throw/reject 하지 않는가?
- [ ] 표준 Mock 헬퍼를 사용하는가?
- [ ] beforeEach에서 초기화하는가?
- [ ] 테스트 간 격리되어 있는가?
- [ ] Mock이 실제 API와 일치하는가?

---

## 결론

> **"좋은 Mock은 보이지 않는다"**

Mock 패턴을 따르면:
- 테스트가 빠르고 안정적
- 엣지 케이스 쉽게 검증
- 외부 의존성 제거
- 일관된 테스트 환경

**Mock은 수단이지 목적이 아닙니다.**

---

**다음 단계:** [FAIL_SOFT_TESTING.md](./FAIL_SOFT_TESTING.md)에서 Fail-Soft 테스트를 학습하세요.

---

**최종 업데이트**: 2026-01-22  
**버전**: 1.0.0
