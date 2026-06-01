/**
 * ESM-safe paths for scripts under docs/constitution/scripts/.
 * @see fix/constitution-scripts-esm-paths (synaxion-core) — re-applied in Itemwiki submodule until upstream merge.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function resolveConstitutionDir(importMetaUrl: string): string {
  return path.resolve(path.dirname(fileURLToPath(importMetaUrl)), '..');
}

/** Itemwiki (or host repo) root when script lives in docs/constitution/scripts/ */
export function resolveProjectRoot(importMetaUrl: string): string {
  return path.resolve(resolveConstitutionDir(importMetaUrl), '..', '..');
}
