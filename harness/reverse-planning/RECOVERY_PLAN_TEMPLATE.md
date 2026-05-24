# Recovery Plan

> **Reverse Planning Protocol — Step 8 산출물**  
> Conflict & Gap Register와 Reconstruction Scorecard를 바탕으로  
> 개발 재개를 위한 구체적인 행동 계획을 정의한다.

---

## 메타

```
프로젝트명: [프로젝트명]
작성 일시: [YYYY-MM-DD]
Reconstruction Score: [총점] / 25
작성: [AI 모델 또는 담당자]
```

---

## 1. 삭제할 코드·기능

| 대상 | 위치 | 삭제 이유 | 우선순위 |
|------|------|---------|---------|
| | | | |

삭제 원칙:

```
- 다른 기능과 연결이 끊긴 dead code
- 더 이상 사용되지 않는 route 또는 component
- 충돌을 발생시키는 중복 구현
- 명확히 폐기 결정된 기능 (Unknown이 해소된 경우에만)
```

---

## 2. 보존할 코드·기능

| 대상 | 위치 | 보존 이유 |
|------|------|---------|
| | | |

---

## 3. 수정이 필요한 계약·코드

| 항목 | 현재 상태 | 목표 상태 | 우선순위 | 참조 Synaxion 규칙 |
|------|---------|---------|---------|-----------------|
| | | | | |

---

## 4. 재작성이 필요한 영역

| 영역 | 재작성 이유 | 범위 | 우선순위 |
|------|----------|------|---------|
| | | | |

---

## 5. Unknown 해소를 위한 질문 목록

개발 재개 전에 사람에게 확인해야 하는 사항들.

| # | 질문 | 답변이 필요한 이유 | 질문 대상 |
|---|------|----------------|---------|
| 1 | | | |

---

## 6. check:* 후보 목록

복원 과정에서 식별된 자동화 검증 후보.

| check 이름 (예시) | 검증 대상 | 기존 Synaxion check 참조 |
|-----------------|---------|----------------------|
| `check:layer-boundaries` | 레이어 경계 위반 | 기존 |
| `check:rls-coverage` | DB 테이블 RLS 누락 | 신규 후보 |
| `check:timeout-missing` | 외부 호출 타임아웃 없음 | 신규 후보 |
| | | |

---

## 7. 개발 재개 순서 제안

```
Phase 1 — 즉시 해소 (Breaking Conflict / Critical Gap)
  1. [항목]
  2. [항목]

Phase 2 — Unknown 해소 (팀 확인 필요)
  1. [질문 목록의 High 우선순위 항목]

Phase 3 — 계약 복원 완성
  1. [미복원 계약 문서 완성]

Phase 4 — 정상 개발 재개
  → Synaxion Planning 디렉토리 기준으로 개발 진행
```

---

## 8. Synaxion Reconstruction Complete 선언 체크

```
[ ] Source Inventory 완성 (모든 source type 최소 1회 스캔)
[ ] 모든 routes, APIs, DB tables, roles, env vars, services 매핑
[ ] 모든 복원 가능한 계약 문서 작성 (미작성은 Unknown 명시)
[ ] 모든 Observed 주장에 Evidence Pointer 연결
[ ] Evidence 없는 내용은 Inferred 또는 Unknown으로 분류
[ ] Conflict & Gap Register 완성
[ ] Unknown Register 완성 + 질문 목록 정리
[ ] Recovery Plan 존재 (본 문서)
[ ] check:* 후보 목록 식별
[ ] 이 프로젝트는 정상 Synaxion Planning 규칙 하에 개발 재개 가능
```

모든 체크 완료 시 → **Synaxion Reconstruction Complete** 선언 가능
