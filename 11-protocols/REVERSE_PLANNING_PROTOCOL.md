# Reverse Planning Protocol

> **Synaxion Constitution 11장 — 보편 프로토콜**  
> 계획 없이 만들어진 기존 프로젝트 또는 미완성 프로젝트를  
> Synaxion 계획 구조로 역변환하는 표준 절차를 정의한다.

---

## §0 역할과 범위

### 이 프로토콜이 다루는 것

```
기존 프로젝트 (레거시 또는 미완성)
  → AI 역분석
  → docs/planning/extraction/ 채움 (O/I/U)
  → docs/planning/ 복원 (00/01/02)
  → Synaxion Planning Baseline 선언
  → 정상 개발 재개
```

출력 디렉토리: `docs/planning/extraction/` (역방향 전용)  
최종 산출물: `docs/planning/` (정방향과 동일한 구조)  
템플릿: `synaxion-core/harness/reverse-planning/`  
구조 표준: `synaxion-core/00-planning/PLANNING_DIRECTORY_STANDARD.md` §1b

### 이 프로토콜이 다루지 않는 것

- 새 프로젝트의 계획 (→ [00-planning/FORWARD_PLANNING_PROTOCOL.md](../00-planning/FORWARD_PLANNING_PROTOCOL.md), [PLANNING_DIRECTORY_STANDARD.md](../00-planning/PLANNING_DIRECTORY_STANDARD.md))
- 코드 품질 개선 (→ 02-development-framework)
- API 재설계 (→ 03-api-standards)

### 핵심 명제

> **Code can reconstruct system shape.  
> Code cannot fully reconstruct product intent.**

코드는 시스템의 형태를 복원할 수 있지만, 제품의 의도 전체를 복원하지는 못한다.

그러므로 복원의 완성도는 "AI가 다 읽었다"가 아니라:

```
모든 주장에 근거가 있고, 모르는 것은 Unknown으로 분리되었는가
```

로 판단해야 한다.

---

## §1 O/I/U 분류 원칙

모든 복원 문서의 모든 주장은 아래 세 라벨 중 하나로 분류해야 한다.

| 라벨 | 의미 | 처리 방식 |
|------|------|---------|
| **Observed** | 코드·config·schema·test에 실제로 존재 | Evidence Pointer 필수 |
| **Inferred** | 코드 구조상 강하게 추론 가능 | 추론 근거 명시 필수 |
| **Unknown** | 코드에 표현되지 않은 의도·판단·맥락 | Unknown Register에 기록 |

### 라벨 적용 규칙

```
Observed 예시:
  orders 테이블이 존재한다. [Evidence: db/migrations/create_orders.sql]

Inferred 예시:
  주문 플로우가 있었던 것으로 보인다.
  [근거: /orders route + orders table + checkout UI 동시 존재]

Unknown 예시:
  결제 실패 시 재시도 정책: Unknown
  MVP 범위에서 refund가 포함되었는지: Unknown
```

### 금지 사항

```
Evidence Pointer 없이 Observed로 표기 → 금지
Unknown을 그럴듯한 문장으로 채우기 → 금지
Inferred를 Observed처럼 표기 → 금지
```

### 기반 원칙

이 분류 체계는 아래 기존 Synaxion 원칙을 역분석 맥락에 적용한 것이다.

- `01-foundations/CONSISTENCY_AS_SYSTEM_CONSTRAINT.md` — 일관성은 시스템 제약
- `01-foundations/IMPLICIT_DISTRIBUTED_INFORMATION_FLOW.md` — 암시적 분산 흐름 관측

---

## §2 복원 가능한 정보 vs 복원 불가 정보

### 코드에서 복원 가능한 정보 (Observed 또는 Inferred)

```
라우트 구조 / API endpoint / DB table·column·relation
role·permission 흔적 / UI component 구조 / 상태값 / form field
validation 로직 / env variable / 외부 서비스 연결
test coverage / 배포 설정 / dependency / 에러 처리 패턴
```

### 코드만으로 복원되지 않는 정보 (Unknown)

```
왜 이 기능을 만들었는가
어떤 사용자 문제를 해결하려 했는가
원래 MVP 범위가 어디까지였는가
어떤 기능이 임시 구현인지
어떤 기능이 폐기 예정인지
왜 특정 UX를 선택했는지
코드에 빠진 비즈니스 규칙
실제 운영에서 발생한 문제
```

---

## §3 8단계 Reverse Planning Protocol

### Step → 출력 파일 매핑

| Step | 출력 위치 |
|------|-----------|
| Step 1 — Source Inventory | `planning/extraction/SOURCE_INVENTORY.md` |
| Step 2 — Surface Mapping | `planning/extraction/EVIDENCE_MAP.md` (초안) |
| Step 3 — Domain Reconstruction | `planning/extraction/EVIDENCE_MAP.md` (보완) |
| Step 4 — Contract Reconstruction | `planning/02-architecture-map.md` |
| Step 5 — Evidence Linking | `planning/extraction/EVIDENCE_MAP.md` (완성) |
| Step 6 — Gap & Conflict Detection | `planning/extraction/CONFLICT_GAP_REGISTER.md` |
| Step 7 — Completion Baseline | `planning/extraction/RECONSTRUCTION_LOG.md` |
| Step 8 — Recovery Plan | `planning/00-product-intent.md` + `docs/tasks/` |

### Step 1 — Source Inventory

프로젝트의 모든 artifact를 목록화한다.

```
스캔 대상:
  package.json / tsconfig / next.config / vite.config
  src/app 또는 pages (UI routes)
  api routes
  components, lib, services
  db migrations, schema files
  supabase config, RLS policies
  tests / scripts
  env.example
  CI workflow / deployment config
  README / docs / ADR
```

**산출물**: `planning/extraction/SOURCE_INVENTORY.md` (harness 템플릿 사용)

**완성 기준**: 모든 source type이 최소 1회 스캔됨. 접근 불가 파일은 별도 기록.

### Step 2 — Surface Mapping

Step 1에서 목록화한 파일들에서 시스템의 "표면"을 추출한다.

```
추출 대상:
  - UI routes (페이지 목록)
  - API routes (endpoint 목록)
  - DB tables (테이블 목록)
  - env vars (환경변수 목록)
  - external services (외부 서비스 목록)
  - user roles (역할 목록)
```

모든 항목은 Observed / Inferred / Unknown으로 분류한다.

### Step 3 — Domain Reconstruction

Step 2의 surface에서 도메인 구조를 복원한다.

```
복원 대상:
  - Entity 목록과 관계
  - User Type / Role
  - State Transition (핵심 엔티티의 상태 변화)
  - Permission Model (누가 무엇을 할 수 있는가)
  - Business Rule 후보
```

**참조**: `01-foundations/STATE_TRANSITION_CONTRACT.md`

### Step 4 — Contract Reconstruction

Step 3의 도메인 구조에서 Synaxion 계약 문서를 복원한다.

```
복원 계약 목록:
  - Product Intent (제품 의도)
  - User Type Contract
  - Domain Entity Contract
  - DB Schema Contract
  - Permission Model Contract
  - API Contract
  - State Transition Contract
  - Error Contract
  - UI State Contract
  - Env Contract
  - Deployment Contract
  - Observability Contract
```

각 계약은 Observed / Inferred / Unknown 섹션으로 나뉘어 작성된다.

**참조**: `03-api-standards/`, `01-foundations/STATE_TRANSITION_CONTRACT.md`

### Step 5 — Evidence Linking

Step 4에서 작성된 모든 Observed 주장에 Evidence Pointer를 연결한다.

```
형식:
  Claim: [주장 내용]
  Evidence: [파일 경로] / [코드 위치 또는 라인]
```

**규칙**:
- Evidence가 없는 내용은 Observed에서 Inferred 또는 Unknown으로 강등한다
- Evidence Map 문서에 중앙 집중 기록한다

**참조**: `01-foundations/CONSISTENCY_AS_SYSTEM_CONSTRAINT.md`

### Step 6 — Gap & Conflict Detection

코드·문서·테스트·DB 간 충돌과 누락을 목록화한다.

```
충돌 유형 예시:
  - 문서의 role명 ≠ DB의 role명
  - API가 기록하는 필드 ≠ 다른 서비스가 읽는 필드
  - UI의 상태값 ≠ DB enum 값
  - 테스트의 mock 응답 ≠ 실제 API 응답 구조
  - env.example ≠ 실제 사용 env var

누락 유형 예시:
  - UI에 있는 기능의 API 없음
  - DB table에 대한 RLS 없음
  - 외부 서비스 호출에 타임아웃 없음 (→ 04-safety-standards/SILENT_FAILURE_PREVENTION.md)
  - 에러 처리 없는 async 함수
```

**산출물**: `planning/extraction/CONFLICT_GAP_REGISTER.md` (harness 템플릿 사용)

### Step 7 — Completion Baseline

RECONSTRUCTION_SCORECARD.md의 기준에 따라 현재 복원 완성도를 평가한다.

```
평가 항목:
  1. Source Coverage Score (0–5)
  2. Contract Coverage Score (0–5)
  3. Evidence Traceability Score (0–5)
  4. Unknown Accounting Score (0–5)
  5. Conflict Detection Score (0–5)

Reconstruction Readiness = 총점 / 25
```

목표: 총점 15점 이상 (각 항목 평균 3점 이상) → 복원 초안으로 사용 가능

### Step 8 — Recovery Plan

Step 6의 Gap & Conflict와 Step 7의 점수를 바탕으로 개발 재개 계획을 작성한다.

```
Recovery Plan 포함 항목:
  - 삭제할 코드 / 기능 목록 (이유 포함)
  - 보존할 코드 / 기능 목록 (이유 포함)
  - 수정이 필요한 계약 목록 (우선순위 포함)
  - 재작성이 필요한 영역 목록
  - Unknown 해소를 위한 질문 목록 (사람에게 확인 필요)
  - check:* 후보 목록
  - 다음 Sprint / 마일스톤 제안
```

---

## §4 Synaxion Reconstruction Complete 선언 조건

아래 10개 조건을 모두 만족하면 `Synaxion Reconstruction Complete`로 선언한다.

```
1. Source Inventory가 완성되었다 (모든 source type 최소 1회 스캔)
2. 모든 UI routes, API routes, DB tables, roles, env vars, external services가 매핑되었다
3. 모든 복원 가능한 Synaxion 계약 문서가 작성되었다 (미작성은 Unknown으로 명시)
4. 모든 Observed 주장에 Evidence Pointer가 연결되어 있다
5. Evidence 없는 내용은 Inferred 또는 Unknown으로 분류되어 있다
6. Code-Doc-Test-DB Conflict가 별도 목록으로 작성되었다
7. 코드에 표현되지 않은 Unknown 항목이 질문 목록으로 정리되었다
8. Recovery Plan이 존재한다 (삭제/보존/수정/재작성/질문 목록)
9. check:* 후보 목록이 식별되었다
10. 이 프로젝트는 이제 정상 Synaxion Planning 규칙 하에 개발을 재개할 수 있다
```

이 선언은 "모든 정보를 추출했다"는 의미가 아니다.

> **현재 접근 가능한 artifact로부터 복원 가능한 정보는 모두 추출했다.**

이것이 정확한 의미다.

---

## §5 AI 복원 작업 지시 프롬프트

AI에게 역분석을 지시할 때 아래 프롬프트 구조를 사용한다.

```
You are reconstructing this unfinished project into a Synaxion planning directory.

Rules:
1. Do not invent product intent. If intent cannot be observed or strongly inferred, mark it Unknown.
2. Every claim must be marked as Observed, Inferred, or Unknown.
3. Every Observed claim must include evidence file paths and code locations.
4. If code and docs conflict, record the conflict in the Conflict Register.
5. If a required Synaxion planning document cannot be filled, create an Unknown entry — do not fill it with plausible-sounding content.
6. Produce: Source Inventory, Evidence Map, Unknown Register, Conflict & Gap Register, Recovery Plan.
7. Do not declare reconstruction complete until all source surfaces have been scanned.
8. Score your reconstruction using the RECONSTRUCTION_SCORECARD criteria.
```

---

## §6 기존 Synaxion 원칙과의 연결

| 이 프로토콜 조항 | 기반 Synaxion 원칙 |
|----------------|------------------|
| O/I/U 분류 원칙 | `01-foundations/CONSISTENCY_AS_SYSTEM_CONSTRAINT.md` |
| Evidence Linking | `01-foundations/IMPLICIT_DISTRIBUTED_INFORMATION_FLOW.md` |
| Contract Reconstruction | `01-foundations/STATE_TRANSITION_CONTRACT.md` |
| Gap Detection — 침묵 실패 누락 | `04-safety-standards/SILENT_FAILURE_PREVENTION.md` |
| API Contract 복원 | `03-api-standards/7_STAGE_LOGIC_CONSTRUCTION.md` |
| check:* 후보 식별 | `06-automation/VERIFICATION_SCRIPTS.md` |
| Completion Baseline | `11-protocols/RECONSTRUCTION_SCORECARD.md` |
| 정방향 계획 (복원 후·신규) | `00-planning/FORWARD_PLANNING_PROTOCOL.md` |

---

**버전**: 1.0.0  
**최종 업데이트**: 2026-05-24 — 초기 제정  
**소속**: Synaxion Constitution 11장 (11-protocols)
