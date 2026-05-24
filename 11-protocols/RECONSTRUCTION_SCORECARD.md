# Reconstruction Scorecard

> **Synaxion Reverse Planning Protocol 부속 문서**  
> 미완성·레거시 프로젝트의 Synaxion 복원 완성도를 평가하는 채점 기준이다.  
> REVERSE_PLANNING_PROTOCOL.md §3 Step 7에서 사용한다.

---

## §1 채점 구조

Reconstruction Readiness는 5개 항목 × 5점 만점 = **총 25점** 기준으로 평가한다.

```
Reconstruction Readiness Score = S1 + S2 + S3 + S4 + S5  (최대 25)
```

---

## §2 S1 — Source Coverage (소스 커버리지)

**질문**: AI가 프로젝트의 모든 주요 source surface를 스캔했는가?

| 점수 | 기준 |
|------|------|
| 0 | 일부 파일만 임의로 읽음 |
| 1 | 주요 기능 코드만 읽음 (config·schema 미확인) |
| 2 | 코드 + package/config 확인 |
| 3 | 코드 + package/config + API/DB/UI/test 확인 |
| 4 | 위 + CI/deployment/env/docs까지 확인 |
| 5 | Source Inventory 문서 완성 + 접근 불가 파일 별도 기록 |

**스캔 체크 목록**:

```
[ ] package.json / lock file
[ ] tsconfig / next.config / vite.config / 기타 build config
[ ] UI routes (src/app 또는 pages/)
[ ] API routes
[ ] components / lib / services
[ ] DB migrations / schema files
[ ] supabase config / RLS policies (해당 시)
[ ] tests (unit / integration / e2e)
[ ] scripts
[ ] env.example / .env.sample
[ ] CI workflow files
[ ] deployment config
[ ] README / docs / ADR / 기타 문서
```

---

## §3 S2 — Contract Coverage (계약 커버리지)

**질문**: 코드에서 복원된 정보가 Synaxion 계약 문서로 변환되었는가?

| 점수 | 기준 |
|------|------|
| 0 | 계약 문서 없음 |
| 1 | 기능 목록 또는 요약만 있음 |
| 2 | DB·API 일부 계약만 복원됨 |
| 3 | 아래 필수 계약 목록의 70% 이상 복원됨 |
| 4 | 필수 계약 목록 전체 복원 + 각 계약에 Observed/Inferred/Unknown 분류 |
| 5 | 4점 + 계약별 Evidence 연결 + 미복원 계약이 Unknown으로 명시됨 |

**필수 복원 계약 목록**:

```
[ ] Product Intent
[ ] User Type Contract
[ ] Domain Entity Contract
[ ] DB Schema Contract
[ ] Permission Model Contract
[ ] API Contract
[ ] State Transition Contract
[ ] Error Contract
[ ] UI State Contract
[ ] Env Contract
[ ] Deployment Contract
[ ] Observability Contract
```

---

## §4 S3 — Evidence Traceability (근거 추적 가능성)

**질문**: 계획 문서의 모든 핵심 주장에 근거 파일이 연결되어 있는가?

| 점수 | 기준 |
|------|------|
| 0 | Evidence 없음 |
| 1 | 일부 주장에만 파일명 언급 |
| 2 | Observed 주장 50% 이상에 파일 경로 연결 |
| 3 | 모든 Observed 주장에 파일 경로 연결 |
| 4 | 3점 + 코드 위치(함수명, 라인 범위) 포함 |
| 5 | 4점 + Evidence Map 문서로 중앙 집중 관리 |

**형식 기준**:

```
# 3점 이상 요건
Claim: orders 테이블에 status 컬럼이 존재한다.
Evidence: db/migrations/20260101_create_orders.sql

# 4점 이상 요건
Claim: status는 pending / confirmed / completed 세 값을 가진다.
Evidence: db/migrations/20260101_create_orders.sql (line 12)
          src/lib/orders/status.ts (OrderStatus enum)
```

---

## §5 S4 — Unknown Accounting (미지 항목 관리)

**질문**: AI가 모르는 것을 명시적으로 Unknown으로 표시했는가?

| 점수 | 기준 |
|------|------|
| 0 | Unknown 개념 없음. 모든 빈칸이 그럴듯한 문장으로 채워짐 |
| 1 | 일부 항목에 "확인 필요" 언급 |
| 2 | 주요 Unknown 항목이 식별됨 |
| 3 | Unknown 항목이 별도 섹션 또는 파일에 목록화됨 |
| 4 | 3점 + Unknown 항목이 질문 형태로 구체화됨 |
| 5 | 4점 + Unknown Register 문서 완성 + Unknown 해소 경로(누가 답할 수 있는지) 명시 |

**Unknown Register 최소 포함 항목**:

```
제품 의도 관련 Unknown
사용자 유형 관련 Unknown
비즈니스 규칙 관련 Unknown
MVP 범위 관련 Unknown
폐기·임시 기능 관련 Unknown
```

**금지 패턴**:

```
Bad:  이 프로젝트는 농가와 소비자를 연결하는 마켓플레이스입니다.
      (코드에 없는 내용을 확정 문장으로 채운 경우)

Good: Product Intent: Unknown
      Observed: products, orders, consumer-facing route 존재
      Inferred: marketplace 성격으로 보임
      Unknown: 실제 MVP 범위, farmer onboarding 여부, 결제 정책
```

---

## §6 S5 — Conflict Detection (충돌 감지)

**질문**: 코드·문서·테스트·DB 간 충돌과 불일치를 식별했는가?

| 점수 | 기준 |
|------|------|
| 0 | 충돌 감지 없음 |
| 1 | 명백한 충돌 1–2개 발견 |
| 2 | 주요 surface 간 충돌 확인 (코드↔DB, 코드↔test) |
| 3 | 코드·문서·테스트·DB 4방향 교차 충돌 확인 |
| 4 | 3점 + 각 충돌에 영향도(Breaking / Non-breaking / Warning) 분류 |
| 5 | 4점 + Conflict & Gap Register 문서 완성 + 해소 우선순위 제안 |

**충돌 유형 체크 목록**:

```
[ ] 문서 role명 ≠ DB role명
[ ] API 기록 필드 ≠ 다른 서비스 읽기 필드
[ ] UI 상태값 ≠ DB enum 값
[ ] test mock 응답 ≠ 실제 API 응답 구조
[ ] env.example ≠ 실제 사용 env var
[ ] UI에 있는 기능의 API 없음
[ ] DB table에 대한 RLS 없음
[ ] 외부 호출에 타임아웃 없음
[ ] 에러 처리 없는 async 함수
```

---

## §7 총점 해석 기준

| 총점 | 상태 | 해석 |
|------|------|------|
| 0–7 | ❌ Insufficient | 복원 초안 사용 불가. Step 1–3 재실행 필요 |
| 8–14 | ⚠️ Partial | 일부 영역만 신뢰 가능. Gap이 큰 영역 재분석 필요 |
| 15–19 | ✅ Baseline | 복원 초안으로 사용 가능. 3점 이하 항목 보완 권장 |
| 20–22 | ✅ Reliable | 계획 디렉토리로 신뢰 가능. 개발 재개 준비 |
| 23–25 | ✅ Complete | `Synaxion Reconstruction Complete` 선언 가능. 개발 의사결정 근거로 사용 가능 |

### 항목별 최소 기준

```
Synaxion Reconstruction Complete 선언을 위한 항목별 최소 점수:
  S1 Source Coverage:       3점 이상
  S2 Contract Coverage:     3점 이상
  S3 Evidence Traceability: 3점 이상
  S4 Unknown Accounting:    3점 이상
  S5 Conflict Detection:    2점 이상
  총점:                     15점 이상
```

---

## §8 채점 예시

### 나쁜 복원 (점수: 6/25)

```
S1: 1 — 주요 기능 코드 일부만 읽음
S2: 1 — 기능 목록만 작성됨
S3: 1 — 파일명 언급 거의 없음
S4: 0 — 모든 빈칸이 그럴듯한 문장으로 채워짐
S5: 3 — 코드↔DB 충돌은 발견했으나 문서화 없음
```

판정: ❌ Insufficient — 복원 결과물을 신뢰할 수 없음

### 좋은 복원 (점수: 21/25)

```
S1: 4 — CI/deployment/env까지 스캔 완료
S2: 4 — 필수 계약 전체 복원, O/I/U 분류 완료
S3: 4 — 모든 Observed에 파일 경로·코드 위치 연결
S4: 5 — Unknown Register 완성, 질문 목록 + 답변 가능자 명시
S5: 4 — 충돌 목록 + 영향도 분류 완성
```

판정: ✅ Reliable — 계획 디렉토리로 신뢰 가능. 개발 재개 준비됨

---

**버전**: 1.0.0  
**최종 업데이트**: 2026-05-24 — 초기 제정  
**소속**: Synaxion Constitution 11장 (11-protocols)  
**사용 시점**: REVERSE_PLANNING_PROTOCOL.md §3 Step 7
