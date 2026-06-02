# Authority Boundary Check Rules (AB Catalog)

> **Tier**: 2 (권장 · 2.16.0) — Itemwiki + Inflomatrix에서 동일 AB-ID로 재현.  
> **원칙 SSOT**: [EXECUTION_AUTHORITY_ALIGNMENT.md](../01-foundations/EXECUTION_AUTHORITY_ALIGNMENT.md)  
> **Playbook**: [AUTHORITY_BOUNDARY_PLAYBOOK.md](./AUTHORITY_BOUNDARY_PLAYBOOK.md)

**최종 업데이트**: 2026-06-02

---

## 인스턴스 구현 이름

| Synaxion (보편) | 인스턴스 예 |
|-----------------|-------------|
| `check:authority-boundary` | Itemwiki / Inflomatrix: `check:auth-boundary` |

스크립트는 **설정 파일·allowlist 경로만** 바꿔 재사용한다. 규칙 ID(AB-xx)는 동일하게 유지.

---

## AB 규칙 카탈로그

| ID | 일반형 | 전형적 grep / heuristic | Severity |
|----|--------|-------------------------|----------|
| **AB-01** | Route/handler에서 elevated persistence client 직접 생성 | `getSupabaseAdmin`, `createServerClient` + service role in `app/api` / `src/api` | error |
| **AB-02** | Generic CRUD/factory without tenant or policy binding | `createUniversalCRUDRouter({` without `tenantId` / permission config | error |
| **AB-03** | Public build env as server-only secret | `NEXT_PUBLIC_*` used for cron/webhook secret fallback | error |
| **AB-04** | Code references table/column absent from migration SSOT | table name in code, 0 hits in `migrations/` | warn→error per team |
| **AB-05** | Optional auth + sensitive mutation without second gate | `requireAuth: false` + POST/PATCH on tenant data | error |
| **AB-06** | Split token extraction SSOT (Bearer vs cookie vs body) | `getAccessTokenFromRequest` vs `…IncludingAuthCookie` both in API layer | warn |
| **AB-07** | Unguarded read on resource with mutation guards | GET list/detail without read permission when CUD guarded | error |
| **AB-08** | Cross-tenant header/body when authenticated principal present | `x-tenant-id` overrides JWT tenant without reject | error |

### AB-02 보조 (인스턴스)

- Collection path `{tenantId}` in URL ≠ factory `tenantId` config — heuristic must strip false positives.

### Allowlist (Tier 2·3)

- **만료일·사유·AB-ID** 필수. “영구 0 finding”은 목표이지 Tier 3 필수 조건 아님.
- Application-layer elevated only (AB-01 예외) → inventory 행 + 리뷰 주기.

---

## Meta-Gate 연계

`check:authority-boundary` exit 0 이고 allowlist가 **만료 없는 백로그**가 아니면 건강. [META_GATE_TELEMETRY.md](./META_GATE_TELEMETRY.md) — 공집합 통과만으로 “검사함” 주장 금지.

---

## Tier 승격 (§0.3)

| Tier | 조건 |
|------|------|
| **2** (현재) | 2인스턴스 + AB 카탈로그·playbook |
| **1** | 2+ 외부 인스턴스 exit 0 + `check:all` 또는 `check:constitution-pr` 포함 + allowlist 최소화 |

---

**제안자 인스턴스**: Itemwiki, Inflomatrix  
**Tier 2 등재일**: 2026-06-02
