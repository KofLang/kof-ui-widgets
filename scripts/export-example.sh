#!/usr/bin/env bash
# Emite HTML + módulos JS + assets, sem abrir janela.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NAME="${1:-showcase}"
KOF="${KOF:-kof}"
APP="$ROOT/examples/$NAME.kf"
if [[ -f "$ROOT/examples/$NAME/main.kf" ]]; then APP="$ROOT/examples/$NAME/main.kf"; fi
SOURCE=$("$ROOT/scripts/build.sh" "$APP")
DEST="$ROOT/.build/web/$NAME"
"$KOF" build "$(dirname "$SOURCE")" --target js --output "$DEST"
[[ -s "$DEST/Default.mjs" && -s "$DEST/index.html" ]] || { echo 'Kof não emitiu o app.' >&2; exit 1; }
if [[ -d "$ROOT/examples/$NAME/assets" ]]; then
    mkdir -p "$DEST/assets"
    cp -R "$ROOT/examples/$NAME/assets/." "$DEST/assets/"
fi
echo "$DEST/index.html"
