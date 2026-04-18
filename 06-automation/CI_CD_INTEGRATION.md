# CI/CD Integration
# CI/CD 통합

> **"배포 전에 모든 것을 검증한다"**  
> "Verify everything before deployment"

---

## 핵심 철학

**자동화된 품질 게이트(Quality Gate)**를 구축합니다.

```
코드 작성 → 커밋 → PR → CI 검증 → 배포
                         ↑
                    품질 게이트
                    (자동 검증)
```

---

## Itemwiki 저장소 기준 (실제)

아래 절의 YAML은 **범용 예시**이다. 이 모노레포에서는 다음을 따른다.

| 항목 | 실제 |
|------|------|
| 패키지 매니저 / Node | **pnpm** (예: 10.x), **Node 20** |
| UX 스캔 스크립트 | **`pnpm run check:ux-risks`** (예시의 `check:ux-safety`와 동일 역할이 아님—명칭만 다름) |
| PR 기본 게이트 | `.github/workflows/pr-checks.yml` — lint, type-check, build, **`pnpm run test:contract`** · **`pnpm run test:unit`**, **`check:ux-risks`(실패 시 job 실패)** |
| Constitution PR 게이트 | `.github/workflows/constitution-check-pr.yml` — **`pnpm run check:constitution-pr`** (경로 필터에 `workers/**` 포함; 워커 전용 PR도 동일 게이트) |
| 정기 헌법 스캔 | `.github/workflows/constitution-scheduled.yml` — **`pnpm run check:all`** (매주 월요일) |
| 상세 인벤토리 | [VERIFICATION_SCRIPTS.md](./VERIFICATION_SCRIPTS.md), [VERIFICATION_FRAMEWORK.md](./VERIFICATION_FRAMEWORK.md)의 “Itemwiki 적용” 절 |

---

## CI/CD 파이프라인 구조

### Stage 1: Build & Lint

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Lint
        run: npm run lint
      
      - name: Type Check
        run: npm run type-check
```

---

### Stage 2: Constitution Checks

```yaml
  constitution:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Check Layer Boundaries
        run: npm run check:layer-boundaries
      
      - name: Check UX Safety
        run: npm run check:ux-safety
      
      - name: Check Conceptual Rot
        run: npm run check:conceptual-rot
      
      - name: Check Silent Failures
        run: npm run check:silent-failures
      
      - name: Upload Constitution Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: constitution-report
          path: reports/constitution-*.json
```

**참고 (Itemwiki)**: 실제 Constitution PR 검증은 `pnpm run check:constitution-pr` 한 번에 묶여 있으며, UX 스캔 스크립트명은 **`check:ux-risks`** 이다. 위 블록은 단계를 이해하기 위한 범용 예시다.

---

### Stage 3: Tests

```yaml
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Unit Tests
        run: npm test -- tests/unit/ --coverage
      
      - name: Integration Tests
        run: npm test -- tests/integration/ --coverage
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
  
  e2e:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: E2E Tests
        run: npm run test:e2e
      
      - name: Upload Playwright Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

### Stage 4: Security & Performance

```yaml
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Dependency Audit
        run: npm audit --audit-level=moderate
      
      - name: SAST Scan (Optional)
        uses: github/codeql-action/analyze@v2
  
  performance:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://staging.example.com
          uploadArtifacts: true
```

---

## 품질 게이트 (Quality Gate)

### 병합 조건

```yaml
# .github/workflows/quality-gate.yml
name: Quality Gate

on:
  pull_request:

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - name: Check all required checks passed
        run: |
          # 다음을 모두 통과해야 병합 가능:
          # ✅ Build successful
          # ✅ Lint passed
          # ✅ Type check passed
          # ✅ Constitution checks passed (High severity only)
          # ✅ Unit tests passed (coverage > 70%)
          # ✅ Integration tests passed
          # ⚠️ E2E tests passed (main branch only)
```

### 심각도별 정책

| 검증 항목 | High | Medium | Low |
|----------|------|--------|-----|
| ESLint 에러 | ❌ 병합 차단 | ⚠️ 경고 | ℹ️ 정보 |
| Constitution 위반 | ❌ 병합 차단 | ⚠️ 경고 | ℹ️ 정보 |
| 테스트 실패 | ❌ 병합 차단 | ❌ 병합 차단 | ⚠️ 경고 |
| Coverage 미달 | ❌ 병합 차단 | ⚠️ 경고 | ℹ️ 정보 |

---

## Branch 전략별 CI 설정

### Feature Branch

```yaml
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  quick-check:
    steps:
      - Lint
      - Type Check
      - Unit Tests (빠른 테스트만)
      - Constitution Check (High severity)
```

### Main/Develop Branch

```yaml
on:
  push:
    branches: [main, develop]

jobs:
  full-check:
    steps:
      - Lint
      - Type Check
      - All Tests (Unit + Integration + E2E)
      - Constitution Check (전체)
      - Security Scan
      - Performance Check
      - Deploy
```

---

## 자동 배포

### Staging 배포

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: [build, test, constitution]
    steps:
      - name: Deploy to Vercel Staging
        run: vercel deploy --prod=false
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

### Production 배포

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: [build, test, constitution, e2e, security]
    steps:
      - name: Final Health Check
        run: npm run health-check
      
      - name: Deploy to Vercel Production
        run: vercel deploy --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      
      - name: Post-deployment Smoke Test
        run: npm run smoke-test
      
      - name: Notify Team
        run: npm run notify:slack "✅ Production deployed"
```

---

## 모니터링 및 알림

### Slack/Discord 알림

```yaml
- name: Notify on Failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: '❌ CI Failed: ${{ github.event.pull_request.title }}'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}

- name: Notify on Success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: '✅ CI Passed: Ready to merge'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 캐싱 전략

### 의존성 캐싱

```yaml
- name: Cache node_modules
  uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

- name: Cache Next.js build
  uses: actions/cache@v3
  with:
    path: .next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}
```

**효과:**
- 빌드 시간 50% 감소
- CI 비용 절감
- 빠른 피드백

---

## 병렬 실행

### Job 병렬화

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    # ...
  
  test-unit:
    runs-on: ubuntu-latest
    # ...
  
  test-integration:
    runs-on: ubuntu-latest
    # ...
  
  constitution:
    runs-on: ubuntu-latest
    # ...

# 모든 job이 병렬로 실행 → 빠른 피드백
```

---

## 체크리스트

CI/CD 구축 시:

- [ ] 모든 검증이 자동화되어 있는가?
- [ ] 품질 게이트가 설정되어 있는가?
- [ ] 캐싱으로 최적화되어 있는가?
- [ ] 알림이 설정되어 있는가?
- [ ] 배포가 자동화되어 있는가?

---

## 결론

> **"자동화된 CI/CD는 개발자의 안전망이다"**

CI/CD 통합을 통해:
- **품질 보장**: 모든 PR이 검증됨
- **빠른 배포**: 자동 배포로 시간 절약
- **안전한 배포**: 실패 시 자동 롤백
- **팀 신뢰**: 배포에 대한 자신감

**CI/CD 없는 Constitution은 선언에 불과합니다.**

---

**다음 단계:** [AUTOMATED_CHECKS_GUIDE.md](./AUTOMATED_CHECKS_GUIDE.md)에서 자동 검증 가이드를 학습하세요.

---

**최종 업데이트**: 2026-03-19  
**버전**: 1.0.1
