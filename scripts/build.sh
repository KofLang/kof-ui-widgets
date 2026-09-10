#!/usr/bin/env bash
#
# build.sh — concatena a biblioteca (ordem dos prefixos numéricos) com o
# seu programa e devolve o arquivo pronto para `kof run`.
#
# Uso:
#   scripts/build.sh meu-app.kf            # -> .build/meu-app.kf
#   kof run "$(scripts/build.sh meu-app.kf)" --target=js
set -euo pipefail

APP="${1:?uso: scripts/build.sh <seu-app.kf>}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

[ -f "$APP" ] || { echo "não achei $APP" >&2; exit 1; }

mkdir -p "$ROOT/.build"
NAME="$(basename "${APP%.kf}")"
if [[ "$NAME" == main ]]; then NAME="$(basename "$(dirname "$APP")")"; fi
mkdir -p "$ROOT/.build/apps/$NAME"
OUT="$ROOT/.build/apps/$NAME/main.kf"

export LC_ALL=C
if [[ "$(basename "$APP")" == main.kf ]]; then
    cat "$ROOT"/src/*.kf "$(dirname "$APP")"/*.kf > "$OUT"
else
    cat "$ROOT"/src/*.kf "$APP" > "$OUT"
fi
echo "$OUT"
