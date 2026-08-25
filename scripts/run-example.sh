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

OUT=$("$ROOT/scripts/build.sh" "$ROOT/examples/$NAME.kf")
exec "$KOF" run "$OUT" --target=js "$@"
