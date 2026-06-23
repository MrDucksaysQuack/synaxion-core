# Cross-Instance Verification Patterns
# 인스턴스 간 검증 패턴 카탈로그

> **Inflomatrix·Itemwiki 등 인스턴스에서 실증된 `check:*` 패턴을 Synaxion 코어 인벤토리에 연결한다.**  
> 본 문서는 스크립트 구현을 복사하지 않고, **채택·승격 판단**을 위한 SSOT다.

**Tier**: 2 (권장 · 2.18.0)  
**연계**: [VERIFICATION_SCRIPTS.md](./VERIFICATION_SCRIPTS.md) · [META_CONSTITUTION.md](../META_CONSTITUTION.md) §0.3

**최종 업데이트**: 2026-06-23

---

## 1. 코어 vs 인스턴스

| 구분 | 위치 |
|------|------|
| **패턴·챕터·Tier** | 본 문서 + 해당 헌법 장 |
| **스크립트 구현** | 인스턴스 `scripts/check-*.ts` (필요 시 `synaxion-core/verification/` reference) |
| **레지스트리 데이터** | 인스턴스 JSON (`page-execution-p0-registry.json` 등) |

---

## 2. Inflomatrix 실증 패턴 (2.18.0 흡수)

### 구조·경계

| Pattern | Script | Synaxion doc |
|---------|--------|--------------|
| Application boundary | `check:application-boundary` | [APPLICATION_LAYER_BOUNDARY](../01-foundations/APPLICATION_LAYER_BOUNDARY.md) |
| API↔Engine | `check:api-engine-boundary` | LAYER_BOUNDARIES |
| Reverse (models→api) | `check:reverse-boundary` | LAYER_BOUNDARIES |
| Stream write gate | `check:stream-subdomain-write-policy` | [STRANGLER_PROMOTION_PLAYBOOK](../01-foundations/STRANGLER_PROMOTION_PLAYBOOK.md) |

### 신원·안전

| Pattern | Script | Synaxion doc |
|---------|--------|--------------|
| OAuth redirect SSOT | `check:oauth-redirect-policy` | [IDENTITY_FEDERATION_SPINE](../04-safety-standards/IDENTITY_FEDERATION_SPINE.md) |
| API origin SSOT | `check:api-origin-ssot` | IDENTITY_FEDERATION_SPINE §4 |
| Access Key invariants | `check:access-key-invariants` | EXECUTION_AUTHORITY_ALIGNMENT |
| Prod mock guard | `check:prod-mock-guard` | IDENTITY_FEDERATION_SPINE §4 |
| Auth boundary | `check:auth-boundary` | AUTHORITY_BOUNDARY_CHECK_RULES |

### UX·IA

| Pattern | Script | Synaxion doc |
|---------|--------|--------------|
| Nav discoverability | `check:nav-discoverability` | [NAVIGATION_DISCOVERABILITY](../07-frontend-ui/NAVIGATION_DISCOVERABILITY.md) |
| Menu depth / Hick | `check:menu-depth` | IA_NAVIGATION_PRINCIPLES |
| UX state coverage | `check:ux-state-coverage` | UX_CONSTITUTION UX-02 |
| Cognitive completeness | `check:cognitive-interface-completeness` | Ch.18 |
| IA alignment | `check:ia-alignment` | NAVIGATION_DISCOVERABILITY |
| Bespoke page governance | `check:bespoke-page-governance` | Ch.19 GAC |
| Domain route parity | `check:domain-route-parity` | N_WAY_CONSISTENCY_GATE |

### 제품·계약

| Pattern | Script | Synaxion doc |
|---------|--------|--------------|
| Page execution contracts | `check:page-execution-contracts` | [PAGE_EXECUTION_CONTRACT_REGISTRY](../19-product-ui-architecture/PAGE_EXECUTION_CONTRACT_REGISTRY.md) |
| Role×Goal coverage | `check:role-goal-coverage` | ROLE_GOAL_MATRIX_SCHEMA |
| Subdomain persona RBAC | `check:subdomain-persona-coverage` | Ch.19 Permission |
| Matrix N-way | `check:matrix-table-manifest:strict` | N_WAY_CONSISTENCY_GATE |

### 도구체인·메타

| Pattern | Script | Synaxion doc |
|---------|--------|--------------|
| JSX scope | `check:jsx-react-scope` | [BUILD_TOOLCHAIN_ALIGNMENT](./BUILD_TOOLCHAIN_ALIGNMENT.md) |
| Gate telemetry | `check:gate-coverage` | META_GATE_TELEMETRY |
| Check tier manifest | `check:tiers` | [CHECK_TIER_MANIFEST](./CHECK_TIER_MANIFEST.md) |
| DB migration order | `check:db-migration-order` | 17-data-db |

---

## 3. 승격 절차

1. 인스턴스에서 warn→strict 완료
2. 본 표에 행 추가 + 헌법 장 링크
3. (선택) `synaxion-core/verification/`에 reference 스크립트 추출
4. META §0.3 Tier 승격 ADR

---

## 4. 의도적 비포함 (인스턴스 전용)

- `check:platform-copy-d94`, genesis-journey-ui, portal-design hygiene
- Completion scorecard %, demo seed determinism 세부
- Inflomatrix plane 이름·matrix JSON 내용

**제안 인스턴스**: Inflomatrix `VERIFICATION_ALIGNMENT.md` (동기화 대상)
