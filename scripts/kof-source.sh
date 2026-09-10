#!/usr/bin/env bash
# Usa o fonte local de Kof sem alterar a distribuição instalada.
# KOF_SOURCE=/caminho/Kof4j scripts/kof-source.sh check app.kf
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KOF_SOURCE="${KOF_SOURCE:-/home/luna/kof/Kof4j}"
CLASSES="$ROOT/.build/toolchain/classes"
JAR="$KOF_SOURCE/lib/kof.jar"
if [[ ! -f "$CLASSES/dev/kof/cli/Main.class" || ! -f "$JAR" ]]; then
    echo 'Execute scripts/prepare-kof.sh /caminho/Kof4j antes de usar kof-source.sh.' >&2
    exit 1
fi
exec java --enable-native-access=ALL-UNNAMED -Dkof.install.dir="$KOF_SOURCE" \
    -cp "$CLASSES:$KOF_SOURCE/kof-compiler/src/main/resources:$JAR" dev.kof.cli.Main "$@"
