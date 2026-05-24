# Form UX Patterns

> **레벨**: Recommended  
> **핵심 원칙**: Form UX quality is measured by recovery, not only completion.

---

## 1. Purpose — 이 패턴이 해결하는 문제

폼 UX를 "제출 버튼까지 안내"로만 설계하면:
- 사용자가 입력 중 이탈 후 돌아올 방법이 없다
- 에러 발생 시 어디가 잘못됐는지 알기 어렵다
- 긴 폼에서 어디까지 진행했는지 알 수 없다
- 제출 후 무슨 일이 일어났는지 알 수 없다

올바른 폼 UX는 **완료를 유도하는 것이 아니라, 언제든 회복 가능하게 만드는 것**이다.  
회복이란: 이탈 후 재진입, 에러 수정, 이전 단계로 돌아가기, 제출 실패 후 재시도 모두를 포함한다.

---

## 2. When to Use

- 사용자 정보 입력 폼 (가입, 신청, 문의)
- 다단계 wizard / step 폼
- 파일 업로드가 포함된 폼
- 제출 후 확인이 필요한 중요한 폼
- 작성 중 이탈 가능성이 높은 긴 폼

---

## 3. When Not to Use

- 단일 필드 (이메일 뉴스레터 구독, 검색 필드 등)
- 즉각 반영이 목적인 설정 토글 (debounce auto-save가 적합)
- 폼이 아닌 일반 인터랙션

---

## 4. Required Inputs

| 항목 | 설명 |
|------|------|
| 필드 유효성 상태 | 각 필드의 touched/error/valid 상태 관리 |
| 제출 상태 | idle / submitting / success / error 4가지 상태 |
| 에러 메시지 | 각 필드별 + 전체 폼 수준 에러 구분 |
| Draft 저장 전략 | localStorage 또는 서버 기반 초안 저장 |
| aria 연결 | `aria-describedby`로 필드와 에러 메시지 연결 |

---

## 5. Pattern Rules

**[R-1] 유효성 검사는 submit-first, then on-blur, not on-keystroke**  
사용자가 아직 입력 중인 필드에 에러를 보여주면 방해가 된다.  
- 처음 제출 시도 후: 모든 필드 즉시 검사
- 제출 시도 후에는: blur(focus 이탈) 시 해당 필드 재검사
- 입력 중(onChange): 에러가 이미 표시된 필드는 실시간 재검사 허용

**[R-2] 에러는 필드 바로 아래에 표시한다**  
페이지 상단의 요약 에러 + 각 필드 아래 개별 에러를 함께 제공한다.  
각 필드 에러는 `aria-describedby`로 입력 요소와 연결한다.

**[R-3] 제출 버튼은 상태를 표시해야 한다**  
`idle`: 기본 라벨 (예: "신청하기")  
`submitting`: 스피너 + "처리 중..." (버튼 비활성화)  
`success`: 성공 표시 (또는 다음 단계로 이동)  
`error`: "다시 시도" (버튼 재활성화, 에러 메시지 표시)

**[R-4] 부분 완료를 저장해야 한다 (Draft)**  
긴 폼에서 이탈 후 재진입 시 이전 입력이 복원되어야 한다.  
Draft 저장 실패는 사용자에게 알려야 한다 (silent failure 금지).  
Draft 식별자는 사용자 ID 또는 세션 기반이어야 한다.

**[R-5] Wizard (다단계 폼)의 각 Step은 독립적으로 저장된다**  
"다음" 버튼을 누를 때마다 현재 step 데이터가 저장된다.  
"이전" 버튼은 데이터 손실 없이 이전 step으로 돌아간다.

**[R-6] 필수 필드와 선택 필드를 명확히 구분한다**  
"* 필수" 표시 또는 "(선택)" 표시 중 하나를 일관되게 사용한다.  
두 가지 표시 방식을 혼용하면 안 된다.

**[R-7] 파일 업로드 후 삭제/교체 기능은 필수다**  
업로드 후 취소하거나 다른 파일로 교체할 수 없으면 실수를 회복할 수 없다.

---

## 6. Single-Step vs Wizard 기준

| 기준 | Single-step 폼 | Wizard (다단계 폼) |
|------|---------------|-----------------|
| 필드 수 | ~6개 이하 | 7개 이상 |
| 정보 카테고리 | 단일 카테고리 | 2개 이상 카테고리 |
| 조건부 필드 | 없거나 1–2개 | 3개 이상 (카테고리별 다른 필드) |
| 예상 입력 시간 | 2분 이하 | 3분 이상 |
| 파일 업로드 | 없거나 1개 | 2개 이상 |

Wizard로 만든다고 UX가 좋아지는 게 아니다.  
Wizard가 적합한 것은 "정보가 많아서"가 아니라 "정보가 단계적으로 연관되어 있어서"다.

---

## 7. Anti-patterns

**❌ Submit 전에 에러를 즉시 표시**  
입력을 시작하자마자 "이메일 형식이 잘못됨" 에러 — 사용자는 아직 입력 중이다.

**❌ "오류가 발생했습니다" 단독 에러 메시지**  
어떤 필드의 어떤 오류인지 알 수 없는 전체 에러 메시지는 회복을 불가능하게 만든다.

**❌ 제출 버튼을 무한 disabled로 만들기**  
"필수 필드가 비어있으면 버튼 비활성화" — 사용자가 무엇이 비어있는지 알 수 없다.  
버튼은 항상 클릭 가능하게 하고, 클릭 시 에러를 표시한다.

**❌ Draft 저장 실패를 무시 (Silent failure)**  
`catch { return; }` — 사용자는 데이터가 저장됐다고 생각하지만 실제로는 유실됐다.  
저장 실패 시 사용자에게 알려야 한다.

**❌ Wizard에서 이전 단계 데이터 초기화**  
"이전" 버튼을 누르면 현재 단계 데이터가 사라짐 — 사용자는 다시 입력해야 한다.

**❌ 모바일에서 키보드가 필드를 가림**  
입력 필드에 포커스될 때 해당 필드가 소프트 키보드 위에 위치하도록 `scrollIntoView` 처리.

---

## 8. Accessibility / Performance Notes

**접근성**
- 에러 메시지는 `role="alert"` 또는 `aria-live="polite"`로 스크린 리더에 알린다.
- 각 에러 메시지는 `id`를 가지고 해당 필드에 `aria-describedby`로 연결된다.
- 필수 필드는 `aria-required="true"` 또는 `required` attribute 사용.
- 에러가 있는 필드는 `aria-invalid="true"`.
- Wizard에서 현재 step 표시는 `aria-current="step"` 또는 step progress에 `aria-label` 사용.

**성능**
- 실시간 유효성 검사(onChange)는 debounce 처리 — 입력마다 서버 호출 금지.
- Draft 자동 저장은 debounce + 최소 변경량 조건으로 과도한 API 호출 방지.
- 파일 업로드는 클라이언트 사이드 크기/타입 검증을 먼저 하고 서버 전송.

---

## 9. Implementation Sketch

```tsx
// 폼 상태 관리 — 핵심 구조

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FieldState {
  value: string;
  touched: boolean;  // focus를 한 번이라도 벗어났는가
  error: string | null;
}

// 유효성 검사 타이밍
const handleBlur = (fieldName: string) => {
  // 제출을 한 번이라도 시도했거나 이미 touched된 필드만 검사
  if (submitted || fields[fieldName].touched) {
    validateField(fieldName);
  }
  setTouched(fieldName);
};

const handleChange = (fieldName: string, value: string) => {
  // 에러가 이미 표시된 필드는 실시간으로 재검사
  if (fields[fieldName].error) {
    validateField(fieldName, value);
  }
  setValue(fieldName, value);
};

// 제출 버튼 상태
const SubmitButton = ({ status }: { status: FormStatus }) => (
  <button
    type="submit"
    disabled={status === 'submitting'}
    aria-busy={status === 'submitting'}
  >
    {status === 'idle' && '신청하기'}
    {status === 'submitting' && <><Spinner /> 처리 중...</>}
    {status === 'error' && '다시 시도'}
  </button>
);

// 에러 메시지 — 접근성 연결
const FieldError = ({ id, message }: { id: string; message: string }) => (
  <p
    id={`${id}-error`}
    role="alert"
    className="text-error text-sm mt-1"
  >
    {message}
  </p>
);

const Field = ({ id, label, error, ...inputProps }) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={error ? 'true' : undefined}
      {...inputProps}
    />
    {error && <FieldError id={id} message={error} />}
  </div>
);

// Draft 저장 — 실패 시 사용자 알림
const saveDraft = async (data: Partial<FormData>) => {
  try {
    const result = await saveDraftToStorage(data);
    if (!result.ok) {
      // Silent failure 금지 — 사용자에게 알림
      showToast('입력 내용을 임시 저장하지 못했습니다. 계속 입력하시면 제출 시 저장됩니다.', 'warning');
    }
  } catch (err) {
    console.error('[saveDraft] failed:', err);
    showToast('임시 저장 실패. 인터넷 연결을 확인해주세요.', 'error');
  }
};
```

---

## 10. Checkability

| 항목 | 방법 | 종류 |
|------|------|------|
| `aria-describedby`로 에러 연결 | `check:accessibility` (lint) | Hard check |
| `aria-required`, `aria-invalid` 사용 | lint / grep | Hard check |
| Draft silent failure 없음 | grep `catch.*return` in form actions | Hard check |
| Submit 버튼 상태 (submitting 시 비활성화) | 코드 리뷰 | Soft review |
| 에러 메시지 구체성 ("오류 발생" 단독 사용 없음) | 코드 리뷰 | Soft review |
| 파일 업로드 후 삭제/교체 기능 존재 | QA | Human judgment |
| Wizard 이전 단계 이동 시 데이터 유지 | QA | Human judgment |

---

## 11. Source Reference

| 프로젝트 | 파일 | 추출 패턴 |
|---------|------|---------|
| truefarm-website | `src/app/actions/submitForm.ts` | 7단계 submit, 상태 반환 구조 |
| truefarm-website | `src/app/actions/saveJoinDraft.ts` | Draft 저장 (GAP-A-2 수정 후) |
| truefarm-website | `src/components/forms/join/JoinQuestionEngine.tsx` | Wizard step 관리, 부분 저장 |
| truefarm-website | `src/components/forms/join/QuestionField.tsx` | 파일 업로드 + 에러 상태 |
| truefarm-website | `src/components/forms/ContactForm.tsx` | Single-step 폼 구조 |
| synaxion-core | `04-safety-standards/SILENT_FAILURE_PREVENTION.md` | silent failure 방지 원칙 |

**추출 일시**: 2026-05-25  
**버전**: 1.0.0
