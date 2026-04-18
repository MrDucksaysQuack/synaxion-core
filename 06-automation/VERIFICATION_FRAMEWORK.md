# Verification Framework
# 검증 프레임워크

> **"사람이 기억하지 않아도, 시스템이 보호한다"**  
> "The system protects, even when people forget"

---

## 핵심 철학

**모든 원칙은 자동으로 검증되어야 합니다.**

```
원칙 정의 → 자동 검증 구축 → CI/CD 통합 → 지속적 모니터링
```

**왜 자동 검증인가?**
- 사람은 실수합니다
- 사람은 잊어버립니다
- 사람은 일관적이지 않습니다
- 시스템은 절대 잊지 않습니다

**실제 스크립트 인벤토리**: 이 프레임워크를 구현하는 `check:*` / `measure:*` 스크립트 목록과 역할은 [VERIFICATION_SCRIPTS.md](./VERIFICATION_SCRIPTS.md)에서 관리합니다.

---

## 검증 계층

### 1. 코드 작성 시점 (Write-Time)

**도구:** ESLint, TypeScript

**목적:** 코드를 쓰는 순간 차단

```typescript
// ❌ ESLint가 즉시 에러 표시
const response = await fetch(url); // Error: Use retryFetch instead

// ❌ TypeScript가 컴파일 에러
const user: User = { id: 123 }; // Error: Type 'number' is not assignable to type 'string'
```

**장점:**
- ✅ 가장 빠른 피드백 (즉시)
- ✅ 개발자 IDE에서 즉시 확인
- ✅ 커밋 전 차단

---

### 2. 커밋 시점 (Commit-Time)

**도구:** Git Hooks (Husky), Pre-commit

**목적:** 잘못된 코드가 커밋되지 않도록

```bash
# .husky/pre-commit
#!/bin/sh
npm run lint
npm run type-check
npm run test:unit
npm run constitution:check
```

**Itemwiki (실제)**: `.husky/pre-commit`은 위와 달리 **lint-staged**와 **조건부** 검증(API 스키마 변경 시 `check:api-schemas`, 테스트 변경 시 `check:temporary-files`·`check:test-fact` 등)만 수행한다. 매 커밋에 `test:unit`/`constitution:check`를 돌리지 않는 대신, **pre-push**에서 `type-check` + **`check:constitution-pr`** 로 무거운 헌법 검증을 막는다.

**장점:**
- ✅ 커밋 전 마지막 방어선
- ✅ 로컬에서 차단
- ✅ 코드 리뷰 전 품질 확보

---

### 3. Pull Request 시점 (PR-Time)

**도구:** GitHub Actions, CI/CD

**목적:** 병합 전 전체 검증

```yaml
# .github/workflows/pr-checks.yml
name: PR Checks

on: pull_request

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install
      
      - name: Lint
        run: npm run lint
      
      - name: Type Check
        run: npm run type-check
      
      - name: Constitution Check
        run: npm run constitution:check
      
      - name: Unit Tests
        run: npm test -- tests/unit/
      
      - name: Integration Tests
        run: npm test -- tests/integration/
      
      - name: Coverage Check
        run: npm test -- --coverage --coverageThreshold='{"global":{"lines":70}}'
```

**Itemwiki (실제)**: 단일 job에 모든 단계를 넣지 않고 **`pr-checks.yml`**(lint·type-check·build·`test:contract`·`test:unit`·`check:ux-risks`)와 **`constitution-check-pr.yml`**(`check:constitution-pr`, 경로 필터에 **`workers/**` 포함**) 등으로 나눈다. 경로 필터를 쓰는 **`e2e-pr.yml`**·**`api-schema-validation.yml`**에도 동일하게 `workers/**`를 넣어 워커 전용 PR에서 필수 체크가 스킵되지 않게 한다. 통합 테스트(DB)·전체 `ci.yml`은 비용상 수동/스케줄·별도 워크플로에 둔다. 예시 YAML은 개념용이다.

**장점:**
- ✅ 팀 전체 품질 기준 강제
- ✅ 병합 전 최종 검증
- ✅ 자동화된 게이트키퍼

---

### 4. 정기 검증 (Scheduled)

**도구:** Cron Jobs, Scheduled Actions

**목적:** 누적된 기술 부채 감지

```yaml
# .github/workflows/scheduled-checks.yml
name: Scheduled Checks

on:
  schedule:
    - cron: '0 9 * * 1' # 매주 월요일 9시

jobs:
  comprehensive-check:
    runs-on: ubuntu-latest
    steps:
      - name: Full Constitution Scan
        run: npm run constitution:check:full
      
      - name: Dependency Audit
        run: npm audit
      
      - name: Performance Benchmark
        run: npm run benchmark
      
      - name: Report Results
        run: npm run report:slack
```

**Itemwiki (실제)**: `.github/workflows/constitution-scheduled.yml`에서 **`pnpm run check:all`** 을 주간(cron) 실행한다.

**장점:**
- ✅ 장기적 품질 유지
- ✅ 느린 변화 감지 (conceptual drift)
- ✅ 정기적인 건강 검진

---

## 검증 스크립트

### 계층 경계 검증

```bash
# scripts/check-layer-boundaries.ts
npm run check:layer-boundaries
```

**검증 항목:**
- Core → Domain import 금지
- Domain → API import 금지
- Domain A → Domain B import 금지
- API → Engine 직접 import 금지

### 엔진 import 규칙 (`check:engine-imports`)

```bash
# scripts/check-engine-imports.ts
pnpm run check:engine-imports
```

**검증 항목 (`packages/lib/engines`):**
- `@itemwiki/lib/utils` 및 `packages/lib/utils` 로의 상대 경로 금지 (Core 게이트 사용)
- `@itemwiki/lib/domain`·Domain 상대 경로·`@itemwiki/web`·**`@itemwiki/lib/api` 및 `packages/lib/api` 상대 경로** 금지 (공유 타입은 `@itemwiki/lib/core/types/**`)
- 엔진 서브패키지 간 직접 import 금지 (상대·`@itemwiki/lib/engines/...` 별칭)

**출력:**
```
❌ Found 3 violations:
  - packages/lib/core/utils/helper.ts:15
    Core Layer에서 Domain Layer import 금지
    
  - packages/lib/domain/product/api.ts:8
    Domain Layer에서 API Layer import 금지
    
✅ 0 violations in 1,234 files
```

---

### UX 안전 규칙 검증

```bash
# scripts/check-ux-risks.ts
pnpm run check:ux-risks
```

**검증 항목:**
- 타임아웃 없는 fetch 호출
- finally 없는 loading 패턴
- 사용자 피드백 없는 catch 블록

**출력:**
```
🔴 High Risk (3):
  - components/product/ProductList.tsx:45
    타임아웃 없는 fetch 호출 발견
    
🟡 Medium Risk (5):
  - components/auth/LoginForm.tsx:78
    finally 없는 loading 패턴 발견
```

---

### 개념 부패 검증

```bash
# scripts/check-conceptual-rot.ts
npm run check:conceptual-rot
```

**검증 항목:**
- 직접 쿼리 사용 (Gateway 함수 우회)
- uid 직접 사용 (레거시 필드)
- 판단 로직 분산 (중앙화 필요)

---

## 통합 검증 명령어

### 로컬 개발

```bash
# 빠른 검증 (커밋 전)
pnpm run verify:quick          # lint + type-check

# 전체 검증 (PR 전)
pnpm run verify:full           # verify:quick + test:unit + constitution:check

# Constitution 최소 세트 (계층·3-depth·flow-docs·UX·개념부패·stale·침묵실패·lib-console)
pnpm run constitution:check

# 푸시 전 필수 (pre-push 훅과 동일)
pnpm run verify:before-push    # type-check + check:constitution-pr
```

### package.json 설정 (Itemwiki 적용)

- **verify:quick**: `lint` + `type-check`
- **constitution:check**: `check:layer-boundaries` + `check:engine-imports` + `check:design-route-depth` + `check:flow-docs` + `check:ux-risks` + `check:conceptual-rot` + `check:stale-ui-risks` + `check:silent-failures` + `check:lib-console`
- **verify:full**: `verify:quick` + `test:unit` + `constitution:check`
- **verify:before-push**: `type-check` + `check:constitution-pr` (pre-push 훅에서 사용)
- **check:constitution-pr**: PR/배포 전 전체 Constitution 검증 (버전·계층·**엔진 import**·domain-layer-idp·침묵실패·lib-console·3-depth 라우트·**flow-docs**·개념부패·ux·stale-ui·e2e-count·decision·api-7-stages)

---

## 검증 결과 처리

### 심각도 분류

| 심각도 | 의미 | 조치 |
|--------|------|------|
| 🔴 High | 즉시 수정 필요 | CI 실패, 병합 차단 |
| 🟡 Medium | 점진적 개선 | 경고만, 병합 허용 |
| 🟢 Low | 권장 사항 | 정보성 메시지 |

### CI 정책

```yaml
# 실패 정책
- High Risk: CI 실패 (병합 차단)
- Medium Risk: 경고만 (병합 허용)
- Low Risk: 정보성 (무시 가능)

# 예외 처리
- suppression 파일로 특정 파일/라인 제외 가능
- 주석으로 임시 예외 설정 가능
```

---

## 예외 처리 (Suppression)

### 파일 레벨 예외

아래 JSON은 **개념 예시**이다. Itemwiki는 주로 ESLint 주석·프로젝트별 allowlist(예: 임시 테스트 허용 목록)로 예외를 관리한다.

```json
// .constitution-suppressions.json
{
  "layer-boundaries": {
    "packages/lib/core/special-case.ts": "Legacy code, will be refactored"
  },
  "ux-safety": {
    "scripts/admin-tool.ts": "Admin tool, not user-facing"
  }
}
```

### 라인 레벨 예외

```typescript
// eslint-disable-next-line constitution/no-direct-fetch
const response = await fetch(url); // 특별한 이유로 예외

// @constitution-suppress ux-safety
setLoading(true); // 이유: 이 컴포넌트는 특수 케이스
await apiCall();
```

---

## 자동 수정 (Auto-Fix)

### 일부 규칙은 자동 수정 가능

```bash
# ESLint 자동 수정
npm run lint -- --fix

# UX 위험 자동 수정 (선택적)
npm run fix:ux-safety

# Import 경로 자동 수정
npm run fix:imports
```

**자동 수정 가능한 항목:**
- Import 순서 정렬
- 세미콜론 추가/제거
- 간단한 코드 포맷

**수동 수정 필요:**
- 계층 경계 위반
- 로직 구조 변경
- 복잡한 리팩토링

---

## 체크리스트

검증 프레임워크 구축 시:

- [ ] ESLint 규칙이 설정되어 있는가?
- [ ] Git Hooks가 설정되어 있는가?
- [ ] CI/CD에 검증 단계가 있는가?
- [ ] 검증 스크립트가 자동 실행되는가?
- [ ] 예외 처리 메커니즘이 있는가?

---

## 결론

> **"자동 검증은 품질의 마지막 방어선이다"**

검증 프레임워크를 구축하면:
- **품질 보장**: 사람이 놓쳐도 시스템이 잡음
- **일관성**: 모든 PR이 동일한 기준
- **속도**: 수동 리뷰 시간 70% 감소
- **신뢰**: 배포 자신감 향상

**자동 검증 없는 원칙은 지켜지지 않습니다.**

---

**다음 단계:** [LINTING_STANDARDS.md](./LINTING_STANDARDS.md)에서 린팅 표준을 학습하세요.

---

**최종 업데이트**: 2026-03-19  
**버전**: 1.0.1
