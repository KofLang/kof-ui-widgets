#!/usr/bin/env bash
#
# check.sh — type-check da biblioteca + exemplos (alvo JVM, sem rodar).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KOF="${KOF:-kof}"

mkdir -p "$ROOT/.build"

ok=1
for f in "$ROOT"/examples/*.kf "$ROOT"/examples/*/main.kf; do
    [[ -f "$f" ]] || continue
    name="$(basename "$f" .kf)"
    out=$("$ROOT/scripts/build.sh" "$f")
    echo "== exemplo: $name"
    if ! "$KOF" check "$out"; then
        ok=0
    fi
done

[ "$ok" = 1 ] || exit 1
