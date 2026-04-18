# E2E 테스트 핵심 플로우 가이드
# E2E Critical Flows Guide

> **"E2E 테스트는 핵심 플로우만 검증한다"**

**런타임 OS 범위**: 제품상 “틀리면 안 되는” 5개 흐름(preferences·제품 편집·가입·기여 승인·탭 설정)에만 ①②③을 집중 적용한다 — [CRITICAL_RUNTIME_GUARANTEES.md](../../guides/CRITICAL_RUNTIME_GUARANTEES.md). 전체 E2E 개수 목표(아래 피라미드)와 모순되지 않는다.

---

## 📋 목차

1. [E2E 테스트 목적](#e2e-테스트-목적)
2. [핵심 플로우 정의](#핵심-플로우-정의)
3. [현재 E2E 테스트 분석](#현재-e2e-테스트-분석)
4. [정리 계획](#정리-계획)
5. [유지 보수 가이드](#유지-보수-가이드)

---

## E2E 테스트 목적

### 정의

**E2E 테스트**는 실제 사용자 시나리오를 브라우저에서 검증하는 테스트입니다.

### 특징

- ✅ **실제 브라우저 사용**: Playwright/Cypress
- ✅ **전체 시스템 통합 검증**: 프론트엔드 + 백엔드 + DB
- ✅ **사용자 관점 테스트**: 실제 사용자 경험 검증
- ⚠️ **느림**: 10-60초
- ⚠️ **불안정**: Flaky 테스트 가능성

### 테스트 피라미드에서의 위치

```
        /\
       /E2E\        ← 10% (목표: 50개 이하)
      /------\
     /Integration\  ← 30% (160개)
    /------------\
   /    Unit      \  ← 60% (300개 이상)
  /----------------\
```

**현재 상태**: E2E 141개 (29%) → **목표: 50개 이하 (10%)**

---

## 핵심 플로우 정의

### ✅ E2E 테스트로 작성해야 하는 것

1. **핵심 사용자 플로우**
   - 회원가입 (Signup)
   - 로그인 (Login)
   - 제품 스캔 (Barcode Scan)
   - 제품 검색 (Product Search)
   - 선호도 설정 (Preference Setting)

2. **Critical Path**
   - 결제 플로우 (Payment)
   - 주문 플로우 (Order)
   - 데이터 동기화 (Data Sync)

3. **크로스 브라우저 이슈**
   - 브라우저 호환성 검증
   - 모바일 반응형 검증

4. **성능 검증 (선택적)**
   - 페이지 로딩 속도
   - API 응답 시간

### ❌ E2E 테스트로 작성하지 말아야 할 것

1. **단순 API 호출** → Integration 테스트로
2. **개별 함수 로직** → Unit 테스트로
3. **모든 엣지 케이스** → Unit/Integration 테스트로
4. **상세한 비즈니스 로직** → Unit 테스트로

---

## 현재 E2E 테스트 분석

### 테스트 분포

**flows/** (50개 파일, 191개 테스트)
- ✅ 핵심 플로우: `authentication.spec.ts`, `signup-*.spec.ts`, `barcode-scan.spec.ts`
- ⚠️ 중복 플로우: `signup-full.spec.ts`, `signup-step2-flow.spec.ts`, `signup-verification.spec.ts` 등
- ⚠️ 상세 테스트: `image-ocr-advanced.spec.ts` (11개 테스트) → Integration으로 이동 권장

**api/** (21개 파일, 42개 테스트)
- ⚠️ API 테스트는 Integration 테스트로 이동 권장
- E2E는 사용자 플로우만 검증해야 함

**pages/** (38개 파일)
- ⚠️ 페이지별 상세 테스트는 Integration 테스트로 이동 권장
- E2E는 핵심 플로우만 검증

**edge-cases/** (8개 파일)
- ⚠️ 엣지 케이스는 Unit/Integration 테스트로 이동 권장

---

## 정리 계획

### Phase 1: 핵심 플로우 식별 (우선순위 높음)

다음 플로우만 E2E 테스트로 유지:

1. **인증 플로우** (`authentication.spec.ts`)
   - 로그인
   - 로그아웃
   - OAuth 인증

2. **회원가입 플로우** (`signup-full.spec.ts` - 통합)
   - 이메일 입력
   - 프로필 설정
   - 온보딩 완료

3. **제품 스캔 플로우** (`barcode-scan.spec.ts`)
   - 바코드 스캔
   - 제품 정보 표시
   - 이미지 업로드

4. **제품 검색 플로우** (`product-search.spec.ts`)
   - 검색어 입력
   - 결과 표시
   - 필터링

5. **선호도 설정 플로우** (`preference-sets.spec.ts`)
   - 선호도 생성
   - 선호도 적용
   - 선호도 공유

### Phase 2: 중복 제거

다음 테스트는 통합 또는 삭제:

- `signup-step2-flow.spec.ts` → `signup-full.spec.ts`에 통합
- `signup-verification.spec.ts` → Integration 테스트로 이동
- `signup-debug-*.spec.ts` → 삭제 (디버그용)
- `signup-new-user-input.spec.ts` → Integration 테스트로 이동

### Phase 3: Integration 테스트로 이동

다음 테스트는 Integration 테스트로 이동:

- `api/**` 전체 → `tests/integration/api/`로 이동
- `pages/**` 상세 테스트 → Integration 테스트로 변환
- `edge-cases/**` → Unit/Integration 테스트로 변환

### Phase 4: 삭제 대상

다음 테스트는 삭제 고려:

- 디버그용 테스트 (`debug/**`)
- 중복된 플로우 테스트
- 상세한 비즈니스 로직 테스트

---

## 유지 보수 가이드

### 새로운 E2E 테스트 작성 전 체크리스트

- [ ] 이 테스트가 실제 사용자 플로우인가?
- [ ] 이 테스트가 Critical Path인가?
- [ ] 이 테스트를 Unit/Integration 테스트로 할 수 없는가?
- [ ] 이 테스트가 다른 E2E 테스트와 중복되지 않는가?

### E2E 테스트 작성 원칙

1. **하나의 플로우만 검증**
   ```typescript
   // ✅ 좋은 예
   test('should complete signup flow', async ({ page }) => {
     // 전체 회원가입 플로우만 검증
   });
   
   // ❌ 나쁜 예
   test('should handle signup and login and search', async ({ page }) => {
     // 여러 플로우를 하나의 테스트에 포함
   });
   ```

2. **명확한 사용자 시나리오**
   ```typescript
   // ✅ 좋은 예
   test('should allow user to scan product and view details', async ({ page }) => {
     // 사용자 관점의 명확한 시나리오
   });
   ```

3. **최소한의 검증**
   ```typescript
   // ✅ 좋은 예
   test('should complete signup', async ({ page }) => {
     await page.goto('/signup');
     await page.fill('input[name="email"]', 'test@example.com');
     await page.click('button[type="submit"]');
     await expect(page).toHaveURL('/dashboard');
   });
   
   // ❌ 나쁜 예
   test('should complete signup with all validations', async ({ page }) => {
     // 모든 검증 로직을 E2E에서 테스트
   });
   ```

---

## 목표 달성 계획

### 단기 (1-2주)

1. ✅ 핵심 플로우 식별 완료
2. ⏳ 중복 테스트 통합 시작
3. ⏳ API 테스트 Integration으로 이동 시작

### 중기 (1개월)

1. ⏳ E2E 테스트 50개 이하로 감소
2. ⏳ 핵심 플로우만 유지
3. ⏳ Integration 테스트로 이동 완료

### 장기 (지속적)

1. ⏳ E2E 테스트 비율 모니터링 (10% 유지)
2. ⏳ 새로운 E2E 테스트 추가 시 검토 프로세스 적용

---

## 참고 문서

- [테스트 피라미드](./TESTING_PYRAMID.md) - 전체 테스트 전략
- [Unit 테스트 가이드](./UNIT_TEST_WRITING_GUIDE.md) - Unit 테스트 작성법
- [Integration 테스트 가이드](./INTEGRATION_TEST_GUIDE.md) - Integration 테스트 작성법

---

**최종 업데이트**: 2026-01-25  
**버전**: 1.0.0
