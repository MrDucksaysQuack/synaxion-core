# Implicit Distributed Information Flow
# 암시적 분산 정보 흐름과 명시적 파이프라인

> **긴 비동기 체인이 있는 곳에는 언제나 암시적 파이프라인이 숨어 있고, 그로 인해 관측성과 예측 가능성이 깨진다.**  
> 이 문서는 그 출발점을 Synaxion(Engineering Constitution) 관점에서 고정하고, 대응 원리를 플랫폼 중립적으로 정리한다.

**Tier**: 2 (권장·아키텍처 원리) — 언어·프레임워크에 비종속적이며, 인스턴스에서는 재시도·타임아웃·E2E·OTel 등으로 **구체화**한다.  
**연계**: [META_CONSTITUTION.md](../META_CONSTITUTION.md) §0.2 · [CONSISTENCY_AS_SYSTEM_CONSTRAINT.md](./CONSISTENCY_AS_SYSTEM_CONSTRAINT.md) · [05-testing-principles/](../05-testing-principles/) · [08-config/](../08-config/) · [09-observability/](../09-observability/) · [10-design-flow/](../10-design-flow/)

**최종 업데이트**: 2026-04-19

---

## 1. 보편적 문제 패턴: 암시적 정보 흐름 파이프라인

현대 소프트웨어는 브라우저·모바일, 하나 이상의 백엔드, DB·캐시·큐, 외부 API, CI/CD·테스트·모니터링처럼 **분산된 컴포넌트**로 구성되는 경우가 대부분이다.

이들이 비동기적으로 연결되면, 사용자 액션에서 최종 결과까지의 정보 흐름은 코드상으로는 `await` 연속처럼 보여도, **각 레이어가 타임아웃·재시도·에러 처리·분기 조건을 독립적으로** 갖기 때문에 실제로는 **암시적(implicit)** 으로 흐른다.

### 1.1 분산 컴퓨팅의 착각과 증상

1980년대부터 정리된 **분산 컴퓨팅의 8가지 착각**(네트워크는 믿을 수 있다, 지연은 0이다, 대역폭은 무한하다, …)은 오늘도 그대로 적용된다.

다음과 같은 현상은 그 착각이 현실에서 드러난 **직접적인 증상**으로 읽을 수 있다.

- 테스트 한도 70초와 실제 클라이언트 재시도 60초×N회가 어긋나 총 대기가 충돌한다.
- URL·헤더·바디 스키마가 한 글자만 달라도 “요청은 나갔는데 관측/테스트는 못 잡는다”.
- 입력이 비어 있으면 파싱 단계가 스킵되어 이후 단계의 가정이 무너진다.

이 패턴은 결제·온보딩·백그라운드 싱크·마이크로서비스 요청 등 **도메인을 가리지 않고** 반복된다.

**한 문장으로 고정**: 긴 비동기 체인이 있으면 암시적 파이프라인이 따라오고, 관측성·예측 가능성이 쉽게 깨진다.

---

## 2. 대응하는 다섯 가지 보편 원리

도구(OTel, 상태 머신, Pact 등)는 **구현 수단**이고, 아래는 **원리**이다.

| 원리 | 한 줄 정의 | 정신적 모델 |
|------|------------|-------------|
| **1. Observability pipeline** | 내부 상태를 외부 질문 없이도 실시간으로 알 수 있게 한다. | 요청 하나를 **투명한 유리관**으로 만든다. |
| **2. Centralized policy management** | 재시도·타임아웃·회로 차단·한도 등 회복력 정책의 **단일 출처**를 둔다. | 정책은 코드 조각이 아니라 시스템의 **법**이다. |
| **3. Explicit workflow orchestration** | 긴 체인을 단순 `await` 나열에만 두지 않고 상태 기계·Saga·오케스트레이터로 **명시**한다. | 워크플로는 **도메인 지식**이며 코드로 드러내야 한다. |
| **4. Contract-driven testing** | 의도한 요청과 실제 요청(URL·헤더·바디·리다이렉트)을 테스트로 **일치**시킨다. | 테스트는 가정이 아니라 **계약 검증**이다. |
| **5. Structured context propagation** | 로그·메트릭·이벤트에 trace·correlation·사용자·스텝 등 **공통 컨텍스트**를 붙인다. | 로그는 나열이 아니라 **검색 가능한 데이터**다. |

---

## 3. 평생 쓸 수 있는 사고방식 (Mental model)

- **Invisible → Visible**: 보이지 않는 흐름을 드러내는 것이 설계 역할이다.
- **Implicit → Explicit**: 숨은 분기·정책·가정을 코드·문서·관측으로 옮긴다.
- **Single source of truth**: 정책·워크플로·계약·설정의 권위 있는 한 곳을 유지한다.
- **End-to-end traceability**: 사용자 이벤트부터 결과까지 **하나의 상관 ID**로 잇는다.
- **Right abstraction level**: 작은 프로젝트는 trace 한 줄로도 이득이 있고, 규모가 커지면 원리를 **조합**해 적용한다.

---

## 4. Synaxion 문서군과의 연결 (참고)

인스턴스는 아래 영역에서 위 원리를 **코드·게이트·런타임**으로 구체화한다. 세부 규칙은 각 디렉터리의 SSOT를 따른다.

| 원리 | Constitution에서의 전형적 매핑 |
|------|-------------------------------|
| 관측·컨텍스트 | [09-observability/](../09-observability/) |
| 정책·설정 단일화 | [08-config/](../08-config/), API·UX 타임아웃 등 [03-api-standards/](../03-api-standards/) |
| 명시적 워크플로 | [10-design-flow/](../10-design-flow/), 상태·플로 계약 [STATE_TRANSITION_CONTRACT.md](./STATE_TRANSITION_CONTRACT.md) |
| 계약·테스트 | [05-testing-principles/](../05-testing-principles/) |
| 일관성·게이트 | [CONSISTENCY_AS_SYSTEM_CONSTRAINT.md](./CONSISTENCY_AS_SYSTEM_CONSTRAINT.md), [06-automation/](../06-automation/) |

이 표는 “여기만 보라”가 아니라 **학습 순서를 줄이기 위한 지도**다. 충돌 시 해당 주제의 전용 문서가 우선한다.
