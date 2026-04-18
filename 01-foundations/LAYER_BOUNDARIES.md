# Layer Boundaries
# 계층 경계

> **"의존성은 단방향으로만 흐른다"**  
> "Dependencies flow in one direction only"

---

## 핵심 원칙

모든 시스템은 **명확한 계층 구조**를 가져야 하며, **의존성은 단방향**으로만 흐릅니다.

```
Frontend Layer (UI/UX)
    ↓ (단방향 의존)
API Layer (Interface)
    ↓ (단방향 의존)
Domain Layer (Business Logic)
    ↓ (단방향 의존)
Engine Layer (Reusable Logic)
    ↓ (단방향 의존)
Core Layer (Infrastructure)
```

**역방향 의존은 절대 금지됩니다.**

---

## 계층 정의

### Core Layer (Infrastructure)

**위치:** `packages/lib/core/` 또는 `src/core/`

**역할:** 시스템의 기초 인프라

**포함 내용:**
- 타입 정의 (`types/`)
- 인증/인가 (`auth/`)
- 로거 (`logger/`)
- API 클라이언트 (`api-client/`)
- 설정 (`config/`)
- 상수 (`constants/`)
- 에러 처리 (`error-handling/`)

**특징:**
- 도메인 독립적
- 모든 계층이 의존 가능
- 변경 시 영향 범위가 큼 (최소 변경 원칙)

**의존성 규칙:**
```
✅ 허용: 외부 라이브러리만 의존 가능
❌ 금지: Engine, Domain, API, Frontend 의존 금지
```

**예시:**
```typescript
// ✅ 올바른 Core Layer 코드
// packages/lib/core/types/database.ts
export interface User {
  id: string;
  email: string;
  created_at: Date;
}

// packages/lib/core/logger/error-logger.ts
export async function logError(error: Error, context: ErrorContext) {
  // 도메인 독립적인 로깅
}
```

---

### Engine Layer (Reusable Logic)

**위치:** `packages/lib/engines/` 또는 `src/engines/`

**역할:** 재사용 가능한 범용 로직

**포함 내용:**
- Parser Engine: 데이터 파싱
- Validation Engine: 검증 규칙
- Scorer Engine: 점수 계산
- Matcher Engine: 매칭 로직
- Normalizer Engine: 정규화
- Confidence Engine: 신뢰도 계산

**특징:**
- 도메인 독립적
- 전략 패턴 기반
- 제네릭 타입 사용
- **의존성**: [IDP §2.4](../11-protocols/INFLOMATRIX_DEVELOPMENT_PROTOCOL.md#24-엔진-의존성-규칙) — **엔진 코드는 Core 진입점(`packages/lib/core/**`) 우선**; 로깅·바코드·문자열 등은 Core 게이트웨이로 utils 구현에 닿는다. “Core만”을 문자 그대로만 적용하지 않음(Itemwiki 정합)

**의존성 규칙:**
```
✅ 허용: Core Layer(및 §2.4가 정하는 동일 성격의 게이트 경로), Domain/API/Frontend/React/Hooks 아님
❌ 금지: Domain, API, Frontend 의존 금지
❌ 금지: 다른 Engine 직접 의존 금지
```

**예시:**
```typescript
// ✅ 올바른 Engine Layer 코드
// packages/lib/engines/parser/parser-engine.ts
interface ParserStrategy<TInput, TOutput> {
  name: string;
  parse(input: TInput): TOutput;
}

class ParserEngine<TInput, TOutput> {
  constructor(private strategies: ParserStrategy<TInput, TOutput>[]) {}
  
  parse(input: TInput, strategyName?: string): TOutput {
    // 도메인 독립적 파싱 로직
  }
}
```

---

### Domain Layer (Business Logic)

**위치:** `packages/lib/domain/` 또는 `src/domain/`

**역할:** 비즈니스 로직

**포함 내용:**
- 도메인별 비즈니스 로직 (`product/`, `user/`, `order/` 등)
- 도메인 규칙 (`rules/`)
- 도메인 타입 (`types.ts`)
- 도메인 서비스 (`services/`)

**특징:**
- 도메인별로 독립적
- Engine과 Core만 사용
- 다른 Domain에 의존하지 않음
- 명확한 진입점 (`index.ts`)

**의존성 규칙:**
```
✅ 허용: Engine Layer, Core Layer 의존 가능
❌ 금지: 다른 Domain 의존 금지
❌ 금지: API, Frontend 의존 금지
❌ 금지: React Hooks, Utils 의존 금지
```

**예시:**
```typescript
// ✅ 올바른 Domain Layer 코드
// packages/lib/domain/product/api/get-product.ts
import { ParserEngine } from '@/engines/parser';  // ✅ Engine 의존
import { logError } from '@/core/logger';         // ✅ Core 의존

export async function getProduct(barcode: string): Promise<Product> {
  // 비즈니스 로직
}

// ❌ 잘못된 Domain Layer 코드
import { getUserOrders } from '@/domain/order';  // ❌ 다른 Domain 의존
```

---

### API Layer (Interface)

**위치:** `app/api/` 또는 `src/api/`

**역할:** HTTP 인터페이스

**포함 내용:**
- API 라우트 (`route.ts`)
- 요청/응답 처리
- 인증/인가 체크
- 검증
- 미들웨어

**특징:**
- Domain Layer를 통해서만 비즈니스 로직 접근
- 7단계 로직 구성 준수
- 표준 에러 응답 형식 사용

**의존성 규칙:**
```
✅ 허용: Domain Layer 의존 가능
✅ 허용: Core의 인증/로깅 유틸리티 직접 사용 가능 (인터페이스 레벨)
❌ 금지: Core의 비즈니스 로직 직접 사용 금지 (Domain 통해서만)
❌ 금지: Engine 직접 사용 금지 (Domain 통해서만)
```

**예시:**
```typescript
// ✅ 올바른 API Layer 코드
// app/api/v1/products/[barcode]/route.ts
import { getProduct } from '@/domain/product';    // ✅ Domain 의존
import { withAuth } from '@/core/auth/middleware'; // ✅ Core 인터페이스 의존

export async function GET(request: NextRequest) {
  return withMetrics(request, async () => {
    const product = await getProduct(barcode);  // Domain 통해 접근
    return createSuccessResponse({ product });
  });
}

// ❌ 잘못된 API Layer 코드
import { ParserEngine } from '@/engines/parser';  // ❌ Engine 직접 의존
const parser = new ParserEngine(...);             // ❌ Domain 우회
```

---

### Frontend Layer (UI/UX)

**위치:** `app/`, `components/`, `pages/`

**역할:** 사용자 인터페이스

**포함 내용:**
- React Components
- Pages
- Hooks
- 상태 관리

**특징:**
- API Layer를 통해서만 서버 통신
- Domain 런타임(매퍼·바디 빌더)은 Itemwiki에서 `@itemwiki/lib/api/core` 또는 `packages/lib/api/*-ui` 재수출 경유
- Core Layer의 타입 정의 사용 가능

**의존성 규칙:**
```
✅ 허용: API Layer 호출 (HTTP)
✅ 허용: @itemwiki/lib/api/core 또는 packages/lib/api/*-ui 경유한 Domain 런타임
✅ 허용: Domain에서 import type 만 (타입 전용)
❌ 금지 (Itemwiki `components/**`·`packages/web/**`): @itemwiki/lib/domain 직접 **값** import — `pnpm run check:ui-domain-runtime-imports`. 타입 경로 일원화는 `pnpm run check:ui-domain-type-imports`(허용 목록 점진 축소).
✅ 허용: Core Layer 타입 정의
❌ 금지: Engine Layer 직접 의존
```

---

## 의존성 방향 규칙

### 허용되는 Import 패턴

```typescript
// ✅ Core에서 외부 라이브러리
import { z } from 'zod';

// ✅ Engine에서 Core
import { logError } from '@/core/logger';

// ✅ Domain에서 Engine
import { ParserEngine } from '@/engines/parser';

// ✅ Domain에서 Core
import { User } from '@/core/types';

// ✅ API에서 Domain
import { getProduct } from '@/domain/product';

// ✅ Frontend에서 API (HTTP)
await fetch('/api/v1/products');
```

### 금지되는 Import 패턴

```typescript
// ❌ Core에서 Domain (역방향)
import { getProduct } from '@/domain/product';

// ❌ Engine에서 Domain (역방향)
import { ProductRules } from '@/domain/product/rules';

// ❌ Domain A에서 Domain B (도메인 간 의존)
import { getUser } from '@/domain/user';

// ❌ API에서 Engine 직접 (Domain 우회)
import { ParserEngine } from '@/engines/parser';

// ❌ Frontend에서 Engine 직접
import { ValidationEngine } from '@/engines/validation';
```

---

## 경계 위반 검증

### 자동 검증 스크립트

```bash
# 계층 경계 검증
pnpm run check:layer-boundaries

# 엔진 전용 import (Utils·Domain·Web·엔진 간 교차) — IDP §2.4·§2.5
pnpm run check:engine-imports
```

### 검증 규칙

1. Core에서 Domain import 금지
2. Engine에서 Domain import 금지 (`check:engine-imports`가 Utils 직접 참조·상대 utils 경로 등도 검사)
3. Domain에서 다른 Domain import 금지
4. API에서 Engine 직접 import 금지

### 예외 처리

다음은 예외적으로 허용됩니다:

```typescript
// ✅ 타입 정의에서만 참조 (런타임 의존 아님)
import type { Product } from '@/domain/product/types';

// ✅ 인터페이스에서만 참조 (런타임 의존 아님)
interface ProductService {
  getProduct: typeof import('@/domain/product').getProduct;
}
```

---

## 리팩토링 영향 범위

계층 경계가 명확하면 **변경 영향 범위(Change Surface)**를 예측할 수 있습니다.

### Change Surface 측정

| 계층 | 변경 시 영향 파일 수 | 예시 |
|------|-------------------|------|
| Core Layer | < 50 파일 | 모든 상위 계층 영향 |
| Engine Layer | < 20 파일 | 해당 엔진을 사용하는 Domain |
| Domain Layer | < 10 파일 | 해당 Domain을 사용하는 API |
| API Layer | < 5 파일 | 해당 API를 호출하는 Frontend |
| Frontend Layer | < 3 파일 | 해당 컴포넌트만 영향 |

---

## 경계 위반 수정 가이드

### 패턴 1: Core → Domain 의존

```typescript
// ❌ 문제: Core에서 Domain 의존
// core/utils/product-helper.ts
import { getProduct } from '@/domain/product';

// ✅ 해결 1: Domain으로 이동
// domain/product/utils/product-helper.ts
import { getProduct } from './api/get-product';

// ✅ 해결 2: 의존성 역전 (Dependency Inversion)
// core/utils/product-helper.ts
interface ProductGetter {
  getProduct(id: string): Promise<Product>;
}

export function createProductHelper(getter: ProductGetter) {
  // Core는 인터페이스만 의존
}
```

### 패턴 2: Domain A → Domain B 의존

```typescript
// ❌ 문제: Domain 간 의존
// domain/product/api/get-product-with-user.ts
import { getUser } from '@/domain/user';

// ✅ 해결 1: API Layer에서 통합
// api/v1/products/[id]/route.ts
import { getProduct } from '@/domain/product';
import { getUser } from '@/domain/user';
const product = await getProduct(id);
const user = await getUser(product.userId);

// ✅ 해결 2: 공통 로직을 Engine으로 추출
// engines/aggregator/aggregator-engine.ts
class AggregatorEngine<T> {
  aggregate(entities: T[]): AggregatedResult { ... }
}
```

### 패턴 3: API → Engine 직접 의존

```typescript
// ❌ 문제: API에서 Engine 직접 사용
// api/v1/products/route.ts
import { ParserEngine } from '@/engines/parser';
const parser = new ParserEngine(...);

// ✅ 해결: Domain에 함수 추가
// domain/product/api/parse-product.ts
import { ParserEngine } from '@/engines/parser';
export function parseProduct(text: string): Product {
  const parser = new ParserEngine(...);
  return parser.parse(text);
}

// api/v1/products/route.ts
import { parseProduct } from '@/domain/product';
const product = parseProduct(text);
```

---

## 체크리스트

새로운 파일을 만들 때 다음을 확인하세요:

- [ ] 파일이 어느 계층에 속하는가?
- [ ] 의존하는 import가 허용된 계층인가?
- [ ] 역방향 의존이 없는가?
- [ ] 도메인 간 의존이 없는가?
- [ ] 계층 우회가 없는가?

---

## 결론

> **"계층 경계가 명확하면 시스템이 무너지지 않는다"**

계층 경계를 지키면:
- 변경 영향 범위가 예측 가능합니다
- 리팩토링이 안전해집니다
- 테스트가 격리됩니다
- 팀원 간 협업이 원활해집니다
- AI가 시스템을 이해하기 쉬워집니다

**계층 경계는 시스템의 뼈대입니다. 뼈대가 튼튼하면 살이 붙어도 무너지지 않습니다.**

---

**다음 단계:** [8_STAGE_METHODOLOGY.md](../02-development-framework/8_STAGE_METHODOLOGY.md)에서 개발 프로세스(표준화·통합·추상화 등)를 학습하세요. 의존성 규칙은 본 문서의 "의존성 방향 규칙" 절에 포함되어 있다.

---

**최종 업데이트**: 2026-03-23 — Frontend Itemwiki: `api/core`·`import type` 경계  
**버전**: 1.0.0
