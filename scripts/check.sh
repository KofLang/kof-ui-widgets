#!/usr/bin/env bash
#
# check.sh — type-check da biblioteca + exemplos (alvo JVM, sem rodar).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KOF="${KOF:-kof}"

mkdir -p "$ROOT/.build"
LIB=$(ls "$ROOT"/src/*.kf | sort)

ok=1
for f in "$ROOT"/examples/*.kf; do
    name="$(basename "$f" .kf)"
    out="$ROOT/.build/check-$name.kf"
    cat $LIB "$f" > "$out"
    echo "== exemplo: $name"
    if ! "$KOF" check "$out"; then
        ok=0
    fi
done

[ "$ok" = 1 ] || exit 1
