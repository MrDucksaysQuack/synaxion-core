# Planning Directory Standard

> 모든 Synaxion 프로젝트의 **`docs/` 루트 구조** 표준.  
> 계획·명세·실행·계약·결정을 한 트리에서 찾을 수 있게 한다.

---

## §1 표준 트리

```
docs/
├── <project>-constitution/     # Synaxion 인스턴스화 (계약·런북·브랜드)
│   ├── README.md
│   ├── ENV_CONTRACT.md
│   ├── DB_CONTRACT.md
│   ├── ROLLBACK_RUNBOOK.md
│   ├── SLO.md
│   ├── INCIDENT_RUNBOOK.md
│   └── … (프로젝트별 확장)
│
├── planning/                   # 정방향 계획 기준선
│   ├── 00-product-intent.md    # 무엇·누구·왜·비목표
│   ├── 01-delivery-target.md   # 루브릭 목표 점수·마일스톤
│   └── 02-architecture-map.md  # 레이어·헌법 챕터·핵심 계약 맵
│
├── specs/                      # 기능 명세 (FEATURE_SPEC_TEMPLATE)
│   └── <FEATURE>_SPEC.md
│
├── adr/                        # 아키텍처 결정 기록
│   ├── README.md
│   └── NNNN-title.md
│
├── tasks/                      # Cursor 실행 태스크 (TASK_SPEC_TEMPLATE)
│   └── <task-slug>.md
│
└── execution/                  # 단계별 실행 지침 (선택, 장기 Phase)
    └── <phase>-<topic>.md
```

**Synaxion Core** (`synaxion-core/`)는 이 트리의 **원본·템플릿**이다. 프로젝트는 `docs/`에 인스턴스를 둔다.

---

## §1b 역방향 확장 (Reverse Planning Extension)

레거시·미완성 프로젝트를 복원할 때 `planning/` 안에
`extraction/` 서브디렉토리를 추가한다.

```
docs/
└── planning/
    ├── extraction/               ← 역방향 전용 (Reverse Planning 시에만 생성)
    │   ├── README.md             # extraction-README.template.md 복사본
    │   ├── SOURCE_INVENTORY.md   # 분석한 모든 source 목록
    │   ├── EVIDENCE_MAP.md       # 주장 → 파일 근거 연결
    │   ├── UNKNOWN_REGISTER.md   # 코드에서 알 수 없는 것 목록
    │   ├── CONFLICT_GAP_REGISTER.md  # 코드·문서·DB 충돌 목록
    │   └── RECONSTRUCTION_LOG.md # 복원 진행 기록
    │
    ├── 00-product-intent.md      ← 정방향: 의도에서 작성
    │                                역방향: extraction/ 완료 후 복원
    ├── 01-delivery-target.md
    └── 02-architecture-map.md
```

### 역방향에서 extraction/ 의 역할

`extraction/`은 복원 작업의 **증거 레이어**다.
이 디렉토리를 먼저 채운 뒤 `00-product-intent.md` 등을 작성한다.

```
extraction/ 완성
      ↓
00-product-intent.md    ← Observed + Inferred 내용만 채움
                           Unknown은 extraction/UNKNOWN_REGISTER.md로 위임
01-delivery-target.md   ← 현재 상태 기반으로 목표 설정
02-architecture-map.md  ← SOURCE_INVENTORY + EVIDENCE_MAP 기반
```

### O/I/U 라벨 규칙

역방향으로 채운 모든 planning/ 문서의 핵심 주장에는 아래 라벨을 붙인다.

| 라벨 | 의미 | 조건 |
|------|------|------|
| **Observed** | 코드·schema·config에 실제로 존재 | Evidence Pointer 필수 |
| **Inferred** | 코드 구조상 강하게 추론 | 추론 근거 명시 필수 |
| **Unknown** | 코드에 없는 의도·판단·맥락 | UNKNOWN_REGISTER에 기록 |

> Evidence Pointer 없이 Observed 표기 금지.  
> Unknown을 그럴듯한 문장으로 채우기 금지.

### 이중 사용 흐름 요약

```
정방향 (새 프로젝트):
  의도 명시 → planning/00-product-intent.md 작성
            → planning/01-delivery-target.md 작성
            → planning/02-architecture-map.md 작성
            → extraction/ 불필요

역방향 (레거시·미완성):
  코드 분석 → planning/extraction/ 채움 (O/I/U)
            → planning/00-product-intent.md 복원
            → planning/01-delivery-target.md 복원
            → planning/02-architecture-map.md 복원
            → Synaxion Planning Baseline 선언
```

템플릿: `synaxion-core/harness/reverse-planning/`  
프로토콜: `synaxion-core/11-protocols/REVERSE_PLANNING_PROTOCOL.md`

---

## §2 디렉터리 역할

| 경로 | SSOT 역할 | 작성 시점 |
|------|-----------|----------|
| `<project>-constitution/` | 런타임·배포·운영 **계약** | Step 4 (프로젝트 init) |
| `planning/` | **의도·목표·구조** 결정 | Step 1, 5, 3 |
| `planning/extraction/` | 역방향 **증거·O/I/U** (복원 시만) | Reverse Step 1~7 |
| `specs/` | **기능** 단위 요구·DoD | Step 7, 기능 추가 |
| `adr/` | **되돌리기 어려운** 기술 결정 | Step 6, 아키텍처 변경 |
| `tasks/` | Agent·개발자 **실행 단위** | Step 8 |
| `execution/` | 여러 PR에 걸친 **Phase playbook** | 대규모 개편 시 |

---

## §3 파일 명명 규칙

```
planning/     — 번호 접두: 00-, 01-, 02- (읽기 순서 고정)
specs/        — UPPER_SNAKE 또는 kebab: QUESTION_ENGINE_SPEC.md
adr/          — NNNN-kebab-case.md (4자리 번호)
tasks/        — kebab-case.md (동사 또는 목표 중심)
execution/    — PHASE_N_TOPIC.md 또는 kebab (팀 합의)
```

---

## §4 기존 경로 마이그레이션 (완료 시 삭제)

| 레거시 경로 | 표준 경로 | 비고 |
|-------------|-----------|------|
| ~~`docs/cursor-tasks/`~~ | `docs/tasks/` | 마이그레이션 후 레거시 폴더 **삭제** |
| ~~`docs/cursor-instructions/`~~ | `docs/execution/` | 마이그레이션 후 레거시 폴더 **삭제** |
| `docs/constitution/` (서브모듈) | `synaxion-core/` + `docs/<project>-constitution/` | Core vs Instance 분리 |
| 루트 `docs/*_SPEC.md` | `docs/specs/` | 스텁 리다이렉트 후 점진 삭제 가능 |

**새 문서는 표준 경로만** 사용한다.

---

## §5 최소 존재 조건 (Planning Complete)

[FORWARD_PLANNING_PROTOCOL.md](./FORWARD_PLANNING_PROTOCOL.md) §1 참조.

```
필수 디렉터리:
  docs/<project>-constitution/
  docs/planning/          (3파일)
  docs/adr/
  docs/specs/             (≥1)
  docs/tasks/             (≥1)

선택:
  docs/execution/
```

---

## §6 검증·도구 연결

| 산출물 | 검증 |
|--------|------|
| ENV_CONTRACT | `check:deployment-env`, `validateEnv()` |
| DB_CONTRACT | `check:contract-adr` |
| ADR | `check:contract-adr` |
| 구현 완료 | 태스크에 명시된 `check:*` |
| 출시 판단 | DELIVERY_READINESS_RUBRIC 자가 평가 |

프로젝트별 `check:constitution-completeness`는 `<project>-constitution/` 필수 파일 존재를 검사할 수 있다.

---

## §7 README 연동

프로젝트 루트 `README.md` 또는 `docs/README.md`에 다음 링크 블록을 둔다:

```markdown
## Documentation

- [Planning](./planning/00-product-intent.md)
- [Constitution](./<project>-constitution/README.md)
- [Specs](./specs/)
- [Tasks](./tasks/)
- [ADR](./adr/)
```

---

**최종 업데이트**: 2026-05-24
