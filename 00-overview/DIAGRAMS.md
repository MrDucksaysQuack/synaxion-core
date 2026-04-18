# Visual Diagrams
# 시각화 다이어그램

> **"한 장의 그림이 천 마디 말보다 낫다"**

---

## 1. 8단계 방법론 플로우차트

```mermaid
graph TD
    A[1. 표준화<br/>Standardization] --> B[2. 통합<br/>Unification]
    B --> C[3. 추상화<br/>Abstraction]
    C --> D[4. 모듈화<br/>Modularization]
    D --> E[5. 자동화<br/>Automation]
    E --> F[6. 지능화<br/>Intelligence]
    F --> G[7. 최적화<br/>Optimization]
    G --> H[8. 확장<br/>Expansion]
    H --> A
    
    A -->|규칙 정립| A1[네이밍<br/>파일 구조<br/>API 형식]
    B -->|중복 제거| B1[유틸리티 통합<br/>컴포넌트 재사용]
    C -->|엔진화| C1[Parser Engine<br/>Validation Engine]
    D -->|독립성| D1[모듈 분리<br/>인터페이스 정의]
    E -->|자동 실행| E1[CI/CD<br/>자동 테스트]
    F -->|AI 연동| F1[학습 파이프라인<br/>추천 시스템]
    G -->|성능 개선| G1[캐싱<br/>쿼리 최적화]
    H -->|도메인 확장| H1[새 기능<br/>국제화]
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1f5
    style D fill:#e1ffe8
    style E fill:#f5e1ff
    style F fill:#ffe8e1
    style G fill:#e1fff4
    style H fill:#fff4f5
```

---

## 2. 계층 경계 다이어그램

```mermaid
graph TB
    subgraph Frontend["Frontend Layer (UI/UX)"]
        FE1[React Components]
        FE2[Pages]
        FE3[Hooks]
    end
    
    subgraph API["API Layer (Interface)"]
        API1[API Routes]
        API2[Middleware]
        API3[Request/Response]
    end
    
    subgraph Domain["Domain Layer (Business Logic)"]
        D1[Product Domain]
        D2[User Domain]
        D3[Order Domain]
    end
    
    subgraph Engine["Engine Layer (Reusable Logic)"]
        E1[Parser Engine]
        E2[Validation Engine]
        E3[Scorer Engine]
    end
    
    subgraph Core["Core Layer (Infrastructure)"]
        C1[Types]
        C2[Auth]
        C3[Logger]
        C4[Config]
    end
    
    Frontend -->|HTTP| API
    API -->|import| Domain
    Domain -->|import| Engine
    Engine -->|import| Core
    Domain -->|import| Core
    
    style Frontend fill:#e1f5ff
    style API fill:#fff4e1
    style Domain fill:#ffe1f5
    style Engine fill:#e1ffe8
    style Core fill:#f5e1ff
```

---

## 3. Front-Back-Engine 루프

```mermaid
graph LR
    subgraph Cycle["Development Cycle"]
        A[Frontend<br/>UX 요구] --> B[Backend<br/>규칙 설정]
        B --> C[Engine<br/>추상화]
        C --> D[Backend<br/>강화]
        D --> E[Frontend<br/>고도화]
        E --> A
    end
    
    A -->|사용자 피드백| A1[새로운 요구사항]
    B -->|스키마 설계| B1[데이터 구조]
    C -->|범용화| C1[재사용 가능]
    D -->|안정화| D1[더 견고]
    E -->|향상| E1[더 나은 UX]
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1f5
    style D fill:#e1ffe8
    style E fill:#f5e1ff
```

---

## 4. 테스트 피라미드

```mermaid
graph TD
    subgraph Pyramid["Test Pyramid"]
        E2E["E2E Tests<br/>10%<br/>느림, 불안정<br/>핵심 플로우만"]
        INT["Integration Tests<br/>30%<br/>중간 속도<br/>API 검증"]
        UNIT["Unit Tests<br/>60%<br/>빠름, 안정적<br/>도메인 로직"]
    end
    
    E2E --> INT
    INT --> UNIT
    
    UNIT -->|예시| U1[순수 함수<br/>계산 로직<br/>엔진]
    INT -->|예시| I1[API 엔드포인트<br/>비즈니스 플로우]
    E2E -->|예시| E1[회원가입<br/>결제 플로우]
    
    style E2E fill:#ff6b6b
    style INT fill:#ffd93d
    style UNIT fill:#6bcf7f
```

---

## 5. 엔진 기반 아키텍처

```mermaid
graph LR
    subgraph Engines["Reusable Engines"]
        PE[Parser<br/>Engine]
        VE[Validation<br/>Engine]
        SE[Scorer<br/>Engine]
        ME[Matcher<br/>Engine]
        NE[Normalizer<br/>Engine]
    end
    
    subgraph Domains["Business Domains"]
        PD[Product<br/>Domain]
        UD[User<br/>Domain]
        OD[Order<br/>Domain]
    end
    
    PE --> PD
    PE --> UD
    PE --> OD
    
    VE --> PD
    VE --> UD
    VE --> OD
    
    SE --> PD
    SE --> UD
    
    style PE fill:#e1f5ff
    style VE fill:#fff4e1
    style SE fill:#ffe1f5
    style ME fill:#e1ffe8
    style NE fill:#f5e1ff
    
    style PD fill:#d4edff
    style UD fill:#ffd4ed
    style OD fill:#d4ffed
```

---

## 6. 구조 통합 의사결정 트리

```mermaid
graph TD
    START[새 기능 개발] --> Q1{비슷한 구조의<br/>기존 코드 있는가?}
    
    Q1 -->|Yes| Q2{입출력 형태가<br/>같은가?}
    Q1 -->|No| CREATE[개별 구현]
    
    Q2 -->|Yes| Q3{라이프사이클이<br/>유사한가?}
    Q2 -->|No| CREATE
    
    Q3 -->|Yes| Q4{제네릭으로<br/>추상화 가능한가?}
    Q3 -->|No| CREATE
    
    Q4 -->|Yes| Q5{통합 시<br/>복잡도 증가?}
    Q4 -->|No| CREATE
    
    Q5 -->|No| UNIFY[반드시 통합<br/>엔진 또는 공통 함수]
    Q5 -->|Yes| CONSIDER[통합 고려<br/>점진적 접근]
    
    style START fill:#e1f5ff
    style UNIFY fill:#6bcf7f
    style CONSIDER fill:#ffd93d
    style CREATE fill:#ff6b6b
```

---

## 7. CI/CD 파이프라인

```mermaid
graph LR
    subgraph Local["Local Development"]
        WRITE[코드 작성]
        COMMIT[Git Commit]
    end
    
    subgraph CI["Continuous Integration"]
        BUILD[Build]
        LINT[Lint]
        TEST[Tests]
        CONST[Constitution<br/>Checks]
    end
    
    subgraph Gate["Quality Gate"]
        GATE{모든 검증<br/>통과?}
    end
    
    subgraph CD["Continuous Deployment"]
        STAGING[Staging<br/>Deploy]
        PROD[Production<br/>Deploy]
    end
    
    WRITE --> COMMIT
    COMMIT -->|Pre-commit Hook| BUILD
    BUILD --> LINT
    LINT --> TEST
    TEST --> CONST
    CONST --> GATE
    
    GATE -->|Pass| STAGING
    GATE -->|Fail| WRITE
    
    STAGING -->|Smoke Test OK| PROD
    STAGING -->|Fail| WRITE
    
    style WRITE fill:#e1f5ff
    style BUILD fill:#fff4e1
    style LINT fill:#ffe1f5
    style TEST fill:#e1ffe8
    style CONST fill:#f5e1ff
    style GATE fill:#ffd93d
    style STAGING fill:#d4edff
    style PROD fill:#6bcf7f
```

---

## 8. 의존성 방향 규칙

```mermaid
graph TB
    FE[Frontend]
    API[API Layer]
    DOM[Domain Layer]
    ENG[Engine Layer]
    CORE[Core Layer]
    
    FE -.->|❌ 금지| ENG
    FE -.->|❌ 금지| CORE
    FE -->|✅ HTTP 호출| API
    
    API -->|✅ import| DOM
    API -.->|❌ 직접 금지| ENG
    
    DOM -->|✅ import| ENG
    DOM -->|✅ import| CORE
    DOM -.->|❌ 금지| API
    
    ENG -->|✅ import| CORE
    ENG -.->|❌ 금지| DOM
    
    CORE -.->|❌ 금지| ENG
    CORE -.->|❌ 금지| DOM
    CORE -.->|❌ 금지| API
    
    style FE fill:#e1f5ff
    style API fill:#fff4e1
    style DOM fill:#ffe1f5
    style ENG fill:#e1ffe8
    style CORE fill:#f5e1ff
```

---

## 9. Fail-Soft 패턴

```mermaid
graph TD
    REQ[요청 수신] --> TRY{API 호출}
    
    TRY -->|성공| SUCCESS[200 OK<br/>정상 응답]
    TRY -->|실패| CHECK{Fail-Soft<br/>가능?}
    
    CHECK -->|Yes - 캐시| CACHE[200 OK<br/>캐시 데이터<br/>meta.degraded=true]
    CHECK -->|Yes - 기본값| DEFAULT[200 OK<br/>기본값<br/>meta.degraded=true]
    CHECK -->|No| ERROR[503<br/>Graceful Error]
    
    SUCCESS --> RESPOND[사용자 응답]
    CACHE --> RESPOND
    DEFAULT --> RESPOND
    ERROR --> RESPOND
    
    style SUCCESS fill:#6bcf7f
    style CACHE fill:#ffd93d
    style DEFAULT fill:#ffd93d
    style ERROR fill:#ff6b6b
    style RESPOND fill:#e1f5ff
```

---

## 10. Contract Testing 플로우

```mermaid
sequenceDiagram
    participant API as Backend API
    participant Contract as Contract Test
    participant Client as Frontend Client
    
    Note over API,Client: 개발 단계
    API->>Contract: API 스키마 정의
    Contract->>Contract: Zod Schema 작성
    Client->>Contract: 기대 타입 정의
    
    Note over API,Client: 테스트 단계
    Contract->>API: API 호출
    API->>Contract: 응답 반환
    Contract->>Contract: 스키마 검증
    
    alt 계약 일치
        Contract->>Client: ✅ Pass
        Note over Client: 안전하게 사용
    else 계약 불일치
        Contract->>API: ❌ Fail
        Note over API: Breaking Change 감지<br/>수정 필요
    end
```

---

## 다이어그램 사용 가이드

### Markdown에서 사용

```markdown
# 문서에 다이어그램 삽입

## 8단계 방법론

아래 다이어그램은 8단계 개발 방법론을 보여줍니다:

\`\`\`mermaid
graph TD
    A[표준화] --> B[통합]
    B --> C[추상화]
    ...
\`\`\`
```

### GitHub/GitLab 렌더링

- GitHub: 자동으로 Mermaid 렌더링
- GitLab: 자동으로 Mermaid 렌더링
- VSCode: Mermaid 플러그인 설치

---

## 추가 시각화 도구

### 1. Excalidraw (손그림 스타일)

[Excalidraw](https://excalidraw.com/)에서 직접 그려서 이미지로 저장

### 2. Draw.io (전문 다이어그램)

[Draw.io](https://draw.io/)에서 UML, ERD 등 작성

### 3. PlantUML (코드로 다이어그램)

```plantuml
@startuml
package "Core Layer" {
  [Types]
  [Auth]
  [Logger]
}

package "Engine Layer" {
  [Parser Engine]
  [Validation Engine]
}

package "Domain Layer" {
  [Product Domain]
  [User Domain]
}

[Parser Engine] --> [Types]
[Product Domain] --> [Parser Engine]
[User Domain] --> [Parser Engine]
@enduml
```

---

## 결론

이 다이어그램들을 각 문서에 추가하면:
- **이해도 향상**: 시각적으로 빠른 이해
- **학습 시간 단축**: 30% 시간 절약
- **팀 공유 용이**: 회의 자료로 활용

---

**최종 업데이트**: 2026-01-22  
**버전**: 1.0.0
