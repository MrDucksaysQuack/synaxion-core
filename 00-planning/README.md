# 00 — Planning (정방향 계획)

> **Synaxion Constitution 00장 — 계획 층**  
> "어떻게 만드는가"(Engineering Constitution) 이전에  
> **"만들기 전에 무엇을·왜·어디까지 계획하는가"**를 정의한다.

---

## 역할

| 프로토콜 | 방향 | 대상 |
|----------|------|------|
| [FORWARD_PLANNING_PROTOCOL.md](./FORWARD_PLANNING_PROTOCOL.md) | 정방향 | 새 프로젝트·새 기능 |
| [11-protocols/REVERSE_PLANNING_PROTOCOL.md](../11-protocols/REVERSE_PLANNING_PROTOCOL.md) | 역방향 | 레거시·미완성 프로젝트 복원 |
| [EXECUTION_CONSTITUTION.md](../EXECUTION_CONSTITUTION.md) | 실행 | 코드·구조 부트스트랩 (계획 **이후**) |

```
계획 (00-planning) → 실행 (EXECUTION + 01~17) → 검증 (06-automation) → 배포·운영 (15~16)
         ↑                                                      |
         └──────── Reverse Planning (기존 코드에서 계획 복원) ────┘
```

---

## 이중 사용 구조

`planning/` 디렉토리는 방향만 다르고 구조는 같다.

```
정방향 (새 프로젝트·기능)          역방향 (레거시·미완성)
─────────────────────────         ────────────────────────────
의도 명시                          코드 분석
    ↓                                  ↓
planning/00-product-intent.md     planning/extraction/
planning/01-delivery-target.md         SOURCE_INVENTORY.md
planning/02-architecture-map.md        EVIDENCE_MAP.md
                                       UNKNOWN_REGISTER.md
                                       CONFLICT_GAP_REGISTER.md
                                            ↓
                                  planning/00-product-intent.md (복원)
                                  planning/01-delivery-target.md (복원)
                                  planning/02-architecture-map.md (복원)
         ↓                                  ↓
Synaxion Planning Complete        Synaxion Reconstruction Complete
         ↓                                  ↓
         └──────── 동일한 실행 단계로 진입 ──────────┘
                    (EXECUTION_CONSTITUTION)
```

---

## 문서 목록

| 문서 | 용도 |
|------|------|
| [FORWARD_PLANNING_PROTOCOL.md](./FORWARD_PLANNING_PROTOCOL.md) | 새 프로젝트 8단계·새 기능 5단계 절차 |
| [PROJECT_INIT_CHECKLIST.md](./PROJECT_INIT_CHECKLIST.md) | Step 1~8 체크리스트 (프로젝트 시작) |
| [PLANNING_DIRECTORY_STANDARD.md](./PLANNING_DIRECTORY_STANDARD.md) | 모든 Synaxion 프로젝트의 `docs/` 표준 구조 |
| [FEATURE_SPEC_TEMPLATE.md](./FEATURE_SPEC_TEMPLATE.md) | `docs/specs/` 기능 명세 템플릿 |
| [TASK_SPEC_TEMPLATE.md](./TASK_SPEC_TEMPLATE.md) | `docs/tasks/` Cursor 실행 태스크 템플릿 |

---

## Harness 템플릿

프로젝트 `docs/planning/` 초안 작성 시 복사:

| 템플릿 | 경로 |
|--------|------|
| Product Intent | [harness/forward-planning/00-product-intent.template.md](../harness/forward-planning/00-product-intent.template.md) |
| Delivery Target | [harness/forward-planning/01-delivery-target.template.md](../harness/forward-planning/01-delivery-target.template.md) |
| Architecture Map | [harness/forward-planning/02-architecture-map.template.md](../harness/forward-planning/02-architecture-map.template.md) |

역방향 `planning/extraction/`:

| 템플릿 | 경로 |
|--------|------|
| Extraction README | [harness/reverse-planning/extraction-README.template.md](../harness/reverse-planning/extraction-README.template.md) |
| Source Inventory | [harness/reverse-planning/SOURCE_INVENTORY_TEMPLATE.md](../harness/reverse-planning/SOURCE_INVENTORY_TEMPLATE.md) |

---

## Tier

- **Tier 2** (권장): 신규 프로젝트·마일스톤 시작 시 필수에 가깝게 적용
- 자동 `check:*` 대상은 아님. 완료 여부는 PR·릴리스 리뷰와 [DELIVERY_READINESS_RUBRIC](../DELIVERY_READINESS_RUBRIC.md) 자가 평가로 보완

**최종 업데이트**: 2026-05-24
