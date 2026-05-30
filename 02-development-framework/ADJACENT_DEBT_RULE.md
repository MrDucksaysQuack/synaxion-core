# Adjacent Debt Rule (Touch-It Type-It)
# 인접 부채 통행료 원칙

> **기술 부채는 *전담 스프린트*로 갚지 않는다. *통행료*로 갚는다.**  
> 파일을 수정할 때마다, 그 파일의 인접 부채(any · unused · TODO)를 *함께* 정리한다.

**Tier**: 3 (도입 단계 · 2.15.0 신규)  
**상태**: Inflomatrix 인스턴스에서 ESLint overrides + CLAUDE.md 원칙으로 실증. 6개월간 max-warnings 3600 → 348 (~87% 감축, 별도 부채 정리 스프린트 0회).  
**연계**: [REFACTORING_SAFETY_PRINCIPLE.md](./REFACTORING_SAFETY_PRINCIPLE.md) · [8_STAGE_METHODOLOGY.md](./8_STAGE_METHODOLOGY.md) · [LINTING_STANDARDS.md](../06-automation/LINTING_STANDARDS.md)

**최종 업데이트**: 2026-05-29

---

## 1. 문제

기술 부채 관리에는 통상 두 가지 접근이 있다.

- **전담 스프린트** — 분기당 1~2주 "부채 정리 스프린트". 일정·우선순위·예산 협상 비용이 큰 만큼 *건너뛰기 쉽다*. 결국 부채는 *지수적으로 누적*된다.
- **방치** — 부채를 *문서화만* 하고 손대지 않음. 새 기능 속도는 *느려지고* 개발자 만족도는 *떨어진다*.

Boy Scout Rule("발견한 것보다 깨끗하게")은 *방향*은 옳지만 *측정 불가능*하고 *강제 불가능*하다. 코드 리뷰어 개개인의 성격에 의존한다.

---

## 2. 전환: 부채 정리를 *기능 작업의 통행료*로 만든다

**파일을 수정한다는 사실 자체가 그 파일의 인접 부채 일부를 정리할 의무를 발생시킨다.**

- *기능 PR*은 자기 변경 범위와 *동일 파일*의 부채를 일정 비율 함께 줄여야 머지된다.
- 부채 정리를 위한 *별도 PR*은 필요 없다 (장려도 하지 않는다 — 변경 동기와 분리되면 휘발성이 높다).
- 강제 메커니즘은 *CI 메트릭* (max-warnings · any 카운트 · TODO 카운트의 *감소* 또는 *유지*).

---

## 3. 운영 원리 (Principles)

### Principle 1 — Debt Is a Toll, Not a Sprint (부채는 스프린트가 아닌 통행료)

부채 정리는 *기능 작업의 통행료*다. 스프린트로 분리하면 *우선순위 협상*이라는 마찰 비용이 정리 비용보다 커진다.

### Principle 2 — Adjacency Is the Scope (인접성이 범위다)

수정한 파일의 부채만 *책임 범위*다. 다른 파일의 부채는 *다른 통행자*가 갚는다. 책임 분산이 통행료를 *지속 가능*하게 만든다.

### Principle 3 — Measurable & Enforceable (측정 가능·강제 가능)

부채 수치는 *기계적으로* 측정된다 — `: any` 카운트, unused import 카운트, TODO 카운트, lint warnings 카운트. 어느 것도 사람의 해석을 요구하지 않는다.

### Principle 4 — Monotonic Improvement (단조 개선)

총 부채 수치는 *증가하지 않는다*. 신규 코드가 부채를 추가하지 않게 [GRADIENT_STRICTNESS](#62-gradient-strictness와의-결합)로 보강한다.

---

## 4. 운용 규칙

기능 PR이 머지되려면 *모두* 충족한다.

1. **신규 라인은 부채를 추가하지 않음** — 새 파일은 ESLint override에서 `error` 영역에 자동 포함되거나 명시적으로 추가된다.
2. **수정 파일의 부채는 *증가하지 않음*** — `lint-staged` 또는 PR diff 분석으로 `: any`·unused import 신규 등장 차단.
3. **수정 파일에 *기존* 부채 ≥ 1건이 있다면 *최소 1건 정리*** — TODO 1개 해결, 또는 `: any` 1개 타입화. 의무는 작지만 누적된다.
4. **부채 카운트의 *총합*은 PR 머지 후 감소 또는 유지** — `monitor:lint-baseline` 또는 동등 메트릭이 이를 강제.

---

## 5. Inflomatrix 실증 (2026-02~05)

| 시점 | max-warnings (전체) | 비고 |
|------|---------------------|------|
| 2026-02-15 (Synaxion 2.11.0 적용 시작) | ~3,600 | 베이스라인 |
| 2026-04-30 | ~1,200 | Stream B/C/D 페이지 확장기 — 신규 코드 ESLint error override 시작 |
| 2026-05-28 | 348 | audit 시점, ~87% 감축 |

이 기간에 *전담 부채 정리 스프린트는 0회* 진행되었다. 모든 감축은 *기능 PR의 통행료*로 일어났다.

---

## 6. 결합 패턴

### 6.1 Touch-It Type-It (구체적 변형)

가장 일반적인 인접 부채는 *암시적 any*다. 파일을 수정할 때 그 파일의 `: any` 1건을 *적절한 타입으로 교체*한다. 이를 "Touch-It Type-It"이라 부른다. CLAUDE.md에 운영 원칙으로 이미 존재.

### 6.2 Gradient Strictness와의 결합

- 신규 파일 경로 → ESLint `no-explicit-any: error`
- 레거시 파일 경로 → ESLint `no-explicit-any: warn`
- "touch"가 일어나면 해당 파일이 *신규 경로 목록*으로 이동 (자동 또는 수동)

이 조합이 *부채 카운트의 단조 감소*를 보장한다.

### 6.3 다층 적용 — RECURSIVE_LAYERING_PRINCIPLE

Touch-It Type-It은 *코드 부채*에만 적용되지 않는다. 같은 사고법을 다음에도 적용한다.

- **문서 부채** — 문서 수정 시 그 문서의 outdated 링크 1건을 함께 수정.
- **테스트 부채** — 컴포넌트 수정 시 그 컴포넌트의 skipped test 1건을 활성화 또는 삭제.
- **매트릭스 부채** — 매트릭스 엔티티 수정 시 그 엔티티의 누락된 관계 1건을 정의.

같은 원칙이 4개 축에서 작동한다 — [RECURSIVE_LAYERING_PRINCIPLE](../01-foundations/RECURSIVE_LAYERING_PRINCIPLE.md) §6 *곱하기 효과*.

---

## 7. 한계

- **대규모 부채에는 부족** — 1만 줄짜리 monolith 단일 파일의 부채는 *어떤 통행료도 따라잡지 못한다*. 이런 경우 별도 *모듈 분할 PR*이 필요하다 — 단, 그 PR 자체가 본 원칙의 예외가 된다.
- **자동 측정 가능한 부채에 한정** — *알고리즘 부적합*, *추상화 누수* 같은 의미론적 부채는 측정 불가능. 본 원칙은 *그런 부채에는 적용 안 함*. 정직하게 *문법적 부채*에 한정한다.
- **신규 부채 통제와 결합 필수** — 신규 코드가 매번 부채를 *추가*하면 통행료가 만회하지 못한다. Gradient Strictness가 *반드시* 동반되어야 한다.

---

## 8. 검증

### 8.1 PR 단위 게이트

```bash
# 수정된 파일 목록 추출
git diff --name-only origin/main...HEAD

# 각 파일의 부채 카운트 비교 (before vs after)
# - any: grep -cE ": *any\b|<any>|as any\b"
# - unused: eslint --rule "unused-imports/no-unused-imports: error" --no-eslintrc
# - TODO: grep -cE "TODO|FIXME|XXX|HACK"

# Rule: 각 카운트가 *증가하지 않음*
```

### 8.2 베이스라인 단조 감소 모니터

```ts
// scripts/monitor-lint-baseline.ts (개념)
// 전체 max-warnings 수치를 일별 기록
// 7일 평균이 *증가하면* 알람
```

### 8.3 ESLint Overrides 자동 등록

```js
// .eslintrc.cjs
overrides: [
  {
    files: [
      // 신규 파일 경로 (touch 시 자동 추가)
      'src/.../**/*.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'unused-imports/no-unused-imports': 'error',
    },
  },
],
```

---

## 9. 곱하기 효과 (Multiplicative)

- [RECURSIVE_LAYERING_PRINCIPLE](../01-foundations/RECURSIVE_LAYERING_PRINCIPLE.md)과 결합 → 코드·문서·테스트·매트릭스 4축 동시 적용.
- [N_WAY_CONSISTENCY_GATE](../01-foundations/N_WAY_CONSISTENCY_GATE.md)과 결합 → 매트릭스 정합 부채도 통행료 대상.
- [META_GATE_TELEMETRY](../06-automation/META_GATE_TELEMETRY.md)과 결합 → 부채 측정 자체가 *공집합 통과*되지 않도록 검증.

---

## 10. 참고

- [REFACTORING_SAFETY_PRINCIPLE.md](./REFACTORING_SAFETY_PRINCIPLE.md) — 안전한 리팩터 원칙
- [LINTING_STANDARDS.md](../06-automation/LINTING_STANDARDS.md) — lint 기준
- Inflomatrix `CLAUDE.md` (Touch-It Type-It 운영 원칙)
- Inflomatrix `.eslintrc.cjs` — Gradient Strictness 구현
- Inflomatrix `docs/inflomatrix-constitution/LINT_WARNING_BASELINE.md` — 베이스라인 기록

---

**제안자**: Inflomatrix instance (2026-05-29)  
**Tier 3 등재일**: 2026-05-29 (Synaxion 2.15.0)
