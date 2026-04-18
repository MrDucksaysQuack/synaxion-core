# Inflomatrix 개발 프로토콜 (IDP - Inflomatrix Development Protocol)

> **Constitution 문서**  
> 일관되고 표준화된, 논리적이고 유연한 시스템 개발을 위한 범용 프로토콜  
> 모든 프로젝트에 적용 가능한 개발 방법론

**작성일**: 2025-12-24  
**목적**: Itemwiki 시스템 분석 결과를 기반으로 한 범용 개발 프로토콜 제공  
**적용 범위**: 모든 프로젝트에 적용 가능한 개발 방법론

---

## 📋 프로토콜 개요

### 핵심 원칙

1. **구조 우선 원칙**: 구조가 같으면 목적이 달라도 통합 가능
2. **계층 분리 원칙**: Core → Engines → Domain → API → Frontend
3. **엔진 기반 원칙**: 공통 로직은 엔진으로 추상화
4. **도메인 독립 원칙**: 도메인 간 의존성 최소화
5. **7단계 로직 원칙**: Trigger → State Read → Branching → Action → State Mutation → Side Effect → Output

---

## 🏗️ Part 1: 아키텍처 계층 구조

### 1.1 계층 정의

```
┌─────────────────────────────────────┐
│   Frontend Layer (UI/UX)            │
│   - React Components                │
│   - Pages                           │
│   - Hooks                           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   API Layer (Interface)              │
│   - API Routes                      │
│   - Request/Response Handlers       │
│   - Middleware                      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Domain Layer (Business Logic)     │
│   - Domain-specific Logic           │
│   - Domain Rules                    │
│   - Domain Types                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Engine Layer (Reusable Logic)     │
│   - Parser Engine                   │
│   - Validation Engine              │
│   - Scorer Engine                  │
│   - Matcher Engine                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Core Layer (Infrastructure)       │
│   - Types                          │
│   - Auth                           │
│   - API Client                     │
│   - Logger                         │
│   - Config                         │
└─────────────────────────────────────┘
```

### 1.2 계층별 역할

#### Core Layer

- **목적**: 시스템 인프라
- **특징**: 도메인 독립, 모든 계층이 의존
- **포함**: 타입 정의, 인증, API 클라이언트, 로거, 설정

#### Engine Layer

- **목적**: 재사용 가능한 로직
- **특징**: 도메인 독립, 전략 패턴, 제네릭 타입
- **포함**: Parser, Validation, Scorer, Matcher, Normalizer, Confidence

#### Domain Layer

- **목적**: 비즈니스 로직
- **특징**: 도메인 독립, 엔진/코어만 의존
- **포함**: 각 도메인별 비즈니스 로직

#### API Layer

- **목적**: 인터페이스
- **특징**: 7단계 로직 구성, 표준화 레벨
- **포함**: API Routes, 미들웨어, 요청/응답 핸들러

#### Frontend Layer

- **목적**: 사용자 인터페이스
- **특징**: 컴포넌트 재사용, Hook 패턴
- **포함**: React Components, Pages, Hooks

---

## 🔧 Part 2: 엔진 설계 프로토콜

### 2.1 엔진 정의 기준

엔진이 되려면 다음 조건을 만족해야 합니다:

1. ✅ 여러 도메인에서 재사용 가능
2. ✅ 도메인 로직이 없음 (순수 함수/규칙 기반)
3. ✅ 전략 패턴으로 확장 가능
4. ✅ 제네릭 타입 사용
5. ✅ **의존성은 [§2.4](#24-엔진-의존성-규칙) 준수** — “Core만”을 엄격 문자열로만 해석하지 않음(Itemwiki는 §2.4 허용 Utils 사용)

### 2.2 엔진 인터페이스 표준

#### 개념적 계약 (문서·설계용)

모든 엔진은 **하나의 주된 연산**으로 요약할 수 있어야 한다: 입력(및 선택적 컨텍스트) → 출력. 설계서·시퀀스 다이어그램에서는 이를 통틀어 **`execute(input, context?)`** 로 적어도 된다.

#### 구현체 메서드명 (Itemwiki / 권장)

코드에서는 **엔진 종류에 맞는 동사**를 쓰는 것이 표준에 부합한다. `execute` 하나로 통일할 의무는 없다.

| 엔진 유형 | 주된 연산 예시 | 비고 |
|-----------|----------------|------|
| Parser | `parse(...)` | `ParserEngine.parse` |
| Validation | `validate(...)` | `ValidationEngine.validate` |
| Matcher | `match(...)` | `MatcherEngine.match` 등 |
| Normalizer | `normalize(...)` | |
| Scorer | `calculate` / `score` | 프로젝트 일관성 유지 |

즉 **§2.3 예시의 `parse` / `validate`가 본 프로토콜의 실제 표준**이고, 위 표의 연산이 곧 각 엔진에서의 `execute`에 해당한다.

#### 안티패턴

- 동일 엔진 클래스에 **`parse`와 `execute`를 동등한 진입점으로 이중 노출**해 호출부가 갈라지는 것
- 의미 없는 `execute` 래퍼만 두고 실제 로직은 다른 이름에만 두는 것(한 가지 공개 진입을 유지)

### 2.3 엔진 구현 패턴

#### 패턴 1: 전략 패턴 엔진

```typescript
/**
 * Parser Engine 예시
 */
class ParserEngine<TInput, TOutput> {
  private strategies: ParserStrategy<TInput, TOutput>[];

  constructor(config: { strategies: ParserStrategy<TInput, TOutput>[] }) {
    // 우선순위 순으로 정렬
    this.strategies = [...config.strategies].sort((a, b) =>
      (a.priority ?? 100) - (b.priority ?? 100)
    );
  }

  async parse(input: TInput, strategyName?: string): Promise<TOutput> {
    // 전략 선택 및 실행
    const strategy = strategyName
      ? this.strategies.find(s => s.name === strategyName)
      : this.strategies[0];

    if (!strategy) {
      throw new Error(`Strategy not found: ${strategyName}`);
    }

    return await strategy.parse(input);
  }
}
```

#### 패턴 2: 규칙 기반 엔진

```typescript
/**
 * Validation Engine 예시
 */
class ValidationEngine<TData, TContext> {
  private rules: ValidationRule<TData, TContext>[];

  constructor(config: { rules: ValidationRule<TData, TContext>[] }) {
    this.rules = config.rules;
  }

  async validate(data: TData, context: TContext): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (const rule of this.rules) {
      if (rule.enabled !== false) {
        try {
          const result = await rule.validate(data, context);
          results.push(result);
        } catch (error) {
          // 실패 격리: 하나의 규칙 실패가 전체를 중단시키지 않음
          results.push({
            field: rule.field,
            severity: 'error',
            message: error.message,
          });
        }
      }
    }

    return results;
  }
}
```

### 2.4 엔진 의존성 규칙

범용 문서의 “Core만”은 **Itemwiki 규모에서 엄격 적용 시 현재 코드와 불일치**한다. 아래는 **실제 리포지토리(`packages/lib/engines`)와 정합**한 규칙이다.

```
✅ 허용
- Core 계층 (`packages/lib/core/**`) — 엔진은 **가능하면 Core 진입점만** import한다(얇은 게이트웨이가 `utils/**` 구현을 재export).
- 구조화 로깅: `createLogger` 등 — 코드 기준 진입점 예: `@itemwiki/lib/core/logger/domain-logger` (구현은 `utils/logger/unified-logger`)
- 엔진 규칙·전략이 쓰는 무상태(또는 인프라에 가까운) 공유 헬퍼, 단:
  - Domain / API / Frontend / React / Hooks 를 끌어오지 않을 것
  - 네트워크·DB 클라이언트·브라우저 전용 API 에 묶이지 않을 것
- 예시(현재 리포와 일치): `@itemwiki/lib/core/barcode/barcode-country`, `@itemwiki/lib/core/product/check-feature-match`, `@itemwiki/lib/core/string/normalize-ingredient`, `@itemwiki/lib/core/profile/profile-query-gateway` 등(각각 utils 단일 구현에 연결)

❌ 금지
- Domain 계층 import
- 다른 Engine 직접 import (엔진 간 결합)
- React, `packages/web`, `app/` UI, Hooks
- “Utils”라는 이름만으로 허용하지 말 것 — 위 ✅ 조건을 만족하는 경로만

⚠️ Utils를 통한 간접 결합
- 서로 다른 엔진이 동일 Utils 모듈에만 의존해 **암묵적으로 결합**해지는 것은 지양한다.
- 공통 알고리즘이 커지면 **Core로 승격**하거나 **한 엔진 내부**로 모을지 검토한다.
```

**검증**: `pnpm run check:layer-boundaries`는 API·Domain·Core 위주이며, **엔진→Domain 역방향** 등을 막는다. **`pnpm run check:engine-imports`**는 `packages/lib/engines`에 대해 **Utils·Domain·Web 직접 참조**, **utils로의 상대 경로**, **엔진 서브패키지 간 교차 import**를 막는다(PR·`constitution:check`에 포함).

### 2.5 엔진 간 상호 의존

- **직접 import 금지**: `engines/A` → `engines/B` ❌
- **공통 하위 로직**: Core로 내리거나, 한 엔진 + Domain 어댑터에서 조합 ([`01-foundations/LAYER_BOUNDARIES`](../01-foundations/LAYER_BOUNDARIES.md) 패턴과 동일)

---

## 🎯 Part 3: 도메인 설계 프로토콜

### 3.1 도메인 정의 기준

도메인이 되려면 다음 조건을 만족해야 합니다:

1. ✅ 독립적인 비즈니스 로직
2. ✅ 다른 도메인에 의존하지 않음
3. ✅ Engines와 Core만 사용
4. ✅ 명확한 진입점 (`index.ts`)

### 3.2 도메인 구조 표준

```
domain/{domain-name}/
├── actions.ts      # 생성/수정/삭제 액션 (선택)
├── queries.ts      # 조회 쿼리 (선택)
├── validator.ts    # 검증 로직 (선택)
├── types.ts        # 도메인 타입 정의
├── index.ts        # 모듈 진입점 (필수)
└── README.md       # 도메인 문서 (선택)
```

### 3.3 도메인 의존성 규칙

```
✅ 허용:
- Engines 계층 사용 가능
- Core 계층 사용 가능
- API 클라이언트 사용 가능

❌ 금지:
- 다른 Domain 의존 금지
- Hooks 의존 금지
- Utils 의존 금지
```

### 3.4 도메인 규칙 관리

```typescript
/**
 * Domain Rules Registry 패턴
 */
interface DomainRules {
  [key: string]: {
    [ruleName: string]: unknown;
  };
}

/**
 * 중앙화된 규칙 관리
 */
export const DomainRules: DomainRules = {
  origin: {
    MAJOR_INGREDIENT_THRESHOLD: 0.3333,
    CONTAMINATION_LEVELS: { /* ... */ },
  },
  oemOdm: {
    DETECTION_KEYWORDS: [/* ... */],
    PATTERNS: [/* ... */],
  },
};
```

---

## 🔌 Part 4: API 설계 프로토콜

### 4.1 API 표준화 레벨

#### Level A: 절대 필수 (모든 API)

1. 미들웨어 패턴: `withMetrics` + `withAuth`/`withOptionalAuth`
2. 요청 검증: `validateRequestBody` (POST/PATCH/PUT)
3. 에러 응답: `createErrorResponse` 계열만 사용
4. 에러 로깅: **예외는 서버에서 반드시 기록**한다. Itemwiki에서는 레거시 `logAPIError` 대신 **`createGetHandler` / `createPostHandler` 등 표준 핸들러 팩토리**가 `handleAPIError`·`logUnifiedError` 등으로 통합 처리한다. 팩토리를 쓰지 않는 커스텀 라우트는 동등한 수준의 API·서버 로깅을 직접 호출한다.
5. 7단계 원칙: 논리적 존재 (주석 추가 **또는** 표준 래퍼 사용으로 충족 — `pnpm run verify:api-7-stages` 참고)

#### Level B: 의미 있을 때만 (선택적)

1. Double-Submit Blocking: CREATE 작업
2. 낙관적 잠금: UPDATE 작업
3. 캐시 무효화: UPDATE/DELETE 작업
4. 원자적 조회: 여러 상태 동시 조회

### 4.2 7단계 로직 구성

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
        await logAPIError(
          error as Error,
          '/api/v1/endpoint',
          'POST',
          { userId: context.userId },
          { errorType: 'InternalError', severity: 'high' }
        );
        return createErrorResponse('생성 중 오류가 발생했습니다.', 500, 'INTERNAL_ERROR', undefined, { startTime });
      }
    });
    return handler(request);
  });
};
```

> **Itemwiki**: 예시의 `logAPIError` 호출은 **교육용 이전 패턴**이다. 현재 저장소에서는 해당 심볼이 제거되었고, `createGetHandler` / `createPostHandler` 등 표준 핸들러 팩토리가 `handleAPIError`·`logUnifiedError` 등으로 동일 책임을 처리한다. `pnpm run verify:api-7-stages`는 팩토리 사용 시 7단계 주석을 생략해도 “논리적 존재”로 인정한다.

### 4.3 API 응답 표준

```typescript
/**
 * 표준 성공 응답
 */
interface StandardResponse<T> {
  success: true;
  data: T;
  meta?: {
    executionTime?: number;
    [key: string]: unknown;
  };
}

/**
 * 표준 에러 응답
 */
interface StandardErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
  meta?: {
    executionTime?: number;
    [key: string]: unknown;
  };
}
```

**Itemwiki**: 수동 블록 대신 `handler-factory` 사용을 권장한다는 점은 위 [4.2](#42-7단계-로직-구성) 각주와 동일하다.

---

## 🎨 Part 5: 프론트엔드 설계 프로토콜

### 5.1 컴포넌트 계층 구조

```
components/
├── common/          # 공통 컴포넌트 (Button, Input, Card)
├── domain/          # 도메인별 컴포넌트 (Resource, Preference)
└── layout/          # 레이아웃 컴포넌트 (Header, Footer)
```

### 5.1.1 Itemwiki 디렉터리 매핑 (IDP 어휘 ↔ 실제 경로)

IDP의 세 갈래는 **역할** 기준이며, Itemwiki에서는 아래처럼 흩어져 있다. 신규 UI도 같은 역할의 폴더에 맞춘다.

| IDP (Part 5.1) | Itemwiki 위치 | 비고 |
|----------------|---------------|------|
| `common/` | `components/common/`, `components/ui/` | 공통·원자 UI |
| `domain/` | `components/product/`, `preferences/`, `ocr/`, `brand/`, `contributions/`, `profile/`, `search/`, `rankings/`, `recommendations/`, `admin/`, `auth/`, `settings/` 등 | 도메인·기능별 화면 조각 |
| `layout/` | `components/layout/` | 콘솔·공통 레이아웃 |

개념 정리용 안내는 저장소 루트의 [`components/domain/README.md`](../../../components/domain/README.md)를 본다 (`components/domain/`은 **문서 앵커**이며, 대량 이동 없이 매핑만 적어 둔다).

### 5.2 Hook 패턴

```typescript
/**
 * 표준 Hook 패턴
 */
function useEntityData<T>(
  entity: string,
  id: string,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
): {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  // 구현
}
```

### 5.3 페이지 구조 원칙

1. 한 페이지 = 한 목적
2. 최대 3단계 깊이 (3-Depth Rule)
3. 상태 기반 분기 (State Read → Branching)

---

## 🔄 Part 6: 개발 방법론 (8단계)

### 6.1 8단계 프로세스

```
1. 표준화 (Standardization)    → 규칙 정립
2. 통합 (Unification)          → 중복 제거
3. 추상화 (Abstraction)        → 엔진화
4. 모듈화 (Modularization)     → 독립성 확보
5. 자동화 (Automation)         → 운영 비용 감소
6. 지능화 (Intelligence)       → AI 연동
7. 최적화 (Optimization)       → 성능 개선
8. 확장 (Expansion)            → 도메인 확장
```

### 6.2 Front → Back → Engine 루프

```
1. Frontend에서 UX 요구 발생
   ↓
2. Backend에서 규칙과 스키마 설정
   ↓
3. 추상화와 엔진화 진행
   ↓
4. Backend 더 단단해짐
   ↓
5. Frontend에서 더 높은 수준의 기능 요구
   ↓
6. Backend 더 고도화
   ↓
(반복)
```

### 6.3 문서 방법론 vs CI 강제 범위

8단계·Front → Back → Engine 루프(6.1–6.2)는 **팀이 따를 권장 프로세스**이며, PR에서 “단계 순서” 자체를 검사하지는 않는다. 자동으로 걸리는 것은 [Part 8.4](#84-itemwiki-자동-검증-매핑)에 정리한 스크립트·워크플로이다.

---

## 📐 Part 7: 개발 순서 프로토콜

### 7.1 필수 개발 순서

```
Phase 1: 기초 인프라
  1. Core Layer (타입, 설정, 로거, API 클라이언트, 인증)
  2. 데이터베이스 스키마 설계

Phase 2: 엔진 계층
  3. 기초 엔진 (Validation, Path, Parser, Normalizer)
  4. 복합 엔진 (Confidence, Scorer, Matcher, Schema)

Phase 3: 도메인 계층
  5. 독립 도메인 (Storage, Normalization, Resource)
  6. 의존 도메인 (Recognition, Preferences, Trust-score, Activity)
  7. 고급 도메인 (Contamination, Missing-field, Reputation)

Phase 4: API 계층
  8. 인증/인가 API
  9. 핵심 API (Resources, Media, Preferences)
  10. 고급 API (Activities, Votes, Recognition, Trust-scores)

Phase 5: 프론트엔드 계층
  11. 공통 컴포넌트
  12. 도메인 컴포넌트
  13. 페이지 컴포넌트

Phase 6: Worker 계층
  14. Background Workers (Recognition, Batch Jobs)
```

### 7.2 Phase 순서와 코드베이스

Part 7.1의 Phase 1→6 순서는 **그린필드·대규모 리팩터**에 유리한 가이드이다. Itemwiki는 성장 과정에서 API·도메인·프론트가 병행 확장되었으므로, “현재 트리 = Phase 순서”와 일치하지 않을 수 있다. 신규 기능은 가능하면 **Core → Engine → Domain → API → UI** 의존 방향을 유지하고, `check:layer-boundaries`로 깨짐을 막는다.

---

## ✅ Part 8: 프로토콜 체크리스트

### 8.1 엔진 체크리스트

- [ ] 여러 도메인에서 재사용 가능한가?
- [ ] 도메인 로직이 없는가?
- [ ] 전략 패턴으로 확장 가능한가?
- [ ] 제네릭 타입을 사용하는가?
- [ ] Core 계층만 의존하는가?

### 8.2 도메인 체크리스트

- [ ] 독립적인 비즈니스 로직인가?
- [ ] 다른 도메인에 의존하지 않는가?
- [ ] Engines와 Core만 사용하는가?
- [ ] 명확한 진입점(`index.ts`)이 있는가?

### 8.3 API 체크리스트

- [ ] Level A 필수 항목을 모두 충족하는가?
- [ ] 7단계 로직 구성이 논리적으로 존재하는가?
- [ ] 표준 에러 응답 형식을 사용하는가?
- [ ] 에러 로깅을 수행하는가? (표준 핸들러 팩토리 또는 동등한 서버 로깅)

### 8.4 Itemwiki 자동 검증 매핑

수동 체크리스트(8.1–8.3)와 CI/스크립트는 **1:1이 아니다**. 아래는 **주요 대응**이며, 전체 인벤토리는 [Itemwiki IDP 자동화 매핑](../../itemwiki-constitution/ITEMWIKI_IDP_AUTOMATION_MATRIX.md)을 본다.

| 체크리스트 축 | 자동화(예) | 비고 |
|---------------|------------|------|
| 8.3 API·7단계·Level A 보조 | `pnpm run verify:api-7-stages` | `app/api/v1/**/route.ts`; 표준 래퍼면 ①–⑦ 주석 생략 인정 |
| 8.3 catch·Promise rejection 로깅 | `pnpm run check:api-catch-logging` | `app/api/**/*.ts` AST; `check:api-catch-logging:routes` = `route.ts` 만 |
| 계층 분리·도메인 경계 | `pnpm run check:layer-boundaries` | `check:constitution-pr` 포함 |
| 침묵 실패·로깅 호출 등 | `pnpm run check:silent-failures`, `check:lib-console` | 8.1 “도메인 로직 없음”은 부분적으로 layer + 리뷰 |
| 프론트 3-Depth | `pnpm run check:design-route-depth` | Part 5.3과 연계 |
| 환경 변수 규칙 | `pnpm run check:env-access:strict` | `check:all`·**`check:constitution-pr`**·`constitution:check`; `workers/src` 스캔·`worker-env.ts`만 예외 — [ENVIRONMENT_VARIABLES](../08-config/ENVIRONMENT_VARIABLES.md) |
| 8.2 도메인 → `lib/utils` 우회 금지 | `pnpm run check:domain-layer-idp` | **`check:constitution-pr` 포함**; 8.2 전체(Engines·Core만)와 동일하지 않음 — [매트릭 §3](../../itemwiki-constitution/ITEMWIKI_IDP_AUTOMATION_MATRIX.md) |
| 8.1 엔진 순수성·8.2 나머지 | `check:layer-boundaries`·`check:engine-imports` + 리뷰 | 전량 자동화 아님 — Part 11 |
| Decision Registry·판단 규칙·미사용 결정 ID | `check:decision-registry`(연쇄 `check:*`), `check:decision-rules`, `check:decision-usage --fail-on-unused`, `check:judgment-contracts` 등 | 운영 OS 축 — **`check:constitution-pr`에 포함**. 전체 순서·목록은 [Itemwiki IDP 매핑 §6](../../itemwiki-constitution/ITEMWIKI_IDP_AUTOMATION_MATRIX.md#6-pr로컬에서-자주-쓰는-묶음) |

---

## 📚 Part 9: 프로토콜 적용 가이드

### 9.1 새 프로젝트 시작 시

1. 프로토콜 문서 복사
2. Core Layer부터 구축
3. 엔진 계층 설계
4. 도메인 계층 설계
5. API 계층 설계
6. 프론트엔드 계층 설계

### 9.2 기존 프로젝트 마이그레이션 시

1. 현재 구조 분석
2. 프로토콜과 비교
3. 단계별 마이그레이션 계획
4. Core → Engine → Domain 순서로 리팩토링

---

## 📝 Part 10: 네이밍 컨벤션

### 10.1 사용자 ID 네이밍 표준

Itemwiki는 3계층 사용자 모델을 사용하므로, 각 계층의 ID를 명확히 구분하는 변수명을 사용해야 합니다.

#### 표준 변수명

| 계층 | 표준 변수명 | 데이터베이스 필드 | 타입 | 설명 |
|------|------------|----------------|------|------|
| OAuth Identity | `authUserId` | `auth.users.id` | `AuthUserId` | OAuth 제공자로부터 받은 인증 ID |
| Service Account | `accountId` | `user_accounts.user_id` | `AccountId` | 서비스 내부 계정 ID (불변) |
| Service Profile | `profileId` | `user_profiles.account_id` (정석) | `ProfileId` | 서비스 이용 정체성 ID |

#### 함수 파라미터명 표준

**OAuth Identity ID를 받는 함수**:
```typescript
// ✅ 좋은 예
function getUserAccount(supabase: SupabaseClient, authUserId: AuthUserId)
function getUserProfile(supabase: SupabaseClient, authUserId: AuthUserId | null)

// ❌ 나쁜 예
function getUserAccount(supabase: SupabaseClient, userId: string)
function getUserProfile(supabase: SupabaseClient, user_id: string)
```

**Service Account ID를 받는 함수**:
```typescript
// ✅ 좋은 예
function getProfileByAccountId(supabase: SupabaseClient, accountId: AccountId)

// ❌ 나쁜 예
function getProfileByAccountId(supabase: SupabaseClient, account_id: string)
```

#### 레거시 변수명 매핑

기존 코드에서 사용하던 변수명을 표준 변수명으로 마이그레이션:

| 레거시 변수명 | 표준 변수명 | 계층 | 비고 |
|-------------|-----------|------|------|
| `userId` | `authUserId` | OAuth Identity | 가장 흔한 혼용 |
| `user_id` | `authUserId` | OAuth Identity | 스네이크 케이스 |
| `contributorId` | `authUserId` | OAuth Identity | 기여자 ID도 동일 |
| `contributor_id` | `authUserId` | OAuth Identity | 스네이크 케이스 |
| `account_id` | `accountId` | Service Account | 카멜 케이스로 변환 |
| `uid` | `profileId` | Service Profile | 레거시 필드명 |

#### 사용 예시

```typescript
// ✅ 좋은 예: 명확한 계층 구분
const { data: { user } } = await supabase.auth.getUser();
const authUserId = user.id; // OAuth Identity ID

const account = await getUserAccount(supabase, authUserId);
const accountId = account?.user_id; // Service Account ID

const { data: profile } = await getUserProfile(supabase, authUserId);
const profileId = profile?.account_id; // Service Profile ID

// ❌ 나쁜 예: 혼용된 변수명
const userId = user.id; // 무엇을 의미하는지 불명확
const account = await getUserAccount(supabase, userId); // userId가 무엇인지 불명확
```

#### 주의사항

1. **레거시 `uid` 필드**: `user_profiles.uid`는 제거 예정이므로, 새로운 코드는 `account_id`만 사용해야 합니다.
2. **변수명 혼용 금지**: `userId`와 `authUserId`를 혼용하지 마세요. 명확한 계층을 나타내는 변수명을 사용하세요.
3. **통합 함수 사용**: 직접 쿼리 대신 `getUserAccount()`, `getUserProfile()` 같은 통합 함수를 사용하세요.

#### 관련 문서

- [사용자 ID 용어집](../../itemwiki-constitution/itemwiki-specific/user-ownership/USER_ID_TERMINOLOGY.md) - 상세한 용어 정의 및 사용 시나리오
- `packages/lib/core/types/user-ids.ts` - 타입 정의 및 변환 유틸리티

---

## Part 11: 준수 예외 및 개선 로드맵

### 11.1 준수 예외 (Itemwiki 적용 시)

- **Domain 간 의존**: Part 3에서 "다른 Domain 의존 금지"를 원칙으로 하나, **타입 전용** (`import type` / `import { type ... }`) 은 허용한다. 타입은 런타임 의존성이 없으므로 도메인 경계를 넘는 타입 참조만으로는 위반으로 보지 않는다. 단, 런타임에 다른 도메인 모듈을 import 하는 것은 금지.
- **레이어 검증**: `pnpm run check:layer-boundaries` 로 Core/Domain/API 경계 및 Domain→Domain(타입 제외) 검증. PR/로컬 점검 시 활용(이미 `check:constitution-pr`에 포함).

### 11.2 개선 로드맵

| 항목 | 현재 | 목표 | 비고 |
|------|------|------|------|
| **사용자 ID 네이밍** (Part 10) | 레거시 `userId`/`user_id` 다수 | 신규·진입점부터 `authUserId`/`accountId`/`profileId` 적용 | 신규 코드는 표준 준수; 기존 코드 수정 시 해당 경로부터 리네이밍 권장. 일괄 리팩터는 별도 계획. |
| **Domain 간 타입 참조** | 일부 도메인 간 `import type` 존재 | 공통 타입은 Core/공유 타입으로 이동 검토 (선택) | 현재도 타입 전용이라 허용 범위 내. 정리 여유 시 검토. |
| **Engine 의존성** | Core + §2.4 허용 Utils (로깅·바코드 등), Domain 미참조 | 유지 | 신규 엔진은 §2.4 조건을 만족하는 Utils만; Domain·타 Engine 직접 import 금지. |
| **Engine → Domain 런타임 의존성 제거** | validation/parser/normalizer/scorer/schema-generator 등 엔진이 Domain을 import하던 부분 | 완료 (2026-03) | 공통 타입·데이터는 Core로 이동, 도메인 로직은 Domain 어댑터로 이전 후 엔진에 주입. `check:layer-boundaries` 통과. |
| **Part 4·API / 7단계** | `verify:api-7-stages` 통과 유지 (`app/api/v1` 전 라우트) | 신규 `route.ts`는 팩토리 또는 ①–⑦ 주석 | 팩토리 미사용 커스텀 라우트는 Level A를 수동 충족해야 함. |
| **Part 5·프론트 IDP 어휘** | `components/domain/` 매핑 README로 정렬 | 유지 | 물리 폴더 대이동 없이 역할 매핑만 문서화 (2026-03). |
| **Part 8·체크리스트 ↔ CI** | [ITEMWIKI_IDP_AUTOMATION_MATRIX.md](../../itemwiki-constitution/ITEMWIKI_IDP_AUTOMATION_MATRIX.md)에 표준화 | 스크립트 추가 시 표 갱신 | 엔진 Utils·도메인 Utils 등은 아직 전량 자동화 없음. |

---

## 🔗 관련 문서

이 프로토콜은 다음 헌법 문서들과 함께 작동합니다:

- [KHS 개발 교과서](./KHS_DEVELOPMENT_TEXTBOOK.md) - 개발의 근본 원리와 방법론 (CI 게이트와 직접 매핑되지 않음)
- [로직 구성 7단계 절대 원칙](../../itemwiki-constitution/itemwiki-specific/development/LOGIC_CONSTRUCTION_CONSTITUTION.md) - 모든 로직의 실행 순서
- [API 표준화 레벨](../03-api-standards/API_STANDARDIZATION_LEVELS.md) - Level A/B 및 API 설계 기준
- [Itemwiki IDP 자동화 매핑](../../itemwiki-constitution/ITEMWIKI_IDP_AUTOMATION_MATRIX.md) - Part 8 체크리스트 ↔ `check:*` / `verify:*`
- [v1.0 완성 기준](./V1_COMPLETION_CONTRACT.md) - 제품 완성 선언·SLO·체크박스 (IDP·레이어 규칙과 별도 축)
- [SRRS 헌법](../../itemwiki-constitution/itemwiki-specific/architecture/SRRS_CONSTITUTION.md) - 시스템 안정성 및 재발 방지 기준
- [사용자 ID 용어집](../../itemwiki-constitution/itemwiki-specific/user-ownership/USER_ID_TERMINOLOGY.md) - 사용자 ID 관련 용어 및 네이밍 표준

---

## 🎯 결론

이 프로토콜을 따르면:

1. **일관성**: 모든 프로젝트가 동일한 구조
2. **확장성**: 엔진 기반으로 새 기능 추가 용이
3. **유지보수성**: 모듈화로 변경 영향 최소화
4. **개발 속도**: Front → Back → Engine 루프로 빠른 반복
5. **품질**: 7단계 원칙으로 버그 최소화

이 프로토콜은 Itemwiki 시스템을 분석하여 추출한 패턴을 일반화한 것입니다. 다른 프로젝트에도 적용 가능합니다.

---

## 📝 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 2025-12-24 | 1.0.0 | 초기 문서 작성 | System |
| 2025-01-27 | 1.1.0 | Part 10: 네이밍 컨벤션 섹션 추가 | System |
| 2026-03-18 | 1.2.0 | Part 11: 준수 예외 및 개선 로드맵 추가 | System |
| 2026-03-18 | 1.2.1 | Part 11.2: Engine → Domain 런타임 의존성 제거 완료 반영 | System |
| 2026-03-19 | 1.3.0 | Part 2: `execute` vs `parse`/`validate` 등 의도적 메서드명 정합; §2.4 엔진 Utils 허용·간접 결합(§2.5) 명시 | System |
| 2026-03-19 | 1.4.0 | Part 4 Level A·예시와 Itemwiki 핸들러 팩토리·통합 로깅 정합; Part 5.1.1 프론트 매핑; §6.3·§7.2 CI 범위; Part 8.4·자동화 매핑 문서; 관련 링크 수정; Part 11.2 로드맵 행 추가 | System |
| 2026-03-19 | 1.4.1 | §2.4 허용 목록: 엔진은 Core 진입점 우선, 예시를 실제 `@itemwiki/lib/core/...` 게이트와 정합 | System |
| 2026-03-19 | 1.4.2 | §2.4 검증: `check:engine-imports` 자동화(PR·constitution:check) | System |

---

**프로토콜 버전**: 1.4.2  
**기반 시스템**: Itemwiki  
**최종 업데이트**: 2026-03-19 (`check:engine-imports`·§2.4 검증)

이 프로토콜을 바탕으로 다른 프로젝트에도 빠르고 효율적인 개발이 가능합니다.

