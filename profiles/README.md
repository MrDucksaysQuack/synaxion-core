# 시스템 프로파일 (Profiles)

> **역할**: Constitution이 적용되는 **시스템 유형**을 정의한다.  
> 여러 종류의 시스템(Next.js 모노레포, Express API, CLI 등)에 동일 OS를 적용할 때, 프로파일별로 레이어·결정·경로를 다르게 줄 수 있다.

**스키마**: [system-spec.schema.json](./system-spec.schema.json) — "시스템 한 개"를 설명하는 최소 명세. **작성 가이드**: [DSL_WRITING_GUIDE.md](./DSL_WRITING_GUIDE.md). **예시 명세**: [example-spec.json](./example-spec.json).

---

## 프로파일 목록

| ID | 설명 | 골격 생성 |
|----|------|------------|
| **nextjs-monorepo** | Next.js 앱 + 패키지 모노레포 (lib, app). | `scaffold:system --profile=nextjs-monorepo --target=./my-app` |
| **express-api** | Express API 서버 (단일 서비스). | `scaffold:system --profile=express-api --target=./my-api` |
| **cli** | CLI 도구 (Node.js ESM, bin). | `scaffold:system --profile=cli --target=./my-cli --name=my-cli` |

템플릿 정의: [profiles/templates/](./templates/) — `manifest.json`, `<profile>.json`.

---

## 사용 방법

1. **시스템 골격 생성**: `pnpm run scaffold:system -- --profile=express-api --target=./my-api --name=my-api` — 프로파일별 디렉터리·파일 생성.
2. **DSL → 생성**: `pnpm run generate:from-spec -- --spec=./system-spec.json --target=./out` — 시스템 명세(DSL) 검증 후 프로파일 골격 생성 연동.
3. **Constitution 이식**: 새 프로젝트에 경전 복사는 `scaffold:constitution -- --target=./my-project`. 검증은 `check:constitution-version`, `check:decision-registry`(레지스트리 경로 지정).

---

## 새 프로파일 추가

1. **템플릿**: `profiles/templates/<profile-id>.json` 생성 — `dirs`, `files`(path, content). placeholders: `{{name}}`, `{{constitutionVersion}}`. `profiles/templates/manifest.json`의 `profiles` 배열에 ID 추가.
2. 이 README의 "프로파일 목록" 표에 한 행 추가.
3. `scaffold-system.ts`는 템플릿 디렉터리를 읽으므로 별도 수정 없이 동작.

**규칙**: 프로파일 ID는 소문자·하이픈만 사용 (예: `express-api`, `cli`).
