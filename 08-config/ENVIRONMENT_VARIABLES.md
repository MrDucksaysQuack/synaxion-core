# 환경 변수 접근 원칙 (Environment Variables)

**목적**: 환경 변수 접근을 표준화하여 타입 안전성, 런타임 검증, 서버/클라이언트 구분을 보장합니다.  
**Tier**: 1 (필수. 위반 시 보안·일관성 위험. 검증은 ESLint·스캔으로 가능)

---

## 1. 핵심 원칙

### 1.1 process.env 직접 사용 금지

- **금지**: 모든 환경 변수에 `process.env.*`를 직접 사용하는 것.
- **이유**: 타입 안전성 부족, 런타임 검증 누락, 클라이언트 번들에 서버 전용 값이 포함될 위험.
- **필수**: 프로젝트가 정의한 **단일 진입점 함수**를 통해서만 접근.  
  (예: 서버용 `getServerEnvVar()` / `requireServerEnvVar()`, 클라이언트용 `getClientEnvVar()` — 함수명은 프로젝트별.)

### 1.2 서버/클라이언트 구분

- **서버**: 서버 전용 환경 변수는 서버 사이드 전용 함수로만 접근.  
  API 키, DB URL, 내부 서비스 URL 등은 클라이언트에서 접근 금지.
- **클라이언트**: 클라이언트에서 노출해도 되는 변수만 **접두사 규칙**(예: `PUBLIC_*`, `NEXT_PUBLIC_*`)으로 정의하고, 해당 변수만 클라이언트용 접근 함수로 읽기.
- **검증**: 빌드/번들 단계에서 서버 전용 변수가 클라이언트 코드에 포함되지 않도록 검증 권장.

### 1.3 타입·런타임 검증

- 환경 변수는 **타입이 명시**되어야 하고, 필수 변수는 **런타임에 존재 여부 검증** 후 사용.  
  (프로젝트별로 Zod 등 스키마 검증 적용 권장.)
- 누락 시: 앱 부트스트랩 단계에서 명확한 오류 메시지로 실패. 조용히 `undefined`로 동작하지 않도록.

---

## 2. 금지 패턴

- `process.env.XXX` 직접 사용.
- `process.env[키]` / `process.env[variable]` 등 **대괄호 동적 접근** (진입점 우회).
- `process.env.XXX!` (non-null assertion)로 "있을 것이다" 가정.
- 클라이언트 번들에서 서버 전용 변수 참조.

---

## 3. 검증

- **ESLint**: `process.env.<키>` 형태의 직접 멤버 접근 탐지 (`no-restricted-syntax`).
- **스캔** (`scripts/check-env-access.ts`, `pnpm run check:env-access` / `--strict`): `process.env.<키>`와 **`process.env[...]` 동적 접근** 모두 탐지 (주석 줄 제외). 스캔 대상에 `workers/src` 포함, 예외는 `worker-env.ts`만.
- **빌드**: 클라이언트 번들에 서버 전용 env 참조가 포함되지 않도록 설정.

---

## 4. 예외 (Exception)

다음은 원칙 1.1(직접 사용 금지)의 **한정적 예외**로, 사유를 코드/문서에 명시한 경우에만 허용한다.

| 대상 | 허용 범위 | 사유 |
|------|------------|------|
| **core/config/env** (`server.ts`, `client.ts`) | `process.env` 직접 읽기 | 진입점이 검증·매핑을 위해 필요 |
| **워커 진입점** (`workers/src/worker-env.ts`) | `process.env` 직접 읽기 | 백그라운드 워커 전용; 나머지 `workers/src/*`는 이 모듈의 getter만 사용 |
| **Edge Runtime** (예: middleware, Edge API) | `server-only` 미지원 구간에서만 | `getServerEnvVar` 사용 불가 시, 최소 키만 직접 읽고 주석에 "08-config Edge 예외" 명시 |
| **테스트/스크립트** (`tests/**`, `scripts/**`, E2E) | 테스트용 모킹·CI env 읽기 | 앱 번들에 포함되지 않음. 가능하면 진입점 함수 mock 권장 |
| **NODE_ENV 단일 키** | (선택) 프로젝트 정책으로 warn만 적용 | Next/Node가 주입하는 단일 키. 엄격 적용 시 `getServerEnvVar('NODE_ENV')` 등 사용 권장 |

---

## 5. 관련 문서

- [04-safety-standards/UX_SAFETY_RULES.md](../04-safety-standards/UX_SAFETY_RULES.md) — 타임아웃·로딩 안전
- [09-observability/LOGGING_OBSERVABILITY_PRINCIPLES.md](../09-observability/LOGGING_OBSERVABILITY_PRINCIPLES.md) — 로깅 시 환경 구분

---

## 6. 개선 로드맵

- **Phase 1**: ESLint로 `process.env` 직접 사용 탐지(warn/error) → 신규 위반 방지.
- **Phase 2**: 앱/패키지에서 로컬 `getServerEnvVar` 중복 제거 → core/config 진입점만 사용.
- **Phase 3**: 서버/워커/알림 등 `process.env` 직접 사용을 `getServerEnvVar`(또는 worker 전용 진입점)로 교체. Edge 예외는 최소 키만 두고 문서화.
  - **워커(Itemwiki)**: `workers/src/worker-env.ts`를 단일 진입점으로 두고, `workers/src/*` 비즈니스 코드에서 `process.env` 제거 완료. `pnpm run check:env-access:strict`가 `workers/src`를 스캔하며 `worker-env.ts`만 예외.
- **Phase 4**: `NODE_ENV`만 쓰는 파일은 정책에 따라 진입점으로 통일하거나, NODE_ENV 예외로 warn 유지.

---

**최종 업데이트**: 2026-03
