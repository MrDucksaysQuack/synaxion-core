#!/usr/bin/env tsx
/**
 * G6-005 — judgment-output.schema.json 로 JudgmentResult 샘플(JSON) 검증 (AJV)
 *
 *   pnpm run check:judgment-output-schema
 */

import * as fs from 'fs';
import * as path from 'path';
import Ajv from 'ajv';

const ROOT = path.resolve(__dirname, '..', '..', '..');

const SCHEMA_PATH = path.join(ROOT, 'docs', 'constitution', 'judgment-output.schema.json');
const FIXTURES = [
  path.join(ROOT, 'docs', 'constitution', 'fixtures', 'judgment-output', 'judgment-output-sample-result.json'),
];

function stripJsonComments(raw: string): string {
  return raw.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
}

function main(): void {
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8')) as object;
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);

  let failed = false;
  for (const fp of FIXTURES) {
    const raw = fs.readFileSync(fp, 'utf8');
    const cleaned = stripJsonComments(raw);
    let data: unknown;
    try {
      data = JSON.parse(cleaned);
    } catch (e) {
      console.error(`❌ ${path.relative(ROOT, fp)}: JSON parse error`, e);
      failed = true;
      continue;
    }
    if (typeof data === 'object' && data !== null && '$comment' in data) {
      const { $comment: _c, ...rest } = data as Record<string, unknown>;
      data = rest;
    }
    if (!validate(data)) {
      console.error(`❌ ${path.relative(ROOT, fp)} fails judgment-output.schema.json:`);
      console.error(ajv.errorsText(validate.errors, { separator: '\n' }));
      failed = true;
    } else {
      console.log(`✅ ${path.relative(ROOT, fp)}`);
    }
  }

  if (failed) {
    process.exit(1);
  }
  console.log('✅ check:judgment-output-schema — all fixtures valid');
}

main();
