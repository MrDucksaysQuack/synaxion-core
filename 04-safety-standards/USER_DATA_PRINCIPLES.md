# 사용자 데이터 원칙 (User Data Principles)

**목적**: 사용자가 생성한 정보에 대한 소유권·제어권을 명확히 하여 법적 안전성, 사용자 신뢰, 데이터 품질을 보장합니다.

**핵심 원칙**: *"User-generated content = User-controlled content."*

---

## 1. 사용자 소유·제어 원칙

- **사용자가 생성한 정보는 사용자에게 소유권이 있으며**, 사용자는 언제든 **수정·삭제**할 수 있어야 한다.
- 삭제 시 리소스의 최종 상태에 영향을 주지 않도록, 필요하면 **활동 로그에서만 비활성화**하는 방식으로 처리한다(삭제된 항목이 여전히 "현재 상태"로 집계되지 않도록).

---

## 2. 법적·규제 관점 (참고)

- **GDPR**: 잊혀질 권리(삭제 요청), 정정 권리(수정 요청), 데이터 이동성.
- **CCPA**: 삭제 권리, 데이터 사용에 대한 알 권리.
- **디지털 플랫폼법 등**: 사용자 데이터에 대한 명확한 소유권·제어권 제공 의무.
- 글로벌 또는 규제 대상 서비스는 **초기 설계부터** 수정·삭제·내보내기 경로를 고려한다.

---

## 3. 신뢰와 품질

- "내가 넣은 정보를 언제든 철회할 수 있다"는 구조는 **사용자 신뢰**와 **데이터 품질**에 기여한다. 잘못 입력한 데이터를 사용자가 직접 정정·삭제할 수 있으면 시스템 전체 품질이 올라간다.
- 권한/레벨 시스템이 있을 때: **자기 데이터**는 본인이 수정·삭제, **타인 데이터**는 검증·정책에 따라 조회·검토 등으로 구분하는 것이 자연스럽다.

---

## 4. 범위 (프로젝트별 정의)

- **사용자 생성 콘텐츠(UGC)** 범위(미디어, 텍스트, 메타데이터, 활동 로그 등)는 프로젝트의 인스턴스 문서에서 구체적으로 정의한다.
- 이 문서는 "원칙" 수준만 다루며, 특정 테이블·API·정책 세부는 프로젝트 헌법(예: itemwiki-constitution)에서 정의한다.

**Itemwiki 인스턴스**: [USER_OWNERSHIP_PRINCIPLE.md](../../itemwiki-constitution/itemwiki-specific/user-ownership/USER_OWNERSHIP_PRINCIPLE.md)(UGC 범위·**데이터 이동성/일괄 export 정책** 포함), `GET /api/v1/users/me/export`·`fetchUserDataExportBlob`·계정 삭제·예약 삭제 API·`packages/lib/utils/account/delete-account.ts` 등.

---

## 5. 소유권 계약 (Ownership contract) — 누가·무엇을·어디까지

**목적**: “이 데이터는 누가 통제하고, 시스템 경계를 넘을 때 누구 것으로 남는가”를 **한 페이지짜리 계약**으로 요약해 두면, 권한·삭제·위임 설계가 흔들리지 않는다.

**원칙 (범용)**:

- **주체(Actor)**: 자연인 사용자, 조직, 시스템 계정 등 데이터의 **법적·제품적 주인**을 구분한다.
- **객체(Object)**: 리소스 유형(UGC, 파생 분석, 로그, 공동 편집 문서 등)마다 **소유·라이선스·삭제 권한**이 다를 수 있음을 명시한다.
- **경계(Boundary)**: API 키, 배치 잡, 제3자 SaaS로 복제될 때 **원본의 소유**가 어디에 남는지(복제본의 지위)를 한 줄로 적는다.

**인스턴스**: 테이블·API·정책 매핑·컴플라이언스 증적 — 예: Itemwiki [OWNERSHIP_CONTRACTS_COMPLIANCE_REPORT.md](../../itemwiki-constitution/itemwiki-specific/user-ownership/OWNERSHIP_CONTRACTS_COMPLIANCE_REPORT.md).

---

## 6. 운영 식별자 익명화 (Privacy-preserving operational IDs)

**Tier**: **Tier 2** (권장 — 레이트 리밋·남용 방지·감사 로그에 IP 등을 쓸 때)

운영·보안 목적으로 **IP, 디바이스 fingerprint, 세션 하드웨어 ID** 등을 저장할 때, **raw 값을 영구 저장하지 않는다**.

### 원칙

1. **Salted one-way hash**: `SHA-256(salt + identifier)` 등 **복원 불가** 해시만 DB·로그·rate-limit 키에 사용한다.
2. **Salt는 비밀 env**: salt는 코드에 하드코딩하지 않고 **환경 변수**로 주입한다. 로테이션 절차는 인스턴스 문서에 둔다.
3. **목적 제한**: 해시는 남용 방지·집계·감사에만 쓰고, 마케팅·프로파일링 식별자로 승격하지 않는다.
4. **null 허용**: 프록시 헤더가 없으면 `null`로 두고, fake IP를 만들지 않는다.

### 금지

- `form_submissions.ip = req.ip` 형태의 **평문 IP** 장기 보관(법적·정책 예외는 인스턴스에서 명시).

### 인스턴스 참고

- truefarm `getIpHash()`: `FORM_SUBMISSION_IP_SALT` + `x-forwarded-for` / `x-real-ip`.

---

## 🔗 관련 문서

- [UX_SAFETY_RULES.md](./UX_SAFETY_RULES.md) — UX·네트워크 안전
- [CONCEPTUAL_ROT_PREVENTION.md](./CONCEPTUAL_ROT_PREVENTION.md) — 권한·정책 일관성
- [NETWORK_RESILIENCE_PRINCIPLES.md](../03-api-standards/NETWORK_RESILIENCE_PRINCIPLES.md) — rate limit 키 설계

---

**최종 업데이트**: 2026-05-23 — §6 운영 식별자 익명화
