# 07 — Overlays: dialogs, confirm, drawer, tooltip, toast, alert

`src/06-overlays.kf`

Janelas são baratas no kof.ui (uma por handle) e `bind` aceita qualquer
subárvore pronta. Um overlay é uma segunda Window mostrando conteúdo que
já existe na sua árvore — ou texto direto.

## Dialog

```kof
Dialog(String title, Int content): Int   // recebe subárvore PRONTA, mostra e devolve a Window
MessageDialog(String title, String message): Int
```

`Dialog` é o componente mais poderoso da biblioteca: o parâmetro `Int` é
um handle de qualquer coisa que você já montou — tabela, formulário,
gráfico. Mostra com ok que fecha.

```kof
Int preview = DataTable("nome;qtd", listOf("widgets;12"))
// num clique:
Int janela = Dialog("preview", preview)
```

## Confirm

```kof
Confirm(String question...): ConfirmParts   // .root() é a Window
confirmAnswered(): Bool                      // estado após fechar
```

confirmar/cancelar gravam a resposta e fecham. Para decisões que mudam o
app, leia `confirmAnswered()` na ação seguinte ou trate dentro das próprias
ações (o padrão dos exemplos).

## Drawer

```kof
Drawer(String title, Int content): DrawerParts   // janela lateral estreita 280x640
```

Menu lateral como janela própria. Sem posicionamento absoluto na
plataforma — "drawer" aqui é uma coluna estreita dedicada, honesta.

## Tooltip

```kof
Tooltip(String term, String explanation): TooltipParts  // gatilho no fluxo
```

A explicação nasce numa janela OCULTA durante a construção; clicar no
gatilho (`term ?`) mostra. Hover não existe na plataforma (gap) — clique é
a alternativa acessível.

## Toast

```kof
Toast(String message): Window               // ✕ manual
ToastAutoDismiss(String message, Int ms): Window   // some sozinho após ms
```

Pílula colorida em mini-janela. `Toast` fecha no ✕; `ToastAutoDismiss` usa
o timer da plataforma (UIW008 fechado 15/09) e fecha a janela em `ms`. A
auto-cancelação lê um **handle-sombra**, não a var do próprio
`time.interval` — o idiom canônico `time.cancel(id)` dentro do job ainda
trava na plataforma (Kof4j §253), e a lib documenta a armadilha no fonte.
Em `ms <= 0` fecha na hora, sem timer.

## Alert / Banner inline

```kof
Alert(String kind, String message): Int   // kind: "ok", "info", "warn", "error"
alertGlyph(kind): String                  // ✓ i ! ✕  (pura)
alertColor(kind): Int                     // verde ciano amarelo erro (pura)
```

Diferente dos overlays, Alert NÃO abre janela: é um banner no fluxo da
página, colorido pela semântica do tema.

## Escolhendo

| Situação | Componente |
|----------|------------|
| mostrar dados montados em destaque | Dialog |
| decisão binária | Confirm |
| menu auxiliar permanente | Drawer |
| explicação de termo | Tooltip |
| aviso efêmero | Toast |
| estado persistente da página | Alert |
