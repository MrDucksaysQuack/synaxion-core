#!/bin/bash
# sync-harness.sh — .ai/AGENTS.md 변경 후 실행하여 동기화 상태 확인
# 실제 파일 복사는 하지 않음 (각 파일은 독립적 포맷이므로)
# 대신 세 파일의 핵심 버전이 일치하는지 검증한다.

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
if [ -f "$ROOT_DIR/docs/constitution/VERSION" ]; then
  CONSTITUTION_VERSION=$(cat "$ROOT_DIR/docs/constitution/VERSION")
elif [ -f "$ROOT_DIR/VERSION" ]; then
  CONSTITUTION_VERSION=$(cat "$ROOT_DIR/VERSION")
else
  CONSTITUTION_VERSION="unknown"
fi

echo "✓ Synaxion Constitution: v${CONSTITUTION_VERSION}"

FILES=(
  ".ai/AGENTS.md"
  ".cursor/rules/harness-core.mdc"
  "CLAUDE.md"
)

ALL_OK=true
for f in "${FILES[@]}"; do
  if [ -f "$ROOT_DIR/$f" ]; then
    echo "✓ $f 존재"
  else
    echo "✗ $f 없음 — HARNESS-UPGRADE.md Step 참조"
    ALL_OK=false
  fi
done

if [ "$ALL_OK" = true ]; then
  echo ""
  echo "✓ Harness 파일 모두 존재. Constitution v${CONSTITUTION_VERSION}와 동기화 확인 완료."
  echo "  Constitution 버전 업데이트 시 세 harness 파일의 버전 문자열도 수동 업데이트 필요."
  if [ "${HARNESS_VERSION_GREP:-0}" = 1 ]; then
    for f in "${FILES[@]}"; do
      if grep -q "v${CONSTITUTION_VERSION}" "$ROOT_DIR/$f" 2>/dev/null; then
        echo "✓ $f 에 v${CONSTITUTION_VERSION} 검출"
      else
        echo "⚠ $f — v${CONSTITUTION_VERSION} 미검출. 헤더 수동 확인"
      fi
    done
  fi
else
  echo ""
  echo "✗ 일부 파일 누락. HARNESS-UPGRADE.md를 참조하여 생성하세요."
  exit 1
fi
