# Experience Direction Constitution (14-experience-direction)

> **범용 원칙**: 브랜드 경험 연출 레이어의 7개 축 스키마를 정의한다.  
> 각 축의 실제 값은 프로젝트마다 다르다. 축의 구조와 정의 의무는 변경 불가다.  
> 이 장은 Synaxion UI Design Constitution(층 C)의 감정·내러티브 확장이며 독립 운영되지 않는다.

---

## 핵심 명제

> **토큰 규칙을 지켰다고 해서 브랜드 경험이 완성된 것은 아니다.**

UI Constitution은 시각 시스템의 계층 질서를 정의한다.  
Experience Constitution은 그 시각 시스템이 **어떤 감정으로 읽혀야 하는가**를 정의한다.

두 문서는 서로를 대체하지 않는다. 둘 다 완성되어야 브랜드 경험이 완결된다.

---

## 📋 이 섹션에서 다루는 것

| 문서 | 역할 |
|------|------|
| [EXPERIENCE_CONSTITUTION.md](./EXPERIENCE_CONSTITUTION.md) | 7개 축의 스키마 정의, 정의 의무 조항, enforcement 모델 |
| [IMAGE_DIRECTION_CONSTITUTION.md](./IMAGE_DIRECTION_CONSTITUTION.md) | AI 이미지 생성 거버넌스: 4-layer 프롬프트 구조, Scene Categories, Visual Tempo, Narrative Ownership, Collision Matrix, Slot System |

---

## 🧩 코어 vs 인스턴스

| 구분 | 위치 | 내용 |
|------|------|------|
| **코어 (Constitution)** | 이 폴더 `14-experience-direction/` | 7개 축의 이름·구조·정의 의무 — **보편 원칙** |
| **인스턴스 (프로젝트별)** | `docs/<project>-constitution/EXPERIENCE_DIRECTION.md` | 실제 감정 좌표, 이미지 opacity 기준값, CTA 카피 매트릭스, 페이지 리듬 실제 적용 |

### 예시 구분

```
synaxion-core/14-experience-direction/EXPERIENCE_CONSTITUTION.md
  ← Brand Emotion Axis 축은 Warm/Organic/Grounded 등의 차원을 포함해야 한다 (구조)

synaxion-core/14-experience-direction/IMAGE_DIRECTION_CONSTITUTION.md
  ← 4-layer 프롬프트 구조를 따른다, Scene Categories 스키마는 이렇게 정의한다 (구조)

docs/truefarm-constitution/EXPERIENCE_DIRECTION.md
  ← Warm: 0.75, Organic: 0.65, Grounded: 0.80 (Truefarm 실제 값)

docs/truefarm-constitution/AI_IMAGE_DIRECTION.md
  ← Brand Layer 실제 값, 20개 슬롯 Scene/Tempo 배정, 실제 프롬프트 (Truefarm 인스턴스)
```

---

## 🔗 관련 Constitution 문서

- [13-ui-design/UI_DESIGN_CONSTITUTION.md](../13-ui-design/UI_DESIGN_CONSTITUTION.md) — 시각 토큰 3-tier, 색상·타이포·간격 원칙
- [10-design-flow/DESIGN_FLOW_PRINCIPLES.md](../10-design-flow/DESIGN_FLOW_PRINCIPLES.md) — 페이지·플로 설계 원칙
- [07-frontend-ui/UX_FEEDBACK_AND_ACCESSIBILITY.md](../07-frontend-ui/UX_FEEDBACK_AND_ACCESSIBILITY.md) — 접근성 기본 원칙

---

**최종 업데이트**: 2026-05-24 — 초기 제정
