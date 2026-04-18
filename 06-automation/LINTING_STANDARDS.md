# Linting Standards
# 린팅 표준

> **"린터는 팀의 코드 리뷰어다"**  
> "Linter is your team's code reviewer"

**Itemwiki**: 루트 `.eslintrc.js` / `.eslintrc.json`이 실제 규칙을 정의한다. UX 안전 관련 규칙은 `postinstall`에서 `scripts/copy-eslint-ux-safety.js`로 동기화되는 플러그인을 사용한다. 아래의 `constitution/*` 규칙 이름·설정은 **범용 예시**이며 프로젝트와 1:1로 같지 않을 수 있다. 레이어·헌법·의존성 등은 ESLint만으로 커버하기 어려운 부분이 **`pnpm run check:*`** 스크립트(예: `check:layer-boundaries`, `check:constitution-pr`)로 보완된다 — “린터 + 검증 스크립트” 이중 구조가 의도된 준수 모델이다.

---

## 핵심 원칙

**모든 Constitution 원칙은 린터 규칙으로 강제되어야 합니다.**

```
Constitution 원칙 → ESLint 규칙 → 자동 검증 → CI/CD 통합
```

---

## ESLint 설정

### 기본 설정

```javascript
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": ["constitution"],
  "rules": {
    // Constitution 규칙
    "constitution/no-direct-fetch": "error",
    "constitution/no-loading-without-finally": "error",
    "constitution/no-direct-query": "error",
    "constitution/layer-boundaries": "error"
  }
}
```

---

## 커스텀 ESLint 규칙

### 규칙 1: no-direct-fetch

**목적:** 타임아웃 없는 fetch 금지

```javascript
// eslint-rules/no-direct-fetch.js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow direct fetch calls without timeout',
      category: 'UX Safety',
    },
    messages: {
      noDirectFetch: 'Direct fetch is not allowed. Use retryFetch with timeout instead.',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.name === 'fetch') {
          context.report({
            node,
            messageId: 'noDirectFetch',
          });
        }
      },
    };
  },
};
```

**사용:**
```typescript
// ❌ ESLint 에러
const response = await fetch(url);

// ✅ 통과
import { retryFetch } from '@/lib/api/retry';
const response = await retryFetch(url, options, { timeout: 30000 });
```

---

### 규칙 2: no-loading-without-finally

**목적:** finally 없는 loading 패턴 금지

```javascript
// eslint-rules/no-loading-without-finally.js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require finally block when using setLoading',
    },
    messages: {
      noFinally: 'setLoading(true) must be followed by finally block with setLoading(false)',
    },
  },
  create(context) {
    return {
      TryStatement(node) {
        // try 블록에서 setLoading(true) 찾기
        const hasSetLoadingTrue = findSetLoading(node.block, true);
        
        if (hasSetLoadingTrue && !node.finalizer) {
          context.report({
            node,
            messageId: 'noFinally',
          });
        }
      },
    };
  },
};
```

---

### 규칙 3: layer-boundaries

**목적:** 계층 경계 위반 차단

```javascript
// eslint-rules/layer-boundaries.js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce layer boundaries (Core ← Domain ← API)',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFile = context.getFilename();
        
        // Core에서 Domain import 금지
        if (currentFile.includes('packages/lib/core/') && 
            importPath.includes('@/lib/domain/')) {
          context.report({
            node,
            message: 'Core Layer cannot import from Domain Layer',
          });
        }
        
        // Domain에서 API import 금지
        if (currentFile.includes('packages/lib/domain/') && 
            importPath.includes('@/app/api/')) {
          context.report({
            node,
            message: 'Domain Layer cannot import from API Layer',
          });
        }
      },
    };
  },
};
```

---

### 규칙 4: no-direct-query

**목적:** Gateway 함수 강제

```javascript
// eslint-rules/no-direct-query.js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require Gateway functions instead of direct queries',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const code = context.getSourceCode().getText(node);
        
        // .from('user_profiles') 직접 사용 금지
        if (code.includes(".from('user_profiles')") || 
            code.includes('.from("user_profiles")')) {
          context.report({
            node,
            message: 'Use getUserProfile() instead of direct query',
          });
        }
      },
    };
  },
};
```

---

## Prettier 설정

### 코드 포맷 통일

```javascript
// .prettierrc.js
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  arrowParens: 'avoid',
};
```

---

## TypeScript 설정

### 엄격한 타입 체크

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## 스캔 스크립트

### 전체 스캔

```bash
# scripts/constitution-scan.ts
#!/usr/bin/env tsx

import { checkLayerBoundaries } from './check-layer-boundaries';
import { checkUXRisks } from './check-ux-risks';
import { checkConceptualRot } from './check-conceptual-rot';
import { checkSilentFailures } from './check-silent-failures';

async function main() {
  console.log('🔍 Running Constitution Scan...\n');
  
  const results = {
    layerBoundaries: await checkLayerBoundaries(),
    uxRisks: await checkUXRisks(),
    conceptualRot: await checkConceptualRot(),
    silentFailures: await checkSilentFailures(),
  };
  
  // 결과 집계
  const totalViolations = Object.values(results)
    .reduce((sum, r) => sum + r.violations.length, 0);
  
  // 리포트 출력
  printReport(results);
  
  // Exit code
  process.exit(totalViolations > 0 ? 1 : 0);
}

main();
```

---

## CI/CD 통합

### GitHub Actions 전체 워크플로우

```yaml
# .github/workflows/constitution.yml
name: Constitution Checks

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run lint
  
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run type-check
  
  constitution-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run constitution:check
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: constitution-report
          path: constitution-report.json
```

---

## 예외 처리

### Suppression 파일

```json
// .constitution-suppressions.json
{
  "version": "1.0.0",
  "suppressions": [
    {
      "rule": "layer-boundaries",
      "file": "packages/lib/core/legacy.ts",
      "reason": "Legacy code, scheduled for refactoring in Q2 2026",
      "expiresAt": "2026-06-30"
    },
    {
      "rule": "ux-safety",
      "file": "scripts/admin-tool.ts",
      "reason": "Internal admin tool, not user-facing",
      "expiresAt": null
    }
  ]
}
```

---

## Constitution 연계·규칙 후보

- **[상태 관리 §2 — `useAsyncState` deps](../07-frontend-ui/STATE_MANAGEMENT_PRINCIPLES.md)** (문서 내 §2)  
  비동기 상태 훅의 **반환 객체 전체**를 `useCallback` / `useEffect` / `useMemo` 의존성에 넣는 패턴은 재발 시 API 폭주로 이어질 수 있다.  
  **후속**: 커스텀 ESLint 규칙, ast-grep, 또는 `pnpm run check:*` 계열 스크립트로 탐지·경고 — 상세 과제는 동 문서 **§2.1 후속 시스템 개선 과제**.

- **[입력–저장 스키마 정렬](../07-frontend-ui/INPUT_PERSISTENCE_SCHEMA_ALIGNMENT.md)**  
  폼 ↔ API 매핑은 ESLint로 완전 강제하기 어렵다. **PR 체크리스트 IP-1~6**(매핑 표·mapper 필수·Round-trip·silent drop·다중 persistence 부분 실패 정책·낙관/드래프트 권위)와 테스트로 보완한다.

---

## 체크리스트

린팅 표준 구축 시:

- [ ] ESLint 설정이 완료되었는가?
- [ ] 커스텀 규칙이 작성되었는가?
- [ ] Git Hooks가 설정되었는가?
- [ ] CI/CD에 통합되었는가?
- [ ] 예외 처리 메커니즘이 있는가?

---

## 결론

> **"린터는 24/7 코드 리뷰어다"**

린팅 표준을 따르면:
- **즉각적 피드백**: 코드 작성 시점에 에러
- **일관성 강제**: 모든 코드가 동일한 기준
- **자동화**: 사람이 안 봐도 검증
- **품질 향상**: 버그 50% 감소

**린터 없는 Constitution은 지켜지지 않습니다.**

---

**다음 단계:** [CI_CD_INTEGRATION.md](./CI_CD_INTEGRATION.md)에서 CI/CD 통합을 학습하세요.

---

**최종 업데이트**: 2026-03-22 — Constitution 연계·규칙 후보(STATE_MANAGEMENT §2)  
**버전**: 1.0.0
