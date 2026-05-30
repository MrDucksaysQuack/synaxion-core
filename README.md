# Synaxion Constitution (synaxion-core)

> **Engineering Constitution + Judgment Constitution** 번들.  
> 프로젝트 인스턴스(예: Itemwiki)는 이 저장소를 **서브모듈**로 두고, 제품별 규칙은 `docs/<project>-constitution/`에 둔다.

**버전**: 2.15.0  
**VERSION 파일**: [VERSION](./VERSION)  
**메타·운영 규칙**: [META_CONSTITUTION.md](./META_CONSTITUTION.md)

---

## 진입점

| 목적 | 문서 |
|------|------|
| 헌법 자체의 Tier·변경 절차·검증 의무 | [META_CONSTITUTION.md](./META_CONSTITUTION.md) |
| 무엇이며 누구를 위한 프레임워크인지 | [00-overview/README.md](./00-overview/README.md) |
| 짧게 훑기 | [00-overview/QUICK_START.md](./00-overview/QUICK_START.md) |
| 철학 한 축 | [00-overview/PHILOSOPHY.md](./00-overview/PHILOSOPHY.md) |
| 판단 층(B) 인덱스 | [12-judgment-constitution/README.md](./12-judgment-constitution/README.md) |
| 범위 경계 | [SCOPE_BOUNDARY.md](./SCOPE_BOUNDARY.md) |
| 정방향 계획 (신규·기능) | [00-planning/FORWARD_PLANNING_PROTOCOL.md](./00-planning/FORWARD_PLANNING_PROTOCOL.md) |
| 프로젝트 docs/ 표준 | [00-planning/PLANNING_DIRECTORY_STANDARD.md](./00-planning/PLANNING_DIRECTORY_STANDARD.md) |
| 코어 완성도 점수 | [CORE_READINESS_SCORECARD.md](./CORE_READINESS_SCORECARD.md) |
| 계약 변경·ADR | [CONTRACT_CHANGE_POLICY.md](./CONTRACT_CHANGE_POLICY.md) |
| 검증 (reference check) | [verification/README.md](./verification/README.md) — `pnpm run verify:core` |

---

## 목차 (번호별 장)

### 00 — Planning (정방향 계획)

[00-planning/](./00-planning/) — Forward Planning Protocol, 프로젝트 init 체크리스트, `docs/` 구조 표준, feature·task 명세 템플릿. **Reverse Planning**(11-protocols)의 정방향 대칭.

### 00 — 개요

[00-overview/](./00-overview/) — 헌법 소개, 다이어그램, 프론트·백·엔진 루프, 빠른 시작

### 01 — 기초 (Foundations)

[01-foundations/](./01-foundations/)

| 문서 | 요약 |
|------|------|
| [STRUCTURE_FIRST_PRINCIPLE.md](./01-foundations/STRUCTURE_FIRST_PRINCIPLE.md) | 구조 우선 |
| [LAYER_BOUNDARIES.md](./01-foundations/LAYER_BOUNDARIES.md) | 계층 경계·의존성 방향 |
| [CONSISTENCY_AS_SYSTEM_CONSTRAINT.md](./01-foundations/CONSISTENCY_AS_SYSTEM_CONSTRAINT.md) | 일관성을 시스템 제약으로 |
| [IMPLICIT_DISTRIBUTED_INFORMATION_FLOW.md](./01-foundations/IMPLICIT_DISTRIBUTED_INFORMATION_FLOW.md) | 암시적 분산 흐름·관측·정책·계약 |
| [TRUST_BOUNDARY_PRINCIPLE.md](./01-foundations/TRUST_BOUNDARY_PRINCIPLE.md) | 신뢰 경계 |
| [STATE_TRANSITION_CONTRACT.md](./01-foundations/STATE_TRANSITION_CONTRACT.md) | 상태 전이 계약 |
| [RECURSIVE_LAYERING_PRINCIPLE.md](./01-foundations/RECURSIVE_LAYERING_PRINCIPLE.md) | 재귀적 계층화 — 어휘 불변성·자기 닮음 문법 (Tier 3 · 2.15.0) |
| [N_WAY_CONSISTENCY_GATE.md](./01-foundations/N_WAY_CONSISTENCY_GATE.md) | N중 정합 게이트 — 복수 SSOT 양방향 정합 strict (Tier 3 · 2.15.0) |

### 02 — 개발 프레임워크

[02-development-framework/](./02-development-framework/) — 8단계 방법론, 리팩터링 안전, [부채를 통행료로 (Touch-It Type-It)](./02-development-framework/ADJACENT_DEBT_RULE.md) (Tier 3 · 2.15.0)

### 03 — API 표준

[03-api-standards/](./03-api-standards/) — 7단계 로직 구성, 표준화 레벨, 네트워크 회복력

### 04 — 안전 표준

[04-safety-standards/](./04-safety-standards/) — 침묵 실패 방지, UX·입력 지속성, 인증 흐름 등

### 05 — 테스트 원칙

[05-testing-principles/](./05-testing-principles/) — 피라미드, 계약·E2E·Fail-Soft, 목 패턴

### 06 — 자동화

[06-automation/](./06-automation/) — CI/CD, 검증 스크립트, 린트, [Meta-Gate / Gate Telemetry](./06-automation/META_GATE_TELEMETRY.md) (Tier 3 · 2.15.0)

### 07 — 프론트엔드·UI

[07-frontend-ui/](./07-frontend-ui/README.md) — 레이어 원칙, 상태·데이터 패칭, 접근성

### 08 — 설정

[08-config/](./08-config/README.md) — 환경 변수 등

### 09 — 관측 가능성

[09-observability/](./09-observability/README.md) — 로깅·관측 원칙

### 10 — 설계·플로

[10-design-flow/](./10-design-flow/README.md) — 페이지·플로 체크리스트, 기대 모델

### 11 — 프로토콜·교과

[11-protocols/](./11-protocols/) — 제품/팀별 완료 계약·개발 프로토콜 문서, **Reverse Planning Protocol** (미완성·레거시 복원: O/I/U, 8단계). 신규·기능 계획은 [00-planning](./00-planning/).

### 12 — 판단 헌법 (Judgment)

[12-judgment-constitution/](./12-judgment-constitution/README.md) — E/R/C/I, 스키마, 리플레이·연합

### 13 — UI 디자인 헌법 (UI Design)

[13-ui-design/](./13-ui-design/README.md) — 토큰 3-tier 아키텍처, 색상·테마 원칙, 타이포그래피, 공간, 형태, 모션, 상태 표현, 검증

### 14 — Experience Direction 헌법 (Experience Direction)

[14-experience-direction/](./14-experience-direction/README.md) — 브랜드 감정 축, 이미지 처리 매트릭스, 여백 밀도 계층, 페이지 내러티브 리듬, 컴포넌트 감정 온도, 아이콘 성숙도, 마이크로카피 보이스, AI 이미지 생성 거버넌스(4-layer 프롬프트·Scene·Tempo·Narrative Ownership)

### 15 — 컴포넌트 패턴 (Component Patterns)

[15-component-patterns/](./15-component-patterns/README.md) — 애니메이션 안무, 섹션 구성, 다크 모드 구현, 반응형 전략, 폼 UX 패턴. UI Constitution(13장)·Experience Constitution(14장)을 구현하는 검증 가능한 패턴 라이브러리.

### 16 — 배포 (Deployment)

[15-deployment/](./15-deployment/README.md) — DEPLOY-01~08, 롤백 템플릿, [DEPLOYMENT_READINESS_RUBRIC](./15-deployment/DEPLOYMENT_READINESS_RUBRIC.md)

### 17 — 운영 (Operations)

[16-operations/](./16-operations/README.md) — OPS-01~09, 인시던트·SLO 템플릿, [OPERATIONS_READINESS_RUBRIC](./16-operations/OPERATIONS_READINESS_RUBRIC.md)

### 18 — 인지 인터페이스 (Cognitive Interface)

[18-cognitive-interface/](./18-cognitive-interface/README.md) — 논리 유형 10개 분류(Hierarchical·Sequential·Conditional·Comparative·Causal·Relational·Proportional·Cyclic·Categorical·State-based), 인지 병목 × UI 패턴 매핑, Primary/Secondary 복합 로직 규칙, 감정 상태 레이어(불안·탐색·확신·신뢰·압박). **"Interface must match cognition before it matches aesthetics."**

### 19 — 제품 UI 아키텍처 (Product UI Architecture)

[19-product-ui-architecture/](./19-product-ui-architecture/README.md) — 다역할·Event 기반 제품에서 "누가·어떤 순서로·무엇을 보는가"를 구조화하는 UI 지도 체계. 문서 14종 taxonomy, 크기 프로파일 S/M/L, PLAN-READINESS 3단 게이트, 거버넌스 4규칙. 코어 6 스키마(Handoff·Event→UI·Time Zones·Recovery·State Matrix·INDEX.template) + GOVERNANCE. **"컴포넌트 패턴만으로는 누가·어떤 순서로·무엇을 보는가가 잡히지 않는다."**

> **Ch.07·10·15·18과의 관계**: 07=기술 레이어, 10=화면 품질, 15=컴포넌트, 18=인지 구조. **19장**은 이 네 레이어 위에서 **제품 전체의 UI 지도**를 관리한다.  
> **Reference instance**: [Agrinovation 11-ui-architecture](../Plan/11-ui-architecture/) — 11역할·21 Handoff·12 Recovery Journey, Plan Complete 96%. (인스턴스 레포 `docs/Plan/11-ui-architecture/`)

### 20 — 데이터·DB

[17-data-db/](./17-data-db/README.md) — [DATA_CONSTITUTION](./17-data-db/DATA_CONSTITUTION.md), [DB_CONTRACT_TEMPLATE](./17-data-db/DB_CONTRACT_TEMPLATE.md)

### Delivery 통합

[DELIVERY_READINESS_RUBRIC.md](./DELIVERY_READINESS_RUBRIC.md) — UX·Visual·Deployment·Operations 가중 합산

### Reference instances

[reference/](./reference/README.md) — `pnpm run verify:reference` (nextjs-minimal + express-api-minimal)

**Multi-role Event-driven products** (Ch.19 기준):  
- [Agrinovation 11-ui-architecture](../Plan/11-ui-architecture/) — 11역할·21 Handoff·12 Recovery·Event 기반 농업 운영 플랫폼 (Plan Complete 96%, Implementation Ready ~82%)

---

## 루트 메타·스키마

| 항목 | 경로 |
|------|------|
| 단일 소스 맵(형식·규칙) | [SINGLE_SOURCE_MAP.md](./SINGLE_SOURCE_MAP.md) |
| 결정 레지스트리 가이드 | [DECISION_REGISTRY.md](./DECISION_REGISTRY.md) |
| 실행 헌법 | [EXECUTION_CONSTITUTION.md](./EXECUTION_CONSTITUTION.md) |
| 진화 전략 | [EVOLUTION_STRATEGY.md](./EVOLUTION_STRATEGY.md) |
| 마이그레이션 | [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) |
| 운영 시스템 | [OPERATING_SYSTEM.md](./OPERATING_SYSTEM.md) |
| 판단 출력 스키마 | [judgment-output.schema.json](./judgment-output.schema.json) |
| ADR | [adr/](./adr/) |
| 변경 연대기 | [history/](./history/) |
| Delivery readiness | [DELIVERY_READINESS_RUBRIC.md](./DELIVERY_READINESS_RUBRIC.md) |

---

## 부록: Step 3 harness (Itemwiki → synaxion-core 동기화)

Itemwiki 레포의 `contrib/synaxion-core/`에 **synaxion-core GitHub 레포 루트에 그대로 복사**할 파일을 둔다.

### synaxion-core 레포에 반영하는 방법

로컬에 synaxion-core 클론이 있다고 가정:

```bash
rsync -a --delete contrib/synaxion-core/harness/ ../synaxion-core/harness/
cp contrib/synaxion-core/install.sh ../synaxion-core/install.sh
cp contrib/synaxion-core/sync-harness.sh ../synaxion-core/sync-harness.sh
chmod +x ../synaxion-core/install.sh ../synaxion-core/sync-harness.sh
cd ../synaxion-core
git add harness install.sh sync-harness.sh
git commit -m "feat: harness 템플릿 + install.sh 추가"
git push -u origin main
```

(`../synaxion-core` 경로는 실제 클론 위치로 바꾼다.)

### Itemwiki에서 constitution 서브모듈로 바꾸기

인증된 환경에서만 `git submodule add`가 성공한다. 절차는 Itemwiki 쪽 `docs/guides/SYNAXION_CORE_SUBMODULE.md`를 따른다.

### install.sh 사용 (서브모듈 연결 후)

```bash
cd /path/to/itemwiki   # 프로젝트 루트
bash docs/constitution/install.sh "Itemwiki" "packages/lib <- …"
```

---

## 버전 히스토리 (README·목차)

| 날짜 | 요약 |
|------|------|
| 2026-05-30 | **2.15.0** — META §0.3 Pattern Promotion Model 추가 (Tier 3 → 2 → 1 승격 단계 모델). Inflomatrix 인스턴스 발견 4개 Tier 3 패턴 신규 등재: [Recursive Layering](./01-foundations/RECURSIVE_LAYERING_PRINCIPLE.md)(어휘 불변성 + 자기 닮음 문법), [N-way Consistency Gate](./01-foundations/N_WAY_CONSISTENCY_GATE.md)(복수 SSOT 양방향 정합), [Meta-Gate / Gate Telemetry](./06-automation/META_GATE_TELEMETRY.md)(게이트 검사 건수 발행 + 공집합 통과 차단), [Adjacent Debt Rule / Touch-It Type-It](./02-development-framework/ADJACENT_DEBT_RULE.md)(부채를 통행료로). Inflomatrix 5중 중첩 매트릭스(SubDomain·Flow·Stream·Schema·Conscious·ERIC)를 Recursive Layering 1호 실증 사례로 등재. |
| 2026-05-27 | **2.14.1** — Ch.19 목차 번호 정합(19=Product UI·20=Data·DB), Handoff 21건 통일, Event→UI·Time Zones 스키마 README 반영. |
| 2026-05-27 | **2.14.0** — 19장 Product UI Architecture 추가: 다역할·Event 기반 제품 UI 지도 체계. 문서 taxonomy 14종, 크기 프로파일 S/M/L, PLAN-READINESS 3단 게이트, 거버넌스 4규칙. 스키마 6종(Handoff·Event→UI·Time Zones·Recovery·State Matrix·INDEX.template). UX_READINESS_RUBRIC 4점 기준 강화. Agrinovation 11-ui-architecture(11역할·21 Handoff·12 Recovery)를 레퍼런스 인스턴스 1호로 등재. |
| 2026-05-25 | **2.13.0** — 18장 Cognitive Interface Design 추가: 논리 유형 10개(Hierarchical·Sequential·Conditional·Comparative·Causal·Relational·Proportional·Cyclic·Categorical·State-based) × 인지 병목 × UI 패턴 매핑 체계. Primary/Secondary 복합 로직 규칙, 허용/금지 조합 정의. 감정 상태 5개(불안·탐색·확신·신뢰·압박) × Logic Type 매트릭스. "인지 구조 기반 인터페이스 설계 언어" — 컴포넌트 선택 전, 논리 유형을 먼저 정의하는 check:cognitive 게이트 도입. |
| 2026-05-25 | **2.12.0** — 15장 Component Patterns 추가: ANIMATION_CHOREOGRAPHY, SECTION_COMPOSITION, DARK_MODE_IMPLEMENTATION, RESPONSIVE_STRATEGY, FORM_UX_PATTERNS. 11섹션 패턴 템플릿, Pattern Adoption Rule(7문항 5+ 기준), Mandatory/Recommended/Project-specific 3레벨 체계. truefarm-website를 reference extraction source로 삼아 추출한 첫 패턴 세트. |
| 2026-05-24 | **2.11.0** — `reference/express-api-minimal`, profile-aware verification, `verify:scaffold:express-api`, CI dual-reference + scaffold smoke. Reusability 10축 5점. |
| 2026-05-24 | **2.11.0** — 00-planning 장 추가: Forward Planning Protocol(신규 8단계·기능 5단계), PROJECT_INIT_CHECKLIST, PLANNING_DIRECTORY_STANDARD, FEATURE_SPEC·TASK_SPEC 템플릿, harness/forward-planning/ 3종. 계획→실행→검증 전 사이클 정방향 커버. |
| 2026-05-24 | **2.10.0** — `verification/` reference check 패키지, `reference/nextjs-minimal`, `CORE_READINESS_SCORECARD`, `CONTRACT_CHANGE_POLICY`, 15–17장 README 목차, `verify:core` CI. |
| 2026-05-24 | **2.10.0** — Reverse Planning Protocol 추가 (11-protocols): O/I/U 분류 원칙, 8단계 복원 절차, Reconstruction Scorecard (25점 기준), Synaxion Reconstruction Complete 선언 조건 10개. harness/reverse-planning/ 템플릿 5개 추가. 미완성·레거시 프로젝트를 Synaxion 계획 기준선으로 복원하는 체계 확립. |
| 2026-05-24 | **2.9.1** — IMAGE_DIRECTION_CONSTITUTION 추가: 4-layer 프롬프트 구조, Scene Categories·Visual Tempo·Narrative Ownership·Collision Matrix·Slot System 스키마 정의. AI 이미지 생성 거버넌스를 Experience Direction의 부속 헌법으로 편입. |
| 2026-05-24 | **2.9.0** — 14장 Experience Direction Constitution 추가: 브랜드 감정 축·이미지 처리 매트릭스·여백 밀도·페이지 내러티브·컴포넌트 온도·아이콘 성숙도·마이크로카피 7개 축 스키마 정의. UI Constitution과 구분되는 Design Review Gate enforcement 모델 도입. |
| 2026-05-24 | **2.8.0** — 13장 UI Design Constitution 추가: 토큰 3-tier 아키텍처, 색상·테마 원칙, 타이포그래피, 공간, 형태, 모션, 상태 표현, 검증 레벨 1–4. |
| 2026-05-23 | **2.7.7** — truefarm에서 추출한 8패턴 반영: Fail-Soft Multi-Target, 클라이언트 영속 버저닝, rate limit fallback, IP 해싱, 이벤트 택소노미, 로케일 패리티 게이트, 폼 이탈 관측, A/B 버킷 내성. |
| 2026-04-19 | 루트 README를 Synaxion 헌법 진입점·목차·루트 메타 표로 정리. harness 안내는 부록으로 이동. |
