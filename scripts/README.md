# Constitution 스크립트

> 이 디렉터리만 복사해도 다른 프로젝트에서 Constitution 검사·생성을 실행할 수 있도록 합니다.  
> 실행 시 **프로젝트 루트**에서 `tsx docs/constitution/scripts/<스크립트>.ts` 로 호출하세요.

## 경로 규칙

- 스크립트는 자신의 위치(`__dirname`)로부터 **Constitution 디렉터리** = `..` (상위), **프로젝트 루트** = `../..` (docs 상위)로 해석합니다.
- **레지스트리 경로**: Constitution 본문에는 레지스트리 **데이터**를 두지 않는다(경전 원칙). `--registry=<경로>` 또는 환경변수 `CONSTITUTION_REGISTRY_PATH`로 프로젝트의 `decision-registry.json` 경로를 지정한다. 미지정 시 `docs/itemwiki-constitution/decision-registry.json` 존재하면 사용(이 repo 호환).

## 스크립트 목록

| 파일 | 역할 |
|------|------|
| check-decision-registry.ts | 레지스트리 스키마 검증 + 등록된 verificationScript 실행 |
| check-decision-rules.ts | `decision-rules.example.json`(또는 `--rules=`). `pnpm` 스크립트는 `--strict-matcher-ref-reason` 포함. Itemwiki·번들: `check:decision-rules:itemwiki`, `check:judgment-runtime-rules`. 성공 시 `docs/constitution/fixtures/*.json` 동일 검증(`--skip-fixtures`로 생략) |
| check-judgment-contracts.ts | `evaluateJudgment` 직접 사용 허용 목록 (G1) — `pnpm run check:judgment-contracts` |
| judgment-eval-demo.ts | `evaluateJudgment` 데모 — `pnpm run judgment:demo` |
| judgment-federation-poc-demo.ts | 연합 PoC — `pnpm run judgment:poc:federation` |
| judgment-itemwiki-demo.ts | Itemwiki 규칙·실전 시나리오·multi-match·포맷터 — `pnpm run judgment:demo:itemwiki` |
| judgment-rule-productivity-experiment.ts | G6 규칙 생산성 스모크 — `pnpm run judgment:experiment:rule-add` ([SYNAXION_G6_METRICS_AND_RUNBOOK.md](../../analysis/SYNAXION_G6_METRICS_AND_RUNBOOK.md)) |
| synaxion-matcher-ref-snapshot.ts | G6 matcherRef 비율 스냅샷 — `pnpm run judgment:metrics:matcher-ref` (`--csv`, `--rules=`) |
| check-constitution-version.ts | VERSION ↔ README ↔ package.json 버전 일치 검사 |
| generate-from-registry.ts | decision-registry.json → generated/registry-generated.ts 생성 |
| check-decision-usage.ts | 미사용 결정 ID 경고 |
| check-decision-call-registry.ts | `checkDecision('id')` 문자열이 레지스트리에 없으면 실패 — `pnpm run check:decision-call-registry` (`check:constitution-pr` 포함) |
| scaffold-from-profile.ts | Constitution(경전) 복사 (다른 프로젝트 이식용, `--target=`) |
| scaffold-system.ts | 프로파일별 **시스템 골격** 생성 (② OS). `--profile=nextjs-monorepo|express-api`, `--target=`, `--name=` |
| generate-from-spec.ts | **DSL(시스템 명세)** 검증 후 scaffold-system 연동 (③ AI 엔진). `--spec=`, `--target=`, `--dry-run`, `--emit-registry-fragment`, `--output-fragment=` |

## 프로젝트에서 사용

루트 `package.json`에 예시:

```json
{
  "scripts": {
    "check:constitution-version": "tsx docs/constitution/scripts/check-constitution-version.ts",
    "check:decision-registry": "tsx docs/constitution/scripts/check-decision-registry.ts",
    "check:decision-usage": "tsx docs/constitution/scripts/check-decision-usage.ts",
    "generate:from-registry": "tsx docs/constitution/scripts/generate-from-registry.ts",
    "scaffold:constitution": "tsx docs/constitution/scripts/scaffold-from-profile.ts",
    "scaffold:system": "tsx docs/constitution/scripts/scaffold-system.ts",
    "generate:from-spec": "tsx docs/constitution/scripts/generate-from-spec.ts"
  }
}
```

**새 시스템 골격 생성**: `pnpm run scaffold:system -- --profile=express-api --target=./my-api --name=my-api`  
**DSL → 생성**: `pnpm run generate:from-spec -- --spec=./system-spec.json --target=./out`  
**Constitution만 이식**: `pnpm run scaffold:constitution -- --target=../other-project`

**이식 시**: `docs/constitution/` 전체를 복사한 뒤, 위 스크립트 경로만 새 프로젝트 루트 기준으로 맞추면 됩니다.
