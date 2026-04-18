# 🛡️ UX 안전 표준 (UX Safety Standards)

**최종 업데이트**: 2024년  
**상태**: ✅ **강제 규칙** (ESLint + 자동 스캔)

---

## 📋 핵심 원칙

> **"사용자 경험은 실패할 수 있지만, 실패를 숨기거나 영구적으로 고정되면 안 된다."**

이 문서는 운영 사고를 통해 학습한 위험 패턴을 **코드 레벨에서 차단**하기 위한 표준입니다.

---

## 1️⃣ 네트워크 호출 표준

### ❌ 금지 패턴

```typescript
// ❌ 타임아웃 없는 fetch 호출 - 금지!
const response = await fetch(url, options);
```

### ✅ 필수 패턴

```typescript
// ✅ 방법 1: retryFetch 사용 (권장)
import { retryFetch } from '@itemwiki/lib/api/retry';

const response = await retryFetch(url, options, {
  timeout: 10000, // 명시적 타임아웃 권장
  maxRetries: 3,
});

// ✅ 방법 2: AbortSignal.timeout 사용 (외부 API 등)
const response = await fetch(url, {
  ...options,
  signal: AbortSignal.timeout(30000), // 30초 타임아웃
});
```

### 📏 타임아웃 기준

| 요청 유형 | 권장 타임아웃 | 상수 참조 |
|---------|------------|----------|
| 일반 GET 요청 | 30초 | `API_TIMEOUTS.GET` |
| POST/PUT/PATCH | 60초 | `API_TIMEOUTS.POST` |
| 이미지 다운로드 | 30초 | `API_TIMEOUTS.GET` |
| 외부 API (LLM 등) | 60초 | `API_TIMEOUTS.POST` |
| 파일 업로드 | 120초 | `API_TIMEOUTS.UPLOAD` |
| 긴 작업 (OCR 등) | 180초 | `API_TIMEOUTS.LONG_RUNNING` |

### 🔍 자동 탐지

- **ESLint**: `fetch` 직접 사용 시 에러
- **스캔 스크립트**: `pnpm check:ux-risks` 실행 시 탐지
- **CI**: PR 체크 시 자동 경고

---

## 2️⃣ Loading 상태 관리 표준

### ❌ 금지 패턴

```typescript
// ❌ finally 없이 setLoading 사용 - 금지!
try {
  state.setLoading(true);
  await apiCall();
  state.setLoading(false); // 에러 발생 시 실행 안 됨
} catch (err) {
  // setLoading(false) 없음 → 로딩 상태 고정!
}
```

### ✅ 필수 패턴

```typescript
// ✅ 방법 1: finally 블록 사용 (수동 관리)
try {
  state.setLoading(true);
  await apiCall();
} finally {
  state.setLoading(false); // 항상 실행됨
}

// ✅ 방법 2: useAsync Hook 사용 (권장)
import { useAsync } from '@itemwiki/web/hooks/api/useAsync';

const { data, loading, error, execute } = useAsync(
  () => fetchData(),
  true // 마운트 시 즉시 실행
);
// useAsync는 내부적으로 finally 블록을 처리함
```

### 📏 사용 가이드

| 상황 | 권장 방법 |
|------|----------|
| 단순 데이터 로딩 | `useAsync` Hook |
| 사용자 액션 (버튼 클릭 등) | `useAsyncState` + `finally` 블록 |
| 옵티미스틱 업데이트 | `useOptimistic` Hook |
| 폼 제출 | `useSaveOperation` Hook |

### 🔍 자동 탐지

- **스캔 스크립트**: `setLoading(true)` 후 `finally` 블록 없으면 경고
- **코드 리뷰**: 수동 체크리스트 항목

---

## 3️⃣ 에러 처리 및 사용자 피드백 표준

### ❌ 금지 패턴

```typescript
// ❌ 사용자 액션 실패 시 피드백 없음 - 금지!
try {
  await saveProduct();
} catch (err) {
  // 로깅만 하고 사용자에게 알리지 않음
  console.error(err);
}
```

### ✅ 필수 패턴

```typescript
// ✅ 사용자 액션 실패 시 반드시 피드백
import { useErrorHandler } from '@itemwiki/web/hooks/common/useErrorHandler';

const { handleError } = useErrorHandler();

try {
  await saveProduct();
  toast.showSuccess('저장되었습니다.');
} catch (err) {
  await handleError(err, {
    defaultMessage: '저장에 실패했습니다.',
    failureCategory: 'external_service',
    showToUser: true, // ✅ 사용자에게 표시
  });
}
```

### 📏 피드백 기준

| 상황 | 피드백 필요 여부 | 예외 |
|------|----------------|------|
| 사용자 트리거 작업 | ✅ **필수** | - |
| 백그라운드 작업 | ⚠️ 선택적 | 헬스체크, 프리페치 등 |
| 낮은 레벨 Hook | ❌ 불필요 | 상위 컴포넌트에서 처리 |

### 🔍 자동 탐지

- **스캔 스크립트**: `showToUser: false` + 사용자 피드백 없으면 경고
- **코드 리뷰**: 사용자 액션 실패 시 피드백 확인

---

## 4️⃣ 재시도 로직 표준

### ❌ 금지 패턴

```typescript
// ❌ 재시도 종료 조건 없음 - 금지!
let attempts = 0;
while (attempts < 10) {
  try {
    await apiCall();
    break;
  } catch (err) {
    attempts++;
    // 종료 조건 없음 → 무한 재시도 가능
  }
}
```

### ✅ 필수 패턴

```typescript
// ✅ retryFetch 사용 (자동 종료 조건 포함)
import { retryFetch } from '@itemwiki/lib/api/retry';

const response = await retryFetch(url, options, {
  maxRetries: 3, // ✅ 최대 시도 횟수 명시
  timeout: 10000, // ✅ 타임아웃 명시
  exponentialBackoff: true,
});
```

### 📏 재시도 기준

- **최대 시도 횟수**: 항상 명시 (기본값: 3회)
- **타임아웃**: 각 시도마다 타임아웃 적용
- **종료 조건**: 재시도 불가능한 에러 (4xx 등)는 즉시 종료

---

## 5️⃣ 자동화 및 검증

### 🔍 자동 스캔

```bash
# 로컬에서 실행
pnpm check:ux-risks

# CI에서 자동 실행 (PR 체크 시)
# .github/workflows/pr-checks.yml 참조
```

### 📊 스캔 결과 해석

| 심각도 | 의미 | 조치 |
|--------|------|------|
| 🔴 높음 | 즉시 수정 필요 | 타임아웃 추가 또는 retryFetch 사용 |
| 🟡 중간 | 점진적 개선 | finally 블록 추가, 피드백 추가 |
| 🟢 낮음 | 권장 사항 | 명시적 타임아웃 설정 등 |

### CI 정책 (PR Checks)

- **머지 차단 가능**: [`.github/workflows/pr-checks.yml`](../../.github/workflows/pr-checks.yml)에서 `pnpm run check:ux-risks`를 실행하며, 스크립트가 비정상 종료(exit code ≠ 0)하면 해당 PR job이 실패합니다 (Constitution 워크플로가 경로 필터로 스킵되는 PR을 대비한 안전망).
- **리포트**: 동일 워크플로에서 `ux-risks-report.txt`를 Artifact로 업로드합니다 (요약은 GitHub Step Summary에 일부 표시).
- **추가 검증**: `app/`, `components/`, `packages/` 등 변경 시 [Constitution Check (PR)](../../.github/workflows/constitution-check-pr.yml)에서도 `check:ux-risks`가 `check:constitution-pr`에 포함되어 실행될 수 있습니다.

---

## 6️⃣ 코드 리뷰 체크리스트

PR 리뷰 시 다음 항목을 확인하세요:

### 네트워크 호출
- [ ] `fetch` 직접 사용 없음 (ESLint 에러 확인)
- [ ] 타임아웃 설정됨 (`retryFetch` 또는 `AbortSignal.timeout`)
- [ ] 재시도 로직에 종료 조건 있음

### Loading 상태
- [ ] `setLoading(true)` 후 `finally` 블록 있음
- [ ] 또는 `useAsync` / `useAsyncState` Hook 사용

### 에러 처리
- [ ] 사용자 액션 실패 시 피드백 제공
- [ ] `handleError` 또는 `handleFrontendError` 사용
- [ ] `showToUser` 옵션 적절히 설정

---

## 7️⃣ 예외 상황

다음 상황에서는 예외가 허용됩니다:

1. **테스트 코드**: 타임아웃 없이 fetch 사용 가능
2. **스크립트 파일**: 일회성 스크립트는 선택적
3. **헬스체크**: 백그라운드 작업은 `showToUser: false` 허용

예외 사용 시 주석으로 이유를 명시하세요:

```typescript
// 예외: 헬스체크는 백그라운드 작업이므로 사용자 피드백 불필요
await handleError(err, {
  showToUser: false,
  failureCategory: 'side_effect',
});
```

---

## 8️⃣ 참고 자료

- [UX 위험 패턴 분석 리포트](../analysis/UX_RISK_PATTERN_ANALYSIS.md)
- [API 타임아웃 수정 요약](../API_TIMEOUT_FIX_SUMMARY.md)
- [SRRS Constitution](./SRRS_CONSTITUTION.md)
- [자동 스캔 스크립트](../../scripts/check-ux-risks.ts)

---

## 9️⃣ 변경 이력

| 날짜 | 변경 내용 | 작성자 |
|------|----------|--------|
| 2024-01 | 초기 작성 (운영 사고 학습) | AI Assistant |
| 2026-03-20 | §5 CI 정책을 pr-checks.yml 실제 동작과 일치시킴 | — |

---

**이 문서는 운영 사고를 통해 학습한 패턴을 코드 레벨에서 차단하기 위한 표준입니다.**  
**모든 개발자는 이 표준을 준수해야 하며, 예외는 반드시 문서화해야 합니다.**
