# kof-ui-widgets

### Widgets de intenção para o kof.ui

**Você escreve o que quer na tela. A biblioteca decide o como.**

---

> O programador deve escrever a intenção.
> A linguagem — e a biblioteca — cuidam da complexidade.

`kof-ui-widgets` é uma biblioteca de widgets para o
[`kof.ui`](https://github.com/KofLang/Kof4j/blob/main/learn/35-kof-ui.md)
construída sobre uma regra só: **cada widget é uma intenção com nome**.

```text
"agrupe isto num cartão"  → Card("Perfil")   → View + Style + Heading
"texto secundário"        → Muted("dica")    → Label + gray + 13px
"abra o app"              → App("Tarefas")   → Window + size + Theme.dark()
```

Sem CSS, sem ids de DOM, sem builder, sem framework. Source Kof puro
compondo os primitivos que você já tem.

---

# O que é

Um único arquivo (`src/kof-ui-widgets.kf`) com oito intenções:

| Widget | Intenção | Devolve |
|--------|----------|---------|
| `App(title)` | "abra o app" — janela pronta, tema do Kof | handle de Window |
| `Heading(text)` | título de seção (26px bold) | handle de Label |
| `Text(text)` | texto corrente | handle de Label |
| `Muted(text)` | texto secundário (13px gray) | handle de Label |
| `Card(title)` | agrupar conteúdo num painel | handle de View |
| `Badge(text)` | marcador curto de status/tag | handle de View |
| `Field(caption, input)` | campo com legenda | handle de Column |
| `progressBar(value, max)` | barra de avanço (função pura) | String |

Os primitivos (`Window`, `Label`, `Button`, `Input`, `Column`, `Row`,
`View`, `Style`) continuam todos disponíveis — a biblioteca não esconde o
core; sobe o nível quando o core já não expressa a intenção direto.

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
    var campo = Input("o que precisa ser feito?")

    w.bind(Column(listOf(
        Heading("Tarefas"),
        resumo,
        Field("Adicionar", campo),
        Button("Adicionar", () -> {
            if (campo.text() != "") {
                Estado.total = Estado.total + 1
                resumo.text = progressBar(Estado.feitas, Estado.total)
            }
        })
    )))
    w.show()
}
```

```bash
cat src/kof-ui-widgets.kf tarefas.kf > app.kf
kof run app.kf --target=js     # webview nativo; fechar encerra o programa
```

Ou clone o repo e rode os exemplos prontos:

```bash
scripts/run-example.sh hello       # o menor app
scripts/run-example.sh perfil      # card + field + badges
scripts/run-example.sh tarefas     # estado interativo
```

---

# Instalação

É source: concatene (ou cole) `src/kof-ui-widgets.kf` junto do seu programa.
Detalhes em [docs/install.md](docs/install.md).

```bash
kof version                        # precisa ser ≥ 0.0.14-alpha (kof.ui)
```

---

# Documentação

| Arquivo | Para quê |
|---------|----------|
| [`docs/widgets.md`](docs/widgets.md) | referência de cada widget: assinatura, exemplo, o que gera |
| [`docs/patterns.md`](docs/patterns.md) | estado interativo: campos estáticos + captura de lambdas, anti-padrões |
| [`docs/targets.md`](docs/targets.md) | o que roda em JVM / Native / KofJS e como testar cada camada |
| [`docs/philosophy.md`](docs/philosophy.md) | as regras da biblioteca, herdadas da filosofia do Kof |
| [`docs/roadmap.md`](docs/roadmap.md) | gaps honestos (`UIW00x`) e próximos passos |
| [`docs/install.md`](docs/install.md) | inclusão no seu app e estrutura do repo |

**Regra prática**: `docs/widgets.md` diz *o que existe*;
`docs/patterns.md` ensina *como pensar*; `docs/philosophy.md` diz *por quê*.

---

# Testes

```bash
scripts/check.sh     # type-check da lib + exemplos + testes
scripts/test.sh      # suíte: test "nome" { assert(...) } no alvo JVM
```

A lógica pura é verificada por valor exato; a composição, por fumaça:
montar a árvore completa de widgets não pode depender de renderização para
passar — em JVM/Native os handles são no-ops.

---

# Princípios

1. Cada widget é uma intenção com nome
2. Zero mecanismo novo — só os oito primitivos do kof.ui
3. APIs pequenas: oito widgets na 0.1.0, cada um puxando seu peso
4. Convenção > configuração: um tema (o do Kof), zero config
5. Limites honestos: o que depende de gap da plataforma fica no roadmap
6. Human first, LLM friendly by consequence

Herdados de [`docs/philosophy.md`](docs/philosophy.md) do Kof — leia lá a
versão completa.

---

# Licença

GPLv3, igual ao Kof. Programas que usam esta biblioteca **não** viram
automaticamente GPLv3 — ver [`docs/LICENSING.md`](https://github.com/KofLang/Kof4j/blob/main/docs/LICENSING.md).

---

**kof-ui-widgets**

*Menos cerimônia. Mais intenção. Mesmos pixels.*
