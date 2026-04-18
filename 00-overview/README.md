# Constitution Overview
# 헌법 개요

> **범용 개발 프레임워크 (Universal Development Framework)**  
> 실전 경험에서 추출한 개발 원칙과 자동 검증 도구

---

## 📚 이 Constitution이란?

이 Constitution은 **실전 프로젝트 경험**을 통해 학습한 개발 원칙을 체계화한 프레임워크입니다.

### 특징

1. **보편적 (Universal)**: 어떤 프로젝트에도 적용 가능
2. **실용적 (Practical)**: 이론이 아닌 실전 경험 기반
3. **자동화 (Automated)**: 모든 원칙이 자동 검증됨
4. **진화적 (Evolutionary)**: Living Documents로 계속 업데이트

---

## 🎯 누구를 위한 프레임워크인가?

### 이런 분들에게 추천합니다

- ✅ **체계적인 개발 방법론**을 찾는 개발자
- ✅ **기술 부채 방지**를 고민하는 팀 리더
- ✅ **AI와 협업**하며 개발하는 개발자
- ✅ **장기 유지보수**가 가능한 시스템을 만들려는 아키텍트
- ✅ **새 프로젝트 시작** 시 검증된 구조를 원하는 스타트업

---

## 📖 빠른 시작

### 1단계: 철학 이해 (30분)

**필독 문서:**
- [PHILOSOPHY.md](./PHILOSOPHY.md) - 개발 철학 및 핵심 원칙

**핵심 개념:**
- 구조 우선 원칙
- 엔진 기반 사고
- 8단계 방법론

---

### 2단계: 기초 원칙 학습 (1시간)

**폴더:** `01-foundations/`

**핵심 문서:**
- [STRUCTURE_FIRST_PRINCIPLE.md](../01-foundations/STRUCTURE_FIRST_PRINCIPLE.md) - 구조가 같으면 통합 가능
- [LAYER_BOUNDARIES.md](../01-foundations/LAYER_BOUNDARIES.md) - 계층 경계 및 의존성 규칙 (의존성 방향 포함)

---

### 3단계: 개발 프레임워크 적용 (2시간)

**폴더:** `02-development-framework/`, `00-overview/`

**핵심 문서:**
- [8_STAGE_METHODOLOGY.md](../02-development-framework/8_STAGE_METHODOLOGY.md) - 표준화 → 통합 → 추상화 → ...
- [FRONT_BACK_ENGINE_LOOP.md](./FRONT_BACK_ENGINE_LOOP.md) - 프론트-백-엔진 루프 (엔진 기반 개발 흐름)

---

### 4단계: API 표준 적용 (1시간)

**폴더:** `03-api-standards/`

**핵심 문서:**
- [API_STANDARDIZATION_LEVELS.md](../03-api-standards/API_STANDARDIZATION_LEVELS.md) - Level A (필수) / Level B (선택)
- [7_STAGE_LOGIC_CONSTRUCTION.md](../03-api-standards/7_STAGE_LOGIC_CONSTRUCTION.md) - 모든 로직의 실행 순서

---

### 5단계: 안전 표준 적용 (1시간)

**폴더:** `04-safety-standards/`

**핵심 문서:**
- [UX_SAFETY_RULES.md](../04-safety-standards/UX_SAFETY_RULES.md) - 운영 사고 학습한 안전 규칙
- [CONCEPTUAL_ROT_PREVENTION.md](../04-safety-standards/CONCEPTUAL_ROT_PREVENTION.md) - 개념 부패 방지

---

## 📂 Constitution 구조

실제 구조는 루트 [README.md](../README.md)의 "폴더 구조"를 기준으로 한다. 개요만 아래와 같이 요약한다.

```
docs/constitution/
├── 00-overview/              # 전체 개요 및 철학
│   ├── README.md            # 이 파일
│   ├── PHILOSOPHY.md        # 개발 철학
│   ├── QUICK_START.md       # 빠른 시작 가이드
│   ├── FRONT_BACK_ENGINE_LOOP.md  # 프론트-백-엔진 루프
│   └── DIAGRAMS.md          # 시각화 다이어그램
│
├── 01-foundations/           # 기초 원칙
│   ├── STRUCTURE_FIRST_PRINCIPLE.md
│   └── LAYER_BOUNDARIES.md   # 계층 경계·의존성 규칙 포함
│
├── 02-development-framework/ # 개발 프레임워크
│   ├── 8_STAGE_METHODOLOGY.md
│   └── 8_STAGE_METHODOLOGY_CASE_STUDIES.md
│
├── 03-api-standards/         # API 표준
│   ├── API_STANDARDIZATION_LEVELS.md
│   ├── API_STANDARDIZATION_LEVEL_B_GUIDE.md
│   └── 7_STAGE_LOGIC_CONSTRUCTION.md
│
├── 04-safety-standards/      # 안전 표준
│   ├── UX_SAFETY_RULES.md
│   ├── CONCEPTUAL_ROT_PREVENTION.md
│   └── SILENT_FAILURE_PREVENTION.md
│
├── 05-testing-principles/    # 테스트 원칙
│   ├── TESTING_PYRAMID.md
│   ├── E2E_TEST_AUTHORITY.md
│   ├── E2E_CRITICAL_FLOWS.md
│   ├── MOCK_PATTERNS.md
│   ├── FAIL_SOFT_TESTING.md
│   ├── CONTRACT_TESTING.md
│   └── UNIT_TEST_WRITING_GUIDE.md
│
├── 06-automation/            # 자동화
│   ├── VERIFICATION_FRAMEWORK.md
│   ├── VERIFICATION_SCRIPTS.md
│   ├── LINTING_STANDARDS.md
│   ├── CI_CD_INTEGRATION.md
│   └── DEPLOYMENT_TRIGGER.md
│
├── 11-protocols/             # 범용 프로토콜
│   ├── INFLOMATRIX_DEVELOPMENT_PROTOCOL.md
│   └── KHS_DEVELOPMENT_TEXTBOOK.md
│
└── (프로젝트 특화 문서·레지스트리·단일소스맵은 Constitution 밖 docs/<project>-constitution/ 등에 둠)
```

---

## 🎓 학습 경로

Constitution 루트 [README.md](../README.md)의 **Tier 1(필수) / Tier 2(핵심) / Tier 3(심화)**와 동일한 구분을 따른다.

### Tier 1: 필수 (모든 개발자, 약 4시간)

1. [PHILOSOPHY.md](./PHILOSOPHY.md) - 개발 철학
2. [STRUCTURE_FIRST_PRINCIPLE.md](../01-foundations/STRUCTURE_FIRST_PRINCIPLE.md) - 구조 우선 원칙
3. [LAYER_BOUNDARIES.md](../01-foundations/LAYER_BOUNDARIES.md) - 계층 경계
4. [8_STAGE_METHODOLOGY.md](../02-development-framework/8_STAGE_METHODOLOGY.md) - 8단계 방법론
5. [API_STANDARDIZATION_LEVELS.md](../03-api-standards/API_STANDARDIZATION_LEVELS.md) - API 표준
6. [UX_SAFETY_RULES.md](../04-safety-standards/UX_SAFETY_RULES.md) - UX 안전 규칙

---

### Tier 2: 핵심 (리드 개발자, 누적 약 10시간)

7. [7_STAGE_LOGIC_CONSTRUCTION.md](../03-api-standards/7_STAGE_LOGIC_CONSTRUCTION.md) - 7단계 로직 구성
8. [CONCEPTUAL_ROT_PREVENTION.md](../04-safety-standards/CONCEPTUAL_ROT_PREVENTION.md) - 개념 부패 방지
9. [FRONT_BACK_ENGINE_LOOP.md](./FRONT_BACK_ENGINE_LOOP.md) - 프론트-백-엔진 루프
10. [VERIFICATION_FRAMEWORK.md](../06-automation/VERIFICATION_FRAMEWORK.md) - 검증 프레임워크
11. [INFLOMATRIX_DEVELOPMENT_PROTOCOL.md](../11-protocols/INFLOMATRIX_DEVELOPMENT_PROTOCOL.md) - 전체 프로토콜 (선택)
12. [KHS_DEVELOPMENT_TEXTBOOK.md](../11-protocols/KHS_DEVELOPMENT_TEXTBOOK.md) - 개발 교과서 (선택)

---

### Tier 3: 심화 (아키텍트, 누적 약 20~30시간)

13. 프로젝트 적용 디렉터리(예: docs/&lt;project&gt;-constitution/)의 특화 문서
14. [E2E_TEST_AUTHORITY.md](../05-testing-principles/E2E_TEST_AUTHORITY.md) - E2E 권한·그룹
15. [VERIFICATION_SCRIPTS.md](../06-automation/VERIFICATION_SCRIPTS.md) - check:* 인벤토리
16. [META_CONSTITUTION.md](../META_CONSTITUTION.md), [EXECUTION_CONSTITUTION.md](../EXECUTION_CONSTITUTION.md) - 운영 규칙
17. 팀 적용 및 Living Documents 관리

---

## 🔑 핵심 원칙 요약

[META_CONSTITUTION.md](../META_CONSTITUTION.md)의 Tier 정의와 동일하다.

### Tier 1: 필수 (위반 시 머지/배포 차단 가능)

1. **구조 우선 원칙**: 구조가 같으면 목적이 달라도 통합
2. **단방향 의존성**: Core ← Engine ← Domain ← API ← Frontend
3. **자동 검증**: 모든 규칙은 자동으로 검증되어야 함
4. **실전 학습**: 운영 사고는 코드 레벨에서 차단

### Tier 2: 권장 (프로젝트/팀 단위 선택)

5. **8단계 방법론**: 표준화 → 통합 → 추상화 → ... → 확장
6. **엔진 기반 설계**: 재사용 가능한 로직은 엔진으로 (FRONT_BACK_ENGINE_LOOP 참조)
7. **7단계 로직**: 모든 API는 7단계 구성
8. **Living Documents**: 문서는 코드와 함께 진화

---

## 🚀 프로젝트 적용 가이드

### 새 프로젝트 시작 시

자세한 부트스트랩 절차는 [EXECUTION_CONSTITUTION.md](../EXECUTION_CONSTITUTION.md)(9단계)를 따른다. 요약:

```bash
# 1. Constitution(경전) 복사
cp -r docs/constitution /your-project/docs/

# 2. 프로젝트 적용 디렉터리 생성 (레지스트리·단일 소스 맵·특화 문서)
mkdir -p /your-project/docs/your-project-constitution

# 3. check:all 등 검증 설정 후 실행
pnpm run check:all
```

### 기존 프로젝트 마이그레이션

1. **현재 구조 분석**: 계층 경계, 의존성 파악
2. **우선순위 설정**: Tier 1 원칙부터 적용
3. **점진적 마이그레이션**: 한 번에 하나씩
4. **자동 검증 구축**: ESLint + 스캔 스크립트

---

## 📊 성공 지표

Constitution 적용 후 측정할 지표:

1. **코드 중복률**: 30% 이상 감소
2. **버그 발생률**: 50% 이상 감소
3. **개발 속도**: 2배 이상 증가
4. **리팩토링 시간**: 70% 이상 감소
5. **온보딩 시간**: 50% 이상 감소

---

## 🤝 기여 가이드

이 Constitution은 **커뮤니티와 함께 성장**합니다.

### 기여 방법

1. **새로운 패턴 발견**: PR로 제안
2. **개선 아이디어**: Issue로 제기
3. **실전 사례 공유**: Discussion에서 논의
4. **자동 검증 도구 개선**: 스크립트 PR

### 기여 원칙

- ✅ 실전 경험 기반
- ✅ 보편적으로 적용 가능
- ✅ 자동 검증 가능
- ✅ 명확한 예시 포함

---

## 📚 추가 자료

### 외부 참고 자료

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Twelve-Factor App](https://12factor.net/)

### 관련 도구

- ESLint: 정적 분석
- TypeScript: 타입 안전성
- Jest: 테스트 프레임워크
- Playwright: E2E 테스트

---

## 💬 문의 및 지원

### FAQ

**Q: 이 Constitution을 모두 적용해야 하나요?**  
A: Tier 1 원칙은 필수, Tier 2는 프로젝트 상황에 따라 선택

**Q: 기존 프로젝트에 적용하기 어렵지 않나요?**  
A: 점진적으로 적용 가능합니다. 우선순위에 따라 단계별 적용

**Q: AI 개발에 정말 도움이 되나요?**  
A: 네. Constitution이 AI에게 명확한 컨텍스트를 제공합니다

**Q: 소규모 프로젝트에도 적용 가능한가요?**  
A: 네. 핵심 원칙만 선택적으로 적용 가능합니다

---

## 📝 변경 이력

Constitution 전체 버전은 루트 [VERSION](../VERSION) 및 [README.md](../README.md) 버전 히스토리를 따른다.

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-15 | Tier·폴더 구조를 실제 문서와 동기화, 존재하지 않는 문서 참조 제거 |
| 2026-01-22 | 초기 범용 프레임워크 버전 작성 |

---

**다음 단계:** [PHILOSOPHY.md](./PHILOSOPHY.md)를 읽고 개발 철학을 이해하세요.

---

**라이선스**: MIT  
**관리**: Constitution Contributors  
**최종 업데이트**: 2026-02-21
