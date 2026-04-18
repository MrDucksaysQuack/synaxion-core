# Structure-First Principle
# 구조 우선 원칙

> **"구조가 같으면 목적이 달라도 통합할 수 있다"**  
> "If structures are the same, purposes can differ yet unify"

---

## 핵심 명제

모든 개발은 하나의 명제에서 출발합니다:

**구조(Structure)는 일반적이고, 목적(Purpose)은 특수하다.**

```
구조 = 안정적, 예측 가능, 재사용 가능
목적 = 변화적, 특수적, 확장 가능
```

---

## 원리 (Principle)

### 1. 구조가 먼저, 데이터는 나중

```
❌ 전통적 접근:
데이터 → 구조 → 로직

✅ 올바른 접근:
구조 → 데이터 → 로직
```

**이유:**
- 데이터는 계속 변합니다
- 구조는 안정적입니다
- 구조가 견고하면 데이터가 변해도 시스템이 흔들리지 않습니다

---

### 2. 형태(Shape)가 같으면 하나로 통합

**Operation(작업)이 달라도, Structure(구조)가 같으면 통합 가능합니다.**

#### 예시 1: Parser Engine

```typescript
// ❌ 잘못된 방식: 도메인별로 개별 파서
function parseProduct(text: string): Product { ... }
function parseIngredient(text: string): Ingredient { ... }
function parseRecipe(text: string): Recipe { ... }

// ✅ 올바른 방식: 구조 기반 통합
interface ParserStrategy<TInput, TOutput> {
  name: string;
  parse(input: TInput): TOutput;
}

class ParserEngine<TInput, TOutput> {
  constructor(private strategies: ParserStrategy<TInput, TOutput>[]) {}
  
  parse(input: TInput, strategyName?: string): TOutput {
    // 구조가 같으므로 모든 도메인에 적용 가능
  }
}
```

**결과:**
- 하나의 엔진으로 모든 도메인 지원
- 새로운 파싱 전략 추가 시 엔진 수정 불필요
- 테스트, 최적화, 유지보수가 한 곳에서 가능

---

#### 예시 2: Validation Engine

```typescript
// ❌ 잘못된 방식: 필드별 개별 검증
function validateEmail(email: string): boolean { ... }
function validatePhone(phone: string): boolean { ... }
function validateName(name: string): boolean { ... }

// ✅ 올바른 방식: 규칙 기반 엔진
interface ValidationRule<TData, TContext> {
  field: string;
  validate(data: TData, context: TContext): ValidationResult;
}

class ValidationEngine<TData, TContext> {
  constructor(private rules: ValidationRule<TData, TContext>[]) {}
  
  async validate(data: TData, context: TContext): Promise<ValidationResult[]> {
    // 구조가 같으므로 모든 검증 규칙 적용 가능
  }
}
```

---

### 3. 입출력이 같으면 인터페이스로 통합

**입력과 출력 형태가 같다면, 내부 구현이 달라도 같은 인터페이스로 관리합니다.**

```typescript
// 모든 Scorer는 동일한 인터페이스
interface Scorer<TInput, TContext> {
  name: string;
  calculate(input: TInput, context: TContext): number;
}

// 구현은 다르지만 구조는 동일
class ToxicityScorer implements Scorer<Product, UserContext> { ... }
class ReputationScorer implements Scorer<User, SystemContext> { ... }
class ConfidenceScorer implements Scorer<Recognition, DataContext> { ... }
```

---

## 실전 적용 (Application)

### 사례 1: Field Renderer 통합

**상황:** 다양한 필드 타입을 렌더링해야 함

```typescript
// ❌ 개별 컴포넌트
<TextFieldRenderer />
<NumberFieldRenderer />
<DateFieldRenderer />
<SelectFieldRenderer />
// ... 100개의 개별 컴포넌트

// ✅ 구조 기반 통합
interface FieldConfig {
  type: string;
  name: string;
  // 공통 구조
}

function FieldRenderer({ field }: { field: FieldConfig }) {
  // type에 따라 전략 선택
  // 하나의 렌더러로 모든 필드 처리
}
```

**효과:**
- 100개 컴포넌트 → 1개 엔진
- 코드 90% 감소
- 새 필드 타입 추가 시 전략만 추가

---

### 사례 2: Storage Path 통합

**상황:** 다양한 리소스의 저장 경로 관리

```typescript
// ❌ 개별 함수
function getProductImagePath(productId: string): string { ... }
function getUserAvatarPath(userId: string): string { ... }
function getDocumentPath(docId: string): string { ... }

// ✅ 구조 기반 엔진
interface PathRule {
  entityType: string;
  getPath(entityId: string, metadata: PathMetadata): string;
}

class PathEngine {
  constructor(private rules: PathRule[]) {}
  
  getPath(entityType: string, entityId: string, metadata: PathMetadata): string {
    // 구조가 같으므로 모든 리소스 경로 관리
  }
}
```

---

## 구조 통합 판단 기준

다음 조건을 **모두** 만족하면 통합해야 합니다:

### ✅ 통합 조건

1. **입출력 형태가 동일**
   - 입력 타입이 같거나 제네릭으로 추상화 가능
   - 출력 타입이 같거나 제네릭으로 추상화 가능

2. **라이프사이클이 동일**
   - 생성 → 검증 → 처리 → 저장 순서가 같음
   - 상태 전이 패턴이 유사

3. **책임이 동일**
   - 수행하는 작업의 본질이 같음
   - 도메인만 다르고 로직은 동일

### ❌ 통합하지 않을 조건

1. **본질적으로 다른 작업**
   - 파싱 vs 검증 (구조가 다름)
   - 동기 vs 비동기 (실행 모델이 다름)

2. **상태 전이가 다름**
   - 단방향 플로우 vs 순환 플로우
   - 즉시 실행 vs 지연 실행

3. **성능 특성이 극단적으로 다름**
   - 실시간 vs 배치
   - 메모리 집약 vs CPU 집약

---

## 통합의 효과

### 1. 코드 감소
- **개별 구현**: N개 도메인 × M개 기능 = N×M개 파일
- **구조 통합**: 1개 엔진 + N개 전략 = 1+N개 파일
- **감소율**: 약 80-90%

### 2. 변경 영향 최소화
- 엔진 수정 시 모든 도메인에 자동 적용
- 전략 추가 시 기존 코드 수정 불필요
- 버그 수정 시 한 곳만 수정

### 3. 테스트 용이성
- 엔진 테스트로 모든 도메인 커버
- 전략별 테스트 격리 가능
- Mock 작성 간소화

### 4. 유지보수성
- 로직이 한 곳에 집중
- 문서화 범위 축소
- 온보딩 시간 단축

---

## 안티패턴 (Anti-Patterns)

### ❌ 안티패턴 1: 목적 기반 분리

```typescript
// ❌ 목적만 다르고 구조는 같은데 분리
function createProduct() { ... }
function createIngredient() { ... }
function createRecipe() { ... }

// ✅ 구조 기반 통합
function createEntity<T>(entityType: string, data: T): T { ... }
```

### ❌ 안티패턴 2: 조기 최적화

```typescript
// ❌ 도메인마다 최적화된 개별 구현
function fastProductSearch() { ... }
function fastIngredientSearch() { ... }

// ✅ 먼저 통합, 필요 시 전략으로 최적화
class SearchEngine<T> {
  search(query: string, strategy?: 'fast' | 'accurate'): T[] { ... }
}
```

### ❌ 안티패턴 3: 과도한 추상화

```typescript
// ❌ 너무 추상적이어서 실용성 없음
interface UniversalProcessor<A, B, C, D, E> { ... }

// ✅ 적절한 수준의 추상화
interface Parser<TInput, TOutput> { ... }
```

---

## 체크리스트

새로운 기능을 구현할 때 다음을 확인하세요:

- [ ] 비슷한 구조의 기존 코드가 있는가?
- [ ] 입출력 형태가 같은가?
- [ ] 라이프사이클이 유사한가?
- [ ] 제네릭으로 추상화 가능한가?
- [ ] 통합 시 복잡도가 증가하지 않는가?

**5개 모두 YES라면 → 반드시 통합**  
**3개 이상 YES라면 → 통합 고려**  
**2개 이하 YES라면 → 개별 구현**

---

## 결론

> **"구조를 보면 미래가 보인다"**

- 구조가 견고하면 목적이 자유롭게 변화합니다
- 구조가 일반적이면 도메인이 무한히 확장됩니다
- 구조가 명확하면 팀원과 AI가 쉽게 이해합니다

**구조 우선 원칙을 따르면:**
- 개발 속도가 2배 빨라집니다
- 코드 양이 80% 감소합니다
- 버그가 50% 줄어듭니다
- 리팩토링이 70% 쉬워집니다

---

**다음 단계:** [LAYER_BOUNDARIES.md](./LAYER_BOUNDARIES.md)에서 계층 경계 원칙을 학습하세요.

---

**최종 업데이트**: 2026-01-22  
**버전**: 1.0.0
