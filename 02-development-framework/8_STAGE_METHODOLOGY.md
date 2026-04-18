# 8-Stage Development Methodology
# 8단계 개발 방법론

> **"표준화 → 통합 → 추상화 → 모듈화 → 자동화 → 지능화 → 최적화 → 확장"**

---

## 개요

모든 개발은 다음 8단계를 반복합니다:

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

이 8단계는 **순차적**이지만 **순환적**입니다. 한 사이클을 완료하면 다시 1단계부터 더 높은 수준으로 반복합니다.

---

## Stage 1: 표준화 (Standardization)

### 목적
**규칙을 만든다.** 서로 다르게 동작하는 기능들을 하나의 규칙으로 묶습니다.

### 작업 내용
- 명명 규칙 정립
- 파일 구조 규칙
- API 응답 형식 통일
- 에러 처리 패턴 통일
- 코드 스타일 가이드

### 산출물
- 스타일 가이드 문서
- ESLint/Prettier 설정
- API 응답 표준 스펙
- 네이밍 컨벤션 문서

### 효과
- **일관성 확보**: 모든 코드가 같은 규칙을 따름
- **예측 가능성**: 파일 위치, 함수 이름을 쉽게 예측
- **온보딩 가속화**: 새 팀원이 빠르게 적응

### 실전 예시

```typescript
// ❌ 표준화 이전: 각자 다른 방식
function getProduct1(id) { ... }
async function fetchProduct2(productId) { ... }
const retrieveProduct = (barcode) => { ... }

// ✅ 표준화 이후: 통일된 네이밍
async function getProduct(barcode: string): Promise<Product> { ... }
async function getProductList(filters: ProductFilters): Promise<Product[]> { ... }
async function getProductById(id: string): Promise<Product> { ... }
```

### 체크리스트
- [ ] 네이밍 규칙이 문서화되어 있는가?
- [ ] ESLint 규칙이 적용되어 있는가?
- [ ] API 응답 형식이 통일되어 있는가?
- [ ] 에러 처리 패턴이 정립되어 있는가?

---

## Stage 2: 통합 (Unification)

### 목적
**중복을 제거한다.** 여러 파일에 흩어진 비슷한 기능을 한 곳으로 모읍니다.

### 작업 내용
- 중복 코드 찾기
- 공통 로직 추출
- 유틸리티 함수 통합
- 컴포넌트 재사용

### 산출물
- 통합된 유틸리티 함수
- 공통 컴포넌트 라이브러리
- 중복 제거 보고서

### 효과
- **코드 감소**: 30-50% 코드 양 감소
- **유지보수성**: 한 곳만 수정하면 전체 적용
- **버그 감소**: 중복 로직의 버그가 하나로 통합

### 실전 예시

```typescript
// ❌ 통합 이전: 중복된 검증 로직
function validateEmail(email: string): boolean { ... }
function validatePhoneNumber(phone: string): boolean { ... }
function validateUsername(username: string): boolean { ... }
function validatePassword(password: string): boolean { ... }
// ... 100개의 개별 검증 함수

// ✅ 통합 이후: 하나의 검증 시스템
interface ValidationRule {
  field: string;
  validate: (value: unknown) => boolean;
  message: string;
}

function validateFields(data: Record<string, unknown>, rules: ValidationRule[]): ValidationResult {
  // 모든 검증을 하나의 시스템으로 통합
}
```

### 체크리스트
- [ ] 중복 코드 스캔이 완료되었는가?
- [ ] 공통 로직이 추출되었는가?
- [ ] 유틸리티 함수가 정리되어 있는가?
- [ ] 재사용 가능한 컴포넌트가 만들어졌는가?

---

## Stage 3: 추상화 (Abstraction)

### 목적
**엔진을 만든다.** 특정 도메인이 아닌 범용적으로 사용할 수 있는 엔진으로 추상화합니다.

### 작업 내용
- 도메인 로직에서 패턴 추출
- 제네릭 타입으로 일반화
- 전략 패턴 적용
- 플러그인 아키텍처 설계

### 산출물
- Parser Engine
- Validation Engine
- Scorer Engine
- Matcher Engine

### 효과
- **확장성 폭발**: 한 엔진으로 무한 도메인 지원
- **엔진 중심 아키텍처**: 비즈니스 로직이 엔진 조합으로 구성
- **테스트 용이**: 엔진 테스트로 모든 도메인 커버

### 실전 예시

```typescript
// ❌ 추상화 이전: 도메인별 개별 파서
function parseProduct(text: string): Product { ... }
function parseIngredient(text: string): Ingredient { ... }
function parseRecipe(text: string): Recipe { ... }

// ✅ 추상화 이후: 범용 Parser Engine
interface ParserStrategy<TInput, TOutput> {
  name: string;
  priority?: number;
  parse(input: TInput): TOutput;
}

class ParserEngine<TInput, TOutput> {
  constructor(private strategies: ParserStrategy<TInput, TOutput>[]) {
    this.strategies.sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
  }
  
  async parse(input: TInput, strategyName?: string): Promise<TOutput> {
    const strategy = strategyName
      ? this.strategies.find(s => s.name === strategyName)
      : this.strategies[0];
    
    if (!strategy) {
      throw new Error(`Strategy not found: ${strategyName}`);
    }
    
    return await strategy.parse(input);
  }
}

// 사용 예시
const productParser = new ParserEngine<string, Product>([
  { name: 'ocr', parse: (text) => parseFromOCR(text) },
  { name: 'manual', parse: (text) => parseManually(text) },
]);
```

### 체크리스트
- [ ] 도메인 독립적인가?
- [ ] 제네릭 타입을 사용하는가?
- [ ] 전략 패턴이 적용되었는가?
- [ ] 여러 도메인에서 재사용 가능한가?

---

## Stage 4: 모듈화 (Modularization)

### 목적
**독립성을 확보한다.** 각 모듈이 서로 영향을 최소로 주도록 분리합니다.

### 작업 내용
- 책임 분리 (Single Responsibility)
- 인터페이스 정의
- 의존성 역전 (Dependency Inversion)
- 모듈 경계 명확화

### 산출물
- 독립 모듈 구조
- 인터페이스 정의서
- 의존성 그래프

### 효과
- **변경 영향 최소화**: 하나 수정해도 다른 곳 영향 없음
- **병렬 개발 가능**: 팀원들이 동시에 개발
- **테스트 격리**: 각 모듈 독립적으로 테스트

### 실전 예시

```
modules/
  ├── ocr/              # OCR 인식 모듈
  │   ├── engine.ts
  │   ├── types.ts
  │   └── index.ts
  ├── storage/          # 저장소 모듈
  │   ├── path-engine.ts
  │   ├── types.ts
  │   └── index.ts
  ├── validation/       # 검증 모듈
  │   ├── validation-engine.ts
  │   ├── rules.ts
  │   └── index.ts
  └── normalization/    # 정규화 모듈
      ├── normalizer-engine.ts
      ├── strategies.ts
      └── index.ts
```

### 체크리스트
- [ ] 각 모듈의 책임이 명확한가?
- [ ] 모듈 간 의존성이 최소화되어 있는가?
- [ ] 인터페이스가 잘 정의되어 있는가?
- [ ] 모듈 교체가 가능한가?

---

## Stage 5: 자동화 (Automation)

### 목적
**운영 비용을 줄인다.** 사람이 하던 반복 작업을 시스템이 대신합니다.

### 작업 내용
- CI/CD 파이프라인 구축
- 자동 테스트
- 자동 배포
- 자동 백업
- 자동 알림

### 산출물
- GitHub Actions 워크플로우
- 자동화 스크립트
- 모니터링 대시보드

### 효과
- **인간 개입 최소화**: 자동으로 처리
- **실수 감소**: 사람이 안 하니 실수 없음
- **시간 절약**: 80% 시간 절약

### 실전 예시

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
      - name: Check constitution
        run: npm run constitution:check
      - name: Lint
        run: npm run lint
```

### 체크리스트
- [ ] CI/CD 파이프라인이 구축되어 있는가?
- [ ] 자동 테스트가 실행되는가?
- [ ] 자동 배포가 가능한가?
- [ ] 모니터링이 자동화되어 있는가?

---

## Stage 6: 지능화 (Intelligence)

### 목적
**AI와 연동한다.** 시스템이 스스로 학습하고 개선합니다.

### 작업 내용
- AI 모델 통합
- 패턴 학습
- 자동 추천
- 이상 감지

### 산출물
- AI 모델 API 통합
- 학습 파이프라인
- 추천 시스템

### 효과
- **지능적 의사결정**: AI가 최적 선택
- **지속적 개선**: 사용할수록 똑똑해짐
- **사용자 경험 향상**: 개인화된 서비스

### 실전 예시

```typescript
// AI 기반 자동 분류
class IntelligentClassifier {
  async classify(item: unknown): Promise<Classification> {
    // AI 모델 호출
    const result = await aiModel.predict(item);
    
    // 결과를 학습 데이터로 저장
    await this.saveForTraining(item, result);
    
    return result;
  }
}
```

### 체크리스트
- [ ] AI 모델이 통합되어 있는가?
- [ ] 학습 파이프라인이 구축되어 있는가?
- [ ] 추천 시스템이 작동하는가?
- [ ] 패턴이 자동으로 학습되는가?

---

## Stage 7: 최적화 (Optimization)

### 목적
**성능을 개선한다.** 병목 지점을 찾아 최적화합니다.

### 작업 내용
- 프로파일링
- 캐싱 전략
- 쿼리 최적화
- 번들 크기 최적화

### 산출물
- 성능 보고서
- 캐싱 전략 문서
- 최적화 가이드

### 효과
- **응답 시간 감소**: 50% 이상 빨라짐
- **비용 절감**: 서버 리소스 30% 절감
- **사용자 경험 향상**: 빠른 반응성

### 실전 예시

```typescript
// 캐싱 전략 적용
class CachedProductService {
  private cache = new Map<string, Product>();
  
  async getProduct(barcode: string): Promise<Product> {
    // 캐시 확인
    if (this.cache.has(barcode)) {
      return this.cache.get(barcode)!;
    }
    
    // DB 조회
    const product = await db.getProduct(barcode);
    
    // 캐시 저장
    this.cache.set(barcode, product);
    
    return product;
  }
}
```

### 체크리스트
- [ ] 병목 지점이 파악되었는가?
- [ ] 캐싱 전략이 적용되었는가?
- [ ] 쿼리가 최적화되었는가?
- [ ] 번들 크기가 최적화되었는가?

---

## Stage 8: 확장 (Expansion)

### 목적
**도메인을 확장한다.** 새로운 기능과 도메인을 추가합니다.

### 작업 내용
- 새 도메인 추가
- 새 기능 개발
- 국제화 (i18n)
- 다국어 지원

### 산출물
- 새 도메인 모듈
- 새 기능 문서
- 국제화 파일

### 효과
- **사업 확장**: 새로운 시장 진입
- **기능 다양화**: 더 많은 사용자 유치
- **플랫폼화**: 다양한 도메인 지원

### 실전 예시

```typescript
// 새 도메인 추가 (기존 엔진 재사용)
const recipeParser = new ParserEngine<string, Recipe>([
  { name: 'ocr', parse: (text) => parseRecipeFromOCR(text) },
  { name: 'manual', parse: (text) => parseRecipeManually(text) },
]);

// 기존 엔진을 그대로 사용하여 빠른 확장
```

### 체크리스트
- [ ] 새 도메인이 기존 엔진을 재사용하는가?
- [ ] 새 기능이 표준을 준수하는가?
- [ ] 국제화가 적용되었는가?
- [ ] 확장 가능한 구조인가?

---

## 8단계 순환 (Cycle)

8단계를 완료하면 **다시 1단계**부터 더 높은 수준으로 반복합니다:

```
사이클 1:
표준화(기본) → ... → 확장(1개 도메인)

사이클 2:
표준화(고급) → ... → 확장(5개 도메인)

사이클 3:
표준화(엔터프라이즈) → ... → 확장(글로벌)
```

---

## 실전 적용 예시

### 사례: 제품 검증 시스템

**1단계 (표준화)**: 검증 규칙 문서화  
**2단계 (통합)**: 100개 검증 함수 → 1개 시스템  
**3단계 (추상화)**: Validation Engine 구축  
**4단계 (모듈화)**: 독립 모듈로 분리  
**5단계 (자동화)**: CI에서 자동 검증  
**6단계 (지능화)**: AI가 새 규칙 제안  
**7단계 (최적화)**: 병렬 검증으로 3배 빠름  
**8단계 (확장)**: 모든 도메인에 적용

---

## 결론

8단계 방법론을 따르면:
- **개발 속도**: 2-3배 증가
- **코드 품질**: 버그 50% 감소
- **유지보수성**: 70% 향상
- **확장성**: 무한 확장 가능

**이 방법론은 반복할수록 강력해집니다.**

---

**리팩토링·대규모 변경 시:** [REFACTORING_SAFETY_PRINCIPLE.md](./REFACTORING_SAFETY_PRINCIPLE.md) — 영향 범위 선언·테스트 고정점.

**다음 단계:** [FRONT_BACK_ENGINE_LOOP.md](../00-overview/FRONT_BACK_ENGINE_LOOP.md)에서 엔진 기반 개발 흐름(프론트→백→엔진 루프)을 학습하세요.

---

**최종 업데이트**: 2026-04-14 — REFACTORING_SAFETY_PRINCIPLE 교차 링크  
**버전**: 1.0.0
