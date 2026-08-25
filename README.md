# kof-ui-widgets

### Widgets de intenção para o kof.ui

**Você escreve o que quer na tela. A biblioteca decide o como — e os testes
provam o como antes de qualquer pixel existir.**

---

> O programador deve escrever a intenção.
> A linguagem, a biblioteca e as transições puras cuidam da complexidade.

```text
"agrupe isto num cartão"  → Card("Perfil")      → View + Style + Heading
"próxima página"          → nextPage(1, 10)     → transição pura testável
"mostre estes dados"      → DataTable(...)      → colunas dimensionadas
"o que é isso?"           → Tooltip("kof", ...) → janela oculta sob clique
```

Sem CSS, sem ids de DOM, sem builder, sem framework. Source Kof puro
compondo os primitivos do [`kof.ui`](https://github.com/KofLang/Kof4j/blob/main/learn/35-kof-ui.md).

---

# O que é

Onze módulos, ~50 intenções cobrindo o ciclo completo de uma UI de app:

| Família | Destaques |
|---------|-----------|
| [core](docs/learn/02-core.md) | `App`, cores semânticas, `repeat/pad/ellipsis/clamp/wrap/str` |
| [tipografia + layout](docs/learn/03-typography-layout.md) | `Heading..Quote`, `Section/Panel/Card`, `VSpace/HSpace/Divider` |
| marcadores | `Badge`, `Tag`, `Chip` |
| [formulários](docs/learn/04-forms.md) | `TextField`, validação pura (`isEmail`, `validationSummary`) |
| [escolhas](docs/learn/05-choices.md) | `Checkbox`, `ToggleSwitch`, `RadioGroup`, `Rating` — estado por instância |
| [navegação](docs/learn/06-navigation.md) | `Tabs`, `Accordion`, `Pagination`, `Navbar`, `Breadcrumbs`, `SearchBox` |
| [overlays](docs/learn/07-overlays.md) | `Dialog`, `Confirm`, `Drawer`, `Tooltip`, `Toast`, `Alert` |
| [dados](docs/learn/08-data.md) | `DataTable`, `TreeView`, `ListView`, `Timeline`, `StatCard`, `Avatar`, `Empty` |
| [data/hora](docs/learn/09-datetime.md) | `Calendar`, `DatePicker`, `TimePicker` (Sakamoto puro, ancorado em datas históricas) |
| [gráficos](docs/learn/10-charts.md) | `Sparkline`, `BarsChart`, `Donut`, `Gauge`, `HBar`, `progressBar` |
| [arquivos](docs/learn/11-io.md) | `FilePicker` com preview via kof.io |

Os primitivos (`Window`, `Label`, `Button`, `Input`, `Column`, `Row`,
`View`, `Style`) continuam todos disponíveis — a biblioteca não esconde o
core; sobe o nível quando o core já não expressa a intenção direto.

Referência única de assinaturas: [`docs/reference/api.md`](docs/reference/api.md).

---

# Quick start

```kof
// tarefas.kf
class Estado {
    static Int total = 0
    static Int feitas = 0
}

main() {
    var w = App("Tarefas")

    var resumo = Text(progressBar(0, 0))
    var lista = Column(listOf<String>())
    var campo = Input("o que precisa ser feito?")
    Int resumoH = resumo
    Int campoH = campo

    var addBtn = Button("+ adicionar", () -> {
        if (!isBlank(campo.text())) {
            Estado.total = Estado.total + 1
            lista.bind(Text("[ ] " + campo.text()))
            resumo.setText(progressBar(Estado.feitas, Estado.total))
        }
    })
    Int addH = addBtn

    w.bind(Column(listOf(
        Heading("Tarefas"),
        resumoH,
        Row(listOf(campoH, addH)),
        Divider(),
        lista
    )))
    w.show()
}
```

```bash
kof run "$(scripts/build.sh tarefas.kf)" --target=js
```

Exemplos completos prontos:

```bash
scripts/run-example.sh hello       # o menor app
scripts/run-example.sh perfil      # formulário + choices + overlays
scripts/run-example.sh tarefas     # estado interativo
scripts/run-example.sh dashboard   # stat cards + charts + tabela + navbar
```

---

# Como cada componente é construído

Anatomia única, herdada do padrão do contador do `kof.ui`
([docs/learn/01-patterns.md](docs/learn/01-patterns.md)):

1. **estado local boxado** — captura por referência: cada instância tem o seu
2. **record de partes** expondo handles (`CheckboxParts.root()`)
3. **construtor** monta tudo no próprio escopo (irmão criado antes da ação)
4. **lambda é cola**; **a lógica mora em função pura**
5. **transições puras são testadas por valor exato**

É por isso que a suíte afirma `monthGrid(2026,8)` caractere a caractere,
`nextPage(10,10) == 10` e `sparkline([1,2,3]) == "▁▄█"` — sem abrir janela.

---

# Instalação

Source: concatene com seu programa.

```bash
OUT=$(scripts/build.sh meu-app.kf)
kof run "$OUT" --target=js
```

Detalhes e estrutura: [`docs/install.md`](docs/install.md).
Requisito: distribuição Kof com `Link/Image/Icon/Font` e captura box
(agosto/2026+; recomendada a mais recente).

---

# Documentação

| Arquivo | Para quê |
|---------|----------|
| [`docs/learn/`](docs/learn/00-intro.md) | capítulos numerados por família: como e quando usar |
| [`docs/reference/api.md`](docs/reference/api.md) | todas as assinaturas e contratos |
| [`docs/gaps.md`](docs/gaps.md) | limites honestos da plataforma (UIW001..UIW040) |
| [`docs/targets.md`](docs/targets.md) | JVM / Native / KofJS |
| [`docs/philosophy.md`](docs/philosophy.md) | as regras da casa |
| [`docs/install.md`](docs/install.md) | inclusão no seu app |

**Regra prática**: `learn/` ensina *como usar*; `reference/` diz *o que
existe*; `gaps.md` diz *o que ainda não dá*; `philosophy.md` diz *por quê*.

---

# Testes

```bash
scripts/test.sh     # todas as suítes: PASS por nome (alvo JVM)
scripts/check.sh    # type-check da lib + exemplos
```

Puras por valor exato; construção por fumaça (montar árvores inteiras não
pode depender de pixels).

---

# Princípios

1. Cada widget é uma intenção com nome
2. Zero mecanismo novo — só os oito primitivos do kof.ui
3. Lógica pura primeiro, pixel depois — e a pura entra na suíte
4. Convenção > configuração: um tema, zero builders
5. Limites honestos: gaps documentados com código, nunca fake idioms
6. Human first, LLM friendly by consequence

Herdados de [`docs/philosophy.md`](docs/philosophy.md).

---

# Licença

**BSD 3-Clause** — redistribuição de source e binários permitida com
atribuição ([LICENSE](LICENSE)). Programas que usam a biblioteca não
herdam obrigações além da nota de copyright ao redistribuírem o source.

---

**kof-ui-widgets**

*Menos cerimônia. Mais intenção. Mesmos pixels.*
