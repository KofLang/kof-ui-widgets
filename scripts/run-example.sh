#!/usr/bin/env bash
#
# run-example.sh — monta um exemplo com build.sh e roda no alvo JS.
#
# Uso:
#   scripts/run-example.sh hello
#   scripts/run-example.sh dashboard --target=jvm   # args extras vão pro kof
set -euo pipefail

NAME="${1:?uso: scripts/run-example.sh <nome> [args do kof]}"
shift || true

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KOF="${KOF:-kof}"

APP="$ROOT/examples/$NAME.kf"
if [[ -f "$ROOT/examples/$NAME/main.kf" ]]; then APP="$ROOT/examples/$NAME/main.kf"; fi
OUT=$("$ROOT/scripts/build.sh" "$APP")
exec "$KOF" run "$OUT" --target=js "$@"
