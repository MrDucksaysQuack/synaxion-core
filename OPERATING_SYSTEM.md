# Constitution 운영 시스템 (OS) 요약

> **Constitution은 문서가 아니라 "구조 생성 + 검증 강제 + 거버넌스 + 자동화"를 포함한 운영 시스템이다.**

**개발 가이드 ❌ · 아키텍처 문서만 ❌ · 코드 스타일 규칙만 ❌**  
→ **운영 OS ✅**

---

## 1. 이 OS가 제공하는 것

| 영역 | 내용 |
|------|------|
| **구조 생성** | `generate:from-registry`(결정 ID·타입), `generate:adr`, `generate:domain`, `generate:api-route`, `scaffold:constitution`(경전 복사), **`scaffold:system`**(프로파일별 골격), **`generate:from-spec`**(DSL→검증·생성) |
| **검증 강제** | `check:constitution-version`, `check:layer-boundaries`, `check:silent-failures`, `check:decision-registry`, **`check:decision-rules`**(판단 규칙 코어 예시), `check:constitution`, `check:single-source-drift` 등 — PR/로컬에서 위반 시 차단. Judgment **출력 타입**: [JUDGMENT_OUTPUT_TYPE.md](./12-judgment-constitution/JUDGMENT_OUTPUT_TYPE.md), [judgment-output.schema.json](./judgment-output.schema.json) |
| **거버넌스** | META_CONSTITUTION(Tier·변경 절차·충돌), SINGLE_SOURCE_MAP(결정→단일 소스→검증), DECISION_REGISTRY(미등록 사용 시 실패 목표) |
| **자동화** | 레지스트리에 등록된 `verificationScript`를 `check:decision-registry`가 자동 실행; CI에서 `check:constitution-pr` 필수 |

---

## 2. 한 줄 흐름

```
레지스트리(결정·단일소스·검증) → 생성(registry-generated, 스캐폴드) → 검증(check:*) → 통과 시 머지/배포
```

- **Registry**: `decision-registry.json` — 무엇이 단일 소스인지, 어떤 check를 돌릴지 선언.
- **생성**: 레지스트리에서 결정 ID·타입 생성; (선택) 프로파일 기반 스캐폴드.
- **검증**: `check:constitution-pr` 또는 `check:all`로 구조·침묵실패·단일소스·레지스트리 지정 검증까지 실행.
- **거버넌스**: META에 따라 새 원칙은 Tier·검증·단일소스맵 반영 의무.

---

## 3. 진화 방향 (선택)

| 단계 | 설명 |
|------|------|
| **현재** | 프로젝트 중립 운영 OS. Constitution(경전)만 복사해 어떤 프로젝트에도 적용 가능. |
| **(2) 여러 시스템용 OS** | 프로파일(nextjs-monorepo, express-api) 골격 생성 ✅. `scaffold:system`, [profiles/templates/](./profiles/templates/). [EVOLUTION_STRATEGY.md](./EVOLUTION_STRATEGY.md) |
| **(3) AI 플랫폼 엔진** | DSL→검증·생성 ✅. 검증 후 배포 트리거 문서 ✅. [generate-from-spec](./scripts/generate-from-spec.ts), [DEPLOYMENT_TRIGGER.md](./06-automation/DEPLOYMENT_TRIGGER.md). |

---

## 4. 관련 문서

- [META_CONSTITUTION.md](./META_CONSTITUTION.md) — 변경·Tier·검증 의무  
- [EXECUTION_CONSTITUTION.md](./EXECUTION_CONSTITUTION.md) — 부트스트랩 9단계  
- [DECISION_REGISTRY.md](./DECISION_REGISTRY.md) — 결정 레지스트리  
- [06-automation/VERIFICATION_SCRIPTS.md](./06-automation/VERIFICATION_SCRIPTS.md) — check:* 인벤토리  
- [EVOLUTION_STRATEGY.md](./EVOLUTION_STRATEGY.md) — 진화 전략  
- [profiles/README.md](./profiles/README.md) — 시스템 프로파일  
- [12-judgment-constitution/README.md](./12-judgment-constitution/README.md) — 판단 헌법(Judgment 층), `check:decision-rules`  

**최종 업데이트**: 2026-03-20
