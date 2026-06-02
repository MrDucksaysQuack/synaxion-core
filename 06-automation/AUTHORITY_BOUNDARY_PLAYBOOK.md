# Authority Boundary Playbook

> 인스턴스가 [EXECUTION_AUTHORITY_ALIGNMENT.md](../01-foundations/EXECUTION_AUTHORITY_ALIGNMENT.md)를 **운영**할 때 쓰는 재사용 템플릿.  
> **Tier**: 3 (도입 · 2.16.0)

**최종 업데이트**: 2026-06-02

---

## 1. 성숙도 4단계

| Stage | 이름 | 산출물 |
|-------|------|--------|
| **1** | 사건 | Incident·PR·빈 메트릭·RLS 오류 |
| **2** | 패턴 | 5+1종 분류에 매핑 (`F-①-xx`) |
| **3** | Rule + Inventory | AB-ID·Boundary Inventory 표·grep 블록 |
| **4** | CI | `check:authority-boundary` + allowlist 만료·Meta-Gate |

---

## 2. Findings Register (템플릿)

```markdown
| ID | Severity | Evidence (paths) | Why | Action | Status |
|----|----------|------------------|-----|--------|--------|
| F-①-01 | high | `src/api/...` | … | … | open/fixed |
```

- ID 접두: ① 권한 ② 환경 ③ 인터셉터 ④ SSOT ⑤ async ⑥ 덮어쓰기

---

## 3. Boundary Inventory (템플릿)

| Route/Job | Edge principal | Store policy | Rule A/B | Elevated OK? | Notes |
|-----------|----------------|--------------|----------|--------------|-------|
| `POST /api/...` | JWT | RLS+domain read | B, D | application only | |

---

## 4. Grep 패턴 (스택 중립)

```bash
# elevated in API layer
rg "getSupabaseAdmin|createServerClient|service_role" --glob '*.{ts,tsx}' app/api src/api

# CRUD factory tenant binding
rg 'createUniversalCRUDRouter\(\{' -A6

# public secret misuse
rg 'NEXT_PUBLIC_.*SECRET|NEXT_PUBLIC_.*CRON'

# schema drift (example table token)
rg 'from\(['\''"]<table>['\''"]\)' && rg '<table>' supabase/migrations

# silent empty on dependency failure
rg '\.catch\(\(\)\s*=>\s*\[\]\)'

# audit tables
rg "decision_logs|event_store|audit_"
```

인스턴스는 경로·함수명을 치환해 [AUTHORITY_BOUNDARY_CHECK_RULES.md](./AUTHORITY_BOUNDARY_CHECK_RULES.md) AB-ID와 연결.

---

## 5. 인스턴스 SSOT 예

| 인스턴스 | 경로 |
|----------|------|
| Itemwiki | `docs/planning/auth-boundary-hardening/`, `itemwiki-constitution` |
| Inflomatrix | `.cursor/plans/production-safety/AUTH_PERMISSION_BOUNDARY_FINDINGS.md` |

---

**제안자 인스턴스**: Itemwiki, Inflomatrix  
**Tier 3 등재일**: 2026-06-02
