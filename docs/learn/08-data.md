# 08 — Dados: tabela, árvore, lista, timeline, stat card, avatar

`src/07-data.kf`

## DataTable

```kof
DataTable(String headersCsv, List<String> rows): Int
tableText(headersCsv, rows): String        // pura
split(s, sep): List<String>                // pura — a plataforma não tem split
```

Cabeçalho em CSV (`"nome;idade"`); cada linha também
(`"mel;26"`). Larguras de coluna são calculadas pela maior célula (+2) e o
texto sai alinhado com `padEnd`, separado por régua `─`.

```text
nome  idade  
─────────────
mel   26     
```

Célula ausente numa linha não estoura: vira comprimento 0.

## TreeView

```kof
TreeView(List<String> paths): Int
treeText(paths): String                    // pura
```

Recebe caminhos planos e deriva a hierarquia pela contagem de `/`:

```text
• kof
  • compiler
    • lexer
```

## ListView e Timeline

```kof
ListView(List<String> items, Bool numbered): Int   // • item  ou  1. item
Timeline(List<String> events): Int                 // ○ ev \n│\n○ ev
listText / timelineText                            // puras
```

Ambas caem no texto do `Empty()` ("nada por aqui ainda") com lista vazia —
estado vazio é parte do contrato, não acaso.

## StatCard

```kof
StatCard(label, value, trend): StatCardParts    // .root()
```

Número grande (30px bold) + legenda muted + tendência colorida pelo sinal:
`+` verde, `-` erro, neutro cinza. O bloco básico de todo dashboard.

## Avatar

```kof
Avatar(name): AvatarParts        // .root()
avatarInitials(name): String     // pura: iniciais das duas primeiras palavras
avatarColor(name): Int           // pura: cor estável por comprimento do nome
```

Círculo (raio 999) com as iniciais em **caixa alta** — via
`String.toUpperCase()` da plataforma (UIW040 fechado).

## Empty

```kof
Empty(): Int                     // "nada por aqui ainda"
EmptyState.EMPTY_TEXT            // constante pública do texto
```

Use sempre que uma lista puder nascer vazia: estado vazio explícito vale
mais que tela branca.
