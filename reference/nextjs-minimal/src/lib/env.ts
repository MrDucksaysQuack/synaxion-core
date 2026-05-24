/**
 * Reference env validation — DEPLOY-02
 */

const required = ["NEXT_PUBLIC_SITE_URL"] as const;

export function validateEnv(): void {
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env: ${key}`);
    }
  }
}
