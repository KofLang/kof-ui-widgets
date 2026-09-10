#!/usr/bin/env bash
# Compila o snapshot local usando as dependências do kof.jar existente.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KOF_SOURCE="${1:-${KOF_SOURCE:-/home/luna/kof/Kof4j}}"
[[ -f "$KOF_SOURCE/lib/kof.jar" ]] || { echo 'Falta lib/kof.jar no fonte informado.' >&2; exit 1; }
OUT="$ROOT/.build/toolchain"
mkdir -p "$OUT/classes"
find "$KOF_SOURCE/kof-compiler/src/main/java" "$KOF_SOURCE/kof-cli/src/main/java" \
    "$KOF_SOURCE/kof-script/src/main/java" "$KOF_SOURCE/kof-c-compiler/src/main/java" \
    "$KOF_SOURCE/kof-runtime/src/main/java" -name '*.java' -print | LC_ALL=C sort > "$OUT/sources.txt"
javac --release 21 -encoding UTF-8 -cp "$KOF_SOURCE/lib/kof.jar" \
    -d "$OUT/classes" @"$OUT/sources.txt"
echo "Compilado em $OUT/classes; use KOF_SOURCE=$KOF_SOURCE KOF=$ROOT/scripts/kof-source.sh"
