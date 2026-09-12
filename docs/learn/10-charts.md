# 10 — Gráficos em texto

`src/09-charts.kf`

Toda a família é função pura: entra `List<Int>`/Int, sai `String`. Os
testes afirmam cada barra — os widgets são só embalagem.

| Widget | Assinatura | Exemplo |
|--------|-----------|---------|
| `Sparkline(values)` | widget | tendência `▁▄█` |
| `sparkline(values)` | `(List<Int>): String` | régua de 8 níveis ▁▂▃▄▅▆▇█ |
| `HBar(value, max, width)` | `: String` | `███░░░░░░░` |
| `progressBar(value, max)` | `: String` | 20 colunas + `" 5/10"` |
| `BarsChart(labels, values, height)` | widget | colunas verticais █ |
| `Donut(percent)` | widget | `◑ 50%` em quadros ○◔◑◕● |
| `donutText(percent)` | `: String` | puro |
| `Gauge(value, max)` | widget | `[█████░░░░░] 50%` |
| `ratioFill(v, max, w)` / `ratioPercent(v, max)` | puras | clamp garantido |

Contratos que a suíte trava:

- `max <= 0` não divide por zero (`ratioFill(3,0,10) == 0`)
- valores acima do máximo saturam (`ratioFill(15,10,20) == 20`)
- série plana rende o nível médio (`sparkline([5,5,5]) == "▅▅▅"`)
- donut clampado (`donutText(-5) == "○ 0%"`)

## Receita: gráfico vivo

```kof
var barra = Text(progressBar(0, tarefas.size))
// numa ação:
barra.setText(progressBar(Estado.feitas, Estado.total))
```

O label é rebindado; a função é a mesma dos testes.

## Limites honestos

Gráficos são monoespaçados por natureza — em fontes proporcionais as
colunas de `BarsChart` entortam. Para pixel real, a família `13-canvas`
desenha no `Canvas` 2D da plataforma (`CanvasBars`/`CanvasLine`/
`CanvasRing`), com as mesmas contas puras no teste. A API textual continua
o contrato padrão — leve, copiável, idêntica nos três alvos.
