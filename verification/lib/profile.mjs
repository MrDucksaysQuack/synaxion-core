/**
 * Project profile detection for multi-stack reference instances.
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { getProjectRoot } from "./paths.mjs";

/** @returns {'nextjs' | 'express-api' | string} */
export function getProjectProfile() {
  const root = getProjectRoot();
  const manifest = join(root, "synaxion.profile.json");
  if (existsSync(manifest)) {
    try {
      const data = JSON.parse(readFileSync(manifest, "utf-8"));
      if (data.profile) return data.profile;
    } catch {
      /* fall through */
    }
  }
  if (existsSync(join(root, "src/app"))) return "nextjs";
  if (existsSync(join(root, "src/index.js")) || existsSync(join(root, "src/index.mjs"))) {
    return "express-api";
  }
  return "nextjs";
}

export function isExpressApiProfile(profile = getProjectProfile()) {
  return profile === "express-api";
}
