# Forward Planning Protocol

> **Synaxion Constitution 00장 — 보편 프로토콜**  
> 새 프로젝트 또는 새 기능을 시작할 때  
> Synaxion 계획 구조를 **정방향**으로 채우는 표준 절차를 정의한다.

---

## §0 역할과 범위

### 이 프로토콜이 다루는 것

```
의도·범위·계약 (문서)
  → Synaxion Planning Baseline 확립
  → EXECUTION_CONSTITUTION / check:* 하에 구현·검증·배포
```

### 이 프로토콜이 다루지 않는 것

- 기존 코드에서 계획 복원 (→ [REVERSE_PLANNING_PROTOCOL](../11-protocols/REVERSE_PLANNING_PROTOCOL.md))
- 핸들러·레이어 등 코드 골격 생성 (→ [EXECUTION_CONSTITUTION](../EXECUTION_CONSTITUTION.md))
- 세부 API 7단계 구현 (→ [03-api-standards](../03-api-standards/))

### 핵심 명제

> **Intent must exist before structure.  
> Structure must exist before implementation.**

의도 없이 구조를 만들면, 구조 없이 구현하면 검증·운영 비용이 기하급수적으로 증가한다.

### 역방향 대칭

| Reverse (11-protocols) | Forward (00-planning) |
|------------------------|------------------------|
| O/I/U — 코드에서 의도 추론 | Product Intent — 의도를 먼저 명시 |
| Source Inventory | Architecture Map + specs |
| Contract Reconstruction | `<project>-constitution/` 생성 |
| Recovery Plan | `docs/tasks/` + check:* 게이트 |

---

## §1 Planning Complete 선언 조건 (신규 프로젝트)

아래 8개 조건을 모두 만족하면 `Synaxion Planning Complete`로 선언한다.

```
1. docs/planning/00-product-intent.md 가 작성되었다 (비목표 포함)
2. SCOPE_BOUNDARY Coverage Eligibility 검사가 기록되었다
3. 적용할 Synaxion 헌법 챕터 목록이 확정되었다
4. docs/<project>-constitution/ 필수 계약 초안이 존재한다
5. docs/planning/01-delivery-target.md 에 루브릭 목표 점수가 명시되었다
6. 핵심 ADR가 docs/adr/ 에 있다 (스택·DB·인증 등)
7. MVP 기능 명세가 docs/specs/ 에 1건 이상 있다
8. 첫 실행 태스크가 docs/tasks/ 에 있고 check:* 완료 기준이 명시되었다
```

이 선언은 "모든 기능이 명세되었다"는 의미가 아니다.

> **MVP까지의 계획 기준선이 확보되었고, 정상 Synaxion 실행 규칙 하에 개발을 시작할 수 있다.**

---

## §2 새 프로젝트 — 8단계 Forward Planning Protocol

### Step 1 — PRODUCT_INTENT 작성

**산출물**: `docs/planning/00-product-intent.md`  
**템플릿**: [harness/forward-planning/00-product-intent.template.md](../harness/forward-planning/00-product-intent.template.md)

```
작성 항목:
  - 무엇을 만드는가 (한 문단)
  - 누구를 위한가 (Primary / Secondary 사용자)
  - 왜 지금인가 (시장·조직 맥락)
  - 비목표 (이번 릴리스에서 하지 않는 것)
  - 성공 신호 (정성·정량)
```

**완성 기준**: 비목표가 최소 3개 이상. "모든 사용자" 단독 표현 없음.

### Step 2 — SCOPE_BOUNDARY 적격성 검사

[Synaxion Core](../SCOPE_BOUNDARY.md)에 편입할 규칙 vs 프로젝트 가이드로 분리할 규칙을 Coverage Eligibility 공식으로 기록한다.

```
Synaxion Coverage Eligibility =
  검증 가능성 + 사용자 피해 위험 + 반복 가능성 + 계층 경계 영향
  - 프로젝트별 취향 의존성
```

**산출물**: `00-product-intent.md` 내 "Synaxion 적용 범위" 섹션 또는 별도 메모

**완성 기준**: Core vs Project Guide 분류표가 1개 이상의 예시와 함께 존재

### Step 3 — 적용 헌법 챕터 선택

프로젝트에 필요한 Synaxion 장을 체크한다.

| 장 | 포함 여부 판단 질문 |
|----|-------------------|
| 01 Foundations | 항상 (계층·상태) |
| 03 API | 서버 API·Server Actions 있음 |
| 04 Safety | 사용자 입력·외부 호출 있음 |
| 05 Testing | E2E·계약 테스트 예정 |
| 13 UI Design | 커스텀 UI·토큰 |
| 14 Experience | 브랜드·이미지·톤 |
| 15 Deployment | 배포 예정 |
| 16 Operations | 프로덕션 운영 예정 |
| 17 Data/DB | 영속 데이터 있음 |
| 12 Judgment | 판단·추천·규칙 엔진 |

**산출물**: `docs/planning/02-architecture-map.md` 상단 "적용 헌법" 표

### Step 4 — docs/\<project\>-constitution/ 생성

인스턴스 계약 디렉터리를 만든다. 최소 초안:

| 문서 | Synaxion 템플릿 |
|------|----------------|
| ENV_CONTRACT | [08-config](../08-config/README.md), reference ENV |
| DB_CONTRACT | [17-data-db/DB_CONTRACT_TEMPLATE](../17-data-db/DB_CONTRACT_TEMPLATE.md) |
| ROLLBACK_RUNBOOK | [15-deployment](../15-deployment/README.md) |
| SLO | [16-operations/SLO_TEMPLATE](../16-operations/SLO_TEMPLATE.md) |
| INCIDENT_RUNBOOK | [16-operations](../16-operations/README.md) |
| CONTRACT_CHANGE_POLICY | [CONTRACT_CHANGE_POLICY](../CONTRACT_CHANGE_POLICY.md) |

Experience·브랜드가 있으면 `EXPERIENCE_DIRECTION.md`, `AI_IMAGE_DIRECTION.md` 추가.

**완성 기준**: README 인덱스 + 위 4~6문서 중 프로젝트에 해당하는 것 전부 초안

### Step 5 — 배포 목표 readiness 설정

[DELIVERY_READINESS_RUBRIC](../DELIVERY_READINESS_RUBRIC.md) 기준으로 **목표 점수**를 명시한다.

**산출물**: `docs/planning/01-delivery-target.md`  
**템플릿**: [harness/forward-planning/01-delivery-target.template.md](../harness/forward-planning/01-delivery-target.template.md)

```
예시:
  MVP 출시: 가중 평균 ≥ 3.0, Deployment ≥ 3, Operations ≥ 3
  Production: 가중 평균 ≥ 3.5, 각 영역 최소 기준 이상
```

### Step 6 — 핵심 ADR 작성

아키텍처에 되돌리기 어려운 결정을 `docs/adr/`에 기록한다.

```
우선순위 ADR 후보:
  - 기술 스택 (프레임워크, 호스팅)
  - DB·인증·권한 모델
  - 폼 제출·관리자 데이터 경로
  - 외부 서비스 (결제, CRM, 분석)
```

**참조**: [adr/template.md](../adr/template.md), [CONTRACT_CHANGE_POLICY](../CONTRACT_CHANGE_POLICY.md)

### Step 7 — 기능 명세 → docs/specs/

[FEATURE_SPEC_TEMPLATE.md](./FEATURE_SPEC_TEMPLATE.md)를 복사하여 MVP 기능마다 1파일.

**완성 기준**: 각 spec에 사용자 흐름, 계약 참조, 완료 기준(DoD) 포함

### Step 8 — Cursor 태스크 분해 → docs/tasks/

[TASK_SPEC_TEMPLATE.md](./TASK_SPEC_TEMPLATE.md) 기반. 각 태스크에:

```
- 목적 (1문장)
- 사전 읽을 문서
- 변경 파일 범위 (추정)
- 완료 기준: 통과해야 할 check:* 목록
- 금지 사항 (범위 밖 수정 등)
```

**완성 기준**: 첫 스프린트 태스크 1건 이상. `pnpm run check:*` 목록이 구체적 이름으로 기재

이후 → [EXECUTION_CONSTITUTION](../EXECUTION_CONSTITUTION.md) 부트스트랩 또는 기존 레포에서 구현 시작.

---

## §3 새 기능 추가 — 5단계 (축소판)

기존 Planning Complete 프로젝트에 기능을 추가할 때.

### Step 1 — 1단락 의도

```
기능 이름:
한 단락 의도 (무엇을, 누구에게, 왜):
비목표 (이 PR에서 하지 않음):
```

### Step 2 — FEATURE_PLACEMENT_GUIDE

[01-foundations/FEATURE_PLACEMENT_GUIDE.md](../01-foundations/FEATURE_PLACEMENT_GUIDE.md) Q1~Q4를 답하고 배치 위치를 확정한다.

### Step 3 — FEATURE_CONTRACT_TEMPLATE

[FEATURE_CONTRACT_TEMPLATE.md](../FEATURE_CONTRACT_TEMPLATE.md)를 PR description 또는 `docs/specs/<feature>.md`에 작성한다.

### Step 4 — ADR (아키텍처 변경 시)

스택·DB·권한·공개 API 표면이 바뀌면 ADR 필수. 변경 없으면 "ADR 불필요"를 spec에 명시.

### Step 5 — docs/tasks/ 태스크 명세

[TASK_SPEC_TEMPLATE.md](./TASK_SPEC_TEMPLATE.md)로 Cursor 실행 단위 추가. check:* 게이트 명시.

---

## §4 AI 계획 작업 지시 프롬프트

```
You are establishing a Synaxion forward planning baseline for this project.

Rules:
1. Write product intent before proposing folder structure or code.
2. Run Coverage Eligibility for any new Synaxion rule candidates.
3. List which constitution chapters apply and which project guides are needed.
4. Create docs/planning/, docs/<project>-constitution/, docs/specs/, docs/tasks/ per PLANNING_DIRECTORY_STANDARD.
5. Do not invent business facts; mark assumptions as Assumption and list questions for the human.
6. Every task spec must name concrete check:* commands for completion.
7. Do not declare Planning Complete until §1 all 8 conditions are met.
```

---

## §5 기존 Synaxion 원칙과의 연결

| 이 프로토콜 조항 | 기반 Synaxion 원칙 |
|----------------|------------------|
| Step 2 Scope | [SCOPE_BOUNDARY.md](../SCOPE_BOUNDARY.md) |
| Step 3 헌법 선택 | [README.md](../README.md) 목차 |
| Step 4 인스턴스 계약 | [17-data-db](../17-data-db/), [15-deployment](../15-deployment/), [16-operations](../16-operations/) |
| Step 5 Delivery | [DELIVERY_READINESS_RUBRIC.md](../DELIVERY_READINESS_RUBRIC.md) |
| Step 6 ADR | [CONTRACT_CHANGE_POLICY.md](../CONTRACT_CHANGE_POLICY.md) |
| Step 7 Feature | [FEATURE_CONTRACT_TEMPLATE.md](../FEATURE_CONTRACT_TEMPLATE.md) |
| Step 8 Tasks | [06-automation/VERIFICATION_SCRIPTS.md](../06-automation/VERIFICATION_SCRIPTS.md) |
| 코드 부트스트랩 | [EXECUTION_CONSTITUTION.md](../EXECUTION_CONSTITUTION.md) |
| 레거시 복원 | [REVERSE_PLANNING_PROTOCOL.md](../11-protocols/REVERSE_PLANNING_PROTOCOL.md) |

---

**버전**: 1.0.0  
**최종 업데이트**: 2026-05-24  
**소속**: Synaxion Constitution 00장 (00-planning)
