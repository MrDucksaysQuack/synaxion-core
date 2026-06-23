# Page Execution Contract Registry
# P0 페이지 실행 계약 레지스트리

> **P0 화면은 살아 있는 API contract test와 1:1로 묶인다.**

**Tier**: 2 (권장 · 2.18.0)  
**연계**: [GENERATION_ASSISTED_COVERAGE.md](./GENERATION_ASSISTED_COVERAGE.md) · [05-testing-principles/CONTRACT_TESTING.md](../05-testing-principles/CONTRACT_TESTING.md)

**최종 업데이트**: 2026-06-23

---

## 1. 레지스트리 스키마 (최소)

```json
{
  "pageId": "business.workspace",
  "route": "/workspace",
  "tier": "P0",
  "contractTests": ["workspace-flow.contract.test.ts"],
  "e2eRefs": ["workspace-flow.spec.ts"],
  "apiHints": ["/api/main/workspace"]
}
```

| 필드 | 필수 | 설명 |
|------|:---:|------|
| `pageId` | ✅ | Screen Inventory 앵커 |
| `route` | ✅ | canonical path |
| `tier` | ✅ | P0만 strict gate 대상 (인스턴스 정의) |
| `contractTests` | P0 ✅ | Jest contract — **파일 존재** 검증 |
| `e2eRefs` | ⬜ | Playwright spec |
| `apiHints` | ⬜ | grep·OpenAPI 앵커 |

---

## 2. 게이트

`check:page-execution-contracts`:

- P0 `pageId`마다 `contractTests` ≥ 1
- 나열된 파일이 repo에 존재
- orphan contract (레지스트리 미등록) warn

승격: [WARN_TO_STRICT_RATCHET.md](../06-automation/WARN_TO_STRICT_RATCHET.md)

---

## 3. Role×Goal과의 관계

[ROLE_GOAL_MATRIX_SCHEMA.md](./ROLE_GOAL_MATRIX_SCHEMA.md)의 `coverageKind: route|api|ci`와 **교차 참조**한다.  
Missing-Journey diff에서 P0 without contract = **구현 준비 미완** 신호.

---

## 4. Perf P0 (연계)

동일 P0 집합에 latency budget registry를 둘 수 있다 (`perf-p0-registry.json`, `check:perf-p0-registry`).

---

**실증**: Inflomatrix `PAGE-EXECUTION-MATRIX.md`, `page-execution-p0-registry.json` (2026-06)
