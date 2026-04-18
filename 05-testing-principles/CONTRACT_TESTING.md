# Contract Testing
# 계약 테스트

> **"API와 클라이언트 간의 계약을 검증한다"**  
> "Verify the contract between API and client"

---

## 핵심 개념

**Contract Testing**은 API와 클라이언트(Frontend) 간의 **데이터 계약**을 검증합니다.

```
Backend (API)  ←→  Contract  ←→  Frontend (Client)
     |                            |
  응답 스키마                  기대 타입
```

**목적:**
- API 응답 형식이 변경되면 즉시 감지
- 타입 불일치 사전 방지
- 리팩토링 안전성 확보

---

## Contract Test 위치

```
tests/contract/
├── api-contract.test.ts      # API 응답 계약
├── database-contract.test.ts # DB 스키마 계약
└── type-contract.test.ts     # 타입 정의 계약
```

### 실행

- **로컬**: `pnpm run test:contract` — `tests/contract` 만 순차(`--runInBand`) 실행.
- **CI**: `ci.yml`, `test.yml`, `nightly-tests.yml`, `release-gate.yml` 에서 `pnpm run test:unit` 다음에 `pnpm run test:contract` 를 실행한다. (`test:unit` 은 `tests/unit` 만 매칭하므로 계약 스위트는 이 단계 없이는 CI에서 누락될 수 있음.)
- **전체 로컬**: `pnpm test` 의 첫 Jest 구간은 integration 을 제외하므로 `tests/contract` 가 함께 돈다.

---

## 패턴 1: Zod Schema 검증

**가장 권장하는 방법**

```typescript
// tests/contract/api-contract.test.ts
import { z } from 'zod';

// API 응답 스키마 정의
const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().nullable(),
  created_at: z.string().datetime(),
});

const ProductSchema = z.object({
  barcode: z.string(),
  product_name: z.string().nullable(),
  brand: z.string().nullable(),
  images: z.array(z.string()).optional(),
});

describe('API Contract Tests', () => {
  describe('GET /api/v1/users/me', () => {
    it('should match User schema', async () => {
      const response = await fetch('/api/v1/users/me');
      const body = await response.json();
      
      // ✅ Zod로 스키마 검증
      expect(() => UserSchema.parse(body.data.user)).not.toThrow();
    });
  });
  
  describe('GET /api/v1/products/[barcode]', () => {
    it('should match Product schema', async () => {
      const response = await fetch('/api/v1/products/8801234567890');
      const body = await response.json();
      
      expect(() => ProductSchema.parse(body.data.product)).not.toThrow();
    });
  });
});
```

---

## 패턴 2: TypeScript Type 검증

```typescript
// tests/contract/type-contract.test.ts
import type { User, Product } from '@/types';

describe('Type Contract Tests', () => {
  it('should match User type definition', () => {
    const user: User = {
      id: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      created_at: new Date(),
    };
    
    // TypeScript 컴파일 시점에 검증
    expectTypeOf(user).toMatchTypeOf<User>();
  });
});
```

---

## 패턴 3: Snapshot Testing

```typescript
// tests/contract/api-contract.test.ts
describe('API Response Structure', () => {
  it('should match snapshot', async () => {
    const response = await fetch('/api/v1/products/8801234567890');
    const body = await response.json();
    
    // ✅ 응답 구조 스냅샷
    expect(body).toMatchSnapshot({
      data: {
        product: {
          barcode: expect.any(String),
          product_name: expect.any(String),
          created_at: expect.any(String),
        }
      },
      meta: {
        executionTime: expect.any(Number),
      }
    });
  });
});
```

---

## 패턴 4: Breaking Change 감지

```typescript
describe('Breaking Change Detection', () => {
  it('should not remove required fields', async () => {
    const response = await fetch('/api/v1/users/me');
    const body = await response.json();
    
    // ✅ 필수 필드 존재 확인
    expect(body.data).toHaveProperty('user');
    expect(body.data.user).toHaveProperty('id');
    expect(body.data.user).toHaveProperty('email');
    
    // ❌ 제거되면 테스트 실패 → Breaking Change 감지
  });
  
  it('should maintain backward compatibility', async () => {
    // 새 필드 추가는 OK, 기존 필드 제거는 NG
    const response = await fetch('/api/v1/products/123');
    const body = await response.json();
    
    // 기존 필드들이 여전히 존재하는지 확인
    const requiredFields = ['barcode', 'product_name', 'created_at'];
    requiredFields.forEach(field => {
      expect(body.data.product).toHaveProperty(field);
    });
  });
});
```

---

## 패턴 5: Nullable/Optional 검증

```typescript
describe('Null Safety Contract', () => {
  it('should handle null values correctly', async () => {
    const response = await fetch('/api/v1/products/123');
    const body = await response.json();
    
    // ✅ null 가능한 필드 타입 검증
    const schema = z.object({
      product_name: z.string().nullable(),  // null 허용
      barcode: z.string(),                  // null 불가
      images: z.array(z.string()).optional(), // undefined 허용
    });
    
    expect(() => schema.parse(body.data.product)).not.toThrow();
  });
});
```

---

## 실전 적용

### 언제 Contract Test를 작성하는가?

**✅ 필수:**
- Public API 엔드포인트
- 외부에 노출되는 API
- 버전 관리되는 API (v1, v2 등)

**⚠️ 권장:**
- 팀 간 경계 API (Frontend ↔ Backend)
- 마이크로서비스 간 API
- 자주 변경되는 API

**❌ 불필요:**
- 내부 헬퍼 함수
- Private 함수
- 테스트 전용 API

---

## CI/CD 통합

```yaml
# .github/workflows/contract-tests.yml
name: Contract Tests

on:
  pull_request:
    paths:
      - 'app/api/**'
      - 'types/**'

jobs:
  contract-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run contract tests
        run: npm test -- tests/contract/
      - name: Report breaking changes
        if: failure()
        run: echo "⚠️ Breaking change detected!"
```

---

## 체크리스트

Contract Test 작성 시:

- [ ] Zod 스키마로 응답 검증하는가?
- [ ] 필수 필드가 정의되어 있는가?
- [ ] Nullable/Optional이 명시되어 있는가?
- [ ] Breaking Change 감지 가능한가?
- [ ] CI에서 자동 실행되는가?

---

## 결론

> **"계약이 명확하면 변경이 안전하다"**

Contract Testing을 통해:
- **Breaking Change 조기 발견**: 배포 전 감지
- **리팩토링 안전성**: 타입 변경 시 즉시 알림
- **팀 간 협업**: Frontend/Backend 독립 개발
- **문서화**: 살아있는 API 스펙

**계약 테스트는 팀 간 신뢰의 기반입니다.**

---

**다음 단계:** [COVERAGE_STANDARDS.md](./COVERAGE_STANDARDS.md)에서 커버리지 기준을 학습하세요.

---

**최종 업데이트**: 2026-01-22  
**버전**: 1.0.0
