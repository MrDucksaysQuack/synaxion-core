import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** `docs/constitution/scripts/lib/` */
const LIB_DIR = dirname(fileURLToPath(import.meta.url));

/** `docs/constitution/` */
export function getConstitutionDir(): string {
  return resolve(LIB_DIR, '..', '..');
}

/** Itemwiki repo root (`scripts/lib/` → 4단계 상위) */
export function getProjectRoot(): string {
  return resolve(LIB_DIR, '..', '..', '..', '..');
}
