# 시스템 명세(DSL) 작성 가이드

> **대상**: AI·생성기·사람이 `system-spec.schema.json`을 따르는 시스템 명세(JSON)를 채울 때 참고하는 필드별 설명과 예시.

**스키마**: [system-spec.schema.json](./system-spec.schema.json)  
**예시**: [example-spec.json](./example-spec.json)

---

## 필드별 설명

| 필드 | 필수 | 의미 | 예시 |
|------|------|------|------|
| **name** | ✅ | 시스템 식별 이름. 패키지명·디렉터리명·표시용. 소문자·하이픈 권장. | `"my-api"`, `"itemwiki"`, `"barcode-scanner-cli"` |
| **profile** | ✅ | 시스템 유형. `profiles/templates/manifest.json`에 등록된 ID와 일치해야 골격 생성 가능. | `"nextjs-monorepo"`, `"express-api"`, `"cli"` |
| **constitutionVersion** | — | 사용하는 Constitution 버전. 채우면 `check:constitution-version`에서 이 값이 VERSION·package.json과 일치하는지 검사. | `"2.2.0"` |
| **decisionIds** | — | 이 시스템이 사용하는 결정(축) ID 목록. 비어 있으면 프로파일 기본 또는 레지스트리 전체. `--emit-registry-fragment` 시 이 목록으로 레지스트리 조각 생성. | `["redirect-url", "auth-path-constants"]` |
| **layers** | — | 이 시스템의 계층 목록. 향후 `check:layer-boundaries` 등에서 경로·import 규칙에 사용. | `["Core", "Domain", "API"]` |
| **paths** | — | 프로젝트 내 경로 오버라이드. 스키마에만 정의되어 있으며, 생성기가 참고할 수 있음. | `{ "packages": "pkgs", "constitution": "docs/governance" }` |

---

## 예시: 최소 명세 (골격만 생성)

```json
{
  "name": "my-service",
  "profile": "express-api"
}
```

- `generate:from-spec -- --spec=this.json --target=./my-service` → `my-service/`에 express-api 골격 생성.

---

## 예시: Constitution 버전 + 결정 ID (검증·레지스트리 조각용)

```json
{
  "name": "itemwiki",
  "profile": "nextjs-monorepo",
  "constitutionVersion": "2.2.0",
  "decisionIds": ["redirect-url", "auth-path-constants", "api-permission"],
  "layers": ["Core", "Domain", "API", "lib", "web", "Frontend"]
}
```

- `constitutionVersion`: 버전 락 검사에 사용.
- `decisionIds`: `generate:from-spec -- --spec=this.json --emit-registry-fragment` 시 레지스트리에서 해당 결정만 추려 JSON 조각 출력.
- `layers`: 문서·도구에서 계층 경계 검사 시 참고.

---

## 예시: CLI 도구

```json
{
  "name": "barcode-cli",
  "profile": "cli",
  "constitutionVersion": "2.2.0"
}
```

- `scaffold:system -- --profile=cli --target=./barcode-cli --name=barcode-cli` 와 동일한 결과를 `generate:from-spec -- --spec=this.json --target=./barcode-cli` 로 낼 수 있음.

---

## AI가 채울 때 요약

1. **name**: 사용자 요청·목적에서 추린 식별자 (예: "결제 API" → `payment-api`).
2. **profile**: "웹 앱/Next.js" → `nextjs-monorepo`, "REST API" → `express-api`, "CLI/터미널 도구" → `cli`.
3. **constitutionVersion**: 현재 Constitution VERSION 파일 값과 맞추거나, 비워 두기.
4. **decisionIds**: 시스템이 “단일 소스”로 강제할 결정만 나열. 비우면 전체.
5. **layers**: 프로파일 기본값으로 두거나, 문서상 계층만 명시.

**관련**: [system-spec.schema.json](./system-spec.schema.json), [EVOLUTION_STRATEGY.md](../EVOLUTION_STRATEGY.md) §3
