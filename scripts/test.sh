#!/usr/bin/env bash
#
# test.sh — roda TODAS as suítes com kof test (alvo JVM: rápido, sem
# renderização; as funções puras são idênticas nos três alvos).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KOF="${KOF:-kof}"
TARGET="${TARGET:-js}"

mkdir -p "$ROOT/.build"

fail=0
for f in "$ROOT"/tests/*.kf; do
    name="$(basename "$f" .kf)"
    mkdir -p "$ROOT/.build/tests/$name"
    out="$ROOT/.build/tests/$name/main.kf"
    cat "$ROOT"/src/*.kf "$f" > "$out"
    echo "== suíte: $name"
    if ! "$KOF" test "$out" --target "$TARGET"; then
        fail=1
    fi
done

exit $fail
