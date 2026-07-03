# Console Surface Composition

**레벨**: Recommended (Tier 3 도입 — OCP 구현 패턴)  
**헌법 연결**: [OPERATIONAL_CONSOLE_PRINCIPLE.md](../10-design-flow/OPERATIONAL_CONSOLE_PRINCIPLE.md) · UX-08~12 · UI Design §04

---

## 1. Purpose

운영 콘솔 화면에서 **정보 구조·시각 계층·공간 사용·CTA 흐름**을 한 column grid 위에 repeatable하게 쌓는다.  
“예쁜 landing 스타일”이 아니라 **상태 판단 → 다음 행동**이 가능한 surface를 만든다.

---

## 2. When to Use

- Authenticated owner/admin/operator hub
- Multi-tenant picker · organization list
- Ops dashboard with entity cards and open/manage actions

---

## 3. When Not to Use

- Public marketing pages (`shellMode: marketing`)
- Single-purpose wizards with one linear goal (`shellMode: flow`)
- Narrow form-only settings without operational summary (`layout: reading`)

---

## 4. Required Inputs

| 입력 | 설명 |
|------|------|
| `shellMode` | `owner-console` \| `app` — P1 AuthenticatedConsoleShell |
| `primaryIntent` | 한 문장 (UX-01) — PAGE-AUDIT intent 필드 |
| `summaryMetrics` | 0~4개 KPI (Active · Billing · Issues · …) |
| `entities[]` | card/list row 데이터 + operational metadata |
| `ctaTier` | P0~P2 per row and page |

**Width tokens** (UI Design §04): console body uses `--width-shell` or `--width-content`; `--width-reading`은 form block 내부만.

---

## 5. Pattern Rules

1. **Vertical stack order** (고정):  
   `ConsolePageHeader` → `ConsoleSummaryStrip?` → `ConsoleToolbar?` → `ConsoleContent` → `ConsoleFooterActions?`

2. **ConsolePageHeader**: eyebrow(영역) · H1(nav와 동일 라벨) · subtitle(행동导向, 이메일은 secondary)

3. **ConsoleSummaryStrip**: 4상태(UX-02)와 별도 — *운영 건강* 요약. empty tenant여도 strip은 “0 Active” 등 표시 가능.

4. **ConsoleToolbar**: 검색·정렬·필터 — **entity count ≥ threshold**(인스턴스 기본 5)일 때만 강조. toolbar width = content width.

5. **EntityConsoleCard**: domain · plan · environment · last activity · status checklist(모호한 “준비 완료” 금지) · P0 Open · P1 Manage.

6. **CTA**: 페이지당 **시각적 primary 1개**(P0). `+ Add`는 P2 — header 우측 secondary 또는 list 하단 tertiary.

7. **Shell**: `owner-console`에서 marketing `PLATFORM_NAV` 및 guest CTA 렌더 금지.

---

## 6. Recommended Variants

- Summary strip as 2×2 stat cards or horizontal metric bar
- List mode instead of card grid when >8 homogeneous entities
- Mobile: summary strip stacks; toolbar becomes icon row

---

## 7. Anti-patterns

| Anti-pattern | OCP ID |
|--------------|--------|
| Marketing nav + 시작하기 on authenticated dashboard | A1 |
| `platform-app-page` (720px) on full console | A3 · A5 |
| Primary button on every card + footer + header | A4 |
| Search bar prominent when entity count = 1 | A5 |
| Badge “준비 완료” without provisioned/domain/billing semantics | A3 |

---

## 8. Accessibility / Performance

- Summary strip metrics: `aria-label` or visible text, color not sole indicator
- Card actions: keyboard reachable, UX-07 touch targets
- Lazy-load row metadata; summary strip from aggregated API batch

---

## 9. Implementation Sketch

```tsx
<PlatformShell shellMode="owner-console">
  <ConsoleSurface layout="shell">
    <ConsolePageHeader
      eyebrow="Owner Console"
      title="내 조직"  {/* = sidebar label */}
      description="접근 가능한 조직과 운영 공간을 관리하세요."
    />
    <ConsoleSummaryStrip metrics={summary} />
  {showToolbar ? (
    <ConsoleToolbar search sort filter />
  ) : null}
    <ConsoleEntityGrid>
      {tenants.map((t) => (
        <EntityConsoleCard key={t.id} entity={t} primaryAction="open" />
      ))}
    </ConsoleEntityGrid>
    <ConsoleFooterActions tier="tertiary">
      <AddTenantButton />
    </ConsoleFooterActions>
  </ConsoleSurface>
</PlatformShell>
```

Primitive 이름은 인스턴스별; **stack order와 tier 규칙**은 불변.

---

## 10. Checkability

| 항목 | 방식 |
|------|------|
| OCP-A1 shell leak | `check:console-surface` (인스턴스) |
| Nav = H1 | soft: page manifest or E2E |
| CTA tier | PR checklist · design review |
| Width token | `check:raw-values` · lint for inline maxWidth on console pages |

---

## 11. Source Reference

- Inflomatrix `PlatformOwnerDashboardPage` · `PlatformShell` (2026-06-26 UX audit)
- Business plane: `ViewingContextBadge` · `AppTopBar` vs Site shell (plane separation 선례)

---

**최종 업데이트**: 2026-06-26
