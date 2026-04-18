# Testing Pyramid
# 테스트 피라미드

> **"많은 Unit 테스트, 적당한 Integration 테스트, 적은 E2E 테스트"**

---

## 개요

테스트는 피라미드 구조를 따라야 합니다:

```
        /\
       /E2E\        ← 적게 (10%, 핵심 플로우만)
      /------\
     /Integration\  ← 적당히 (30%, 모듈 간 상호작용)
    /------------\
   /    Unit      \  ← 많이 (60%, 도메인 로직)
  /----------------\
```

**왜 피라미드인가?**
- 아래로 갈수록 빠르고 안정적
- 위로 갈수록 느리고 불안정
- 비용 효율적

---

## 테스트 계층

### 1. Unit Tests (60-70%)

**목적:** 개별 함수/모듈의 독립적인 동작 검증

**특징:**
- 외부 의존성 없음 (모든 의존성 Mock)
- 매우 빠른 실행 (< 1초)
- 순수 함수 로직 검증
- 결정론적 (항상 같은 결과)

**위치:** `tests/unit/`

**테스트 대상:**
- 도메인 로직 (비즈니스 규칙)
- 계산 함수 (순수 함수)
- 유틸리티 함수
- 엔진 로직
- 변환/정규화 함수

**예시:**
```typescript
// tests/unit/engines/parser/parser-engine.test.ts
describe('ParserEngine', () => {
  it('should parse text using first strategy', () => {
    const engine = new ParserEngine([
      { name: 'test', parse: (text) => ({ result: text.toUpperCase() }) }
    ]);
    
    const result = engine.parse('hello');
    expect(result.result).toBe('HELLO');
  });
  
  it('should select strategy by name', () => {
    const engine = new ParserEngine([
      { name: 'upper', parse: (text) => text.toUpperCase() },
      { name: 'lower', parse: (text) => text.toLowerCase() }
    ]);
    
    expect(engine.parse('Hello', 'lower')).toBe('hello');
  });
});
```

**장점:**
- ✅ 빠름 (수천 개를 몇 초에 실행)
- ✅ 안정적 (외부 의존성 없음)
- ✅ 디버깅 쉬움
- ✅ TDD 가능

---

### 2. Integration Tests (20-30%)

**목적:** API 엔드포인트와 모듈 간 통합 동작 검증

**특징:**
- API 라우트 전체 플로우 테스트
- Mock 데이터베이스/외부 서비스 사용
- 인증/권한/에러 핸들링 검증
- 중간 속도 (1-5초)

**위치:** `tests/integration/`

**테스트 대상:**
- API 엔드포인트
- 비즈니스 플로우
- 모듈 간 상호작용
- 인증/인가 로직
- 에러 처리

**예시:**
```typescript
// tests/integration/api/users-me.test.ts
/**
 * @jest-environment node
 */
describe('GET /api/v1/users/me', () => {
  beforeEach(() => {
    // Mock 설정
    mockSupabase.from.mockReturnValue(
      createQueryBuilder({ data: mockUser, error: null })
    );
  });
  
  it('should return user profile when authenticated', async () => {
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.profile).toMatchObject({
      username: 'testuser',
      email: 'test@example.com'
    });
  });
  
  it('should return 401 when unauthenticated', async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: null } });
    
    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});
```

**장점:**
- ✅ 실제 플로우 검증
- ✅ API 계약 검증
- ✅ 통합 이슈 조기 발견

**단점:**
- ⚠️ Unit보다 느림
- ⚠️ Mock 설정 복잡

---

### 3. E2E Tests (10%)

**목적:** 실제 사용자 시나리오를 브라우저에서 검증

**특징:**
- 실제 브라우저 사용 (Playwright/Cypress)
- 전체 시스템 통합 검증
- 사용자 관점 테스트
- 느림 (10-60초)

**위치:** `tests/e2e/`

**테스트 대상:**
- 핵심 사용자 플로우 (회원가입, 로그인, 결제 등)
- Critical Path만 선택
- 크로스 브라우저 이슈
- UI/UX 검증

**예시:**
```typescript
// tests/e2e/flows/signup.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Signup Flow', () => {
  test('should complete signup successfully', async ({ page }) => {
    await page.goto('/signup');
    
    // Step 1: 이메일 입력
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    
    // Step 2: 프로필 설정
    await expect(page).toHaveURL(/\/signup\/profile/);
    await page.fill('input[name="username"]', 'testuser');
    await page.click('button:has-text("완료")');
    
    // Step 3: 대시보드 리다이렉트
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('환영합니다');
  });
});
```

**장점:**
- ✅ 실제 사용자 경험 검증
- ✅ 전체 시스템 통합 확인
- ✅ 회귀 테스트 (Regression)

**단점:**
- ⚠️ 매우 느림
- ⚠️ 불안정 (Flaky)
- ⚠️ 유지보수 비용 높음

---

## 비율 가이드

### 저장소 스냅샷 (Jest, 2026-03-20)

| 계층 | 대략적 규모 | 실행 |
|------|-------------|------|
| Unit | ~3100+ tests, `tests/unit` | `pnpm run test:unit` |
| Integration | ~900+ tests, `tests/integration` | `pnpm run test:integration` |
| Contract | 16 tests, `tests/contract` (Zod·타입·DB 계약) | `pnpm run test:contract` |
| E2E | Playwright `tests/e2e` | `pnpm run test:e2e` (권한/그룹별 스크립트 별도) |

통합+단위만 보면 **단위가 케이스 수 기준 과반을 훨씬 넘는다** — 이상형 피라미드의 “E2E는 얇게”는 **스펙 수·실행 빈도**를 점검하는 쪽이 현실적이다.

### 이상적인 분포 (목표 가이드)

```
Unit Tests:        60-70% (600-700개)
Integration Tests: 20-30% (200-300개)
E2E Tests:         10%    (50-100개)
```

### 실행 시간 분포

```
Unit Tests:        10-30초  (70% 커버리지)
Integration Tests: 1-3분    (20% 커버리지)
E2E Tests:         5-10분   (10% 커버리지)

총 실행 시간: 약 6-13분
```

---

## 각 계층별 가이드

### Unit Test 작성 기준

**✅ Unit Test로 작성해야 하는 것:**
- 순수 함수
- 계산 로직
- 변환 함수
- 검증 규칙
- 엔진 로직

**❌ Unit Test로 작성하지 말아야 할 것:**
- API 엔드포인트
- 데이터베이스 쿼리
- 외부 API 호출
- React 컴포넌트 렌더링

---

### Integration Test 작성 기준

**✅ Integration Test로 작성해야 하는 것:**
- API 엔드포인트
- 비즈니스 플로우 (여러 모듈 연동)
- 인증/인가 로직
- 에러 핸들링 전체 플로우

**❌ Integration Test로 작성하지 말아야 할 것:**
- 순수 함수 (Unit으로)
- 전체 사용자 플로우 (E2E로)

---

### E2E Test 작성 기준

**✅ E2E Test로 작성해야 하는 것:**
- 핵심 사용자 플로우 (회원가입, 로그인)
- Critical Path (결제, 주문)
- 크로스 브라우저 이슈
- 성능 검증 (선택적)

**❌ E2E Test로 작성하지 말아야 할 것:**
- 단순 API 호출 (Integration으로)
- 개별 함수 로직 (Unit으로)
- 모든 엣지 케이스 (Unit/Integration으로)

---

## Anti-Pattern (안티패턴)

### ❌ 안티패턴 1: 역피라미드

```
E2E Tests:         60%  ❌ 너무 많음, 느림, 불안정
Integration Tests: 30%
Unit Tests:        10%  ❌ 너무 적음
```

**문제:**
- 테스트 실행이 느림 (30분+)
- Flaky 테스트 많음
- 디버깅 어려움

---

### ❌ 안티패턴 2: E2E로 모든 케이스 검증

```typescript
// ❌ E2E로 엣지 케이스까지 모두 검증
test('should handle invalid email format', async ({ page }) => {
  await page.fill('input[name="email"]', 'invalid');
  await page.click('button[type="submit"]');
  await expect(page.locator('.error')).toContainText('이메일 형식이 올바르지 않습니다');
});

// ✅ Unit으로 검증
it('should reject invalid email format', () => {
  expect(validateEmail('invalid')).toBe(false);
});
```

---

### ❌ 안티패턴 3: Integration Test 없이 Unit → E2E

```
Unit Tests:   70%
E2E Tests:    30%
Integration:  0%   ❌ 통합 이슈 발견 못함
```

**문제:**
- 모듈 간 통합 이슈를 E2E에서만 발견
- E2E는 느리고 디버깅 어려움

---

## 최적 전략

### 1. 도메인 로직: Unit Test

```typescript
// ✅ 순수 함수는 Unit으로
export function calculateScore(data: Data, rules: Rules): number {
  // 복잡한 계산 로직
}

// tests/unit/domain/scorer.test.ts
describe('calculateScore', () => {
  it('should return 100 for perfect data', () => {
    expect(calculateScore(perfectData, rules)).toBe(100);
  });
});
```

### 2. API 엔드포인트: Integration Test

```typescript
// ✅ API는 Integration으로
// app/api/v1/products/route.ts
export async function POST(request: NextRequest) { ... }

// tests/integration/api/products.test.ts
describe('POST /api/v1/products', () => {
  it('should create product', async () => {
    const response = await POST(mockRequest);
    expect(response.status).toBe(201);
  });
});
```

### 3. 핵심 플로우: E2E Test

```typescript
// ✅ 핵심 사용자 플로우만 E2E로
test('should complete checkout flow', async ({ page }) => {
  await page.goto('/products/1');
  await page.click('button:has-text("장바구니")');
  await page.goto('/cart');
  await page.click('button:has-text("결제")');
  await expect(page).toHaveURL('/checkout/success');
});
```

---

## 실행 전략

### 로컬 개발

```bash
# 빠른 Unit만 (개발 중)
npm test -- --testPathPattern=unit

# Integration 추가 (커밋 전)
npm test -- --testPathPattern="unit|integration"

# E2E는 선택적 (대형 변경 후)
npm run test:e2e
```

### CI/CD

```yaml
# Pull Request
- Unit Tests (매번)
- Integration Tests (매번)
- E2E Tests (main 브랜치만)

# Main 브랜치
- 전체 테스트 (Unit + Integration + E2E)
- 크로스 브라우저 E2E
- 성능 테스트
```

---

## 커버리지 기준

### 최소 커버리지

| 테스트 타입 | Lines | Branches | Functions |
|-------------|-------|----------|-----------|
| Unit | 80% | 75% | 80% |
| Integration | 60% | 60% | 65% |
| 전체 | 70% | 65% | 70% |

### 중요도별 커버리지

| 코드 유형 | 목표 커버리지 |
|----------|--------------|
| 핵심 비즈니스 로직 | 90% |
| API 엔드포인트 | 80% |
| 도메인 규칙 | 85% |
| 유틸리티 함수 | 75% |
| UI 컴포넌트 | 60% |

---

## 테스트 우선순위

### 🔴 필수 (Must Have)
- 도메인 로직 (비즈니스 규칙)
- API 계약
- 상태 머신 규칙
- 복잡한 계산 로직
- 보안 관련 로직

### 🟡 권장 (Should Have)
- 핵심 사용자 플로우 (E2E)
- 모듈 간 통합
- 에러 처리
- 인증/인가

### 🟢 선택적 (Nice to Have)
- 단순 UI 컴포넌트
- 얇은 페이지 컴포넌트
- 순수 유틸리티

---

## 체크리스트

새로운 기능 개발 시:

- [ ] 도메인 로직이 있는가? → Unit Test 작성
- [ ] API 엔드포인트인가? → Integration Test 작성
- [ ] 핵심 사용자 플로우인가? → E2E Test 작성
- [ ] 비율이 피라미드를 유지하는가?
- [ ] 전체 실행 시간이 10분 이내인가?

---

## 결론

> **"Fast feedback first, comprehensive coverage later"**

테스트 피라미드를 따르면:
- **빠른 피드백**: Unit이 대부분이라 즉시 확인
- **안정적 CI**: Flaky 테스트 최소화
- **비용 효율**: 느린 E2E 최소화
- **높은 커버리지**: Unit으로 많이 커버

**피라미드가 무너지면 테스트도 무너집니다.**

---

**다음 단계:** [MOCK_PATTERNS.md](./MOCK_PATTERNS.md)에서 Mock 패턴을 학습하세요.

---

**최종 업데이트**: 2026-01-22  
**버전**: 1.0.0
