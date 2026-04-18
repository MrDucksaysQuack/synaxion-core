# Constitution 자동 마이그레이션 가이드

> Constitution 버전 업 또는 Decision Registry 변경 시, 코드·문서·CI를 일관되게 맞추는 절차.

**작성일**: 2026-02-15

---

## 1. 버전 락 (Constitution 버전)

### 단일 소스

- **`docs/constitution/VERSION`** — Constitution 버전의 **단일 소스**. 여기만 수정하면 됨.
- `docs/constitution/README.md`의 `**버전**: x.y.z`와 `package.json`의 `constitutionVersion`은 **VERSION과 동기화**해야 함 (`check:constitution-version`이 검사).
- (Itemwiki 권장) 루트 `README.md`에 `**Constitution 락**: x.y.z` 한 줄이 있으면 **반드시 VERSION과 동일**해야 함 — 동일 스크립트가 검사한다.
- `docs/constitution/README.md` 상단 `**최종 업데이트**`와 하단(라이선스 블록) `최종 업데이트`는 **같은 날짜**로 맞춘다 ([META_CONSTITUTION.md](./META_CONSTITUTION.md) §0.1).

### 버전 업 시 체크리스트

1. **VERSION 파일 수정**
   ```bash
   echo "2.3.0" > docs/constitution/VERSION
   ```

2. **README 동기화**
   - `docs/constitution/README.md`에서 `**버전**: 2.2.0` → `**버전**: 2.3.0` 수정.
   - 루트 `README.md`에 `**Constitution 락**:` 줄이 있으면 같은 버전으로 수정.
   - 같은 PR에서 constitution README 상단·하단 `최종 업데이트` 날짜를 일치시킨다.

3. **package.json 동기화**
   - `"constitutionVersion": "2.2.0"` → `"2.3.0"` 수정.

4. **버전 락 검사**
   ```bash
   pnpm run check:constitution-version
   ```

5. **README 버전 히스토리**
   - `## 버전 히스토리` 표에 새 행 추가 (날짜, 변경 요약).

---

## 2. Decision Registry 변경 시

### 레지스트리 수정

- **프로젝트 적용 디렉터리의 `decision-registry.json`** 수정. (예: `docs/<project>-constitution/decision-registry.json`. Constitution 경전에는 레지스트리 **데이터**를 두지 않음.)
- 새 결정 축 추가 시: `id`, `title`, `singleSource`, `verificationScript`(또는 `verificationScripts`), `layers` 입력.
- **프로젝트의 SINGLE_SOURCE_MAP.md** (같은 적용 디렉터리) 표에 동일 내용 한 행 추가 (수동 또는 스크립트).

### 검증 연결

- `verificationScript` / `verificationScripts`에 해당 `check:*` 지정.
- 새 패턴이 필요하면 `scripts/check-single-source-drift.ts`에 규칙 추가 후, 레지스트리 해당 결정에 `check:single-source-drift` 연결.

### 마이그레이션 순서

1. 프로젝트 적용 디렉터리의 `decision-registry.json` 수정 (및 필요 시 스키마).
2. `pnpm run check:decision-registry -- --registry=<적용 디렉터리>/decision-registry.json --skip-scripts` 로 스키마만 검증.
3. `pnpm run check:decision-registry -- --registry=<적용 디렉터리>/decision-registry.json` 로 전체 검증(레지스트리 지정 스크립트 실행) 통과 확인.
4. 같은 적용 디렉터리의 `SINGLE_SOURCE_MAP.md` 동기화.
5. Registry 기반 생성 코드 재생성(사용 시):
   ```bash
   pnpm run generate:from-registry -- --registry=docs/<project>-constitution/decision-registry.json --output=packages/lib/core/decisions/registry-generated.ts
   ```
   (경로는 프로젝트 구조에 맞게 지정.)

---

## 3. 자동 마이그레이션 스크립트 (선택)

버전 업을 한 번에 적용하려면:

```bash
# 예: 버전을 2.3.0으로 올리는 경우
echo "2.3.0" > docs/constitution/VERSION
# README·package.json은 수동 또는 sed 등으로 치환 후
pnpm run check:constitution-version
```

`scripts/migrate-constitution-version.ts` 같은 스크립트를 두고, 인자로 새 버전을 받아 VERSION·README·package.json을 갱신한 뒤 `check:constitution-version`을 실행하도록 확장할 수 있음.

---

## 4. CI에서의 락

- **Constitution Check (PR)** 워크플로는 `check:constitution-pr`를 실행.
- `check:constitution-pr`에는 **check:constitution-version**이 포함되어 있음.
- 따라서 **VERSION ≠ README 또는 package.json**이면 PR이 실패하여, 버전 락이 깨진 채 머지되지 않음.

---

## 5. 요약

| 변경 유형 | 단일 소스 | 동기화 대상 | 검증 명령 |
|-----------|------------|-------------|-----------|
| Constitution 버전 업 | `docs/constitution/VERSION` | README.md, package.json | `pnpm run check:constitution-version` |
| Registry 수정 | 프로젝트 적용 디렉터리의 `decision-registry.json` | 같은 디렉터리의 SINGLE_SOURCE_MAP.md, 검증 스크립트 | `pnpm run check:decision-registry` (필요 시 `--registry=`) |
| Registry 기반 생성 코드 | — | 생성 출력 경로 | `pnpm run generate:from-registry` 후 check:all |

**관련**: [META_CONSTITUTION.md](./META_CONSTITUTION.md), [DECISION_REGISTRY.md](./DECISION_REGISTRY.md)

**최종 업데이트**: 2026-02-15
