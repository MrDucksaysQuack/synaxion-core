# 검증 후 배포 트리거

> **③ AI 플랫폼 엔진** 연결: Constitution 검증이 통과한 뒤에만 배포 단계를 실행하도록 CI에서 연결한다.

---

## 원칙

- **검증 → 배포 순서**: `check:constitution-pr`(또는 `check:all`)이 성공한 뒤에만 배포 job을 실행한다.
- Branch protection에서 "Constitution Check (PR)"을 필수로 두면, 머지된 코드는 이미 검증된 상태이므로 배포 파이프라인에서 동일 검증을 한 번 더 실행하거나, 머지 시 배포를 트리거할 수 있다.

**메인 앱(Vercel 등 Git 연동 배포)**: 저장소 내 배포 워크플로가 없고 Vercel 등이 Git 푸시/머지로 배포하는 경우, `main`/`develop` 브랜치에 대한 Branch protection에서 **"Constitution Check (PR)"** 체크를 필수로 설정한다. 그러면 머지되는 모든 커밋이 이미 `check:constitution-pr`를 통과한 상태이므로, 배포가 트리거될 때 추가 검증 없이 "검증 후 배포" 원칙을 만족한다. (설정: GitHub 저장소 → Settings → Branches → Branch protection rules → Require status checks to pass before merging.)

### 운영 체크리스트 (Itemwiki)

- [ ] `main` / `develop` 보호 규칙에 **PR Checks**(`pr-checks.yml`) 필수 — lint·type-check·build·**`test:contract`·`test:unit`**·**`check:ux-risks`** 가 항상 실행된다.
- [ ] 동일 규칙에 **Constitution Check (PR)**(`constitution-check-pr.yml`) 필수 — `check:constitution-pr` 전체(버전·decision·api-7-stages 등).
- [ ] Vercel 등 Git 연동 배포만 쓰는 경우, 위 체크가 없으면 머지된 커밋이 검증 없이 배포될 수 있다.

---

## 예시: GitHub Actions

```yaml
# 검증 통과 후 배포 트리거 예시
deploy:
  needs: [constitution-check, build]  # constitution-check job이 성공해야 진행
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Constitution 검증 (배포 전 재확인)
      run: pnpm run check:constitution-pr
    - name: Deploy
      run: # 실제 배포 스크립트 (예: Vercel, AWS, 등)
```

**constitution-check job** 예시:

```yaml
constitution-check:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v2
      with:
        version: 8
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'
    - run: pnpm install --frozen-lockfile
    - name: Constitution PR 검증
      run: pnpm run check:constitution-pr
```

---

## 요약

| 단계 | 내용 |
|------|------|
| 1. 검증 | `check:constitution-pr` 또는 `check:all` |
| 2. 통과 시 | 다음 job에서 배포 실행 (needs 또는 조건부 step) |
| 3. 실패 시 | 배포 미실행, PR 머지 차단(권장) |

이 연결이 되어 있으면 **Registry → 검증 → 배포**까지 Constitution이 관여하는 운영 체인이 완성된다.

**관련**: [VERIFICATION_SCRIPTS.md](./VERIFICATION_SCRIPTS.md), [CI_CD_INTEGRATION.md](./CI_CD_INTEGRATION.md)

**최종 업데이트**: 2026-03-19
