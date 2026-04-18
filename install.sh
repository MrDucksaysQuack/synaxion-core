#!/bin/bash
# synaxion-core/install.sh
# 신규 프로젝트 **루트에서** Harness 파일을 생성한다.
#
# 사용법:
#   bash /path/to/docs/constitution/install.sh "프로젝트명" "레이어경계(한 줄 권장)"
#
# 선택 인자(순서):
#   3) VERSION_FILE_PATH     — Constitution VERSION 상대 경로 (기본: docs/constitution/VERSION)
#   4) CHECK_COMMANDS        — 계층 경계 검증 문구 (기본: `pnpm run check:layer-boundaries`)
#   5) API_SSOT_PATH         — 핸들러 팩토리 경로 문구 (기본: `app/api/utils/handler-factory`)
#
# 레이어 경계에 `/` 나 `|` 가 많으면 sed 이스케이프가 필요하다. 복잡하면 생성 후 .ai/AGENTS.md 를 수동 편집.
# 전체 헌법 참조 표는 harness/CLAUDE.constitution-ref.default.md 를 치환한다. 프로젝트별로 해당 파일을
# synaxion-core 쪽에서 교체한 뒤 install 하거나, 생성된 CLAUDE.md 만 수동 편집하면 된다.

set -e

PROJECT=${1:-"my-project"}
LAYER_BOUNDARIES=${2:-"packages/lib <- core; packages/web <- client (lib only); app/ <- Next (web+lib)"}
VERSION_FILE_PATH=${3:-"docs/constitution/VERSION"}
CHECK_COMMANDS=${4:-'`pnpm run check:layer-boundaries`'}
API_SSOT_PATH=${5:-'`app/api/utils/handler-factory`'}
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -f "$SCRIPT_DIR/VERSION" ]; then
  SYNAXION_VERSION=$(cat "$SCRIPT_DIR/VERSION")
else
  SYNAXION_VERSION="unknown"
fi

echo "▶ Synaxion Harness 설치 시작 (v${SYNAXION_VERSION}, 프로젝트: ${PROJECT})"

mkdir -p .ai .cursor/rules scripts

sed -e "s/{{PROJECT}}/${PROJECT//\//\\/}/g" \
    -e "s/{{SYNAXION_VERSION}}/${SYNAXION_VERSION//\//\\/}/g" \
    -e "s|{{LAYER_BOUNDARIES}}|${LAYER_BOUNDARIES//\\/\\\\}|g" \
    "$SCRIPT_DIR/harness/AGENTS.md.template" > .ai/AGENTS.md

sed -e "s/{{PROJECT}}/${PROJECT//\//\\/}/g" \
    -e "s/{{SYNAXION_VERSION}}/${SYNAXION_VERSION//\//\\/}/g" \
    -e "s|{{LAYER_BOUNDARIES}}|${LAYER_BOUNDARIES//\\/\\\\}|g" \
    "$SCRIPT_DIR/harness/harness-core.mdc.template" > .cursor/rules/harness-core.mdc

export SYNAXION_HARNESS_DIR="$SCRIPT_DIR"
export CLAUDE_PROJECT_NAME="$PROJECT"
export CLAUDE_SYNAXION_VERSION="$SYNAXION_VERSION"
export CLAUDE_LAYER_BOUNDARIES="$LAYER_BOUNDARIES"
export CLAUDE_CHECK_COMMANDS="$CHECK_COMMANDS"
export CLAUDE_API_SSOT_PATH="$API_SSOT_PATH"

python3 <<'PY'
import os
from pathlib import Path

root = Path(os.environ["SYNAXION_HARNESS_DIR"])
template = (root / "harness/CLAUDE.md.template").read_text(encoding="utf-8")
const_ref = (root / "harness/CLAUDE.constitution-ref.default.md").read_text(encoding="utf-8")

text = template.replace("{{CONSTITUTION_REF_TABLE}}", const_ref.rstrip("\n"))
text = text.replace("{{PROJECT_NAME}}", os.environ["CLAUDE_PROJECT_NAME"])
text = text.replace("{{SYNAXION_VERSION}}", os.environ["CLAUDE_SYNAXION_VERSION"])
text = text.replace("{{LAYER_BOUNDARIES}}", os.environ["CLAUDE_LAYER_BOUNDARIES"])
text = text.replace("{{CHECK_COMMANDS}}", os.environ["CLAUDE_CHECK_COMMANDS"])
text = text.replace("{{API_SSOT_PATH}}", os.environ["CLAUDE_API_SSOT_PATH"])
Path("CLAUDE.md").write_text(text, encoding="utf-8")
PY

export VERSION_FILE_PATH
perl -pe 's/\{\{VERSION_FILE_PATH\}\}/$ENV{VERSION_FILE_PATH}/g' \
  < "$SCRIPT_DIR/scripts/sync-harness.sh.template" > scripts/sync-harness.sh
chmod +x scripts/sync-harness.sh

echo ""
echo "✓ 완료. 생성된 파일:"
echo "  .ai/AGENTS.md"
echo "  .cursor/rules/harness-core.mdc"
echo "  CLAUDE.md"
echo "  scripts/sync-harness.sh (VERSION: ${VERSION_FILE_PATH})"
echo ""
echo "검증: HARNESS_VERSION_GREP=1 bash scripts/sync-harness.sh"
