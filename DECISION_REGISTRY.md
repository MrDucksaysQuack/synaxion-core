# Decision Registry (결정 레지스트리)

> **운영 OS 2.0**: 모든 "결정 축"이 한 레지스트리에 등록되고, **미등록 결정 사용 시 check 실패**가 목표다.

**현재 단계**: 스키마와 문서만 정의. 추후 `decision-registry.json`(또는 동등)을 채우고, check 스크립트가 이 레지스트리를 참조해 "등록되지 않은 결정 사용"을 탐지하면 운영 OS 2.0 수준으로 올라간다.

---

## 스키마

- **스키마 파일**: [decision-registry.schema.json](./decision-registry.schema.json)
- **항목**: `id`, `title`, `singleSource`, (선택) `verificationScript`, `layers`

## 레지스트리 데이터 (목표)

| 항목 | 설명 |
|------|------|
| **id** | 결정 축 식별자 (예: `redirect-url`, `auth-path`, `editable-fields`) |
| **title** | 사람이 읽는 설명 |
| **singleSource** | 단일 소스 진입점 (파일/함수명) |
| **verificationScript** | 해당 위반 탐지 check (예: `check:single-source-drift`, `check:permission-drift`) |
| **layers** | 영향 레이어 |

## 레지스트리 데이터

- **위치**: 프로젝트의 Constitution 적용 디렉터리(예: `docs/<project>-constitution/decision-registry.json`). Constitution 본문에는 스키마와 예시만 둠. [decision-registry.example.json](./decision-registry.example.json)
- 프로젝트의 단일 소스 맵과 1:1 대응. 각 결정 축: `id`, `title`, `singleSource`, `verificationScript`(선택), `layers`.

## 코드 사용 강제 (운영 OS 2.0)

- **checkDecision(id)** (프로젝트의 decisions 패키지): 인자 타입이 **DecisionId**이므로, 레지스트리에 없는 id를 넣으면 **컴파일 실패**. 미등록 결정 사용을 타입으로 차단.
- **generate:from-registry**: 프로젝트의 `decision-registry.json`(예: `--registry=docs/<project>-constitution/decision-registry.json`) → 프로젝트의 `registry-generated.ts` 생성. `checkDecision`, `DecisionId`, `DECISION_IDS`, `isRegisteredDecisionId`는 이 생성 파일에 종속.

```ts
import { checkDecision, type DecisionId } from '<프로젝트>/core/decisions';

checkDecision('redirect-url'); // ✅ 등록된 id
checkDecision('invalid-id');   // ❌ 컴파일 에러 (DecisionId에 없음)
```

## 강제화·생성

- **check:decision-registry**: 레지스트리 스키마 검증 후, 등록된 `verificationScript`/`verificationScripts`를 모두 실행. PR에서 `check:constitution-pr`에 포함됨.
- **check:decision-usage**: 레지스트리에 있지만 코드에서 한 번도 참조되지 않는 결정 ID를 **경고**. `--fail-on-unused` 시 미사용이 있으면 exit 1.
- **generate:from-spec --emit-registry-fragment**: 시스템 명세(DSL)의 `decisionIds`로 레지스트리에서 해당 결정만 추려 JSON 조각 출력. `--output-fragment=<path>` 로 파일 저장. 새 프로젝트의 decision-registry.json에 넣을 조각 생성용.

## 체크리스트 5종과 레지스트리 id 매핑

"체크리스트 기준 실제 중복" 5종과 레지스트리 id의 대응 관계. 위 5종은 코드에서 단일 소스만 사용하도록 정리된 상태이며, 신규 코드는 해당 레지스트리 id의 singleSource만 사용할 것.

| # | 결정(목적) | 레지스트리 id | 단일 소스 요약 |
|---|------------|----------------|----------------|
| 1 | 프로필 없음 → 403 | api-permission | checkUnifiedPermission, checkAuthorizationAPI(resource, action), 정책 requireProfile |
| 2 | 콘솔 접근 가능 여부 | console-access | useAuthState().isFullyAuthenticated 또는 state === 'console' |
| 3 | 학습 데이터 필요 trust level | ui-permission / trust-level-reference | policy.ts admin:view_learning_data, getPermissionPolicy / usePermission, permission: { resource, action } |
| 4 | API 호출 허용 여부 | client-session | `useAuthState().hasAuthenticatedSession`; Bearer는 **`useAuthState().accessToken`** (같은 모듈에서 `useAuth`+`useAuthState` 토큰 병용 금지). `useAuthCheck`는 `authFlowState`·`hasAuthenticatedSession`·`accessToken`을 함께 반환하고 `waitForAuth`로 내부 `useAuthState` 한 번만 호출해 동일 컴포넌트 이중 구독을 피함 |
| 5 | 401 인증 필요 시 클라이언트 메시지 | auth-401-message | ERROR_MESSAGES.AUTH.UNAUTHORIZED (error-messages.ts, constitution) |

## Judgment 층과의 관계

- **Decision Registry**: 코드에서 **결정 축**이 어디서 끊기는지(단일 소스).
- **Decision Rules** (`decision-rules.json` / 스키마 [decision-rules.schema.json](./decision-rules.schema.json)): **정규화된 정보(ERIC) 상태 → 판단 outcome** 을 형식화한다. `outcome`·런타임 객체는 [12-judgment-constitution/JUDGMENT_OUTPUT_TYPE.md](./12-judgment-constitution/JUDGMENT_OUTPUT_TYPE.md), [judgment-output.schema.json](./judgment-output.schema.json)과 동일해야 한다. 상세는 [12-judgment-constitution/DECISION_RULES.md](./12-judgment-constitution/DECISION_RULES.md).

### Synaxion 휴먼 루프 (G5)

| 결정 id | 단일 소스 요약 |
|---------|----------------|
| `synaxion-operator-followup` | [docs/flow/SYNAXION_HUMAN_LOOP_WORKFLOW.md](../flow/SYNAXION_HUMAN_LOOP_WORKFLOW.md), GitHub 이슈 템플릿 `synaxion-rule-change-proposal`, `PATCH .../synaxion-judgments/[id]` |

## 다음 단계

1. ~~SINGLE_SOURCE_MAP.md의 행을 기반으로 `decision-registry.json` 생성~~ → 완료.
2. check 스크립트 확장: "코드에서 사용된 결정"을 파싱해 레지스트리에 없으면 실패 (선택).
3. 새 결정 추가 시: 레지스트리에 행 추가 + SINGLE_SOURCE_MAP.md 동기화 + 해당 check 규칙 갱신. [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) 참고.

**관련**: [SINGLE_SOURCE_MAP.md](./SINGLE_SOURCE_MAP.md), [META_CONSTITUTION.md](./META_CONSTITUTION.md)

**최종 업데이트**: 2026-03-28 — client-session 행: accessToken·useAuthCheck(`authFlowState`·`waitForAuth`) 정렬
