# ADR-0007: Synaxion 2.16.0 — Execution Authority Alignment (Tier 3 + AB Tier 2)

**상태**: 수락  
**일자**: 2026-06-02  
**참조**: [META_CONSTITUTION.md §0.3](../META_CONSTITUTION.md)

---

## 상황 (Context)

Itemwiki auth-boundary hardening과 Inflomatrix `AUTH_PERMISSION_BOUNDARY_FINDINGS`에서 **동형 5+1 실패 패턴**이 반복되었다.

- 실행 principal ≠ 정책 principal (privileged client on user paths, unguarded read)
- 환경·비밀 downgrade (`NEXT_PUBLIC_*`, missing service env)
- 인터셉터·tenant 컨텍스트 불일치
- 스키마·permission SSOT 드리프트
- audit fail-open + silent success on dependency failure

[TRUST_BOUNDARY_PRINCIPLE.md](../01-foundations/TRUST_BOUNDARY_PRINCIPLE.md)는 *책임 한계*만 다루며, *어떤 자격으로 시스템이 행동하는가*는 별도 SSOT가 필요했다.

## 결정 (Decision)

Synaxion **2.15.0 → 2.16.0** minor:

1. **신규 Tier 3**: [EXECUTION_AUTHORITY_ALIGNMENT.md](../01-foundations/EXECUTION_AUTHORITY_ALIGNMENT.md)
2. **신규 Tier 2**: [AUTHORITY_BOUNDARY_CHECK_RULES.md](../06-automation/AUTHORITY_BOUNDARY_CHECK_RULES.md) (AB-01~08)
3. **신규 Tier 3 playbook**: [AUTHORITY_BOUNDARY_PLAYBOOK.md](../06-automation/AUTHORITY_BOUNDARY_PLAYBOOK.md)
4. **보강**: `7_STAGE_LOGIC_CONSTRUCTION.md` § Authority at boundary · `LOGGING_OBSERVABILITY_PRINCIPLES.md` § Rule C · `TRUST_BOUNDARY` cross-ref · `VERIFICATION_SCRIPTS.md` § authority-boundary
5. **VERSION** 2.16.0 · META §0.3 표 갱신

인스턴스 구현명 `check:auth-boundary` → Synaxion 보펼명 `check:authority-boundary` (스크립트는 인스턴스 레포).

## 대안 (Alternatives)

- **Tier 1 즉시 승격** — 2인스턴스만으로는 check:* 코어 강제까지는 이르다 → AB Tier 2, 원칙 Tier 3.
- **Supabase 레시피를 Synaxion에 포함** — 거절. 스택 중립 norm만 유지.

## 결과 (Consequences)

- Itemwiki·Inflomatrix planning/ops 문서가 Synaxion 원칙을 **인용**할 수 있음.
- 6개월 내 제3 인스턴스 AB check 재사용 시 Tier 1 승격 검토.

---

**제안자 인스턴스**: Itemwiki, Inflomatrix  
**저자**: Inflomatrix maintainer (Synaxion submodule)
