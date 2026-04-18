#!/bin/bash
# synaxion-core/install.sh
# 신규 프로젝트 **루트에서** Harness 파일을 생성한다.
# 사용법: cd /path/to/project && bash /path/to/docs/constitution/install.sh "프로젝트명" "레이어경계(한 줄 권장)"
#
# 레이어 경계에 `/` 나 `|` 가 많으면 sed 이스케이프가 필요하다. 복잡하면 생성 후 .ai/AGENTS.md 를 수동 편집.

set -e

PROJECT=${1:-"my-project"}
LAYER_BOUNDARIES=${2:-"packages/lib <- core; packages/web <- client (lib only); app/ <- Next (web+lib)"}
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

cp "$SCRIPT_DIR/sync-harness.sh" scripts/sync-harness.sh
chmod +x scripts/sync-harness.sh

echo ""
echo "✓ 완료. 생성된 파일:"
echo "  .ai/AGENTS.md"
echo "  .cursor/rules/harness-core.mdc"
echo "  scripts/sync-harness.sh"
echo ""
echo "다음 단계: CLAUDE.md를 직접 작성하거나 기존 것을 유지하세요."
echo "검증: HARNESS_VERSION_GREP=1 bash scripts/sync-harness.sh"
