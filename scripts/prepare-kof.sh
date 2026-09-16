#!/usr/bin/env bash
# Compila o snapshot local usando as dependências do kof.jar existente.
# O --release vem do pom do fonte (KOF_RELEASE sobrescreve); o javac é o
# JAVA_HOME/bin ou um JDK com major >= release encontrado nos caminhos comuns.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KOF_SOURCE="${1:-${KOF_SOURCE:-/home/luna/kof/Kof4j}}"
[[ -f "$KOF_SOURCE/lib/kof.jar" ]] || { echo 'Falta lib/kof.jar no fonte informado.' >&2; exit 1; }
RELEASE="${KOF_RELEASE:-$(sed -n 's|.*<maven.compiler.release>\([0-9]*\).*|\1|p' "$KOF_SOURCE/pom.xml" 2>/dev/null | head -1)}"
RELEASE="${RELEASE:-21}"

javac_major() { "$1" -version 2>&1 | sed -nE 's/^javac ([0-9]+).*/\1/p' | head -1; }

pick_javac() {
    local cand major
    for cand in "${JAVA_HOME:+$JAVA_HOME/bin/}javac" \
                /home/*/tools/jdk-*/bin/javac /usr/lib/jvm/*/bin/javac; do
        command -v "$cand" >/dev/null 2>&1 || continue
        major=$(javac_major "$cand") || continue
        [ -n "$major" ] || continue
        if [ "$major" -ge "$RELEASE" ]; then echo "$cand"; return 0; fi
    done
    return 1
}

JAVAC=$(pick_javac) || { echo "nenhum javac com --release >= $RELEASE encontrado" >&2; exit 1; }

OUT="$ROOT/.build/toolchain"
mkdir -p "$OUT/classes"
find "$KOF_SOURCE/kof-compiler/src/main/java" "$KOF_SOURCE/kof-cli/src/main/java" \
    "$KOF_SOURCE/kof-script/src/main/java" "$KOF_SOURCE/kof-c-compiler/src/main/java" \
    "$KOF_SOURCE/kof-runtime/src/main/java" -name '*.java' -print | LC_ALL=C sort > "$OUT/sources.txt"
"$JAVAC" --release "$RELEASE" -encoding UTF-8 -cp "$KOF_SOURCE/lib/kof.jar" \
    -d "$OUT/classes" @"$OUT/sources.txt"
echo "Compilado com $JAVAC (release $RELEASE) em $OUT/classes; use KOF_SOURCE=$KOF_SOURCE KOF=$ROOT/scripts/kof-source.sh"
