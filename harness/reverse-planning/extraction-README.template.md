# planning/extraction/

> **역방향 복원 전용 디렉토리**  
> [REVERSE_PLANNING_PROTOCOL.md](../../11-protocols/REVERSE_PLANNING_PROTOCOL.md) Step 1~7의 출력물.
>
> 이 디렉토리는 레거시·미완성 프로젝트 복원 시에만 생성한다.  
> 새 프로젝트는 이 디렉토리 없이 `planning/00-product-intent.md`부터 시작한다.

## 파일 목록

| 파일 | Protocol Step | 내용 |
|------|--------------|------|
| `SOURCE_INVENTORY.md` | Step 1 | 분석한 모든 source artifact 목록 |
| `EVIDENCE_MAP.md` | Step 2–5 | 주장 → 파일 근거 연결 (O/I/U 라벨) |
| `UNKNOWN_REGISTER.md` | 전 단계 | 코드에서 알 수 없는 것 목록 |
| `CONFLICT_GAP_REGISTER.md` | Step 6 | 코드·문서·DB·테스트 충돌 목록 |
| `RECONSTRUCTION_LOG.md` | Step 7 | 복원 진행 기록 + Completion Score |

## 완료 기준

아래 8개 조건을 만족하면 `Synaxion Reconstruction Complete`를 선언할 수 있다.

```
1. SOURCE_INVENTORY.md — 모든 source type 최소 1회 분석
2. 모든 route, API, DB table, role, env var, 외부 서비스 매핑
3. 복원 가능한 계약이 planning/ 또는 <project>-constitution/ 에 문서화됨
4. 모든 핵심 주장에 Evidence Pointer 존재
5. Evidence 없는 내용이 Assumption으로 분리됨
6. CONFLICT_GAP_REGISTER.md 에 코드-문서-테스트-DB 충돌 기록
7. UNKNOWN_REGISTER.md 에 미복원 정보 질문 목록화
8. docs/tasks/ 에 Recovery Plan 기반 첫 태스크 존재
```

## O/I/U 라벨 규칙

```
[Observed]  코드·schema·config에 실제로 존재. Evidence Pointer 필수.
[Inferred]  코드 구조상 강하게 추론 가능. 근거 명시 필수.
[Unknown]   코드에 없는 의도·판단·맥락. 이 파일에 기록.
```

**금지**: Evidence 없이 Observed 표기 / Unknown을 그럴듯한 문장으로 채우기
