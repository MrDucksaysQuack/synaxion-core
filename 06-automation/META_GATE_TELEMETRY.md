# Meta-Gate / Gate Telemetry
# 게이트 원격 측정 — 위양성 검출

> **게이트가 ✅로 통과했다는 신호와, 게이트가 *실제로 무언가를 검사했다*는 신호는 분리되어야 한다.**  
> 모든 게이트는 *검사 건수*를 발행한다. 검사 건수가 0이면 그 게이트는 거짓 통과이다.

**Tier**: 3 (도입 단계 · 2.15.0 신규)  
**상태**: Inflomatrix 인스턴스 audit(2026-05-28)에서 발견. `verify:api-7-stages` 가 빈 디렉터리(`src/tenant/business/backend/api/`)를 검사하며 strict ✅로 통과 — 0개 파일을 검사한 false positive. 트랙 P1-S로 해소.  
**연계**: [VERIFICATION_FRAMEWORK.md](./VERIFICATION_FRAMEWORK.md) · [VERIFICATION_SCRIPTS.md](./VERIFICATION_SCRIPTS.md) · [N_WAY_CONSISTENCY_GATE.md](../01-foundations/N_WAY_CONSISTENCY_GATE.md)

**최종 업데이트**: 2026-05-29

---

## 1. 문제

CI 게이트는 *signal*과 *coverage*를 동시에 제공한다고 *가정*된다.

- ✅ = *위반이 없다* (signal)
- ✅ = *모든 대상을 검사했다* (coverage)

그러나 이 두 신호는 *분리될 수 있다*. 게이트가 잘못된 디렉터리·잘못된 파일 패턴·잘못된 환경 변수를 보고 있으면, *0개 대상을 검사하고 ✅로 통과*한다. 이는 *침묵 실패*의 가장 위험한 형태다 — 시스템은 *안전하다고 자신*하지만 *실제로는 검증되지 않은 코드를 배포*한다.

이 문제는 코드 정적 검사·테스트 러너·linter·alignment 게이트 모두에서 발생한다. ESLint도 잘못된 glob을 지정하면 0 파일을 검사하고 통과한다. Jest도 잘못된 testMatch면 0 테스트로 통과한다.

---

## 2. 전환: 검사 건수를 *제일급 시그널*로 발행한다

**모든 게이트는 *검사 건수*를 stdout 또는 metadata로 발행해야 한다. 메타 게이트가 이 건수를 검증한다.**

- 게이트 stdout에 `📊 scanned: <N> files` 라인을 의무화한다.
- 메타 게이트(`check:gate-coverage`)는 각 게이트의 *최소 기대 건수*와 *실제 건수*를 비교한다.
- 검사 건수가 0이면 *시그널과 무관하게* 게이트는 실패한다.

---

## 3. 운영 원리 (Principles)

### Principle 1 — Coverage is a Signal (커버리지는 그 자체로 시그널이다)

게이트 통과 여부와 게이트 적용 범위는 *독립적으로* 검증된다. 둘 중 하나만 양호한 상태는 *부분 검증*으로 분류된다.

### Principle 2 — Empty Pass is Failure (공집합 통과는 실패다)

검사 대상이 0인 게이트 실행은 *디폴트로 실패*다. 의도된 0 대상은 *명시적 허용 목록*(`expectedZero: true`)으로 표기해야 한다.

### Principle 3 — Expected Bounds (기대 범위)

각 게이트는 *예상되는 최소/최대 검사 건수*를 메타데이터로 가진다. 실제 건수가 범위를 벗어나면 — 갑자기 절반으로 줄거나 두 배로 늘면 — 회귀 가능성으로 표기된다.

### Principle 4 — Telemetry as Code (원격 측정도 코드다)

게이트의 원격 측정 형식은 *문서가 아닌 코드 계약*이다. stdout 포맷이 깨지면 메타 게이트가 즉시 잡는다.

---

## 4. 발행 포맷 표준 (Telemetry Format)

게이트 스크립트는 *반드시* 다음 라인을 stdout에 발행한다.

```
📊 scanned: <N> files  (expected: <min>~<max>)
✅ violations: 0
```

또는 위반이 있을 때:

```
📊 scanned: <N> files  (expected: <min>~<max>)
❌ violations: <K>
   <file:line>: <message>
   ...
```

JSON 출력 모드(`--json`)도 지원:

```json
{
  "gate": "verify:api-7-stages",
  "scanned": 42,
  "expected": { "min": 30, "max": 200 },
  "violations": 0,
  "exitCode": 0
}
```

---

## 5. Inflomatrix 실증 — P1-S 트랙 (2026-05-28~29)

| 항목 | Before (audit 발견) | After (P1-S 해소) |
|------|---------------------|-------------------|
| `verify:api-7-stages` 스캔 루트 | `src/tenant/business/backend/api/` (.gitkeep만 존재) | `src/api/` (실제 라우트) |
| 검사 파일 수 | **0** | **42** |
| CI ✅ 의미 | false positive | true positive |
| 베이스라인 파일 | 없음 | `.audit/verify-7stages-baseline.txt` (스캔 증거) |

audit의 정적 분석 단계에서 발견되지 않았다면, *7개월간* 게이트가 거짓 통과를 발행했을 가능성이 있다.

---

## 6. 메타 게이트 구현 권장 (check:gate-coverage)

```ts
// scripts/check-gate-coverage.ts (개념 스케치)
interface GateExpectation {
  gate: string;           // npm script 이름
  expectedMin: number;    // 최소 검사 건수
  expectedMax?: number;   // 최대 (회귀 감지용)
  rationale: string;      // 왜 이 수치인가
}

const EXPECTATIONS: GateExpectation[] = [
  { gate: 'verify:api-7-stages',     expectedMin: 30, expectedMax: 200, rationale: 'src/api/ 도메인+system 라우트' },
  { gate: 'check:layer-boundaries',  expectedMin: 100,                  rationale: 'frontend .tsx 전수' },
  { gate: 'check:matrix-table-manifest', expectedMin: 8,                rationale: 'manifest 시드 8 서브도메인 이상' },
  // ...
];
```

메타 게이트는 *주간 1회* 또는 *PR 머지 시* 실행되어, 모든 게이트의 telemetry를 수집·검증한다.

---

## 7. 적용 체크리스트

새 게이트를 도입할 때 다음을 *반드시* 충족한다.

- [ ] 스캔 루트 경로가 *존재*하는지 게이트 자체가 검증한다 (없으면 즉시 실패).
- [ ] 스캔 파일 수를 stdout에 발행한다 (`📊 scanned: <N> files`).
- [ ] 기대 검사 건수 최소값을 `EXPECTATIONS` 또는 게이트 헤더 주석에 명시한다.
- [ ] `--json` 출력 모드를 지원한다 (CI 메트릭 수집용).
- [ ] *공집합 통과*를 허용하는 경우 `--allow-empty` 플래그를 명시적으로 요구한다.

---

## 8. 한계

- **유효한 0 케이스** — 일부 게이트는 *정말로* 0 대상을 가질 수 있다(예: 도입 초기, 일부 빈 디렉터리). 이 경우 `expectedMin: 0, expectedMax: 0` + 주석으로 *왜* 0인지 명시. 그렇지 않으면 메타 게이트가 잡는다.
- **동적 글로브** — testMatch 등 동적 글로브 패턴은 시점마다 결과가 다를 수 있다. 이 경우 *상대적 변화*(어제 대비 ±20% 이내)를 검증한다.
- **메타 게이트 자체의 신뢰성** — 메타 게이트도 메타-메타 게이트가 필요한가? 실용적으로는 불필요 — 메타 게이트는 *극히 단순*하게 유지하고 정기 리뷰로 충분하다.

---

## 9. 곱하기 효과

- **[N_WAY_CONSISTENCY_GATE](../01-foundations/N_WAY_CONSISTENCY_GATE.md)과 결합**: 각 정합 쌍이 telemetry를 발행하면, *어느 쌍이 검사되지 않았는지*를 즉시 식별 가능.
- **[ADJACENT_DEBT_RULE](../02-development-framework/ADJACENT_DEBT_RULE.md)과 결합**: 매 PR마다 *수정된 파일 수* 대비 *게이트가 검사한 파일 수*를 비교 — 누락 검출.
- **[RECURSIVE_LAYERING_PRINCIPLE](../01-foundations/RECURSIVE_LAYERING_PRINCIPLE.md)과 결합**: 각 추상 수준의 매트릭스 게이트가 telemetry를 *같은 포맷*으로 발행하면, 메타 게이트가 *모든 층*을 동일하게 검증.

---

## 10. 검증

- 게이트 telemetry 포맷 준수: `check:gate-telemetry-format` (제안) — 모든 게이트 stdout이 `📊 scanned:` 라인을 포함하는지.
- 기대 범위 명세 존재: 모든 `check:*`·`verify:*` 스크립트의 헤더 주석 또는 `EXPECTATIONS` 등록부에 명시.
- 메타 게이트 정기 실행: `check:gate-coverage` 가 `check:all` 또는 nightly job에 포함.

---

## 11. 참고

- [VERIFICATION_FRAMEWORK.md](./VERIFICATION_FRAMEWORK.md) — 검증 일반 원칙
- [VERIFICATION_SCRIPTS.md](./VERIFICATION_SCRIPTS.md) — `check:*` 스크립트 카탈로그
- Inflomatrix `scripts/verify-api-7-stages.ts` — P1-S 트랙 적용 사례
- Inflomatrix `.audit/verify-7stages-baseline.txt` — telemetry 산출 예
- Inflomatrix `INFLOMATRIX_COMPLETENESS_AUDIT.html` §갭 — 발견 맥락

---

**제안자**: Inflomatrix instance (2026-05-29)  
**Tier 3 등재일**: 2026-05-29 (Synaxion 2.15.0)
