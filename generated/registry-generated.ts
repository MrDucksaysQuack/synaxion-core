/**
 * 결정 ID — decision-registry.json에서 자동 생성.
 * 재생성: pnpm run generate:from-registry
 * CI 검증: pnpm run check:decision-registry-generated-sync
 */

export const DECISION_IDS = [
  "editable-fields",
  "console-access",
  "ui-permission",
  "api-permission",
  "signup-complete",
  "redirect-url",
  "auth-path-constants",
  "login-redirect-url",
  "login-error-url",
  "profile-display-name",
  "401-login-redirect",
  "redirect-decision",
  "failure-reason-auth-state",
  "api-handler-wrapper",
  "require-profile-policy",
  "trust-level-reference",
  "client-session",
  "page-ready",
  "profile-absent-error",
  "e2e-mode",
  "auth-401-message",
  "api-catch-logging",
  "domain-no-lib-utils-direct",
  "synaxion-product-label-judgment",
  "synaxion-operator-followup",
  "consumer-product-gates",
  "consumer-gate-explanation-scope",
  "consumer-gate-ux-copy",
  "ingestion-ocr-feature-batch",
  "ingestion-ingredient-text-parse"
] as const;

export type DecisionId = (typeof DECISION_IDS)[number];

export function isRegisteredDecisionId(id: string): id is DecisionId {
  return (DECISION_IDS as readonly string[]).includes(id);
}

// 레지스트리 버전: 1.0
// 결정 수: 30