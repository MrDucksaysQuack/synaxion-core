# Unit 테스트 작성 가이드
# Unit Test Writing Guide

> **"Unit 테스트는 코드의 안전망이자 문서다"**

---

## 📋 목차

1. [Unit 테스트란?](#unit-테스트란)
2. [언제 Unit 테스트를 작성하는가?](#언제-unit-테스트를-작성하는가)
3. [테스트 작성 원칙](#테스트-작성-원칙)
4. [실전 예시](#실전-예시)
5. [체크리스트](#체크리스트)

---

## Unit 테스트란?

### 정의

**Unit 테스트**는 개별 함수나 모듈의 독립적인 동작을 검증하는 테스트입니다.

### 특징

- ✅ **외부 의존성 없음**: 모든 의존성은 Mock 처리
- ✅ **빠른 실행**: 1초 이내 실행
- ✅ **순수 함수 검증**: 입력에 대한 출력 검증
- ✅ **독립적 실행**: 다른 테스트와 독립적으로 실행 가능

### 테스트 피라미드에서의 위치

```
        /\
       /E2E\        ← 목표 ~10% (Playwright, 별도 스펙 수)
      /------\
     /Integration\  ← API·플로우 (Jest `tests/integration`)
    /------------\
   /    Unit      \  ← 목표 다수 (Jest `tests/unit`)
  /----------------\
```

**실측 스냅샷 (2026-03-20, Jest만 — E2E 제외)**  
`pnpm run test:unit` → 약 **3100+ tests** / **450+ suites**. `pnpm run test:integration` → 약 **900+ tests**. `pnpm run test:contract` → **16 tests** / 3 suites (`tests/contract`).  
비율은 **단위 테스트가 압도적으로 많고**, 통합도 두껍다. 위 도표의 %는 **유지보수 비용 관점의 목표 분포**이며, 숫자는 분기마다 위 명령으로 갱신하는 것을 권장한다.

---

## 언제 Unit 테스트를 작성하는가?

### ✅ Unit 테스트로 작성해야 하는 것

1. **도메인 로직 (비즈니스 규칙)**
   ```typescript
   // ✅ 좋은 예
   // tests/unit/domain/product/queries.test.ts
   describe('calculateProductSimilarity', () => {
     it('should return 1.0 for identical products', () => {
       const similarity = calculateProductSimilarity(product1, product2);
       expect(similarity).toBe(1.0);
     });
   });
   ```

2. **계산 함수 (순수 함수)**
   ```typescript
   // ✅ 좋은 예
   // tests/unit/utils/score-calculator.test.ts
   describe('calculateTrustScore', () => {
     it('should calculate trust score correctly', () => {
       const score = calculateTrustScore(contributions);
       expect(score).toBeGreaterThan(0);
     });
   });
   ```

3. **엔진 로직**
   ```typescript
   // ✅ 좋은 예
   // tests/unit/engines/parser-engine.test.ts
   describe('ParserEngine', () => {
     it('should parse text using first strategy', () => {
       const engine = new ParserEngine([strategy1, strategy2]);
       const result = engine.parse('input');
       expect(result).toBeDefined();
     });
   });
   ```

4. **변환/정규화 함수**
   ```typescript
   // ✅ 좋은 예
   // tests/unit/utils/normalizer.test.ts
   describe('normalizeIngredient', () => {
     it('should normalize ingredient name', () => {
       const normalized = normalizeIngredient('밀가루 (Wheat Flour)');
       expect(normalized).toBe('밀가루');
     });
   });
   ```

### ❌ Unit 테스트로 작성하지 말아야 할 것

1. **API 엔드포인트** → Integration 테스트로
2. **데이터베이스 쿼리** → Integration 테스트로
3. **외부 API 호출** → Integration 테스트로
4. **React 컴포넌트 렌더링** → Integration/E2E 테스트로

---

## 테스트 작성 원칙

### 1. AAA 패턴 (Arrange-Act-Assert)

모든 테스트는 다음 구조를 따릅니다:

```typescript
it('should do something', () => {
  // Arrange: 테스트 데이터 준비
  const input = { value: 1 };
  
  // Act: 테스트 대상 함수 실행
  const result = functionUnderTest(input);
  
  // Assert: 결과 검증
  expect(result).toBe(expected);
});
```

### 2. 하나의 테스트는 하나의 동작만 검증

```typescript
// ❌ 나쁜 예
it('should calculate similarity and compare products', () => {
  const similarity = calculateProductSimilarity(p1, p2);
  const comparison = compareProducts(p1, p2);
  expect(similarity).toBe(1.0);
  expect(comparison).toEqual([]);
});

// ✅ 좋은 예
it('should return 1.0 for identical products', () => {
  const similarity = calculateProductSimilarity(p1, p2);
  expect(similarity).toBe(1.0);
});

it('should return empty array for identical products', () => {
  const comparison = compareProducts(p1, p2);
  expect(comparison).toEqual([]);
});
```

### 3. 명확한 테스트 이름

테스트 이름은 "should + 동작 + 조건" 형식을 따릅니다:

```typescript
// ✅ 좋은 예
it('should return 1.0 for identical products', () => {});
it('should return 0.0 for completely different products', () => {});
it('should handle null values gracefully', () => {});
it('should parse JSON string ingredients to array', () => {});

// ❌ 나쁜 예
it('test similarity', () => {});
it('works', () => {});
it('test1', () => {});
```

### 4. 엣지 케이스 포함

다음 케이스들을 반드시 테스트합니다:

- ✅ null/undefined 값
- ✅ 빈 배열/객체
- ✅ 잘못된 입력
- ✅ 경계값 (boundary values)
- ✅ 예외 상황

---

## 실전 예시

### 예시 1: 도메인 로직 테스트

```typescript
/**
 * Product Queries 테스트
 * 
 * 제품 관련 쿼리 함수들의 동작을 검증합니다.
 */

import { calculateProductSimilarity } from '@itemwiki/lib/domain/product/queries';
import type { Product } from '@itemwiki/lib/domain/product/types';

describe('Product Queries', () => {
  describe('calculateProductSimilarity', () => {
    it('should return 1.0 for identical products', () => {
      // Arrange
      const product1: Product = {
        barcode: '123',
        product_name: 'Test Product',
        ingredients: ['밀가루', '설탕'],
      };
      const product2: Product = {
        barcode: '123',
        product_name: 'Test Product',
        ingredients: ['밀가루', '설탕'],
      };
      
      // Act
      const similarity = calculateProductSimilarity(product1, product2);
      
      // Assert
      expect(similarity).toBe(1.0);
    });
    
    it('should return 0.0 for completely different products', () => {
      // Arrange
      const product1: Product = {
        barcode: '123',
        product_name: 'Product A',
        ingredients: ['밀가루'],
      };
      const product2: Product = {
        barcode: '456',
        product_name: 'Product B',
        ingredients: ['우유'],
      };
      
      // Act
      const similarity = calculateProductSimilarity(product1, product2);
      
      // Assert
      expect(similarity).toBe(0.0);
    });
    
    it('should handle null values gracefully', () => {
      // Arrange
      const product1: Product = {
        barcode: '123',
        product_name: 'Test Product',
        ingredients: null as any,
      };
      const product2: Product = {
        barcode: '123',
        product_name: 'Test Product',
        ingredients: ['밀가루'],
      };
      
      // Act & Assert
      expect(() => {
        calculateProductSimilarity(product1, product2);
      }).not.toThrow();
    });
  });
});
```

### 예시 2: 엔진 테스트

```typescript
/**
 * Parser Engine 테스트
 * 
 * 범용 파서 엔진의 동작을 검증합니다.
 */

import { ParserEngine } from '@itemwiki/lib/engines/parser-engine';
import type { ParserStrategy } from '@itemwiki/lib/engines/parser-engine/types';

describe('ParserEngine', () => {
  describe('parse', () => {
    it('should parse text using first strategy', () => {
      // Arrange
      const strategy1: ParserStrategy<string, string> = {
        name: 'upper',
        parse: (text) => text.toUpperCase(),
      };
      const strategy2: ParserStrategy<string, string> = {
        name: 'lower',
        parse: (text) => text.toLowerCase(),
      };
      
      const engine = new ParserEngine({
        strategies: [strategy1, strategy2],
      });
      
      // Act
      const result = engine.parse('hello');
      
      // Assert
      expect(result).toBe('HELLO');
    });
    
    it('should select strategy by name', () => {
      // Arrange
      const strategy1: ParserStrategy<string, string> = {
        name: 'upper',
        parse: (text) => text.toUpperCase(),
      };
      const strategy2: ParserStrategy<string, string> = {
        name: 'lower',
        parse: (text) => text.toLowerCase(),
      };
      
      const engine = new ParserEngine({
        strategies: [strategy1, strategy2],
      });
      
      // Act
      const result = engine.parse('Hello', 'lower');
      
      // Assert
      expect(result).toBe('hello');
    });
  });
});
```

### 예시 3: 유틸리티 함수 테스트

```typescript
/**
 * String Utils 테스트
 * 
 * 문자열 유틸리티 함수들의 동작을 검증합니다.
 */

import { normalizeIngredient } from '@itemwiki/lib/utils/string/ingredient-normalizer';

describe('String Utils', () => {
  describe('normalizeIngredient', () => {
    it('should normalize ingredient name', () => {
      // Arrange
      const input = '밀가루 (Wheat Flour)';
      
      // Act
      const result = normalizeIngredient(input);
      
      // Assert
      expect(result).toBe('밀가루');
    });
    
    it('should handle empty string', () => {
      // Arrange
      const input = '';
      
      // Act
      const result = normalizeIngredient(input);
      
      // Assert
      expect(result).toBe('');
    });
    
    it('should handle null value', () => {
      // Arrange
      const input = null as any;
      
      // Act & Assert
      expect(() => {
        normalizeIngredient(input);
      }).toThrow();
    });
  });
});
```

---

## 체크리스트

테스트 작성 후 다음을 확인합니다:

- [ ] 모든 의존성이 Mock 처리되었는가?
- [ ] 테스트가 독립적으로 실행 가능한가?
- [ ] 테스트 이름이 명확한가? ("should + 동작 + 조건")
- [ ] AAA 패턴을 따르는가?
- [ ] 엣지 케이스가 포함되어 있는가?
- [ ] 하나의 테스트가 하나의 동작만 검증하는가?
- [ ] Integration 테스트를 삭제하지 않았는가? (SYSTEM_GUARDRAILS 준수)

---

## 테스트 실행

### 개별 테스트 실행

```bash
# 특정 테스트 파일 실행
npm test -- tests/unit/domain/product/queries.test.ts

# 특정 패턴 테스트 실행
npm test -- tests/unit/domain/product

# 특정 테스트만 실행
npm test -- tests/unit/domain/product/queries.test.ts -t "should return 1.0"
```

### 모든 Unit 테스트 실행

```bash
npm test -- tests/unit
```

### 테스트 커버리지 확인

```bash
npm test -- --coverage
```

---

## 다음 단계

- [Integration 테스트 가이드](./INTEGRATION_TEST_GUIDE.md) - API 엔드포인트 테스트
- [Mock 패턴 가이드](./MOCK_PATTERNS.md) - Mock 사용법
- [테스트 피라미드](./TESTING_PYRAMID.md) - 전체 테스트 전략

---

**최종 업데이트**: 2026-01-25  
**버전**: 2.0.0
