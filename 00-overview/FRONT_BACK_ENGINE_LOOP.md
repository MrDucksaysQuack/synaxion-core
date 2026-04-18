# Front-Back-Engine 루프

> **Constitution 문서**  
> 개발 방법론의 핵심: Frontend → Backend → Engine → Backend → Frontend 순환 개발 프로세스

**작성일**: 2026-01-25  
**목적**: Front-Back-Engine 루프의 개념, 원리, 실전 적용 방법 설명  
**적용 범위**: 모든 개발 프로세스

---

## 📋 개요

Front-Back-Engine 루프는 이 프레임워크의 **독특한 개발 방식**입니다.

일반적인 개발 방식:
```
Backend 먼저 설계 → Frontend 구현
```

이 프레임워크의 개발 방식:
```
Frontend UX 요구 → Backend 규칙화 → Engine 추상화 → Backend 강화 → Frontend 고도화
```

---

## 🔄 루프 구조

### 기본 흐름

```
┌─────────────────────────────────────────────────────────┐
│                    Front-Back-Engine 루프                 │
└─────────────────────────────────────────────────────────┘

1. Frontend: UX 요구 발생
   ↓
2. Backend: 규칙과 스키마 설정
   ↓
3. Engine: 추상화와 엔진화
   ↓
4. Backend: 더 단단해짐 (엔진 활용)
   ↓
5. Frontend: 더 높은 수준의 기능 요구
   ↓
6. Backend: 더 고도화
   ↓
(반복)
```

### 단계별 상세 설명

#### ① Frontend: UX 요구 발생

**무엇을 하는가?**
- 사용자 경험 개선을 위한 새로운 기능 요구
- 기존 기능의 불편함 발견
- 새로운 사용자 시나리오 제안

**예시:**
- "제품 스캔 후 자동으로 필드 추출이 되면 좋겠어요"
- "바코드 스캔 시 중복 스캔을 방지하고 싶어요"
- "사용자가 수정한 데이터를 자동으로 학습했으면 좋겠어요"

**특징:**
- **구체적이고 실용적**: 실제 사용자 경험에서 나옴
- **목적 지향적**: "무엇을" 해야 하는지 명확
- **구현 방법은 모름**: "어떻게" 할지는 아직 불명확

---

#### ② Backend: 규칙과 스키마 설정

**무엇을 하는가?**
- Frontend 요구를 **규칙(Rule)**으로 변환
- 데이터 구조를 **스키마(Schema)**로 정의
- 비즈니스 로직을 **도메인 규칙**으로 정립

**예시:**
- UX 요구: "제품 스캔 후 자동으로 필드 추출"
  - Backend 규칙:
    - `product_scan_sessions` 테이블에 스캔 기록 저장
    - `ocr_results` 테이블에 추출 결과 저장
    - `field_extraction_rules` 테이블에 추출 규칙 정의
    - API: `POST /api/v1/products/scan`

**특징:**
- **구조화**: 비정형 요구를 정형화된 규칙으로 변환
- **데이터 중심**: 스키마와 데이터 구조 먼저 설계
- **규칙 기반**: 명확한 비즈니스 규칙 수립

---

#### ③ Engine: 추상화와 엔진화

**무엇을 하는가?**
- Backend 규칙에서 **공통 패턴** 발견
- 공통 패턴을 **재사용 가능한 엔진**으로 추상화
- 도메인 독립적인 **범용 로직**으로 변환

**예시:**
- Backend 규칙: "제품 필드 추출 로직"
  - Engine 추상화:
    - `ParserEngine`: 모든 텍스트 파싱에 사용 가능
    - `ValidationEngine`: 모든 데이터 검증에 사용 가능
    - `ScorerEngine`: 모든 신뢰도 계산에 사용 가능

**특징:**
- **도메인 독립**: 특정 도메인에 종속되지 않음
- **재사용 가능**: 여러 도메인에서 사용 가능
- **전략 패턴**: 다양한 전략으로 확장 가능

---

#### ④ Backend: 더 단단해짐

**무엇을 하는가?**
- Engine을 활용하여 Backend 로직 **단순화**
- 중복 코드 제거 및 **일관성 확보**
- **안정성 향상**: 검증된 엔진 사용

**예시:**
- 이전: 각 도메인마다 별도의 파싱 로직
- 이후: `ParserEngine`을 모든 도메인에서 공통 사용

**특징:**
- **코드 감소**: 중복 제거로 코드량 감소
- **일관성**: 모든 도메인에서 동일한 로직 사용
- **유지보수성**: 엔진 수정 시 모든 도메인에 자동 반영

---

#### ⑤ Frontend: 더 높은 수준의 기능 요구

**무엇을 하는가?**
- 강화된 Backend를 바탕으로 **더 복잡한 기능** 요구
- 이전에는 불가능했던 **고급 기능** 구현 가능
- **사용자 경험 향상**: 더 나은 UX 제공

**예시:**
- 이전: "제품 스캔 후 필드 추출"
- 이후: "제품 스캔 후 자동 필드 추출 + 신뢰도 표시 + 사용자 수정 학습"

**특징:**
- **점진적 발전**: 단계적으로 기능 향상
- **복합 기능**: 여러 기능을 조합한 고급 기능
- **사용자 중심**: 실제 사용자 경험 개선

---

#### ⑥ Backend: 더 고도화

**무엇을 하는가?**
- 새로운 Frontend 요구를 다시 규칙화
- 기존 Engine 확장 또는 **새로운 Engine** 생성
- **시스템 전체 강화**

**예시:**
- 새로운 요구: "사용자 수정 학습"
  - 새로운 Engine: `LearningEngine`
  - Backend 규칙: `user_corrections` 학습 로직

**특징:**
- **순환 강화**: 루프가 반복될수록 시스템 강화
- **엔진 증가**: 엔진이 늘어날수록 시스템 능력 향상
- **지속적 개선**: 끊임없는 발전

---

## 🎯 루프의 효과

### 1. Frontend 단순화

**엔진이 늘어날수록 Frontend는 단순해집니다.**

```
엔진 없음:
  Frontend: 복잡한 비즈니스 로직 직접 구현
  코드량: 1000줄

엔진 1개:
  Frontend: 엔진 호출만
  코드량: 500줄

엔진 5개:
  Frontend: 엔진 조합만
  코드량: 200줄
```

**이유:**
- 비즈니스 로직이 Backend/Engine으로 이동
- Frontend는 **표시(Display)**와 **상호작용(Interaction)**만 담당
- 복잡한 로직은 **재사용 가능한 엔진**으로 추상화

---

### 2. Backend 강화

**엔진이 늘어날수록 Backend는 강해집니다.**

```
엔진 없음:
  Backend: 각 도메인마다 별도 로직
  일관성: 낮음
  유지보수: 어려움

엔진 5개:
  Backend: 공통 엔진 활용
  일관성: 높음
  유지보수: 쉬움
```

**이유:**
- 공통 로직이 **엔진으로 통합**
- 중복 제거로 **코드 품질 향상**
- 엔진 수정 시 **모든 도메인에 자동 반영**

---

### 3. 시스템 폭발적 성장

**엔진이 늘어날수록 전체 시스템은 폭발적으로 성장합니다.**

```
엔진 1개: 1개 도메인 지원
엔진 3개: 3개 도메인 지원
엔진 5개: 10개 도메인 지원 (조합 가능)
엔진 10개: 50개 도메인 지원 (조합 가능)
```

**이유:**
- 엔진은 **조합 가능**
- 새로운 도메인 추가 시 **기존 엔진 재사용**
- **지수적 성장**: 엔진 수에 비례하여 지원 도메인 수가 기하급수적으로 증가

---

## 📚 실전 예시

### 예시 1: 제품 스캔 기능

#### ① Frontend 요구
"바코드를 스캔하면 제품 정보를 자동으로 표시하고 싶어요"

#### ② Backend 규칙화
```typescript
// API 설계
POST /api/v1/products/scan
{
  barcode: string;
  image?: File;
}

// 스키마 설계
product_scan_sessions {
  barcode: string;
  scanned_at: timestamp;
  user_id: uuid;
}
```

#### ③ Engine 추상화
```typescript
// ParserEngine: 바코드에서 제품 정보 파싱
class ParserEngine {
  parse(barcode: string): ProductData;
}

// ValidationEngine: 파싱 결과 검증
class ValidationEngine {
  validate(data: ProductData): ValidationResult;
}
```

#### ④ Backend 강화
```typescript
// Backend에서 엔진 활용
const productData = parserEngine.parse(barcode);
const validation = validationEngine.validate(productData);
```

#### ⑤ Frontend 고도화
"스캔 후 자동으로 필드 추출 + 신뢰도 표시 + 사용자 수정 학습"

#### ⑥ Backend 고도화
```typescript
// 새로운 엔진 추가
class ScorerEngine {
  calculateConfidence(data: ProductData): number;
}

class LearningEngine {
  learnFromCorrection(correction: UserCorrection): void;
}
```

---

### 예시 2: 사용자 선호도 기능

#### ① Frontend 요구
"사용자가 좋아하는 제품을 저장하고 추천받고 싶어요"

#### ② Backend 규칙화
```typescript
// API 설계
POST /api/v1/users/me/preferences
GET /api/v1/users/me/recommendations

// 스키마 설계
user_preferences {
  user_id: uuid;
  product_id: uuid;
  preference_type: 'like' | 'dislike';
}
```

#### ③ Engine 추상화
```typescript
// MatcherEngine: 사용자 선호도와 제품 매칭
class MatcherEngine {
  match(userPreferences: UserPreferences, products: Product[]): MatchResult[];
}

// ScorerEngine: 추천 점수 계산
class ScorerEngine {
  calculateRecommendationScore(match: MatchResult): number;
}
```

#### ④ Backend 강화
```typescript
// Backend에서 엔진 활용
const matches = matcherEngine.match(userPreferences, products);
const scored = scorerEngine.calculateRecommendationScore(matches);
```

#### ⑤ Frontend 고도화
"개인화된 추천 + 실시간 업데이트 + AI 기반 추천"

#### ⑥ Backend 고도화
```typescript
// 새로운 엔진 추가
class AIRecommendationEngine {
  generatePersonalizedRecommendations(userId: string): Recommendation[];
}
```

---

## 🎓 학습 가이드

### 초급: 루프 이해하기

1. **Frontend 요구 파악**: 사용자가 무엇을 원하는지 이해
2. **Backend 규칙화**: 요구를 규칙과 스키마로 변환
3. **Engine 추상화**: 공통 패턴을 엔진으로 추출

### 중급: 루프 활용하기

1. **기존 엔진 활용**: 새로운 기능에서 기존 엔진 재사용
2. **엔진 확장**: 기존 엔진에 새로운 전략 추가
3. **엔진 조합**: 여러 엔진을 조합하여 복합 기능 구현

### 고급: 루프 최적화하기

1. **엔진 설계**: 새로운 엔진 설계 및 구현
2. **루프 가속**: 루프 반복 속도 향상
3. **시스템 확장**: 엔진 기반으로 시스템 확장

---

## ⚠️ 주의사항

### 1. 루프를 강제하지 말 것

**❌ 잘못된 접근:**
- 모든 기능을 무조건 루프로 개발
- Frontend 요구 없이 Engine부터 설계

**✅ 올바른 접근:**
- 자연스러운 흐름으로 루프 진행
- Frontend 요구가 명확할 때만 루프 시작

---

### 2. 과도한 추상화 금지

**❌ 잘못된 접근:**
- 모든 것을 엔진으로 만들려고 시도
- 사용하지 않는 엔진 미리 설계

**✅ 올바른 접근:**
- 실제로 재사용되는 패턴만 엔진화
- 필요할 때 엔진 생성

---

### 3. Frontend와 Backend 분리 유지

**❌ 잘못된 접근:**
- Frontend에서 직접 Engine 호출
- Backend 로직을 Frontend에 포함

**✅ 올바른 접근:**
- Frontend는 API만 호출
- Backend가 Engine을 관리

---

## 📊 루프 성공 지표

### 정량적 지표

1. **엔진 수**: 시스템의 엔진 개수
2. **엔진 재사용률**: 각 엔진이 사용되는 도메인 수
3. **코드 중복률**: 중복 코드 비율 감소
4. **개발 속도**: 새로운 기능 개발 시간

### 정성적 지표

1. **Frontend 단순성**: Frontend 코드의 복잡도 감소
2. **Backend 안정성**: Backend 로직의 일관성 향상
3. **시스템 확장성**: 새로운 도메인 추가 용이성
4. **개발자 생산성**: 개발 속도 및 품질 향상

---

## 🔗 관련 문서

- [개발 철학 (PHILOSOPHY.md)](./PHILOSOPHY.md)
- [8단계 방법론 (KHS_DEVELOPMENT_TEXTBOOK.md)](../11-protocols/KHS_DEVELOPMENT_TEXTBOOK.md)
- [엔진 설계 프로토콜 (INFLOMATRIX_DEVELOPMENT_PROTOCOL.md)](../11-protocols/INFLOMATRIX_DEVELOPMENT_PROTOCOL.md)
- [계층 경계 (LAYER_BOUNDARIES.md)](../01-foundations/LAYER_BOUNDARIES.md)

---

## 📝 요약

Front-Back-Engine 루프는:

1. **Frontend 요구**에서 시작
2. **Backend 규칙화**로 구조화
3. **Engine 추상화**로 범용화
4. **Backend 강화**로 안정화
5. **Frontend 고도화**로 발전
6. **Backend 고도화**로 완성

**결과:**
- Frontend는 단순해지고
- Backend는 강해지고
- 전체 시스템은 폭발적으로 성장합니다

---

**"엔진이 늘어날수록 Frontend는 단순해지고, Backend는 강해지고, 전체 시스템은 폭발적으로 성장한다."**
