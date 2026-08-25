# Alvos — o que roda onde

A biblioteca segue o contrato do `kof.ui`: **a intenção compila em todos
os alvos; quem não consegue executá-la diz isso na hora.**

| Alvo | Comportamento | Como rodar |
|------|---------------|------------|
| **JS** (KofJS) | renderiza de verdade: webview nativo (`bin/kof-webview`, WebKitGTK embutido) ou browser; DOM real, cliques, edição de input | `kof run app.kf --target=js` |
| **JVM** | handles no-ops — compila e executa, nada desenha | `--target=jvm` |
| **Native** | handles no-ops — idem JVM | `--target=native` |

Exceção parcial: `FilePicker` depende de kof.io — leitura em JVM/Native;
no JS o gap da plataforma aparece no preview ([gaps.md](gaps.md), UIW031).

Consequências práticas:

1. **Lógica em JVM, tela em JS.** Funções puras são idênticas nos três
   alvos — `scripts/test.sh` roda tudo em JVM, rápido. Pixels só quando
   você quiser ver.
2. **Fechar TODAS as janelas encerra o programa** no alvo JS. Overlays
   abrem janelas próprias: fechá-las não encerra o app enquanto a principal
   ficar.
3. **Sem webview nativo**, o runner cai no browser do sistema.

## Testes por alvo

```bash
scripts/test.sh                                  # todas as suítes (JVM)
kof test .build/test-09-charts.kf --target js    # qualquer suíte no KofJS
```

Cada família tem suíte própria em `tests/`; os testes de construção montam
árvores completas — passam em JVM/Native porque construir e vincular são
no-ops fora do JS.
