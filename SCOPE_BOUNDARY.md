# Synaxion 범위 경계 (Scope Boundary)

**Tier**: 1 (필수)
**목적**: 어떤 규칙을 Synaxion Core에 포함시킬지, 프로젝트별 가이드로 분리할지를 판단하는 공식 기준.

---

## Coverage Eligibility 공식

새로운 규칙, 원칙, 문서를 Synaxion Core에 추가하기 전에 아래 공식으로 판단한다.

```
Synaxion Coverage Eligibility =
  검증 가능성 (Verifiability)
+ 사용자 피해 위험 (User Harm Risk)
+ 반복 가능성 (Repeatability)
+ 계층 경계 영향 (Layer Impact)
- 프로젝트별 취향 의존성 (Project Taste Dependency)
```

**포함 조건** — 아래 4개를 모두 만족하면 Synaxion Core에 포함한다:

1. 자동 또는 반자동으로 검증 가능하다 (check:* 또는 PR 체크리스트)
2. 위반 시 사용자, 운영, 보안, 품질에 실제 피해가 생긴다
3. 프로젝트마다 반복적으로 필요한 기준이다
4. 계층 경계, SSOT, 계약, 배포 안정성에 영향을 준다

**제외 조건** — 아래 중 하나라도 해당하면 프로젝트별 가이드로 분리한다:

1. 맞고 틀림보다 좋고 나쁨의 판단이다
2. 브랜드, 시장, 사용자층에 따라 달라진다
3. 자동 검증이 어렵고 사람의 감각 판단이 필요하다
4. 특정 프로젝트의 전략·감성·비즈니스 포지션에 종속된다

---

## Synaxion Core / Project Guide 분리 원칙

```
Synaxion Core                     → 강제 가능한 구조 규칙
  ├── Engineering Constitution     → 계층, API, 상태, 에러, 인증
  ├── UX Constitution              → 상태 처리, 접근성, 흐름 완결성
  ├── UI Design Constitution       → 토큰 시스템, 시각 계층, 반응형
  ├── Deployment Constitution      → CI/CD, 환경, 롤백, smoke test
  └── Operations Constitution      → 로깅, SLO, 알림, 런북

Project Guide                     → 판단 기반 품질 기준
  ├── Brand Experience Guide       → 브랜드 감정, 이미지, 내러티브
  ├── UX Research Guide            → 사용자 인터뷰, 프로토타입
  └── Business Strategy Guide      → 시장, 포지셔닝, 성장
```

**핵심 문장:**

> Synaxion은 시장을 판단하지 않는다.
> Synaxion은 제품이 시장에 나갈 수 있는 상태인지를 판단한다.

---

## 적용 예시

| 규칙 후보 | 포함 여부 | 이유 |
|-----------|-----------|------|
| "loading state가 없으면 위반" | ✅ Core | 검증 가능, 사용자 피해 직결 |
| "이 배색이 따뜻하게 느껴지는가" | ❌ Project Guide | 취향 의존, 자동 검증 불가 |
| "dark mode semantic remapping" | ✅ Core | check:theme-split으로 검증 가능 |
| "이 카피가 설득력 있는가" | ❌ Project Guide | 브랜드·시장 종속 |
| "rollback 절차가 있는가" | ✅ Core | 운영 피해 직결, check:*로 파일 존재 확인 |
| "이 인터페이스가 농업인에게 친숙한가" | ❌ Project Guide | 사용자층·도메인 종속 |

---

## 관련 문서

- [META_CONSTITUTION.md](./META_CONSTITUTION.md) — Tier 시스템, 변경 절차
- [OPERATING_SYSTEM.md](./OPERATING_SYSTEM.md) — OS 진화 방향
- [DELIVERY_READINESS_RUBRIC.md](./DELIVERY_READINESS_RUBRIC.md) — 완성도 평가

**최종 업데이트**: 2026-05-24
