# 02 — Fundação: App, cores e helpers puros

`src/00-core.kf`

## App

```kof
App(String title): Int
```

"abra o app". Janela pronta: tema escuro do Kof, 960x640. O handle
devolvido é uma Window — continue com `w.bind`, `w.show`, `w.close`.

## Cores semânticas

`SurfaceColor()`, `ErrorColor()`, `PrimaryColor()`, `TextColor()` — todas
`: Int`. Atalhos para as cores do tema escuro sem instanciar Theme na
mão. Use ao compor Views customizadas:

```kof
var box = View(Style(SurfaceColor(), TextColor(), 12, 8))
```

## Helpers puros de texto

| Função | Contrato |
|--------|----------|
| `repeat(piece, n)` | `piece` n vezes; n=0 é vazio |
| `padEnd(s, width)` | completa à direita; não trunca |
| `padStart(s, width)` | completa à esquerda (números alinhados) |
| `ellipsis(s, width)` | trunca com `…`; no limite não corta |
| `substringN(s, a, b)` | substring com clamp nos dois lados |
| `countChar(s, ch)` | ocorrências de um caractere |
| `join(parts, sep)` | junta `List<String>` |

## Helpers puros numéricos

| Função | Contrato |
|--------|----------|
| `clamp(v, min, max)` | satura nos limites |
| `wrapNext(i, n)` | avança voltando ao início; n=0 devolve 0 |
| `wrapPrev(i, n)` | recua indo para o fim; n=0 devolve 0 |
| `str(v)` | Int → String via concatenação |

Tudo função pura: os testes afirmam valores exatos (`tests/00-core.kf`),
em qualquer alvo.

## Quando descer para o core

Se nenhum widget expressa sua intenção, componha os primitivos direto
usando estes helpers — é para isso que eles existem. Exemplo: uma caixa
com borda colorida própria:

```kof
var box = View(Style(SurfaceColor(), PrimaryColor(), 16, 12))
box.bind(Column(listOf(Heading("meu jeito"))))
w.bind(box)
```
