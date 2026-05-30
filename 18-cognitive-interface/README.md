# Cognitive Interface Constitution (18-cognitive-interface)

> **Synaxion Constitution 18장**  
> 인지 구조에 맞춘 UI 설계 언어 — Logic Type Taxonomy, 복합 규칙, 감정 상태 패턴.  
> **버전**: 2.14.0

---

## 핵심 명제

> **Interface must match cognition before it matches aesthetics.**

사용자는 데이터 모델이 아니라 **자신의 질문 패턴**(계층·순서·비율·상태·인과)으로 세계를 이해한다.  
18장은 그 질문 패턴을 10개 Logic Type으로 분류하고, UI 패턴·감정 상태·청킹 규칙을 연결한다.

---

## 문서 목차

| 문서 | 역할 |
|------|------|
| [COGNITIVE_INTERFACE_CONSTITUTION.md](./COGNITIVE_INTERFACE_CONSTITUTION.md) | 원칙·정의 의무·타 챕터 관계 |
| [LOGIC_TYPE_TAXONOMY.md](./LOGIC_TYPE_TAXONOMY.md) | 10 Logic Type 정의·UI 패턴·위반 신호 |
| [COMPOSITE_LOGIC_RULES.md](./COMPOSITE_LOGIC_RULES.md) | Primary + Secondary 복합 규칙 |
| [EMOTIONAL_STATE_PATTERNS.md](./EMOTIONAL_STATE_PATTERNS.md) | 5감정 상태 × UI 대응 패턴 |

---

## 코어 vs 인스턴스

| 구분 | 위치 | 내용 |
|------|------|------|
| **코어** | `synaxion-core/18-cognitive-interface/` | Logic Type·감정 상태 **스키마** |
| **인스턴스** | `docs/<project>-constitution/COGNITIVE_INTERFACE_MAPPING.md` | 서브도메인별 Primary Logic·Primary Question·권장 UI |

---

## 타 챕터 관계

| 챕터 | 관계 |
|------|------|
| **Ch.10** (Design Flow / UX) | UX-02 4상태·UX-04 Single CTA — 18장 감정·Logic 적용의 최소선 |
| **Ch.14** (Experience Direction) | 7감정 축·브랜드 톤 — 18장 5감정 상태와 연계 |
| **Ch.19** (Product UI Architecture) | Journey·State Matrix — 화면별 Logic Type 매핑 입력 |

---

**최종 업데이트**: 2026-05-28 — 초기 제정 (Inflomatrix 흡수 선행)
