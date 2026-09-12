# 03 — Tipografia e layout

`src/01-typography.kf`, `src/02-layout.kf`

## Tipografia

| Widget | Intenção | Estilo |
|--------|----------|--------|
| `Heading(text)` | título de seção | 26px bold |
| `Subheading(text)` | subtítulo/título de bloco | 18px bold |
| `Text(text)` | texto corrente | padrão |
| `Muted(text)` | dica, legenda, contador | 13px cinza |
| `Code(text)` | trecho de código/comando | ciano |
| `Quote(text)` | citação com barra lateral | View com barra primária |
| `Link(label)` | referência clicável-visual | azul |

O código lê como prosa quando os níveis se alternam:

```kof
Column(listOf(
    Heading("Configurações"),
    Subheading("Perfil"),
    Text("como você aparece para outras pessoas"),
    Muted("máximo 40 caracteres")
))
```

## Layout

| Widget | Intenção | Notas |
|--------|----------|-------|
| `Section(title)` | bloco titulado | superfície + título; vincule conteúdo depois com `.bind` |
| `Panel(content)` | moldura pronta | recebe subárvore `Int`; padding 16, raio 12 |
| `Card(title)` | cartão com título | vincule o corpo depois com `.bind` |
| `Hero(title, subtitle)` | abertura de tela | gradiente primary→secondary (`setGradient`) |
| `Content(maxWidth, child)` | largura de leitura | para de esticar em telas largas (`setMaxWidth`) |
| `Fill(child)` | ocupa o resto | flexível na linha/coluna (`setFlexBasis`) |
| `VSpace(px)` / `HSpace(px)` | respiro | label vazio dimensionado; clampado em [4,120] |
| `Divider()` | separador | barra fina da cor primária |

Superfícies têm **elevação real** (issue #78): `Section`/`Panel` assentam
(nível 1), `Card` flutua (nível 2), via `setShadow`. A escala é pura e
testável (`shadowOffset/shadowBlur/shadowAlpha`); `Elevate(view, level)`
aplica. A plataforma também traz os containers de layout
(`Box/Stack/Spacer/Wrap/Grid/Center/Align`) — use-os direto quando a
intenção for estrutural.

## Marcadores

| Widget | Intenção |
|--------|----------|
| `Badge(text)` | pílula neutra (status, versão) |
| `Tag(text, color)` | pílula colorida por quem chama (`Palette.*`) |
| `Chip(text)` | pílula removível ("texto ✕") |

```kof
Row(listOf(Badge("alpha"), Tag("novo", Palette.green), Chip("kof")))
```

## Composição livre

Todos devolvem handles que aceitam mais binds (`Section`/`Card`) ou entram
em qualquer `Column`/`Row` — inclusive os seus próprios containers:

```kof
Int card = Card("Notas")
card.bind(Muted("rascunho"))
card.bind(Text("a biblioteca é source puro"))
w.bind(card)
```
