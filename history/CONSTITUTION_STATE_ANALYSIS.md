# Constitution 현재 상태 분석

> **목적**: Constitution이 “구조 생성 + 검증 강제 + 거버넌스 + 자동화”를 포함한 **운영 OS**로 어디까지 완성되었는지, 무엇이 남았는지 정확히 정리한다.

**기준일**: 2026-03-21 (G5 병렬 평가 반영)  
**평가**: 전체 **9/10** 수준. 일반 SaaS 팀이 3~4년에 걸쳐 만드는 수준의 운영 OS가 문서·스크립트·타입·파이프라인까지 갖춰진 상태다.

---

## 1. 항목별 상태 (사용자 평가와 매핑)

| 항목 | 상태 | 설명 |
|------|------|------|
| **Registry 기반 검증 연결** | ✅ 완비 | `decision-registry.json`(itemwiki-constitution) → 스키마 검증 + `verificationScript`/`verificationScripts`를 `check:decision-registry`가 실행. PR에서 `check:constitution-pr`에 포함. |
| **PR 강제화** | ✅ 완비 | `.github/workflows/constitution-check-pr.yml`이 `check:constitution-pr` 실행. Branch protection으로 머지 차단 가능. |
| **버전 거버넌스** | ✅ 완비 | `VERSION` 단일 소스, README·package.json `constitutionVersion`과 일치 검사 (`check:constitution-version`). `--project-root` 지원. |
| **마이그레이션 절차** | ✅ 완비 | MIGRATION_GUIDE.md, 레지스트리 수정 절차, check 스크립트 순서 문서화. |
| **코드 생성 연결** | ✅ 완비 | `generate:from-registry`(레지스트리→registry-generated.ts), `scaffold:system`(프로파일→골격), `generate:from-spec`(DSL→검증·생성·레지스트리 조각). |
| **코드 사용 강제** | 🔶 부분 | **타입/구조는 완비.** `checkDecision(id: DecisionId)` — 미등록 id는 **컴파일 실패**. `registry-generated.ts`는 레지스트리에서 생성. **도입(adoption)은 확대됨:** Core(`policy`, `error-messages`, judgment persist), `packages/web`(예: `useAuthState`, `error-ux-mapper`), `packages/lib/utils/profile`, 스크립트 `check-api-catch-logging` 등에서 호출. 다수 결정 축은 여전히 문자열·관례만으로 연결. |
| **미사용/미등록 탐지** | ✅ PR 기본 | **스크립트 완비.** `check:decision-usage --fail-on-unused`가 **`check:constitution-pr`에 포함**되어 미사용 결정 ID가 있으면 PR 실패. `check:decision-call-registry`로 `checkDecision('…')` 문자열과 레지스트리 역방향 정합. |
| **Judgment 층(판단 규칙 JSON)** | ✅ 문서·검증 | `JUDGMENT_OUTPUT_TYPE.md`, `judgment-output.schema.json`, `12-judgment-constitution/`, 코어 예시 + **Itemwiki** `docs/itemwiki-constitution/decision-rules.json`, `check:decision-rules`·`check:decision-rules:itemwiki`. `check:constitution-pr`에 코어 `check:decision-rules` 포함. **2.5.0**에서 `outcome` enum 변경(마이그레이션은 DECISION_RULES.md). |

---

## 2. 코드 사용 강제 — 현재 구현

### 2.1 타입·생성 (완비)

- **위치**: `packages/lib/core/decisions/`
  - `registry-generated.ts`: `DECISION_IDS`, `DecisionId`, `isRegisteredDecisionId` — **레지스트리에서 생성** (`generate:from-registry`).
  - `check-decision.ts`: `checkDecision(id: DecisionId)`, `assertRegisteredDecisionId(id: string)`.
  - `index.ts`: 위를 re-export.
- **동작**:
  - `checkDecision('redirect-url')` → ✅ (DecisionId에 있으면 컴파일 통과).
  - `checkDecision('invalid-id')` → ❌ **컴파일 에러** (DecisionId에 없음).
- **결론**: “레지스트리에 없으면 컴파일 실패”는 **이미 구현됨.** 진짜 완성 단계에서 요구한 “decision-ids에서 생성된 타입만 허용”을 만족한다.

### 2.2 도입(adoption) — 부분(진행 중)

- **실제 사용처(예)**: `@itemwiki/lib/core/decisions`의 `checkDecision`을 import하는 코드가 **Core·web·스크립트**에 존재한다 — `policy.ts`, `error-messages.ts`, `persist-product-label-decision.ts`, `useAuthState.ts`, `error-ux-mapper.ts`, `profile-display.ts`, `scripts/check-api-catch-logging.ts` 등.
- **아직 약한 축**: `redirect-url`·`auth-path-constants` 등 다수 결정은 레지스트리·`check:decision-usage`(문자열 참조)와 단일 소스 스크립트로 봉인되어 있고, **런타임 `checkDecision` 호출은 모든 축에 깔려 있지 않음**.
- **의미**: “미등록 id = 컴파일 실패”는 유효하며, 중요 경로에 `checkDecision`을 더 붙이면 운영 OS와 코드의 결합이 강해진다.

---

## 3. 미사용/미등록 탐지 — 현재 구현

### 3.1 스크립트 (완비)

- **스크립트**: `docs/constitution/scripts/check-decision-usage.ts`
  - 레지스트리에서 결정 ID 목록 로드.
  - `packages`, `app`, `components`, `scripts`, `tests` 아래 `.ts`/`.tsx`에서 **문자열로 id가 등장하면** “사용됨”으로 집계.
  - 미사용 ID 목록 출력, `--fail-on-unused` 시 미사용이 있으면 exit 1.
  - `--registry=`, `CONSTITUTION_REGISTRY_PATH` 지원. (버그 수정: `loadRegistry(registryPath)` 인자 전달.)
- **실행**: `pnpm run check:decision-usage` — 레지스트리의 각 결정 id가 소스 트리에 문자열로 등장하는지 집계. **`--fail-on-unused`는 PR 프리셋에서 사용.**

### 3.2 PR/CI 연동 (포함)

- `check:constitution-pr`는 `check:constitution-version`부터 `verify:api-7-stages`까지 **긴 체인**이며, 그 안에 **`check:decision-registry`**, **`check:decision-usage -- --fail-on-unused`**, **`check:decision-call-registry`**, **`check:judgment-contracts`** 등이 포함된다. 전체 목록은 [VERIFICATION_SCRIPTS.md](../06-automation/VERIFICATION_SCRIPTS.md) 및 [ITEMWIKI_IDP_AUTOMATION_MATRIX.md](../../itemwiki-constitution/ITEMWIKI_IDP_AUTOMATION_MATRIX.md) §6.
- 따라서 “레지스트리에만 있고 코드/문서 문자열에 없는 결정 ID”는 **PR에서 실패**한다(정책상 엄격 모드).

---

## 4. 전체 운영 OS 완성도

### 4.1 체크리스트

| 영역 | 세부 | 완료 여부 |
|------|------|-----------|
| **구조 생성** | 레지스트리→registry-generated.ts | ✅ |
| | 프로파일별 골격(scaffold-system) | ✅ |
| | DSL→검증·생성·레지스트리 조각 | ✅ |
| **검증 강제** | check:constitution-version | ✅ |
| | check:layer-boundaries, check:silent-failures | ✅ |
| | check:decision-registry (스키마+verificationScript 실행) | ✅ |
| | check:decision-rules (코어 decision-rules.example.json) | ✅ |
| | check:constitution, check:single-source-drift | ✅ |
| **거버넌스** | META_CONSTITUTION (Tier·변경·충돌) | ✅ |
| | SINGLE_SOURCE_MAP, DECISION_REGISTRY 문서 | ✅ |
| | 버전 락 (VERSION, constitutionVersion) | ✅ |
| **자동화** | PR 워크플로 (check:constitution-pr) | ✅ |
| | 검증 후 배포 트리거 문서 | ✅ |
| **코드 사용 강제** | checkDecision(id: DecisionId) — 미등록 시 컴파일 실패 | ✅ |
| | registry-generated.ts = 레지스트리에서 생성 | ✅ |
| | 비즈니스 코드 전반에서 checkDecision 도입 | 🔶 부분 |
| **미사용/미등록 탐지** | check:decision-usage 스크립트 | ✅ |
| | PR에 미사용 실패 포함 (`--fail-on-unused`) | ✅ (`check:constitution-pr`) |

### 4.2 점수 해석

- **9/10**은 과장이 아니다.
  - Registry 기반 검증, PR 강제, 버전 거버넌스, 마이그레이션 절차, 코드 생성 연결까지 **완비**.
  - **코드 사용 강제**: “미등록 id = 컴파일 실패”까지 구현됨. 부족한 것은 “코드베이스 전반에서 checkDecision을 실제로 호출하는가”라는 **도입률**이다.
  - **미사용 탐지**: 스크립트 완비 + **PR에서 `--fail-on-unused` 활성**.
- **10/10**에 가까워지려면:
  1. (선택) 더 많은 단일 소스 진입점 직전에 `checkDecision(id)` 호출을 추가해 레지스트리와 런타임을 맞춘다.
  2. (유지) 레지스트리·문서·IDP 매핑을 결정 추가 시 함께 갱신한다.

---

## 5. 요약: “진짜 OS” 기준 충족 여부

- **checkDecision(id)** — decision-ids에서 생성된 타입만 허용, 레지스트리에 없으면 컴파일 실패  
  → **✅ 구현됨.**
- **선택적으로 check 스크립트에서 사용 추적**  
  → **✅ 구현됨.** `check:decision-usage`가 “문자열로 id 등장” 기준으로 사용 추적.
- **레지스트리에 있지만 코드에서 한 번도 사용되지 않는 decision 경고**  
  → **✅ 구현됨.** `check:decision-usage`가 미사용 목록 출력, `--fail-on-unused` 시 실패.

정리하면, **“이게 진짜 OS다”라고 말할 수 있는 요구사항은 이미 구현된 상태**다. 남은 것은 (1) 비즈니스 코드에서 checkDecision 도입을 늘리는 것, (2) PR에서 미사용 실패를 켜는지 여부라는 **정책 선택**이다.

**관련**: [DECISION_REGISTRY.md](../DECISION_REGISTRY.md), [06-automation/VERIFICATION_SCRIPTS.md](../06-automation/VERIFICATION_SCRIPTS.md), [EVOLUTION_STRATEGY.md](../EVOLUTION_STRATEGY.md)
