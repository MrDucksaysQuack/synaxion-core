/**
 * ESM-safe paths for constitution scripts (tsx runs as ES module).
 *
 * Supports:
 * - Host monorepo with submodule at `docs/constitution/` (e.g. Itemwiki)
 * - Standalone synaxion-core checkout (`--project-root=` or `process.cwd()`)
 */
import path from 'path';
import { fileURLToPath } from 'url';

const LIB_DIR = path.dirname(fileURLToPath(import.meta.url));

/** `docs/constitution/scripts` or standalone `scripts/` */
export function getConstitutionScriptsDir(): string {
  return path.resolve(LIB_DIR, '..');
}

/** Constitution package root (`docs/constitution` or synaxion-core root) */
export function getConstitutionDir(): string {
  return path.resolve(LIB_DIR, '..', '..');
}

function projectRootFromArgv(): string | null {
  const arg = process.argv.find((a) => a.startsWith('--project-root='));
  if (!arg) return null;
  const value = arg.slice('--project-root='.length).trim();
  return path.isAbsolute(value) ? value : path.resolve(process.cwd(), value);
}

/** Host monorepo root (Itemwiki, etc.) */
export function getRepoRoot(): string {
  const fromArg = projectRootFromArgv();
  if (fromArg) return fromArg;

  const constitutionDir = getConstitutionDir();
  const nestedSuffix = path.join('docs', 'constitution');
  if (path.normalize(constitutionDir).endsWith(path.normalize(nestedSuffix))) {
    return path.resolve(constitutionDir, '..', '..');
  }

  return path.resolve(process.cwd());
}
