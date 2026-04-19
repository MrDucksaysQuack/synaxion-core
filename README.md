# Synaxion Constitution (synaxion-core)

> **Engineering Constitution + Judgment Constitution** 번들.  
> 프로젝트 인스턴스(예: Itemwiki)는 이 저장소를 **서브모듈**로 두고, 제품별 규칙은 `docs/<project>-constitution/`에 둔다.

**번들 버전**: [VERSION](./VERSION)  
**메타·운영 규칙**: [META_CONSTITUTION.md](./META_CONSTITUTION.md)

---

## 진입점

| 목적 | 문서 |
|------|------|
| 헌법 자체의 Tier·변경 절차·검증 의무 | [META_CONSTITUTION.md](./META_CONSTITUTION.md) |
| 무엇이며 누구를 위한 프레임워크인지 | [00-overview/README.md](./00-overview/README.md) |
| 짧게 훑기 | [00-overview/QUICK_START.md](./00-overview/QUICK_START.md) |
| 철학 한 축 | [00-overview/PHILOSOPHY.md](./00-overview/PHILOSOPHY.md) |
| 판단 층(B) 인덱스 | [12-judgment-constitution/README.md](./12-judgment-constitution/README.md) |

---

## 목차 (번호별 장)

### 00 — 개요

[00-overview/](./00-overview/) — 헌법 소개, 다이어그램, 프론트·백·엔진 루프, 빠른 시작

### 01 — 기초 (Foundations)

[01-foundations/](./01-foundations/)

| 문서 | 요약 |
|------|------|
| [STRUCTURE_FIRST_PRINCIPLE.md](./01-foundations/STRUCTURE_FIRST_PRINCIPLE.md) | 구조 우선 |
| [LAYER_BOUNDARIES.md](./01-foundations/LAYER_BOUNDARIES.md) | 계층 경계·의존성 방향 |
| [CONSISTENCY_AS_SYSTEM_CONSTRAINT.md](./01-foundations/CONSISTENCY_AS_SYSTEM_CONSTRAINT.md) | 일관성을 시스템 제약으로 |
| [IMPLICIT_DISTRIBUTED_INFORMATION_FLOW.md](./01-foundations/IMPLICIT_DISTRIBUTED_INFORMATION_FLOW.md) | 암시적 분산 흐름·관측·정책·계약 |
| [TRUST_BOUNDARY_PRINCIPLE.md](./01-foundations/TRUST_BOUNDARY_PRINCIPLE.md) | 신뢰 경계 |
| [STATE_TRANSITION_CONTRACT.md](./01-foundations/STATE_TRANSITION_CONTRACT.md) | 상태 전이 계약 |

### 02 — 개발 프레임워크

[02-development-framework/](./02-development-framework/) — 8단계 방법론, 리팩터링 안전

### 03 — API 표준

[03-api-standards/](./03-api-standards/) — 7단계 로직 구성, 표준화 레벨, 네트워크 회복력

### 04 — 안전 표준

[04-safety-standards/](./04-safety-standards/) — 침묵 실패 방지, UX·입력 지속성, 인증 흐름 등

### 05 — 테스트 원칙

[05-testing-principles/](./05-testing-principles/) — 피라미드, 계약·E2E·Fail-Soft, 목 패턴

### 06 — 자동화

[06-automation/](./06-automation/) — CI/CD, 검증 스크립트, 린트

### 07 — 프론트엔드·UI

[07-frontend-ui/](./07-frontend-ui/README.md) — 레이어 원칙, 상태·데이터 패칭, 접근성

### 08 — 설정

[08-config/](./08-config/README.md) — 환경 변수 등

### 09 — 관측 가능성

[09-observability/](./09-observability/README.md) — 로깅·관측 원칙

### 10 — 설계·플로

[10-design-flow/](./10-design-flow/README.md) — 페이지·플로 체크리스트, 기대 모델

### 11 — 프로토콜·교과

[11-protocols/](./11-protocols/) — 제품/팀별 완료 계약·개발 프로토콜 문서

### 12 — 판단 헌법 (Judgment)

[12-judgment-constitution/](./12-judgment-constitution/README.md) — E/R/C/I, 스키마, 리플레이·연합

---

## 루트 메타·스키마

| 항목 | 경로 |
|------|------|
| 단일 소스 맵(형식·규칙) | [SINGLE_SOURCE_MAP.md](./SINGLE_SOURCE_MAP.md) |
| 결정 레지스트리 가이드 | [DECISION_REGISTRY.md](./DECISION_REGISTRY.md) |
| 실행 헌법 | [EXECUTION_CONSTITUTION.md](./EXECUTION_CONSTITUTION.md) |
| 진화 전략 | [EVOLUTION_STRATEGY.md](./EVOLUTION_STRATEGY.md) |
| 마이그레이션 | [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) |
| 운영 시스템 | [OPERATING_SYSTEM.md](./OPERATING_SYSTEM.md) |
| 판단 출력 스키마 | [judgment-output.schema.json](./judgment-output.schema.json) |
| ADR | [adr/](./adr/) |
| 변경 연대기 | [history/](./history/) |

---

## 부록: Step 3 harness (Itemwiki → synaxion-core 동기화)

Itemwiki 레포의 `contrib/synaxion-core/`에 **synaxion-core GitHub 레포 루트에 그대로 복사**할 파일을 둔다.

### synaxion-core 레포에 반영하는 방법

로컬에 synaxion-core 클론이 있다고 가정:

```bash
rsync -a --delete contrib/synaxion-core/harness/ ../synaxion-core/harness/
cp contrib/synaxion-core/install.sh ../synaxion-core/install.sh
cp contrib/synaxion-core/sync-harness.sh ../synaxion-core/sync-harness.sh
chmod +x ../synaxion-core/install.sh ../synaxion-core/sync-harness.sh
cd ../synaxion-core
git add harness install.sh sync-harness.sh
git commit -m "feat: harness 템플릿 + install.sh 추가"
git push -u origin main
```

(`../synaxion-core` 경로는 실제 클론 위치로 바꾼다.)

### Itemwiki에서 constitution 서브모듈로 바꾸기

인증된 환경에서만 `git submodule add`가 성공한다. 절차는 Itemwiki 쪽 `docs/guides/SYNAXION_CORE_SUBMODULE.md`를 따른다.

### install.sh 사용 (서브모듈 연결 후)

```bash
cd /path/to/itemwiki   # 프로젝트 루트
bash docs/constitution/install.sh "Itemwiki" "packages/lib <- …"
```

---

## 버전 히스토리 (README·목차)

| 날짜 | 요약 |
|------|------|
| 2026-04-19 | 루트 README를 Synaxion 헌법 진입점·목차·루트 메타 표로 정리. harness 안내는 부록으로 이동. |
