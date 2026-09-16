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
java_major() { "$1" -version 2>&1 | sed -nE 's/^openjdk version "([0-9]+).*/\1/p' | head -1; }
CLASS_MAJOR=$(od -An -j6 -N2 -tu1 "$CLASSES/dev/kof/cli/Main.class" | awk '{print $1*256+$2}')
RUNTIME_NEED=$((CLASS_MAJOR - 44))
JAVA_BIN="${JAVA_HOME:+$JAVA_HOME/bin/java}"
[ -x "$JAVA_BIN" ] || JAVA_BIN=$(command -v java || true)
[ -n "$JAVA_BIN" ] || JAVA_BIN=java
if [ "$(java_major "$JAVA_BIN" 2>/dev/null || echo 0)" -lt "$RUNTIME_NEED" ]; then
    for cand in /home/*/tools/jdk-*/bin/java /usr/lib/jvm/*/bin/java; do
        [ -x "$cand" ] || continue
        if [ "$(java_major "$cand")" -ge "$RUNTIME_NEED" ]; then JAVA_BIN="$cand"; break; fi
    done
fi
exec "$JAVA_BIN" --enable-native-access=ALL-UNNAMED -Dkof.install.dir="$KOF_SOURCE" \
    -cp "$CLASSES:$KOF_SOURCE/kof-compiler/src/main/resources:$JAR" dev.kof.cli.Main "$@"
