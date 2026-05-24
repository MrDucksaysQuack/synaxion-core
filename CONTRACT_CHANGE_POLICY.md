# Contract Change Policy

**Tier**: 1 (Synaxion Core)  
**목적**: 계약(DB, ENV, SLO, Runbook) 변경 시 ADR을 강제하여 추적 가능하게 한다.  
프로젝트 인스턴스는 이 정책을 `docs/<project>-constitution/`에 복사·확장하거나 `SYNAXION_CONTRACT_PATHS`로 `check:contract-adr`에 경로를 등록한다.

---

## ADR 필수 대상

다음 유형의 변경 시 **반드시** `docs/adr/`(또는 프로젝트 ADR 경로)에 ADR을 추가하거나 기존 ADR을 갱신한다:

| 계약 | 예시 |
|------|------|
| DB Contract | 테이블 추가, RLS, migration |
| ENV Contract | 필수 env 추가/제거 |
| SLO | 목표·error budget 변경 |
| Rollback / Incident Runbook | 절차·severity 변경 |
| Schema migration | `supabase/migrations/`, Prisma migrate 등 |

템플릿: [FEATURE_CONTRACT_TEMPLATE.md](./FEATURE_CONTRACT_TEMPLATE.md), [adr/README.md](./adr/README.md)

---

## 워크플로

```
1. 계약 문서 또는 migration 수정
2. docs/adr/NNNN-slug.md 작성 (adr/template.md 참조)
3. PR에 ADR 링크
4. pnpm run verify:core (인스턴스) 또는 check:contract-adr 통과
5. merge
```

---

## check 실패 → ADR 연계

| check | 실패 시 |
|-------|---------|
| `check:silent-failures` | ADR 또는 PR에 의도적 무시 근거 |
| `check:ux-risks` | UX Safety 예외 ADR 또는 수정 |
| `check:deployment-*` | Deployment contract ADR |
| `check:constitution-completeness` | 누락 문서 작성 + 신규 contract 시 ADR |

---

## 검증

```bash
# synaxion-core (reference instance)
cd synaxion-core && pnpm run verify:reference

# consumer project (truefarm 등)
pnpm run check:contract-adr
```

**최종 업데이트**: 2026-05-24
