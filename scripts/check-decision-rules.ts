#!/usr/bin/env tsx
// Why: decision-rules JSON이 스키마·ERIC·matcherRef 이유를 지키지 않으면 런타임 판단이 불안정.
/**
 * Synaxion decision-rules JSON 스키마 검사 (경전 예시 또는 --rules= 지정 파일)
 *
 * 규칙마다 requiredDimensions(ERIC 축 ≥1) 필수. matcherRef 시 matcherRefReason 필수 — CI: --strict-matcher-ref-reason
 *
 * 성공 후 `docs/constitution/fixtures/*.json`도 동일 검증(데모·픽스처 드리프트 방지). 제외: `--skip-fixtures`
 */

import * as fs from 'fs';
import * as path from 'path';
import { JUDGMENT_MATCHER_REF_ALLOWLIST } from '../../../packages/lib/core/judgment/escape-matcher-registry';

const ROOT = path.resolve(__dirname, '..', '..', '..');
const CONSTITUTION_DIR = path.join(ROOT, 'docs', 'constitution');

const OUTCOMES = new Set([
  'ALLOW',
  'DENY',
  'HOLD',
  'INSUFFICIENT_DATA',
  'CONFLICTING_SOURCES',
  'DEGRADED_CONFIDENCE',
  'ESCALATE_TO_HUMAN',
]);
const DIMENSIONS = new Set(['entity', 'relation', 'context', 'impact']);
const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FLAGS = new Set(['trustBoundaryViolation', 'conflictingSources', 'unresolvedConflict', 'asyncPending']);
const BUILTINS = new Set(['missingAnyRequiredDimension', 'ericAllDimensionsPresent', 'ericPartialDegraded']);
/** DSL 중첩 한도 — 초과 시 matcherRef 로 옮길 것 */
const MAX_MATCH_NEST_DEPTH = 4;

const MATCHER_REF_SET = new Set<string>(JUDGMENT_MATCHER_REF_ALLOWLIST);

function getRulesPath(): string {
  const arg = process.argv.find((a) => a.startsWith('--rules='));
  if (arg) return path.resolve(ROOT, arg.slice('--rules='.length).trim());
  return path.join(CONSTITUTION_DIR, 'decision-rules.example.json');
}

interface Rule {
  id: string;
  title: string;
  when: string;
  outcome: string;
  requiredDimensions: string[];
  rationaleDoc?: string;
  match?: unknown;
  matcherRef?: string;
  matcherRefReason?: string;
  implementationNote?: string;
}

interface RulesFile {
  version: string;
  description?: string;
  rules: Rule[];
}

function loadJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function validateEricKeys(arr: unknown, path: string): string[] {
  const errors: string[] = [];
  if (!Array.isArray(arr) || arr.length < 1) {
    errors.push(`${path}: ERIC 차원 배열은 최소 1개 요소 필요`);
    return errors;
  }
  for (let i = 0; i < arr.length; i++) {
    const d = arr[i];
    if (typeof d !== 'string' || !DIMENSIONS.has(d)) {
      errors.push(`${path}[${i}]: 알 수 없는 차원 ${String(d)}`);
    }
  }
  return errors;
}

function validateMatch(spec: unknown, path: string, depth: number): string[] {
  const errors: string[] = [];
  if (depth > MAX_MATCH_NEST_DEPTH) {
    errors.push(
      `${path}: match 중첩이 ${String(MAX_MATCH_NEST_DEPTH)} 초과 — DSL 과설계 방지. 복합 조건은 matcherRef(escape) 사용`,
    );
    return errors;
  }
  if (spec === null || typeof spec !== 'object' || Array.isArray(spec)) {
    errors.push(`${path}: match는 객체여야 함`);
    return errors;
  }
  const o = spec as Record<string, unknown>;
  const keys = Object.keys(o).filter((k) => o[k] !== undefined);

  function onlyKeys(allowed: string[]): boolean {
    const bad = keys.filter((k) => !allowed.includes(k));
    if (bad.length > 0) {
      errors.push(`${path}: 허용 키 ${allowed.join(', ')} 만 가능 (불가: ${bad.join(', ')})`);
      return false;
    }
    return true;
  }

  if (o.allOf !== undefined) {
    if (!onlyKeys(['allOf'])) return errors;
    const arr = o.allOf;
    if (!Array.isArray(arr) || arr.length < 1) {
      errors.push(`${path}.allOf: 비어 있지 않은 배열 필요`);
      return errors;
    }
    arr.forEach((child, i) => {
      errors.push(...validateMatch(child, `${path}.allOf[${i}]`, depth + 1));
    });
    return errors;
  }
  if (o.anyOf !== undefined) {
    if (!onlyKeys(['anyOf'])) return errors;
    const arr = o.anyOf;
    if (!Array.isArray(arr) || arr.length < 1) {
      errors.push(`${path}.anyOf: 비어 있지 않은 배열 필요`);
      return errors;
    }
    arr.forEach((child, i) => {
      errors.push(...validateMatch(child, `${path}.anyOf[${i}]`, depth + 1));
    });
    return errors;
  }
  if (o.not !== undefined) {
    if (!onlyKeys(['not'])) return errors;
    errors.push(...validateMatch(o.not, `${path}.not`, depth + 1));
    return errors;
  }
  if (o.flag !== undefined) {
    if (!onlyKeys(['flag', 'equals'])) return errors;
    const flag = o.flag;
    if (typeof flag !== 'string' || !FLAGS.has(flag)) {
      errors.push(`${path}.flag: 허용 값: ${[...FLAGS].join(', ')}`);
    }
    if (o.equals !== undefined && typeof o.equals !== 'boolean') {
      errors.push(`${path}.equals: boolean 이어야 함`);
    }
    return errors;
  }
  if (o.itemwiki !== undefined) {
    if (!onlyKeys(['itemwiki', 'equals'])) return errors;
    if (typeof o.itemwiki !== 'string' || !String(o.itemwiki).trim()) {
      errors.push(`${path}.itemwiki: 비어 있지 않은 문자열`);
    }
    if (o.equals !== undefined && typeof o.equals !== 'boolean') {
      errors.push(`${path}.equals: boolean 이어야 함`);
    }
    return errors;
  }
  if (o.experiment !== undefined) {
    if (!onlyKeys(['experiment', 'equals'])) return errors;
    if (typeof o.experiment !== 'string' || !String(o.experiment).trim()) {
      errors.push(`${path}.experiment: 비어 있지 않은 문자열`);
    }
    if (o.equals !== undefined && typeof o.equals !== 'boolean') {
      errors.push(`${path}.equals: boolean 이어야 함`);
    }
    return errors;
  }
  if (o.ericAllFilled !== undefined) {
    if (!onlyKeys(['ericAllFilled'])) return errors;
    errors.push(...validateEricKeys(o.ericAllFilled, `${path}.ericAllFilled`));
    return errors;
  }
  if (o.ericAnyUnfilled !== undefined) {
    if (!onlyKeys(['ericAnyUnfilled'])) return errors;
    errors.push(...validateEricKeys(o.ericAnyUnfilled, `${path}.ericAnyUnfilled`));
    return errors;
  }
  if (o.ericNoLowTrust !== undefined) {
    if (!onlyKeys(['ericNoLowTrust'])) return errors;
    errors.push(...validateEricKeys(o.ericNoLowTrust, `${path}.ericNoLowTrust`));
    return errors;
  }
  if (o.ericAnyLowTrust !== undefined) {
    if (!onlyKeys(['ericAnyLowTrust'])) return errors;
    errors.push(...validateEricKeys(o.ericAnyLowTrust, `${path}.ericAnyLowTrust`));
    return errors;
  }
  if (o.builtin !== undefined) {
    if (!onlyKeys(['builtin'])) return errors;
    const b = o.builtin;
    if (typeof b !== 'string' || !BUILTINS.has(b)) {
      errors.push(`${path}.builtin: 허용 값: ${[...BUILTINS].join(', ')}`);
    }
    return errors;
  }

  errors.push(`${path}: 알 수 없는 match 형태 (키: ${keys.join(', ') || '(empty)'})`);
  return errors;
}

function validate(data: RulesFile, opts: { strictMatcherRefReason: boolean }): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (data.version !== '1.0') errors.push(`version은 "1.0"이어야 함 (got: ${data.version ?? '(없음)'})`);
  if (!Array.isArray(data.rules) || data.rules.length < 1) errors.push('rules는 최소 1개 항목 배열이어야 함');

  const seen = new Set<string>();
  (data.rules || []).forEach((r, i) => {
    const p = `rules[${i}]`;
    if (!r.id) errors.push(`${p}.id 필수`);
    else if (!ID_RE.test(r.id)) errors.push(`${p}.id는 kebab-case 형식이어야 함: ${r.id}`);
    else if (seen.has(r.id)) errors.push(`중복 id: ${r.id}`);
    else seen.add(r.id);

    if (!r.title || typeof r.title !== 'string' || !r.title.trim()) errors.push(`${p}.title 필수`);
    if (!r.when || typeof r.when !== 'string' || !r.when.trim()) errors.push(`${p}.when 필수`);

    if (!Array.isArray(r.requiredDimensions) || r.requiredDimensions.length < 1) {
      errors.push(
        `${p}.requiredDimensions: ERIC 커버리지 — entity|relation|context|impact 중 이 규칙이 의존하는 차원을 1개 이상 배열로 명시 (ERIC_SPEC.md, G2)`,
      );
    } else {
      const uniq = new Set<string>();
      for (const d of r.requiredDimensions) {
        if (!DIMENSIONS.has(d)) errors.push(`${p}.requiredDimensions에 알 수 없는 값: ${d}`);
        if (uniq.has(d)) errors.push(`${p}.requiredDimensions 중복: ${d}`);
        uniq.add(d);
      }
    }

    if (r.implementationNote !== undefined) {
      if (typeof r.implementationNote !== 'string' || !r.implementationNote.trim()) {
        errors.push(`${p}.implementationNote: 비어 있지 않은 문자열`);
      }
    }
    if (r.matcherRefReason !== undefined) {
      if (typeof r.matcherRefReason !== 'string' || !r.matcherRefReason.trim()) {
        errors.push(`${p}.matcherRefReason: 비어 있지 않은 문자열`);
      }
    }
    if (!r.outcome || !OUTCOMES.has(r.outcome)) {
      errors.push(`${p}.outcome은 ${[...OUTCOMES].join('|')} 중 하나: ${r.outcome ?? '(없음)'}`);
    }

    const hasMatch = r.match != null && typeof r.match === 'object' && !Array.isArray(r.match);
    const refRaw = typeof r.matcherRef === 'string' ? r.matcherRef.trim() : '';
    const hasRef = refRaw.length > 0;

    if (hasMatch && hasRef) {
      errors.push(`${p}: match 와 matcherRef 는 동시에 둘 수 없음`);
    } else if (!hasMatch && !hasRef) {
      errors.push(`${p}: match 또는 matcherRef 중 하나 필수`);
    } else if (hasRef) {
      if (!MATCHER_REF_SET.has(refRaw)) {
        errors.push(
          `${p}.matcherRef: 허용 값만 사용: ${JUDGMENT_MATCHER_REF_ALLOWLIST.join(', ')}`,
        );
      } else {
        const reasonOk = typeof r.matcherRefReason === 'string' && r.matcherRefReason.trim().length > 0;
        if (!reasonOk) {
          const msg = `${p}: matcherRef 사용 시 matcherRefReason 권장 (DSL 경계·감사 추적용)`;
          if (opts.strictMatcherRefReason) {
            errors.push(msg);
          } else {
            warnings.push(msg);
          }
        }
      }
    } else {
      errors.push(...validateMatch(r.match, `${p}.match`, 0));
    }
  });

  return { errors, warnings };
}

function main(): void {
  const RULES_PATH = getRulesPath();
  console.log('🔍 Synaxion decision-rules 검사...\n');
  console.log('   대상:', RULES_PATH, '\n');

  if (!fs.existsSync(RULES_PATH)) {
    console.error('❌ decision-rules 파일 없음:', RULES_PATH);
    process.exit(1);
  }

  let data: RulesFile;
  try {
    data = loadJson<RulesFile>(RULES_PATH);
  } catch (e) {
    console.error('❌ JSON 파싱 실패:', (e as Error).message);
    process.exit(1);
  }

  const strictMatcherRefReason = process.argv.includes('--strict-matcher-ref-reason');
  const { errors, warnings } = validate(data, { strictMatcherRefReason });

  if (warnings.length > 0) {
    console.warn('⚠️  권장 사항:');
    warnings.forEach((w) => console.warn('  -', w));
    console.warn('');
  }

  if (errors.length > 0) {
    console.error('❌ 검증 실패:');
    errors.forEach((e) => console.error('  -', e));
    process.exit(1);
  }

  console.log(`✅ decision-rules OK (${data.rules.length} rules)`);

  if (!process.argv.includes('--skip-fixtures')) {
    const fixtureDir = path.join(CONSTITUTION_DIR, 'fixtures');
    if (fs.existsSync(fixtureDir) && fs.statSync(fixtureDir).isDirectory()) {
      const names = fs.readdirSync(fixtureDir).filter((n) => n.endsWith('.json')).sort();
      if (names.length > 0) {
        console.log('\n📁 docs/constitution/fixtures/*.json\n');
        for (const name of names) {
          const fp = path.join(fixtureDir, name);
          console.log('   대상:', fp);
          let fixtureData: RulesFile;
          try {
            fixtureData = loadJson<RulesFile>(fp);
          } catch (e) {
            console.error(`❌ JSON 파싱 실패 (${name}):`, (e as Error).message);
            process.exit(1);
          }
          const fv = validate(fixtureData, { strictMatcherRefReason });
          if (fv.warnings.length > 0) {
            console.warn(`⚠️  권장 사항 (${name}):`);
            fv.warnings.forEach((w) => console.warn('  -', w));
            console.warn('');
          }
          if (fv.errors.length > 0) {
            console.error(`❌ 검증 실패 (${name}):`);
            fv.errors.forEach((e) => console.error('  -', e));
            process.exit(1);
          }
          console.log(`   ✅ OK (${fixtureData.rules.length} rules)\n`);
        }
        console.log(`✅ constitution fixtures OK (${names.length} file(s))`);
      }
    }
  }

  process.exit(0);
}

main();
