# 관측성 스키마 및 콘솔 페이지 상태 계약

**Tier**: 2 (권장) — 네트워크·관측성 원칙  
**관련**: [network-operations-improvement-plan.md](../../analysis/network-operations-improvement-plan.md), [network-operations-standardization-evaluation.md](../../analysis/network-operations-standardization-evaluation.md)

---

## 0. 네트워크·관측성 원칙 (Tier 2)

- **원칙**: **모든 아웃바운드 호출은 operation ID를 가져야 한다.**
  - 클라이언트·서버의 아웃바운드 API/외부 호출은 `operationId`(예: `products.get`, `contributions.create`)를 부여하여 로깅·메트릭·Retry/Circuit Breaker 정책과 일치시킨다.
  - 구현: `callAPI(..., { operation })`, `callAPIByOperation({ operation, params })`, 또는 레지스트리(`network-operations.ts`, `operation-route-registry.ts`)에 등록된 operation 사용.
- **Tier 2**로 먼저 적용. 실제 운영 가시성 개선 효과를 본 뒤 **Tier 1 승격** 여부를 결정한다.

---

## 1. 관측성 스키마 (Observability Schema)

### 1.1 공통 필드

모든 아웃바운드 요청·응답 로깅 및 메트릭에 다음 필드를 포함할 것을 권장한다.

| 필드 | 설명 | 설정 위치 |
|------|------|-----------|
| **operationId** | 작업 식별자 (`{serviceGroup}.{action}`). 예: `products.get`, `contributions.create` | 요청 헤더 `X-Request-Operation`, 레지스트리: `network-operations.ts` |
| **correlationId** | 요청 추적 ID. 한 요청-응답-하위 호출에서 동일 값 유지 | 요청/응답 헤더 `X-Correlation-ID`, `getOrCreateCorrelationId()` |
| **sessionId** | 세션 식별자 (선택). 로그/타임라인 조회 시 사용 | 응답 헤더 `X-Session-ID`, `getSessionId(request)` |
| **stateVersion** | 클라이언트 상태 버전. 오래된 응답 무시용 | 요청 헤더 `X-State-Version`, 응답 메타 `stateVersion` |

### 1.2 성공 로그 포맷 (권장)

```ts
{
  level: 'info',
  message: 'api_success',
  operationId: string,
  correlationId?: string,
  sessionId?: string,
  durationMs?: number,
  statusCode: number,
}
```

### 1.3 실패 로그 포맷 (권장)

```ts
{
  level: 'warn' | 'error',
  message: 'api_error',
  operationId: string,
  correlationId?: string,
  sessionId?: string,
  durationMs?: number,
  statusCode?: number,
  errorId?: string,  // Error Registry의 errorId
  errorCode?: string,
}
```

### 1.4 성능 메트릭 수집 기준

- **수집**: 모든 API 라우트·클라이언트 fetch에 대해 `operationId`별로 `durationMs`, `statusCode` 기록.
- **집계**: operationId 단위 P50/P95/에러율. Circuit Breaker·Retry 정책과 동일 operationId 사용.

---

## 2. 콘솔 페이지 UI 상태 계약 (Page State)

### 2.1 계약

모든 콘솔 페이지(데이터 로딩이 있는 페이지)는 **동일한 페이지 상태 계약**을 따른다.

- **상태 타입**: `LoadingState = 'idle' | 'loading' | 'ready' | 'error' | 'empty'`
- **계약**: 페이지는 내부적으로 `wrapperState`(또는 동일 의미의 상태)를 계산하고, `PageLoadingWrapper`에 `state={wrapperState}`로 전달한다.

### 2.2 상태 의미

| 상태 | 의미 |
|------|------|
| **idle** | 아직 로딩 시작 전 |
| **loading** | 데이터 요청 중 |
| **ready** | 데이터 로드 완료, 콘텐츠 표시 |
| **error** | 로드 실패 (재시도/에러 메시지 표시) |
| **empty** | 로드 완료했으나 표시할 데이터 없음 (빈 목록 등) |

### 2.3 구현 위치

- **타입**: `components/common/PageLoadingWrapper.tsx` — `LoadingState` export
- **사용**: 각 콘솔 페이지/컨텐츠 컴포넌트에서 `wrapperState` 계산 후 `<PageLoadingWrapper state={wrapperState} ... />` 사용

### 2.4 화면 식별자 `screen` (권장)

- `PageLoadingWrapper`의 **`screen`** prop으로 사용자 뷰 로깅(`logUserView`)에 쓸 식별자를 고정한다.
- 경로 기반 자동 생성 대신 `screen`을 두면 URL 구조가 바뀌어도 대시보드·알림 집계가 안정적이다.
- 예: `products-verify-ocr`, `products-register`, `admin-dashboard`, `contributions-pending`, `home`, `search`, `auth-login`, `profile-public`, `brands-contributions`.

### 2.5 데이터 속성 (선택)

- `data-page-ready="true"`: `wrapperState === 'ready'`일 때 메인 콘텐츠 컨테이너에 설정 권장 (E2E·접근성).

---

**최종 업데이트**: 2026-03 — §2.4 `screen` 권장 정리
