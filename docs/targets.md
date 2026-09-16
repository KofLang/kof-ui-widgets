# Alvos — o que roda onde

A biblioteca segue o contrato do `kof.ui`: **a intenção compila em todos
os alvos; quem não consegue executá-la diz isso na hora.**

| Alvo | Comportamento | Como rodar |
|------|---------------|------------|
| **JS** (KofJS) | renderiza de verdade: webview nativo (`bin/kof-webview`, WebKitGTK embutido) ou browser; DOM real, cliques, edição de input | `kof run app.kf --target=js` |
| **JVM** | handles no-ops — compila e executa, nada desenha | `--target=jvm` |
| **Native** | handles no-ops — idem JVM | `--target=native` |

`FilePicker` depende de kof.io — que roda nos 3 alvos (o JS delega ao host
GraalJS, byte-parity; UIW031 fechado 16/09). **Recorte honesto:** a delegação
exige o runner com host (`kof run --target=js`); no browser puro
(desenvolvimento web sem host GraalJS) `kof.io` lança erro claro — "not
available in the browser" — nunca leitura silenciosa. FilePicker no browser
precisaria de `input[type=file]` no runtime; continua aberto como gap de
plataforma (Kof4j, sem código — a UI do widget já funciona).

Consequências práticas:

1. **Lógica em JS, tela no browser.** Funções puras são idênticas nos três
   alvos — `scripts/test.sh` roda a suíte no alvo JS (rápido) e passa também
   em `TARGET=jvm|native` (as regressões UIW050/UIW051 fecharam, ver
   [gaps.md](gaps.md)). A construção de DOM é provada no Chrome
   (`scripts/browser-tests.mjs`); pixels só quando você quiser ver.
2. **Fechar TODAS as janelas encerra o programa** no alvo JS. Overlays
   abrem janelas próprias: fechá-las não encerra o app enquanto a principal
   ficar.
3. **Sem webview nativo**, o runner cai no browser do sistema.

## Testes por alvo

```bash
scripts/test.sh                                  # todas as suítes (alvo JS)
TARGET=native scripts/test.sh                    # handles no-op (sem DOM)
kof test .build/test-09-charts.kf --target js    # qualquer suíte no KofJS
```

Cada família tem suíte própria em `tests/`. Os testes de construção montam
árvores completas; no JVM/Native os handles são no-op, no JS headless o
stub cobre os primitivos de DOM usados pela biblioteca (fonte, `setName`,
texto no Canvas) — a prova de pixels é no browser.
