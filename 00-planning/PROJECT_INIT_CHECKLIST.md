# Project Init Checklist

> [FORWARD_PLANNING_PROTOCOL.md](./FORWARD_PLANNING_PROTOCOL.md) Step 1~8 실행 체크리스트.  
> 신규 Synaxion 프로젝트 시작 시 이 목록을 복사해 `docs/planning/PROJECT_INIT_STATUS.md`로 추적할 수 있다.

---

## 메타

```
프로젝트명:
시작일:
담당:
Planning Complete 선언일: (미완료 시 비움)
```

---

## Step 1 — Product Intent

- [ ] `docs/planning/00-product-intent.md` 생성
- [ ] 무엇 / 누구 / 왜 지금 작성
- [ ] 비목표 3개 이상
- [ ] 성공 신호 정의

---

## Step 2 — Scope Boundary

- [ ] [SCOPE_BOUNDARY.md](../SCOPE_BOUNDARY.md) Coverage Eligibility 검토 기록
- [ ] Synaxion Core vs Project Guide 분류표 (예시 ≥1)

---

## Step 3 — Constitution Chapters

- [ ] 적용 헌법 챕터 체크리스트 완료
- [ ] `02-architecture-map.md`에 "적용 헌법" 표 반영

---

## Step 4 — Project Constitution

- [ ] `docs/<project>-constitution/README.md` (인덱스)
- [ ] ENV_CONTRACT 초안
- [ ] DB_CONTRACT (DB 사용 시)
- [ ] ROLLBACK_RUNBOOK 초안
- [ ] SLO + INCIDENT_RUNBOOK (운영 예정 시)
- [ ] EXPERIENCE_DIRECTION (브랜드 UI 있을 시)

---

## Step 5 — Delivery Target

- [ ] `docs/planning/01-delivery-target.md` 생성
- [ ] DELIVERY_READINESS_RUBRIC 목표 점수 (MVP / Production)
- [ ] 마일스톤별 최소 영역 점수 명시

---

## Step 6 — ADR

- [ ] `docs/adr/README.md`
- [ ] 기술 스택 ADR
- [ ] DB/인증 ADR (해당 시)
- [ ] ADR 번호·상태(Status) 관리 규칙 합의

---

## Step 7 — Feature Specs

- [ ] `docs/specs/` 디렉터리 생성
- [ ] MVP 기능 명세 ≥1 ([FEATURE_SPEC_TEMPLATE](./FEATURE_SPEC_TEMPLATE.md))
- [ ] 각 spec에 DoD·계약 참조

---

## Step 8 — Tasks

- [ ] `docs/tasks/` 디렉터리 생성
- [ ] 첫 스프린트 태스크 ≥1 ([TASK_SPEC_TEMPLATE](./TASK_SPEC_TEMPLATE.md))
- [ ] 태스크마다 `check:*` 완료 기준 명시
- [ ] (선택) `docs/execution/` 단계별 지침 디렉터리 준비

---

## Planning Complete (§1 8조건)

- [ ] §1 선언 조건 8개 전부 충족
- [ ] [EXECUTION_CONSTITUTION](../EXECUTION_CONSTITUTION.md) 부트스트랩 착수 또는 기존 레포 개발 재개

---

## 레거시 프로젝트인 경우

정방향 체크리스트 대신 또는 병행:

- [ ] [REVERSE_PLANNING_PROTOCOL](../11-protocols/REVERSE_PLANNING_PROTOCOL.md) 8단계
- [ ] `Synaxion Reconstruction Complete` 후 이 체크리스트의 미충족 항목만 보완

**최종 업데이트**: 2026-05-24
