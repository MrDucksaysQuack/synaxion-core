# Architecture Map

> **Forward Planning Protocol — Step 3·4 통합 산출물**  
> 저장: `docs/planning/02-architecture-map.md`

---

## 메타

```
프로젝트명:
작성일:
스택 요약: (예: Next.js App Router, Supabase, Vercel)
```

---

## 적용 Synaxion 헌법 챕터

| 장 | 적용 | 이유 |
|----|------|------|
| 01 Foundations | ☐ | |
| 03 API | ☐ | |
| 04 Safety | ☐ | |
| 05 Testing | ☐ | |
| 13 UI Design | ☐ | |
| 14 Experience | ☐ | |
| 15 Deployment | ☐ | |
| 16 Operations | ☐ | |
| 17 Data/DB | ☐ | |
| 12 Judgment | ☐ | |

---

## 레이어·디렉터리 (인스턴스)

프로젝트의 계층 경계 SSOT:

```
src/lib/        — 
src/content/    — 
src/components/ — 
src/app/        — 
```

**검증**: `pnpm run check:layer-boundaries`

---

## 핵심 계약 맵

| 계약 | 문서 경로 | 검증 |
|------|----------|------|
| ENV | docs/…/ENV_CONTRACT.md | |
| DB | docs/…/DB_CONTRACT.md | |
| Auth | ADR / spec | |
| SLO | docs/…/SLO.md | |

---

## 외부 시스템

| 서비스 | 용도 | 실패 시 정책 |
|--------|------|-------------|
| | | 타임아웃 / fallback |

---

## ADR 인덱스 (링크)

| # | 제목 | 상태 |
|---|------|------|
| | | |

---

## specs / tasks 인덱스

| 유형 | 경로 | 개수 |
|------|------|------|
| Feature specs | docs/specs/ | |
| Tasks | docs/tasks/ | |
