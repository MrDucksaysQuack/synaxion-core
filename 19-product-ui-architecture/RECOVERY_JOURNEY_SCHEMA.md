# Recovery Journey — 섹션 구조 스키마

> **Synaxion Constitution 19장 · RECOVERY_JOURNEY_SCHEMA**  
> 정상 흐름(happy path) 실패 시 사용자가 복구하는 여정의 표준 섹션 구조.  
> **출처**: Agrinovation `02-RECOVERY-JOURNEYS.md` 12건 구현 검증

---

## 핵심 원칙

> **복구 여정은 happy path만큼 명확한 CTA와 다음 단계를 가져야 한다.**

에러 상태를 "에러 메시지 표시"로 끝내지 않는다.  
사용자가 다음에 무엇을 해야 하는지, 어떤 CTA가 있는지, 복구가 완료된 상태가 무엇인지를 함께 설계한다.

---

## 섹션 구조 (5요소)

각 Recovery Journey는 아래 5요소로 기술한다.

```markdown
## R-[ID] — [여정 이름]

**트리거**: [어떤 Event 또는 조건이 이 실패를 발생시키는가]
**영향 역할**: [이 복구 여정에 관여하는 역할들]
**연결 핸드오프**: `backlog: L2-H-NN` (해당 시)
**연결 Event**: `backlog: L3-E-EventType` (해당 시)

[복구 흐름 다이어그램 — 아래 형식]

### 복구 완료 조건
[어떤 상태가 되면 이 여정이 끝나는가]
```

---

## 복구 흐름 다이어그램 형식

```
⚡ [트리거 Event 또는 조건]
    ↓
[#/경로 — 역할 화면]
🔴 상태: "[에러 배지 텍스트]"
    │  [사용자가 보는 정보]
    ↓
[CTA 선택]
    ├── [주 복구 경로] → [다음 단계]
    │       ↓
    │   [#/경로 — 중간 상태]
    │       ↓
    │   ✅ [복구 완료 상태]
    │
    └── [대안 경로] → [다른 결과]
            ↓
        [#/경로]
```

---

## 심볼 범례

| 심볼 | 의미 |
|------|------|
| `⚡` | 트리거 Event 또는 조건 |
| `🔴` | 사용자가 반드시 봐야 하는 에러 상태 |
| `✅` | 복구 완료 상태 |
| `backlog:` | 구현 항목 — Backlog ID |

---

## Recovery Journey 분류

인스턴스는 여정을 아래 유형으로 분류해 관리할 것을 권장한다.

| 유형 접두사 | 설명 |
|------------|------|
| `R-[도메인]` | 도메인 로직 실패 (예: R-correction, R-delivery-fail) |
| `R-auth` | 인증·권한 실패 |
| `R-network` | 네트워크 오류·타임아웃 |
| `R-payment` | 결제·에스크로 실패 |
| `R-timeout` | 시간 초과 (배치·비동기 응답 없음) |

---

## N/A 허용 조건

아래 조건에서 `02-RECOVERY-JOURNEYS.md`를 생략할 수 있다.

- 제품이 단일 역할이고, 모든 실패가 "재시도 버튼 1개"로 해결된다.
- 핸드오프(역할 간 책임 이전)가 없다.
- Event 기반 비동기 흐름이 없다.

이 조건에 해당하지 않으면 복구 여정 문서 없이 "Plan Complete"를 주장할 수 없다.

---

## Reference (검증 인스턴스)

Agrinovation `02-RECOVERY-JOURNEYS.md` 12건:

| ID | 여정 | 유형 |
|----|------|------|
| R-correction | 검증 거절 → 재제출 또는 분쟁 | R-도메인 |
| R-delivery-fail | 배송 실패 → 재배정 또는 분쟁 | R-도메인 |
| R-session-expire | 세션 만료 → returnTo 복귀 | R-auth |
| R-role-denied | 역할 불일치 → 역할 신청 유도 | R-auth |
| R-payment-fail | Wallet 잔액 부족 → 충전 CTA | R-payment |
| R-offline-submit | 오프라인 증거 제출 → 재접속 자동 재시도 | R-network |
| ... | (총 12건) | |
