/**
 * Reference env validation — DEPLOY-02
 */

const required = ["PORT"];

export function validateEnv() {
  for (const key of required) {
    if (process.env[key] === undefined || process.env[key] === "") {
      throw new Error(`Missing required env: ${key}`);
    }
  }
}
