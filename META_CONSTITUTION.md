# 메타-헌법 (Meta-Constitution)

> **"헌법을 다루는 헌법"**  
> Constitution 자체의 변경·계층·충돌·검증을 정의한다. 이 문서가 없으면 Constitution은 문서 모음이다. 이 문서가 있으면 Constitution은 **운영 규칙**이 된다.

**작성일**: 2026-02-15  
**목적**: 헌법 변경 절차, 계층 구조, 충돌 해결, 검증 의무를 명시하여 운영 OS로의 전환 기반 마련

---

## 0. Synaxion 두 층 (이름·범위)

이 저장소의 `docs/constitution/`을 **Synaxion**이라 부를 때, 다음 두 층을 구분한다.

| 층 | 역할 | 주요 산출물 |
|----|------|-------------|
| **A. Engineering Constitution** | 코드 구조, API, 테스트, CI, **코드 속 결정 축** | `00~11/`, `decision-registry`, `check:*`, ADR |
| **B. Judgment Constitution** | **판단 출력 타입** 먼저, E/R/C/I, 규칙, 플로, 연합 | [12-judgment-constitution/JUDGMENT_OUTPUT_TYPE.md](./12-judgment-constitution/JUDGMENT_OUTPUT_TYPE.md), [judgment-output.schema.json](./judgment-output.schema.json), [12-judgment-constitution/](./12-judgment-constitution/README.md), `decision-rules.schema.json` |
| **C. UI Design Constitution** | 시각 토큰 3-tier 아키텍처, 색상·테마 원칙, 타이포그래피, 공간, 형태, 모션, 상태 표현, **시각 의존 방향** | [13-ui-design/UI_DESIGN_CONSTITUTION.md](./13-ui-design/UI_DESIGN_CONSTITUTION.md), `check:ui-*` |
| **D. Experience Constitution** | 브랜드 감정 축, 이미지 처리 매트릭스, 여백 밀도, 페이지 내러티브, 컴포넌트 온도, 아이콘 성숙도, 마이크로카피 보이스, **Design Review Gate** | [14-experience-direction/EXPERIENCE_CONSTITUTION.md](./14-experience-direction/EXPERIENCE_CONSTITUTION.md), Design Review Gate Checklist |
| **E. Component Patterns** | UI Constitution(13장)·Experience Constitution(14장)을 구현하는 재사용 패턴 라이브러리. 헌법이 "무엇이어야 하는가"라면, 이 층은 "어떻게 구현하는가"의 검증 가능한 패턴 | [15-component-patterns/README.md](./15-component-patterns/README.md), Pattern Adoption Rule, check:* + Soft review |
| **F. Cognitive Interface** | 복잡한 논리를 인간의 인지 패턴에 맞춰 인터페이스로 번역하는 설계 언어. 논리 유형 10개(Hierarchical·Sequential·Conditional·Comparative·Causal·Relational·Proportional·Cyclic·Categorical·State-based) × 인지 병목 × UI 패턴 매핑. 컴포넌트 선택 이전 단계의 설계 결정 최상위 레이어. | [18-cognitive-interface/README.md](./18-cognitive-interface/README.md), LOGIC_TYPE_TAXONOMY, COMPOSITE_LOGIC_RULES, EMOTIONAL_STATE_PATTERNS, check:cognitive |
| **0. Planning** | 만들기 **전** 의도·범위·명세·태스크 분해. Engineering Constitution의 입력. | [00-planning/FORWARD_PLANNING_PROTOCOL.md](./00-planning/FORWARD_PLANNING_PROTOCOL.md), PLANNING_DIRECTORY_STANDARD.md, harness/forward-planning/ |
| **P. Protocols** | "무엇이어야 하는가"가 아닌 "어떤 순서로 무엇을 해야 하는가"를 정의하는 절차 규약. Constitution을 보완. | [11-protocols/REVERSE_PLANNING_PROTOCOL.md](./11-protocols/REVERSE_PLANNING_PROTOCOL.md) (역방향), [00-planning](./00-planning/) (정방향), RECONSTRUCTION_SCORECARD.md, harness/reverse-planning/ |

층 B는 기본 **Tier 3**로 두고, 제품화 시 Tier 승격·PR 게이트 포함 여부를 팀이 정한다. 층 A의 Tier·검증 의무는 기존 절차를 따른다.

### 0.1 Synaxion 메타 정합성 (이름·날짜·버전)

**이름**

- **Synaxion**: 이 저장소에서 `docs/constitution/` 코어 헌법 묶음을 가리킬 때의 총칭(§0).
- **층 A·B**, **Engineering Constitution**, **Judgment Constitution**: §0 표와 Constitution [README.md](./README.md)의 표준 명칭이다. 혼용 금지는 아니나, 새 문서·ADR에서는 이 쌍을 우선한다.
- **코드·DB**: 테이블·API 경로 등 `synaxion_*`는 제품 네임스페이스다. 문서의 Judgment 층(B)과 **같은 도메인 축**(판단 기록·리플레이·감사)을 구현할 때 붙인 이름이며, “Synaxion = 오직 DB만”이 아니다.

**버전·날짜**

- **버전 번호** 단일 소스: [VERSION](./VERSION).
- **번들 공식 갱신일**: [README.md](./README.md) 상단 `**최종 업데이트**`. README 하단 라이선스 블록의 `최종 업데이트`는 상단과 **항상 동일**하게 유지한다.
- **하위 문서**(`00~12`, 스크립트 주석 등) 각각의 “최종 업데이트”는 해당 파일의 마지막 의미 있는 편집일로 두어도 되며, **번들 일치 의무는 README에만** 둔다.
- [README.md](./README.md) 버전 히스토리 표의 날짜는 릴리스 단위 변경 기록이다.

### 0.2 Synaxion 운영 원리 — 일관성은 시스템 제약

**일관성**을 “팀이 노력하면 지켜지는 품질”로만 두지 않는다. Synaxion에서는 **일관성을 시스템 제약**으로 선언한다 — 모순을 **기대하지 않고**, 빌드·런타임·게이트로 **허용 범위를 줄인다**.

- 선언문·네 원리·Itemwiki 인스턴스와의 연결: [01-foundations/CONSISTENCY_AS_SYSTEM_CONSTRAINT.md](./01-foundations/CONSISTENCY_AS_SYSTEM_CONSTRAINT.md)
- 분산 비동기 체인에서의 **암시적 파이프라인**과, 관측·정책 단일화·명시적 워크플로·계약 테스트·컨텍스트 전파로의 전환: [01-foundations/IMPLICIT_DISTRIBUTED_INFORMATION_FLOW.md](./01-foundations/IMPLICIT_DISTRIBUTED_INFORMATION_FLOW.md)
- 본 절은 §0의 **이름·범위**와 별도로, “왜 Constitution이 문서 모음이 아니라 **운영 규칙**인가”에 대한 **철학 층**을 고정한다.

### 0.3 Pattern Promotion Model — 인스턴스 발견 패턴의 Tier 승격

Synaxion은 *제품 인스턴스*(Itemwiki·Inflomatrix 등)에서 발견된 보편화 가능한 패턴을 흡수하며 진화한다. 그러나 인스턴스 1개의 경험만으로는 *보편*임을 보장할 수 없다. 따라서 다음의 *증명 단계 모델*을 둔다.

| 단계 | 조건 | 위치 |
|------|------|------|
| **Tier 3 (도입)** | 1개 인스턴스에서 실증, 헌법 문서로 작성 완료 | 해당 챕터에 `Tier 3 (도입 단계)` 표기 |
| **Tier 2 (권장)** | 6개월 내 1개 이상 *외부 인스턴스*(원 발견 인스턴스가 아닌)에서 적용 시도 | 동일 챕터, Tier 갱신 + 적용 인스턴스 목록 |
| **Tier 1 (필수)** | 2개 이상 외부 인스턴스에서 *작동 확인* + 검증 스크립트 코어 재사용 가능 | 동일 챕터, Tier 갱신 + CI 게이트 의무 |

**규칙**: Tier 3 도입 시 *제안자 인스턴스*와 *Tier 3 등재일*을 챕터 하단에 명시한다. 승격 PR은 *증명 근거*(외부 인스턴스 적용 사례)를 ADR로 첨부한다. 강등은 §3 규칙을 따른다.

**현재 Tier 3 신규 패턴 (2.15.0+ — Inflomatrix·Itemwiki 제안)**

| ID | 챕터 | 위치 | 검증 |
|----|------|------|------|
| Recursive Layering | [01-foundations/RECURSIVE_LAYERING_PRINCIPLE.md](./01-foundations/RECURSIVE_LAYERING_PRINCIPLE.md) | 메타 원칙 — 어휘 불변성 + 자기 닮음 문법 | `check:vocabulary-coverage` (제안) |
| N-way Consistency Gate | [01-foundations/N_WAY_CONSISTENCY_GATE.md](./01-foundations/N_WAY_CONSISTENCY_GATE.md) | 복수 SSOT 양방향 정합 strict 게이트 | `check:matrix-table-manifest` 등 |
| Meta-Gate / Gate Telemetry | [06-automation/META_GATE_TELEMETRY.md](./06-automation/META_GATE_TELEMETRY.md) | 게이트 *검사 건수* 발행 + 공집합 통과 차단 | `check:gate-coverage` (인스턴스) |
| Adjacent Debt Rule (Touch-It Type-It) | [02-development-framework/ADJACENT_DEBT_RULE.md](./02-development-framework/ADJACENT_DEBT_RULE.md) | 부채를 전담 스프린트가 아닌 통행료로 정리 | `monitor:lint-baseline` |
| Execution Authority Alignment | [01-foundations/EXECUTION_AUTHORITY_ALIGNMENT.md](./01-foundations/EXECUTION_AUTHORITY_ALIGNMENT.md) | 실행 주체 ≠ 정책 주체 · Rule A–D · 5+1 실패 패턴 | 인스턴스 `check:authority-boundary` |
| Authority Boundary (AB catalog + playbook) | [06-automation/AUTHORITY_BOUNDARY_CHECK_RULES.md](./06-automation/AUTHORITY_BOUNDARY_CHECK_RULES.md) · [AUTHORITY_BOUNDARY_PLAYBOOK.md](./06-automation/AUTHORITY_BOUNDARY_PLAYBOOK.md) | AB-01~08 · 4단계 성숙도 · inventory | Tier 2 rules · Tier 3 playbook |
| **Operational Maturity Layers** | [01-foundations/OPERATIONAL_MATURITY_LAYERS.md](./01-foundations/OPERATIONAL_MATURITY_LAYERS.md) | Meaning · Permission · Navigation Graph · Identity Spine | 인스턴스 UX·nav·auth gates |
| **Host Trust Surface Separation** | [01-foundations/HOST_TRUST_SURFACE_SEPARATION.md](./01-foundations/HOST_TRUST_SURFACE_SEPARATION.md) | 4표면 추상 모델 · plane guard · strangler | plane E2E · `check:nav-discoverability` |
| **Strangler Promotion** | [01-foundations/STRANGLER_PROMOTION_PLAYBOOK.md](./01-foundations/STRANGLER_PROMOTION_PLAYBOOK.md) | alias·shim·병렬 스트림 무중단 승격 | build · type-check · compat E2E |
| **Identity Federation Spine** | [04-safety-standards/IDENTITY_FEDERATION_SPINE.md](./04-safety-standards/IDENTITY_FEDERATION_SPINE.md) | central OAuth · signed state · handoff | `check:oauth-redirect-policy` |
| **Navigation Discoverability** | [07-frontend-ui/NAVIGATION_DISCOVERABILITY.md](./07-frontend-ui/NAVIGATION_DISCOVERABILITY.md) | wayfinding graph · transient exempt | `check:nav-discoverability` |
| **Indirect UX** | [10-design-flow/INDIRECT_UX_PRINCIPLE.md](./10-design-flow/INDIRECT_UX_PRINCIPLE.md) | structure over telling · UX-02b | `check:ux-state-coverage` |

**Tier 2 신규 (2.18.0 — Inflomatrix 제안)**

| ID | 챕터 | 위치 | 검증 |
|----|------|------|------|
| Application Layer Boundary | [01-foundations/APPLICATION_LAYER_BOUNDARY.md](./01-foundations/APPLICATION_LAYER_BOUNDARY.md) | Application↔API↔FE 경계 | `check:application-boundary` |
| Warn→Strict Ratchet | [06-automation/WARN_TO_STRICT_RATCHET.md](./06-automation/WARN_TO_STRICT_RATCHET.md) | CI 게이트 승격 절차 | — |
| Check Tier Manifest | [06-automation/CHECK_TIER_MANIFEST.md](./06-automation/CHECK_TIER_MANIFEST.md) | quick/pr/release 레인 SSOT | `check:tiers` |
| Build Toolchain Alignment | [06-automation/BUILD_TOOLCHAIN_ALIGNMENT.md](./06-automation/BUILD_TOOLCHAIN_ALIGNMENT.md) | JSX runtime · alias parity | `check:jsx-react-scope` |
| Page Execution Contract Registry | [19-product-ui-architecture/PAGE_EXECUTION_CONTRACT_REGISTRY.md](./19-product-ui-architecture/PAGE_EXECUTION_CONTRACT_REGISTRY.md) | P0↔contract test 1:1 | `check:page-execution-contracts` |
| Cross-Instance Verification Patterns | [06-automation/CROSS_INSTANCE_VERIFICATION_PATTERNS.md](./06-automation/CROSS_INSTANCE_VERIFICATION_PATTERNS.md) | 인스턴스 check:* 카탈로그 | 인스턴스별 |

---

## 1. 원칙의 수준 (Tier 정의)

| Tier | 의미 | 적용 범위 |
|------|------|-----------|
| **Tier 1** | 필수. 위반 시 머지/배포 차단 가능 | 모든 개발자, 모든 코드 |
| **Tier 2** | 권장. 프로젝트/팀 단위로 선택 적용 | 리드·아키텍트 결정 |
| **Tier 3** | 참고. 심화·확장 시 참조 | 아키텍트·신규 도메인 |

- **Tier 1 예**: 계층 경계, 단방향 의존성, API withMetrics+withAuth, UX 안전(타임아웃·finally), 침묵 실패 방지·**Fail-Soft Multi-Target**(다중 저장 부분 성공 투명성), 클라이언트 영속 `schema_version`·read migration, **API 7단계 자동 검증**(예: `verify:api-7-stages`를 PR/게이트에 엄격 포함)
- **Tier 2 예**: Fail-Soft 테스트, 계약 테스트, E2E authority 그룹, rate limit 인프라 fallback, 운영 IP salted hash, 프론트 이벤트 택소노미, **로케일 패리티 `check:*`** (7단계는 **자동 검증이 없고 주석만 요구**할 때 여기에 둠)
- **Tier 3 예**: 8단계 방법론 심화, 프로토콜 문서, 폼 이탈 관측, A/B 버킷 내성, 프로젝트 특화 세부
- **층 B(Judgment Constitution) 전체**: 기본적으로 Tier 3에 해당한다(§0). 다만 아래 §1.1처럼 **스키마·JSON 예시**는 자동 검증 대상으로 둘 수 있다.

**규칙**: 새 원칙 추가 시 반드시 Tier를 지정한다. Tier 1은 가능한 한 `check:*`로 검증 가능해야 한다.

### 1.1 Judgment 층(B) — Tier 3일 때의 강제 범위

“Tier 3 = 참고”와 “판단 스키마·코어 예시는 깨지면 안 된다”를 동시에 만족시키기 위한 구분이다.

| 대상 | 기본(Tier 3)에서 PR/머지 | 승격 시(팀이 Tier 2·게이트에 포함) |
|------|---------------------------|-------------------------------------|
| **12번 원칙 문서**만의 서술(교육·아키텍처 가이드) | 자동 차단 **아님** | 리뷰 체크리스트 또는 `check:*` 필수로 올릴 수 있음 |
| **`judgment-output.schema.json`**, **`decision-rules.schema.json`**, **`decision-rules.example.json`** | 스키마/예시 변경 시 `pnpm run check:decision-rules`로 깨짐 탐지 **권장**; CI 포함 여부는 팀 선택 | CI 필수(예: `constitution-check-pr`에 포함) |
| **인스턴스 규칙**(예: `docs/<project>-constitution/decision-rules.json`) | 프로젝트 스크립트(예: `check:decision-rules:itemwiki`)로 선택 검증 | 동일 스크립트를 PR 게이트에 추가 |
| **런타임 구현**(예: `packages/.../judgment/`) | 일반 코드 경로 — 계층·안전 등 **층 A Tier 1** 규칙 적용 | 동일 |

**규칙 요약**

- Tier 3라고 해서 “스키마를 아무렇게나 바꿔도 된다”는 뜻이 **아니다**. 스키마·코어 예시를 바꾸면 [README](./README.md) 버전·히스토리 갱신과, 가능하면 `check:decision-rules` 통과를 **같은 PR**에 둔다.
- **문서만** 추가·수정하고 스키마를 안 건드리면, Tier 3 한계상 **원칙 문서 위반을 자동으로 머지 차단하는 메커니즘은 없다** — 리뷰·교육으로 보완한다.
- 층 B를 **제품 핵심**으로 올릴 때는 팀이 Tier 2(또는 Tier 1에 준하는 게이트)로 **승격**하고, 위 표 오른쪽 열처럼 `check:*`를 PR 필수에 넣는다.

---

## 2. 새 원칙 추가 절차

1. **제안**: 이슈 또는 PR로 "무슨 원칙을, 어느 Tier로, 어떤 문서에" 제안
2. **검증 의무**: 원칙이 **행위**를 요구하면(예: "~를 사용한다", "~를 금지한다") 가능한 한 **자동 검증**을 추가한다.
   - `check:*` 스크립트, ESLint 규칙, 또는 테스트로 위반 탐지
   - 자동화 불가 시 문서·체크리스트에 명시하고, 리뷰 시 확인
3. **문서 배치**: 범용 원칙은 Constitution 본문(`00~11`, [12-judgment-constitution/](./12-judgment-constitution/README.md)). 프로젝트 특화는 Constitution 밖(예: `docs/<project>-constitution/`)에 둔다.
4. **단일 소스 맵 반영**: "이 판단은 이 한 곳에서만" 유형의 원칙이면 [SINGLE_SOURCE_MAP.md](./SINGLE_SOURCE_MAP.md) 표에 **반드시** 추가
5. **README·학습 경로 갱신**: Constitution [README.md](./README.md)의 **📂 폴더 구조** 트리, [12-judgment-constitution/README.md](./12-judgment-constitution/README.md)·[history/README.md](./history/README.md) 문서 표(해당 시), Tier 학습 경로에 링크·파일명을 실제와 맞춘다 (Synaxion 트리 드리프트 방지).
6. **버전 기록**: Constitution README의 버전 히스토리에 변경 요약 추가

---

## 3. 기존 원칙 삭제·폐기 기준

- **삭제**: 더 이상 적용하지 않을 때. 삭제 사유와 대체 방안을 문서에 남긴 후 제거
- **폐기(Deprecated)**: 단계적 제거 시. 문서에 "Deprecated: 대신 ~ 사용" 명시, 신규 코드에서는 사용 금지, 기존 코드는 마이그레이션 계획 수립
- **Tier 강등**: Tier 1 → 2 등. 적용 범위를 줄일 때. 사유와 검증 방식 변경(해당 시)을 기록

**규칙**: 삭제·폐기·강등 시 **ADR(Architecture Decision Record)**에 이유와 대안을 기록한다.

---

## 4. 모든 원칙과 검증 가능성

| 원칙 유형 | 검증 방식 |
|-----------|------------|
| 계층·의존성 | `check:layer-boundaries`, `check:dependency-graph` |
| 침묵 실패·에러 삼킴 | `check:silent-failures` |
| Constitution 위반 패턴 | `check:constitution` |
| 권한 정책 드리프트 | `check:permission-drift` |
| API 스키마·계약 | `check:api-schemas` |
| 단일 소스(리다이렉트 등) | `check:signup-url` 등, 필요 시 확장 |
| UX 위험·로딩 고정 | `check:ux-risks` |
| 개념 부패 | `check:conceptual-rot` |
| 판단 규칙 JSON(코어 예시) | `check:decision-rules` |
| 판단 규칙(인스턴스)·런타임 번들 | `check:decision-rules:itemwiki`, `check:judgment-runtime-rules` (`check:constitution-pr`) |
| 판단 진입점(`evaluateJudgment` 우회 금지) | `check:judgment-contracts` (`check:constitution-pr`) |
| 레지스트리 결정 ID 미사용 | `check:decision-usage --fail-on-unused` (`check:constitution-pr`) |
| `checkDecision('…')` 문자열 미등록 | `check:decision-call-registry` (`check:constitution-pr`) |

**규칙**: Tier 1 원칙은 위 표에 대응하는 검증이 없으면 **검증 추가**를 제안한다. "원칙만 있고 검증이 없음" 상태를 최소화한다.

---

## 5. 원칙 충돌 시 우선순위

다음 순서로 적용한다. 상위가 하위보다 우선한다.

1. **Trust / Security / Safety** — 시스템 신뢰성, 사용자 안전
2. **Structure & Architecture** — 계층 경계, 의존성 방향
3. **Code Quality & Maintainability** — 테스트, 중복 방지
4. **User Experience** — UX 안전, 피드백
5. **Performance** — 최적화는 구조 확립 후

**규칙**: 충돌 해결 시 선택한 우선순위와 이유를 ADR에 기록한다.

---

## 6. 단일 소스 맵 유지 의무

- **결정 축**(예: "인증됐는가?", "리다이렉트 URL은?", "이 필드 편집 가능한가?")이 생기면 **SINGLE_SOURCE_MAP** 표에 한 행으로 추가한다.
- 표 항목: 결정(축) | 단일 소스(진입점) | 검증 스크립트 | 영향 레이어
- **규칙**: 새 "단일 소스" 원칙을 문서에 추가할 때마다 SINGLE_SOURCE_MAP을 갱신한다. 이 의무는 메타-헌법의 일부이다.

---

## 7. ADR과의 관계

- **구조적 결정**(예: 3계층 채택, handler factory 단일 패턴, E2E authority 도입)은 **ADR**에 기록한다.
- 메타-헌법에서 "삭제·폐기·충돌 해결" 시 ADR 기록을 요구한다.
- ADR 목록과 템플릿은 [adr/README.md](./adr/README.md) 참조.

---

## 8. 코어 vs 인스턴스

- **코어**: `00~11`, `12-judgment-constitution/`, `13-ui-design/`, `14-experience-direction/`, `scripts/`, `generated/`, `profiles/`, `decision-registry.schema.json`, `decision-rules.schema.json`, `decision-rules.example.json`, **`judgment-output.schema.json`**, META/EXECUTION/SINGLE_SOURCE/DECISION_REGISTRY. 프로젝트 중립이며 이식·재사용 대상.
- **인스턴스**: 프로젝트 적용 디렉터리의 레지스트리·단일 소스 맵·특화 문서. 한 프로젝트에만 적용.
- **규칙**: 새 원칙·결정이 "모든 시스템에 공통"이면 코어에, "이 프로젝트만 해당"이면 인스턴스에 둔다. 분리 전략은 [EVOLUTION_STRATEGY.md](./EVOLUTION_STRATEGY.md) 참조.

---

## 9. 요약

| 질문 | 답 |
|------|----|
| 원칙은 어떤 수준인가? | Tier 1(필수) / 2(권장) / 3(참고). 추가 시 Tier 지정. Judgment 층(B) 기본은 Tier 3이나 §1.1 참고 |
| 새 원칙은 어떻게 추가하는가? | 제안 → 검증 의무 확인 → 문서 배치 → 단일소스맵 반영(해당 시) → README·버전 갱신 |
| 기존 원칙 삭제 기준은? | 사유·대체안 문서화, 필요 시 ADR, Deprecated는 단계적 제거 |
| 모든 원칙은 check:*로 검증 가능한가? | Tier 1은 가능한 한 예. 불가 시 문서·리뷰로 보완 |
| 원칙 충돌 시 우선순위는? | 안전 > 구조 > 품질 > UX > 성능 |
| 단일 소스 맵은? | 새 단일 소스 원칙 추가 시 표에 반드시 추가 |

---

**이 문서가 있으면 Constitution은 "문서 모음"이 아니라 "운영 규칙"이 된다.**

**관련**: [EXECUTION_CONSTITUTION.md](./EXECUTION_CONSTITUTION.md), [SINGLE_SOURCE_MAP.md](./SINGLE_SOURCE_MAP.md), [adr/README.md](./adr/README.md)

**최종 업데이트**: 2026-03-21 — §0.1 메타 정합성, §1.1 Judgment 층 Tier 3 강제 범위
