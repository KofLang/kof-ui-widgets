# 01 — Padrões: estado interativo sem framework

UI interativa tem um problema clássico: quem responde ao clique precisa ver
o mundo que mudou. No Kof a resposta é uma convenção só — e desde o update
do `kof.time`, a captura ficou mais forte.

## As regras de captura (atuais)

1. **Variáveis externas apenas LIDAS dentro da lambda** continuam sendo
   fotos somente-leitura — handles de widget criados antes da ação caem
   aqui: `mark.setText(...)`, `lista.bind(...)`, `input.text()` funcionam
   porque o handle é estável.
2. **Variáveis externas ESCRITAS dentro da lambda viram box mutável**
   (captura por referência): a ação escreve, o escopo de fora lê o valor
   atualizado — é o mecanismo que faz `time.interval` contar ticks no E2E
   do compilador.
3. **Estado que precisa ser lido por OUTRA função** continua em campo
   estático de classe, como espelho documentado.

## O esqueleto de todo componente interativo

```kof
record XParts(Int root)

X(String label): XParts {
    var on = false                 // BOXADO: escrito dentro da ação...
    var mark = Label(marca())      // irmão criado ANTES (captura estável)
    var btn = Button(label, () -> {
        on = flip(on)              // ...e por isso cada instância tem o seu
        mark.setText(marca(on))
    })
    ...
}

flip(Bool v): Bool { ... }         // a lógica mora em função pura testável
```

Consequência direta: **cada Checkbox/Tabs/Accordion/Rating tem estado
próprio** — dois checkboxes na mesma tela não brigam mais pelo mesmo Bool.

## Espelhos estáticos (onde o app precisa ler)

Quando a lógica do app depende da escolha, a ação escreve também num
estático nomeado, e a biblioteca documenta o contrato:

| Espelho | Contrato |
|---------|----------|
| `RadioMirror.lastSelected` | índice da última opção marcada (-1 = nenhuma) |
| `PageState.page` | página atual do Pagination |
| `NavState.route` | rota ativa do Navbar |
| `SearchState.query / .matches` | última busca executada |
| `TextFieldState.value` | valor sincronizado pelo ↻ |

O espelho reflete **a última instância interagida** — o visual nunca
depende dele.

## Vincular ação depois de criar (UIW001, 16/09)

Isto era impossível; **deixou de ser**. Um handle criado vive e aceita `.on`
depois — o botão pode trocar o próprio texto ao clicar, sem irmão
rebindável:

```kof
var btn = Button("desligado", () -> {})
btn.on("click", (e: Event) -> btn.setText("LIGADO"))   // self-capture no handler
```

`ReconfigButton(labelOn, labelOff, id)` é o widget pronto desse padrão. A
transição é puramente a antiga: um `Component` com `state`/`view` continua
sendo a via para estado que outro código lê.

Ressalva honesta (Kof4j §253 face A/B): a variante em que o handler lê a
**var em declaração** — `var btn = Button(…, () -> btn.setText(…))`, o handler
como 3º argumento do construtor — roda em jvm/js mas ainda **falha em native**
(SEM092) até a face B fechar na lane nat. A forma acima (criar, depois
`.on`) roda nos 3 alvos. Ver [`gaps.md`](../gaps.md), UIW001.

## Anti-padrões

- **Estado duplicado**: contador num box E no texto do label sem fonte da
  verdade. O texto deriva da transição pura.
- **Sentinelas não documentadas**: `-1` só existe onde é contrato
  (`RadioMirror.lastSelected`).
- **Mecanismo na tela**: ids de DOM/CSS/hex dentro do handler de clique.
