# Constitution 진화 전략

> **현재**: 구조 생성 + 검증 강제 + 거버넌스 + 자동화를 포함한 **운영 시스템(OS)**  
> **선택지**: Itemwiki 전용 유지 / 여러 시스템 생성용 OS 확장 / AI 기반 자동 시스템 생성 플랫폼 엔진

**작성일**: 2026-02-15

---

## 1. Itemwiki constitution 안에서 해도 되나?

**결론: 네. Itemwiki 내 `docs/constitution/`에서 진행해도 된다.** 단, **코어와 인스턴스를 구분**하는 게 중요하다.

| 구분 | 위치 | 역할 |
|------|------|------|
| **코어** | `00~09`, `scripts/`, `generated/`, `decision-registry.json`(스키마), META/EXECUTION/SINGLE_SOURCE/DECISION_REGISTRY | 어떤 프로젝트에 이식해도 쓸 수 있는 **범용 OS** |
| **인스턴스** | `itemwiki-specific/`, 레지스트리의 Itemwiki 전용 결정(e.g. `e2e-mode`, `profile-display-name`) | **이 프로젝트 한정** 적용 |

- **지금 할 일**: 코어는 “프로젝트 중립”으로 유지하고, Itemwiki 전용 것은 `itemwiki-specific/`·레지스트리 일부로만 두기.
- **나중에**: 여러 시스템용 OS나 AI 플랫폼이 필요해지면, **코어만** 별도 repo/패키지로 분리하고 Itemwiki는 그걸 “한 명의 소비자”로 사용하면 된다.
- **문서화**: 이 문서와 README에 “코어 vs Itemwiki 인스턴스” 구분을 적어 두면, 나중에 분리·재사용 시 혼란이 줄어든다.

---

## 2. (2) 여러 시스템 생성용 OS로 확장 — 어떻게?

목표: **한 Constitution 코어**로 “여러 종류의 시스템(Next.js 모노레포, Express API, CLI 등)”을 생성·검증할 수 있게 하는 것.

### 2.1 단계별로 할 수 있는 일

1. **이식성 강화 (이미 진행됨)**  
   - `docs/constitution/`만 복사해 다른 프로젝트에서 스크립트·검증 실행 가능.  
   - 여기서 멈춰도 “여러 프로젝트에 동일 OS 적용”은 이미 가능.

2. **시스템 프로파일 도입**  
   - `decision-registry.json` 또는 별도 설정에 **시스템 유형** 개념 추가.  
   - 예: `"systemProfile": "nextjs-monorepo" | "express-api" | "cli"`  
   - 검증 스크립트·생성 스크립트가 이 프로파일에 따라 “어떤 레이어/어떤 규칙을 적용할지” 선택.

3. **스캐폴드/생성기 정리**  
   - “새 프로젝트 뼈대”를 만드는 스크립트를 Constitution 쪽에 두기.  
   - 예: `scripts/generate-project.ts` → 프로파일 + 레지스트리 기반으로 `packages/`, `app/`, `docs/constitution/` 골격 생성.  
   - 생성 결과가 곧바로 `check:layer-boundaries`, `check:decision-registry` 등으로 검증 가능하도록 설계.

4. **코어 분리 (선택)**  
   - Itemwiki와 무관한 “순수 Constitution 코어”를 별도 패키지/repo로 빼고, Itemwiki는 그 패키지를 의존성으로 쓰기.  
   - 이때 Itemwiki 전용 결정·문서는 Itemwiki 쪽에만 두고, 코어는 프로파일·스키마·검증 로직만 포함.

### 2.2 Itemwiki 내에서 시작하는 방법

- **지금 repo 안에서**:  
  - `docs/constitution/` 아래에 `profiles/` 또는 `templates/` 디렉터리를 두고,  
    - `nextjs-monorepo`(현재 Itemwiki 구조),  
    - `express-api`(예시)  
    같은 “시스템 프로파일”을 문서 + (선택) JSON/TS 설정으로 정의.  
  - `scripts/generate-from-registry.ts`를 확장해 “프로파일별로 다른 출력 경로/규칙”을 지원하거나,  
    새 스크립트 `scripts/scaffold-system.ts`를 두어 “프로파일 이름을 받아 골격 생성”까지 할 수 있다.  
- 이렇게 하면 **Itemwiki constitution 안에서** “여러 시스템 생성용 OS”의 1차 버전을 만들 수 있고, 필요해지면 그때 코어만 분리하면 된다.

---

## 3. (3) AI 기반 자동 시스템 생성 플랫폼 엔진 — 어떻게?

목표:  
**registry → DSL → 코드 생성 → 구조 검증 → 자동 배포**까지 한 흐름으로 연결해, AI가 “시스템 명세”를 만들고 Constitution이 검증·생성·배포까지 담당하는 플랫폼.

### 3.1 연결 고리

| 단계 | 내용 | Constitution과의 관계 |
|------|------|------------------------|
| **Registry** | 결정·단일소스·검증 스크립트 선언 (현재 `decision-registry.json` 등) | 이미 있음 |
| **DSL** | “시스템이 무엇을 하며, 어떤 레이어/경로를 가지는지”를 기술하는 형식 (스키마·문법 정의) | 새로 정의 필요 |
| **코드 생성** | DSL + 레지스트리 규칙에 따라 프로젝트 골격/보일러플레이트 생성 | `generate-from-registry` 확장 또는 별도 생성기 |
| **구조 검증** | 생성 결과에 대해 `check:layer-boundaries`, `check:decision-registry` 등 실행 | 현재 스크립트 재사용 |
| **자동 배포** | 검증 통과 시 빌드·배포 파이프라인 연결 | CI/CD와 Constitution 검사 통합 |

### 3.2 단계적으로 갈 수 있는 길

1. **DSL 설계 (스키마 먼저)**  
   - “시스템 한 개”를 설명하는 최소 스키마를 JSON Schema 또는 작은 문법으로 정의.  
   - 예: 시스템 이름, 프로파일, 엔드포인트 목록, 사용할 결정 ID 목록, 배포 타겟 등.  
   - 이 스키마를 `docs/constitution/` 또는 별도 스펙 디렉터리에 두고, Itemwiki는 그 스키마의 “한 인스턴스”로 본다.

2. **레지스트리 ↔ DSL 연결**  
   - DSL 인스턴스가 “어떤 결정(decision id)을 쓸지” 명시하고,  
     생성/검증 스크립트가 그 목록과 `decision-registry.json`을 함께 읽어서 동작하도록 함.  
   - 그러면 “AI가 만든 시스템 명세(DSL)”와 “Constitution이 강제하는 결정·검증”이 자연스럽게 연결된다.

3. **코드 생성기**  
   - DSL + 레지스트리 + (선택) 프로파일을 입력으로 받아,  
     디렉터리 구조·파일·보일러플레이트를 출력하는 스크립트/도구를 만듦.  
   - 1차는 Itemwiki 구조를 템플릿으로 두고, DSL에서 “이름/경로만 바꾼” 수준이어도 됨.  
   - 생성 결과는 반드시 `check:*`로 검증 가능한 형태로 만드는 것이 목표.

4. **검증 자동화**  
   - 생성 직후 또는 PR에서 `check:constitution-pr`(또는 동일 역할) 실행.  
   - 통과 시에만 배포 파이프라인으로 넘기도록 CI 설정.  
   - 이 부분은 이미 “Constitution 검사 통과 시에만 머지”와 같은 형태로 확장 가능.

5. **AI 역할**  
   - AI는 “DSL 인스턴스 작성” 또는 “자연어 → DSL” 변환을 담당하고,  
     코드 생성·검증·배포는 Constitution 쪽 스크립트/파이프라인이 담당하는 구조로 두면,  
     Constitution이 **플랫폼의 핵심 엔진**이 된다.

### 3.3 Itemwiki 내에서 해도 되는지

- **가능하다.**  
  - DSL 스키마·예시, 레지스트리와의 연결 방식, 코드 생성기 1차 버전을 모두 Itemwiki repo의 `docs/constitution/`(및 필요 시 `scripts/`, `profiles/`) 안에서 개발할 수 있다.  
  - Itemwiki는 “첫 번째로 이 OS를 쓰는 시스템”이 되고, 여기서 검증된 설계가 나중에 다른 시스템·다른 repo로 복제·분리되면 된다.  
- **주의할 점**:  
  - “코어(DSL 스키마, 검증 규칙, 생성 로직)”와 “Itemwiki 전용 설정·결정”은 구분해 두어야, 나중에 플랫폼 엔진만 분리할 때 깔끔해진다.

---

## 4. 선택지별 현재 충족도

Constitution(경전)이 세 가지 전략 선택지를 **지금 얼마나** 충족하는지 정리한다.

| 선택지 | 충족도 | 현재 상태 | 부족한 것 |
|--------|--------|-----------|------------|
| **① Itemwiki 전용 유지** | ✅ 구조적으로 완전 충족 | Constitution은 경전(프로젝트 중립). Itemwiki 적용은 `docs/itemwiki-constitution/`에만 있음. Itemwiki만 쓰더라도 “경전 + 한 프로젝트 적용”으로 유지 가능. | — |
| **② 여러 시스템 생성용 OS** | 🟢 약 85% | 이식성 ✅. 프로파일·시스템 명세 스키마 ✅. **프로파일별 골격 생성** ✅(`scaffold-system.ts`, `profiles/templates/` — nextjs-monorepo, express-api). 레지스트리·검증 프로젝트별 경로 ✅. | 프로파일별 **골격 생성기** 없음(예: `express-api` 프로파일로 새 프로젝트 뼈대 생성). Constitution 쪽에 “프로파일 이름 → 디렉터리/파일 템플릿” 생성 스크립트가 있으면 ② 완성에 가까움. |
| **③ AI 기반 자동 시스템 생성 플랫폼 엔진** | 🟢 약 70% | **Registry** ✅. **DSL 스키마** ✅. **DSL→생성** ✅(`generate-from-spec.ts`: 명세 검증 후 scaffold-system 연동). **검증** ✅. **검증 후 배포 트리거** ✅([DEPLOYMENT_TRIGGER.md](./06-automation/DEPLOYMENT_TRIGGER.md) 문서·예시). | **DSL 인스턴스 → 코드/디렉터리 생성** 없음. **자동 배포** 연동 없음. AI가 “자연어→DSL” 또는 “DSL 편집”을 하고, Constitution이 “DSL→생성·검증·배포”를 맡는 파이프라인이 없음. |

### 한 줄 요약

- **①**: 이미 “Itemwiki 전용으로만 쓴다”를 깔끔하게 유지할 수 있는 구조다.
- **②**: “여러 프로젝트에 같은 OS 적용”은 가능하고, “프로파일만 지정해 새 시스템 골격을 자동 생성”이 들어가면 ②를 거의 다 채운다.
- **③**: DSL 명세 → 검증 → 골격 생성까지 연결됨. 검증 통과 시 배포 트리거는 CI 예시로 문서화. AI가 DSL만 출력하면 Constitution이 생성·검증·배포 훅까지 제공.

---

## 5. 요약

| 질문 | 답 |
|------|----|
| 2·3번 방향 작업을 어디서 하나? | 경전(`docs/constitution/`)은 유지하고, 프로젝트 적용·실험은 `docs/itemwiki-constitution/` 또는 별도 repo에서. |
| 2번을 더 채우려면? | 추가 프로파일(예: cli)·템플릿 확장. (이미 scaffold:system 있음) |
| 3번을 더 채우려면? | AI 자연어→DSL 또는 DSL 편집 UI; 배포 스크립트는 프로젝트별. (DSL→생성·배포 훅 문서는 있음) |

---

## 6. 충족도 향상: 부족한 것과 다음 단계

아래는 **지금 없는 것**과, 충족도를 더 올리기 위한 **구체적 액션**이다.

### ② 여러 시스템 생성용 OS (85% → 95%+)

| 부족한 것 | 영향 | 다음 단계 (우선순위) |
|-----------|------|------------------------|
| **프로파일 수** | nextjs-monorepo, express-api만 있음. CLI·정적 사이트 등이 없음. | 1) `profiles/templates/cli.json` 추가 — bin, package.json(type: module), README. manifest.json에 cli 추가. |
| **생성 후 검증 자동 실행** | 골격만 만들고, 생성된 프로젝트에서 check:*를 수동 실행해야 함. | 2) `scaffold-system.ts` 끝에 옵션으로 `--run-check` 시 생성된 디렉터리에서 `check:constitution-version`(또는 가능한 check) 한 번 실행. |
| **템플릿 커스터마이징** | 프로젝트가 템플릿 내용을 덮어쓰거나 확장하려면 JSON 직접 수정. | 3) (선택) `--overrides=./my-overrides.json` 처럼 파일 경로·내용 오버라이드 지원. |
| **프로파일별 레이어·규칙** | check:layer-boundaries 등이 프로파일에 따라 다른 경로를 보진 않음. | 4) (선택) 시스템 명세의 `layers`·`paths`를 읽어서 check 스크립트에 전달하는 옵션. |

### ③ AI 기반 자동 시스템 생성 플랫폼 엔진 (70% → 90%+)

| 부족한 것 | 영향 | 다음 단계 (우선순위) |
|-----------|------|------------------------|
| **자연어 → DSL** | AI가 “Express API 하나 만들어줘”라고 하면 DSL을 직접 만들 수 있어야 함. Constitution 밖(프롬프트·에이전트) 영역. | 1) Constitution 쪽: **DSL 필드 가이드** 문서 — “이 필드는 이렇게 채우면 된다” 예시. AI가 스키마만 보고 채울 수 있도록. |
| **DSL 편집 UI** | 사람이 시스템 명세를 GUI로 만들고 수정하는 도구 없음. | 2) (선택) 단순 폼(이름, 프로파일, 결정 ID 목록)만 있는 정적 HTML/스크립트를 `profiles/` 또는 별도 도구로 제공. 또는 외부 도구가 system-spec.schema.json을 참고해 폼 생성. |
| **DSL → 레지스트리 연결** | generate-from-spec는 골격만 생성. 명세의 `decisionIds`로 프로젝트용 decision-registry.json 조각을 생성하는 건 없음. | 3) `generate-from-spec` 확장: `--emit-registry-fragment` 시 spec.decisionIds 기반으로 `decision-registry.json`에 넣을 JSON 조각을 stdout 또는 파일로 출력. |
| **실제 배포 연동** | DEPLOYMENT_TRIGGER는 예시일 뿐. “검증 통과 → 이 스크립트 실행” 훅이 Constitution 표준으로 없음. | 4) (선택) `scripts/post-constitution-check.sh` 같은 **훅 스크립트** 규약 — 프로젝트가 이 이름의 스크립트를 두면 check:constitution-pr 성공 후 CI에서 호출. 문서만 명시해도 됨. |

### 한 줄 요약: 뭐가 부족한가?

- **②**: 프로파일 더 추가(cli 등), **생성 직후 check 한 번 돌리기** 옵션, (선택) 템플릿 오버라이드·프로파일별 레이어 경로.
- **③**: **DSL 작성 가이드**(AI용), (선택) DSL 편집 UI, **명세→레지스트리 조각 출력**, (선택) **검증 후 훅** 규약.

이 문서는 전략·로드맵 성격이므로, 실제 변경이 있을 때마다 META_CONSTITUTION·README·이 문서를 함께 갱신하는 것을 권장한다.

---

## 7. 판단 헌법(Judgment) 층 — 안정 경계 vs 인스턴스

Synaxion은 **Engineering 층**(레이어·API·테스트·`decision-registry`)과 **Judgment 층**([12-judgment-constitution/](./12-judgment-constitution/README.md))을 구분한다.

| 구분 | 코어(경전)에 둔다 | 인스턴스(프로젝트)에 둔다 |
|------|------------------|---------------------------|
| **안정** | [JUDGMENT_OUTPUT_TYPE.md](./12-judgment-constitution/JUDGMENT_OUTPUT_TYPE.md), `judgment-output.schema.json`, ERIC 정의, outcome 열거형, `decision-rules.schema.json`, 코어 예시 `decision-rules.example.json`, 데이터 플로·엔진 인터페이스 **문서** | — |
| **가변** | — | `decision-rules.json`(도메인 규칙), 연합 신뢰·출처 정책, 실제 스토리지·API 스키마 |

**Itemwiki — 적용 전략·로드맵은 코어 본문에 흡수하지 않음**: 파이프라인 수렴 단계, Gate vs Judgment 운영, G6 체크리스트, Synaxion 배포·SLO 등 **제품별 문서**는 [12-judgment-constitution/README.md — Itemwiki rollout documentation map](./12-judgment-constitution/README.md#itemwiki-rollout-documentation-map)의 링크 표를 단일 진입점으로 쓴다(내용 복사 금지, 링크만 유지).

**규칙**: Judgment 층의 **형식**(스키마·열거형)을 바꿀 때는 ADR·버전 히스토리를 남기고, `check:decision-rules`가 통과하도록 예시 JSON을 함께 갱신한다.
