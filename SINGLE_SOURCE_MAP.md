# 단일 소스 맵 (Single Source Map)

> **결정 축별 단일 소스·검증·영향 레이어를 한 표로.**  
> 새 "단일 소스" 원칙을 추가하면 **반드시 이 표에 한 행 추가**한다. (META_CONSTITUTION §6)

**Constitution 규칙**: 각 프로젝트는 자체 단일 소스 맵을 **프로젝트의 Constitution 적용 디렉터리**(예: `docs/<project>-constitution/SINGLE_SOURCE_MAP.md`)에 둔다. 이 문서는 **형식과 규칙**만 정의한다.

---

## 맵 형식

| 결정(축) | 단일 소스 | 검증 스크립트 | 영향 레이어 |
|----------|------------|---------------|-------------|
| *(프로젝트가 채움)* | *(진입점 파일/함수)* | check:* 또는 — | *(레이어 목록)* |

---

## 규칙

- **새 결정 축**이 생기면 프로젝트의 맵에 **한 행** 추가: 결정(축) | 단일 소스(진입점) | 검증 스크립트 | 영향 레이어
- **decision-registry.json**과 1:1 대응 유지. 레지스트리 스키마: [decision-registry.schema.json](./decision-registry.schema.json)
- 검증이 없으면 빈칸. META_CONSTITUTION에 따라 Tier 1 원칙은 가능한 한 check:* 추가 제안

**관련**: [META_CONSTITUTION.md](./META_CONSTITUTION.md) §6, [DECISION_REGISTRY.md](./DECISION_REGISTRY.md)
