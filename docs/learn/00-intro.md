# 00 — Comece aqui

`kof-ui-widgets` é uma biblioteca de widgets para o `kof.ui` construída
sobre uma regra: **cada widget é uma intenção com nome**.

```text
"agrupe isto num cartão"  → Card("Perfil")   → View + Style + Heading
"página 2 de 10"          → nextPage(1,10)   → transição pura testável
"mostre estes dados"      → DataTable(...)   → texto alinhado por larguras
```

## O que existe

| Família | Capítulo | Destaques |
|---------|----------|-----------|
| Fundação | [02-core](02-core.md) | `App`, cores semânticas, `repeat/pad/ellipsis/clamp/wrap` |
| Texto e layout | [03-typography-layout](03-typography-layout.md) | `Heading..Quote`, `Section/Panel/Card`, `Badge/Tag/Chip` |
| Formulários | [04-forms](04-forms.md) | `TextField`, validação pura (`isEmail`, `validationSummary`) |
| Escolhas | [05-choices](05-choices.md) | `Checkbox`, `ToggleSwitch`, `RadioGroup`, `Rating` |
| Navegação | [06-navigation](06-navigation.md) | `Tabs`, `Accordion`, `Pagination`, `Navbar`, `SearchBox`, `Breadcrumbs` |
| Overlays | [07-overlays](07-overlays.md) | `Dialog`, `Confirm`, `Drawer`, `Tooltip`, `Toast`, `Alert` |
| Dados | [08-data](08-data.md) | `DataTable`, `TreeView`, `ListView`, `Timeline`, `StatCard`, `Avatar`, `Empty` |
| Data e hora | [09-datetime](09-datetime.md) | `Calendar`, `DatePicker`, `TimePicker` |
| Gráficos | [10-charts](10-charts.md) | `Sparkline`, `BarsChart`, `Donut`, `Gauge`, `HBar`, `progressBar` |
| Arquivos | [11-io](11-io.md) | `FilePicker` com preview via kof.io |

Referência de assinaturas: [`reference/api.md`](../reference/api.md).
Limites honestos da plataforma: [`gaps.md`](../gaps.md).

## Como usar

A biblioteca é source Kof puro. Ela entra no seu programa por
concatenação (um programa Kof é um arquivo):

```bash
scripts/build.sh meu-app.kf          # -> .build/meu-app.kf (lib + app)
kof run "$(scripts/build.sh meu-app.kf)" --target=js
```

## Ordem recomendada

```
00 → 01 (padrões) → 02..06 (o dia a dia)
→ 07 (overlays) → 08..11 (dados, datas, gráficos, arquivos)
```

## Para LLMs

Assinaturas completas e contratos estão em `reference/api.md`; os gaps da
plataforma em `gaps.md`. Nenhum widget aqui é fake idiom — o que depende
de mecanismo inexistente está no gaps, não fingido na API.
