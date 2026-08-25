#!/usr/bin/env bash
#
# test.sh — roda TODAS as suítes com kof test (alvo JVM: rápido, sem
# renderização; as funções puras são idênticas nos três alvos).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KOF="${KOF:-kof}"

mkdir -p "$ROOT/.build"
LIB=$(ls "$ROOT"/src/*.kf | sort)

fail=0
for f in "$ROOT"/tests/*.kf; do
    name="$(basename "$f" .kf)"
    out="$ROOT/.build/test-$name.kf"
    cat $LIB "$f" > "$out"
    echo "== suíte: $name"
    if ! "$KOF" test "$out" --target jvm; then
        fail=1
    fi
done

exit $fail
