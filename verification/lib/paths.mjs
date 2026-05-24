/**
 * Synaxion verification — path resolution for core repo vs project instance.
 */

import { existsSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** synaxion-core repository root */
export function getCoreRoot() {
  return join(__dirname, "../..");
}

/** Project instance root (reference app or consumer repo) */
export function getProjectRoot() {
  const core = getCoreRoot();
  const raw = process.env.SYNAXION_PROJECT_ROOT ?? "reference/nextjs-minimal";
  return raw.startsWith("/") ? raw : join(core, raw);
}

/** docs/<name>-constitution/ directory inside project */
export function getConstitutionDir(projectRoot = getProjectRoot()) {
  if (process.env.SYNAXION_CONSTITUTION_DIR) {
    const custom = process.env.SYNAXION_CONSTITUTION_DIR;
    const path = custom.startsWith("/") ? custom : join(projectRoot, custom);
    if (existsSync(path)) return path;
  }

  const docsDir = join(projectRoot, "docs");
  if (!existsSync(docsDir)) {
    return join(projectRoot, "docs/reference-constitution");
  }

  const match = readdirSync(docsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.endsWith("-constitution"))
    .map((e) => join(docsDir, e.name));

  if (match.length === 1) return match[0];
  const preferred = join(docsDir, "reference-constitution");
  if (existsSync(preferred)) return preferred;
  return match[0] ?? preferred;
}

export function constitutionDoc(name, projectRoot = getProjectRoot()) {
  return join(getConstitutionDir(projectRoot), name);
}
