# 🔇 Silent Failure 방지 정책

**작성일**: 2026-01-13  
**최종 업데이트**: 2026-01-14  
**책임 팀**: Team 5 — Silent Failure & Background UX 팀  
**상태**: 활성

---

## 📋 개요

**Silent Failure**는 에러가 발생했는데 사용자에게 아무 피드백도 제공되지 않는 상황을 의미합니다. 이는 사용자 경험을 크게 해치는 UX 버그입니다.

이 정책은 모든 에러가 적절한 피드백을 받도록 보장합니다.

---

## 🎯 핵심 원칙

### 1. 모든 에러는 반드시 처리되어야 함

> **"에러는 반드시 사용자 또는 시스템 중 한 곳에 전달되어야 한다"**

- 사용자에게 표시 (Toast, Alert 등)
- 시스템 로그에 기록
- 둘 중 하나는 반드시 수행되어야 함

### 2. 사용자 기대 작업은 반드시 피드백 제공

> **"사용자가 트리거한 작업의 실패는 반드시 사용자에게 알려야 한다"**

사용자가 버튼을 클릭하거나 폼을 제출한 경우, 실패 시 반드시 피드백을 제공해야 합니다.

### 3. 백그라운드 작업도 컨텍스트에 따라 판단

> **"백그라운드 작업도 사용자가 기대하는 작업이면 피드백을 제공해야 한다"**

예를 들어, 이미지 업로드 후 자동으로 실행되는 OCR 작업은 사용자가 기대하는 작업이므로 실패 시 피드백을 제공해야 합니다.

---

## 🚫 금지 패턴 (Forbidden Patterns)

### ❌ catch 블록에서 아무 처리도 하지 않음

```typescript
// ❌ 금지: 에러를 조용히 삼킴
try {
  await someOperation();
} catch (error) {
  // 아무것도 하지 않음
}
```

### ❌ showToUser: false인데 상위에서도 처리하지 않음

```typescript
// ❌ 금지: Hook에서 showToUser: false로 설정했는데 상위에서도 처리하지 않음
// Hook 내부
try {
  await apiCall();
} catch (error) {
  await handleFrontendError(error, {
    showToUser: false, // ❌ 상위에서 처리하지 않으면 Silent Failure
  });
}

// 상위 컴포넌트에서도 에러 상태를 확인하지 않음
```

### ❌ 사용자 트리거 작업인데 피드백 없음

```typescript
// ❌ 금지: 사용자가 버튼을 클릭했는데 실패 시 피드백 없음
const handleSubmit = async () => {
  try {
    await submitForm();
  } catch (error) {
    // ❌ 사용자에게 알리지 않음
    console.error(error);
  }
};
```

---

## ✅ 허용 패턴 (Allowed Patterns)

### ✅ 사용자 기대 작업: 반드시 피드백 제공

```typescript
// ✅ 권장: 사용자 트리거 작업은 반드시 피드백 제공
const handleSubmit = async () => {
  try {
    await submitForm();
    toast.showSuccess('제출 완료');
  } catch (error) {
    await handleError(error, {
      defaultMessage: '제출에 실패했습니다.',
      failureCategory: 'core_logic',
      showToUser: true, // ✅ 사용자에게 표시
    });
  }
};
```

### ✅ userActionContext 사용 (권장)

```typescript
// ✅ 권장: handleFrontendError에 userActionContext 전달 (자동 판단)
import { handleFrontendError } from '@itemwiki/lib/utils/error-handling/frontend-error-handler';

const handleUpload = async () => {
  try {
    await uploadImage();
  } catch (error) {
    await handleFrontendError(error, {
      userActionContext: {
        action: 'upload_image',
        trigger: 'button_click',
        context: { page: 'product-register' }
      }
      // showToUser는 자동으로 판단됩니다
    });
  }
};
```

### ✅ useErrorHandler에 userActionContext 전달

```typescript
// ✅ 권장: useErrorHandler에 userActionContext 전달
import { useErrorHandler } from '@itemwiki/web/hooks/common/useErrorHandler';

function MyComponent() {
  const { handleError } = useErrorHandler();
  
  const handleSubmit = async () => {
    try {
      await submitForm();
    } catch (error) {
      await handleError(error, {
        userActionContext: {
          action: 'submit_form',
          trigger: 'form_submit',
          context: { page: 'product-register' }
        }
      });
    }
  };
}
```

### ✅ 헬퍼 함수 직접 사용

```typescript
// ✅ 허용: isUserInitiatedAction 헬퍼 직접 사용
import { ensureUserFeedback, isUserInitiatedAction } from '@itemwiki/lib/utils/error-handling/user-action-detector';

const handleUpload = async () => {
  try {
    await uploadImage();
  } catch (error) {
    await ensureUserFeedback(error, {
      action: 'upload_image',
      trigger: 'button_click',
      context: { page: 'product-register' }
    }, handleFrontendError, '이미지 업로드에 실패했습니다.');
  }
};
```

### ✅ Hook에서 showToUser: false 사용 시 상위에서 처리

```typescript
// ✅ 허용: Hook에서 showToUser: false 사용 (상위에서 처리)
// Hook 내부
export function useData() {
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = async () => {
    try {
      const data = await apiCall();
      setData(data);
    } catch (error) {
      await handleFrontendError(error, {
        showToUser: false, // ✅ 상위에서 처리
      });
      setError(error); // ✅ 에러 상태로 저장
    }
  };
  
  return { data, error, fetchData };
}

// 상위 컴포넌트에서 에러 처리
function MyComponent() {
  const { data, error, fetchData } = useData();
  
  useEffect(() => {
    if (error) {
      toast.showError('데이터를 불러오지 못했습니다.'); // ✅ 상위에서 피드백 제공
    }
  }, [error]);
  
  return <div>...</div>;
}
```

### ✅ 백그라운드 작업: 로깅만 수행

```typescript
// ✅ 허용: 백그라운드 작업은 로깅만 수행
const healthCheck = async () => {
  try {
    await checkHealth();
  } catch (error) {
    await handleFrontendError(error, {
      userActionContext: {
        action: 'health_check',
        trigger: 'background'
      }
      // showToUser는 자동으로 false로 판단됩니다
    });
    // 로그에만 기록
  }
};
```

### ✅ 백그라운드 작업이지만 사용자가 기대하는 경우

```typescript
// ✅ 허용: 백그라운드 작업이지만 사용자가 기대하는 경우 (예: 이미지 업로드 후 OCR)
const processOCR = async () => {
  try {
    await runOCR();
  } catch (error) {
    await handleFrontendError(error, {
      userActionContext: {
        action: 'process_ocr',
        trigger: 'auto_after_user',
        context: { 
          page: 'product-register',
          explicitRequest: true // 사용자가 기대하는 작업
        }
      }
      // showToUser는 자동으로 true로 판단됩니다
    });
  }
};
```

---

## 🛠 도구 및 자동화

### ESLint 규칙

- `no-catch-without-feedback`: catch 블록에서 사용자 피드백 필수
- `require-error-handling`: showToUser: false 사용 시 상위 컴포넌트에서 에러 처리 확인
- `require-user-action-context`: handleFrontendError/handleError 사용 시 userActionContext 제공 권장
- `no-show-to-user-false-without-context`: showToUser: false 사용 시 userActionContext 또는 주석으로 근거 제공

### 자동 스캔 스크립트

```bash
# Silent Failure 탐지 (`--strict` 포함: 사용자 대면 경로 console 전용 catch 등)
pnpm check:silent-failures

# 동일 동작 별칭
pnpm check:silent-failures:strict

# 비 strict만 필요 시 (드묾): tsx scripts/check-silent-failures.ts
```

### 헬퍼 함수

- `isUserInitiatedAction()`: 사용자 기대 작업인지 판단
- `ensureUserFeedback()`: 사용자 피드백 보장
- `getUserActionErrorOptions()`: 에러 처리 옵션 자동 생성
- `handleFrontendError()`: userActionContext 옵션 지원 (자동 판단)
- `useErrorHandler()`: userActionContext 옵션 지원 (자동 판단)

---

## 📊 판단 기준

### 사용자 기대 작업 판단

다음 경우는 **사용자 기대 작업**으로 간주합니다:

1. **명시적 사용자 트리거**
   - `button_click`: 버튼 클릭
   - `form_submit`: 폼 제출
   - `link_click`: 링크 클릭

2. **사용자 액션 후 자동 실행** (일부 경우)
   - `auto_after_user`: 사용자 액션 후 자동 실행
   - 예: 이미지 업로드 후 OCR 자동 실행

3. **명시적으로 지정된 경우**
   - `context.isUserExpected: true`

### 백그라운드 작업 판단

다음 경우는 **백그라운드 작업**으로 간주합니다:

1. **명시적 백그라운드 작업**
   - `background`: 백그라운드 작업
   - `scheduled`: 스케줄된 작업

2. **특정 액션**
   - `health_check`: 헬스체크
   - `cache_warmup`: 캐시 워밍업
   - `analytics_track`: 분석 추적
   - `background_sync`: 백그라운드 동기화
   - `periodic_refresh`: 주기적 갱신

---

## ✅ 완료 기준

1. **사용자 트리거 작업 중 "침묵 실패" 0**
   - 모든 사용자 트리거 작업에서 에러 발생 시 피드백 제공
   - 테스트로 검증 완료
   - `check-silent-failures` 스크립트로 자동 검증

2. **에러는 반드시 사용자 or 시스템 중 한 곳에 전달**
   - 모든 에러가 사용자에게 표시되거나 시스템 로그에 기록
   - `showToUser: false` 사용 시 상위 컴포넌트에서 처리 확인
   - 백그라운드 실패 시: user-initiated → toast 필수, system-only → log 필수

3. **isUserInitiatedAction() 전면 적용**
   - `handleFrontendError`와 `useErrorHandler`에서 `userActionContext` 옵션 지원
   - `showToUser` 자동 판단 기능 활성화
   - ESLint 규칙으로 `userActionContext` 사용 권장

4. **백그라운드 작업 실패 구분**
   - 사용자 기대 작업인 백그라운드 작업은 반드시 피드백 제공
   - 시스템 전용 백그라운드 작업은 로깅만 수행
   - `isUserInitiatedAction()` 헬퍼로 자동 구분

5. **CI 필수화**
   - `check-silent-failures`가 PR 체크에서 필수 검증으로 실행
   - 실패 시 PR 머지 차단

6. **헬퍼 함수 정식화**
   - JSDoc 보강 및 사용 예제 추가
   - 타입 정의 명확화
   - 마이그레이션 가이드 제공

---

## 📚 관련 문서

- [에러 피드백 가이드](../guides/ERROR_FEEDBACK_GUIDE.md)
- [showToUser 사용 기준](../guides/SHOW_TO_USER_CRITERIA.md)
- [UX 버그 기준 평가](../analysis/UX_BUG_CRITERIA_EVALUATION.md)
- [isUserInitiatedAction 마이그레이션 가이드](../guides/IS_USER_INITIATED_ACTION_MIGRATION.md) ✅

---

**최종 업데이트**: 2026-01-14  
**책임자**: Team 5 — Silent Failure & Background UX 팀
