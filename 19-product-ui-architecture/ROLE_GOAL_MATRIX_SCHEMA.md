# Role×Goal Matrix — 기계 판독 SSOT 스키마

> **Synaxion Ch.19** · [GENERATION_ASSISTED_COVERAGE.md](./GENERATION_ASSISTED_COVERAGE.md) §3-A  
> **용도**: 큐레이션된 Role×Goal 열거 → Missing-Journey diff CI 입력

---

## 1. 원칙

- **카르테시안 곱 금지**: 파일에는 **실제 제품이 보장해야 하는 Goal**만 등록한다.
- **출처 추적**: `sources`에 markdown SSOT 링크 (critical path, journey, handoff).
- **coverageKind**로 CI 검사 범위를 구분한다 — 모든 행이 `route`일 필요 없음.

---

## 2. 최상위 객체

```json
{
  "schemaVersion": "1.0",
  "product": "inflomatrix",
  "synaxionRef": "synaxion-core/19-product-ui-architecture/ROLE_GOAL_MATRIX_SCHEMA.md",
  "sources": [
    "docs/testing/INFLOMATRIX_CRITICAL_PATHS.md"
  ],
  "entries": []
}
```

| 필드 | 필수 | 설명 |
|------|:---:|------|
| `schemaVersion` | ✅ | 현재 `"1.0"` |
| `product` | ✅ | 인스턴스 식별자 |
| `sources` | ✅ | 큐레이션 근거 문서 경로 |
| `entries` | ✅ | Goal 행 배열 |

---

## 3. Entry 스키마

```json
{
  "id": "CP-3",
  "role": {
    "personaId": "P-BIZ-01",
    "plane": "business"
  },
  "goal": "로그인→Workspace→Flow 실행",
  "routeHints": ["/login", "/workspace"],
  "coverageKind": "route",
  "tier": "P0",
  "journeyRef": "J-BIZ-01",
  "e2eRefs": ["workspace-flow.spec.ts"],
  "suggestedArchetype": "queue",
  "notes": "선택 — drift·시드 의존 메모"
}
```

### 필드

| 필드 | 필수 | 설명 |
|------|:---:|------|
| `id` | ✅ | 안정 ID (`CP-*`, `J-*`, `H-*` 등) |
| `role.personaId` | ✅ | `01-PERSONAS` 앵커 |
| `role.plane` | ✅ | `platform` \| `business` \| `site` \| `portal` |
| `goal` | ✅ | 한 문장 Goal (Ch.19 Goal 축) |
| `routeHints` | △ | `coverageKind: route`일 때 **최소 1개** |
| `apiHints` | △ | `coverageKind: api`일 때 **최소 1개** (`src/api` grep) |
| `coverageKind` | ✅ | 아래 표 |
| `tier` | ✅ | `P0` \| `P1` \| `P2` (인스턴스 정의) |
| `journeyRef` | ⬜ | `02-JOURNEY-MAPS` ID |
| `e2eRefs` | ⬜ | E2E spec 파일명 — **P0 `api`/`flow`/`ci` 필수** (존재 검증) |
| `gateRefs` | ⬜ | contract test · CI gate 스크립트 — `api`/`ci` P0 대안 |
| `suggestedArchetype` | ⬜ | `list` \| `detail` \| `create` \| `queue` \| `approval` \| `report` — **제안만**, 자동 생성 아님 |
| `inventoryRefs` | ⬜ | `04-SCREEN-INVENTORY` 앵커 |
| `auditRefs` | ⬜ | `PAGE-AUDIT-MATRIX` 행 |
| `notes` | ⬜ | 시드·mock·live 갭 메모 |

### coverageKind

| 값 | CI 동작 |
|----|---------|
| `route` | `routeHints`가 Router 소스 또는 04 Inventory에 존재해야 함 |
| `api` | (v2) `apiHints` → `src/api` grep | Inflomatrix `check:role-goal-coverage` |
| `ci` | 문서화만 — 배포 게이트 등 |
| `flow` | 엔진·FlowCategory — v1은 경고만, route 미검사 |

---

## 4. Missing-Journey diff 알고리즘 (normative)

인스턴스 CI (`check:role-goal-coverage` 등):

```
FOR each entry WHERE coverageKind = 'route':
  matched = ANY(routeHint IN router_scan) OR ANY(routeHint IN inventory_doc)
  IF NOT matched AND tier = 'P0':
    FAIL with entry.id
  IF NOT matched AND tier IN (P1, P2):
    WARN
```

**3-way drift** (확장):

```
inventory_has = routeHint mentioned in 04-SCREEN-INVENTORY
router_has    = routeHint in tenant router TSX
matrix_has    = entry in role-goal-matrix.json

drift = matrix_has AND NOT (inventory_has AND router_has)  → report per entry
```

---

## 5. 거버넌스 연동

- 신규 P0 Goal: matrix entry + `sources` 문서 + 규칙 3 동반 갱신 ([GOVERNANCE](./GOVERNANCE.md) 규칙 7).
- `suggestedArchetype` 변경만으로 merge 불가 — Split/Tab은 6차원·Ch.10 게이트.

---

## 6. 인스턴스 예시

Inflomatrix: [`docs/inflomatrix-constitution/ui-architecture/role-goal-matrix.json`](../../docs/inflomatrix-constitution/ui-architecture/role-goal-matrix.json)

---

**최종 업데이트**: 2026-06-18
