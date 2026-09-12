# Filosofia da biblioteca

Esta biblioteca aplica a filosofia do Kof **um nível acima** do `kof.ui`.
Onde a linguagem diz "intenção → compilador → backend", aqui é "intenção →
widget → primitivos":

```text
"agrupe isto num cartão" → Card("Perfil") → View + Style + Heading
"página seguinte"        → nextPage(1,10) → transição pura testável
```

## As regras, herdadas de `docs/philosophy.md` do Kof

### 1. O programador escreve o quê; a biblioteca decide o como

Ninguém deveria saber que um cartão é `padding: 16; radius: 12`, que
tabela é texto alinhado por larguras calculadas, que dia-da-semana vem de
`kof.time`. Quem escreve o app escreve `Card("Perfil")`, `DataTable(...)`,
`dayOfWeek(...)`.

### 2. Simplicidade por padrão

Se o caso comum precisa de mais de 3 linhas de primitivos, vira widget.
Se vira widget, tem nome verbalizável ("isto é um marcador").

### 3. APIs pequenas — mas completas dentro do escopo

Cada família cobre o ciclo inteiro da sua intenção (Pagination inclui
transição, rótulo E clamp). "Seria útil às vezes" não entra: fica no
[roadmap](gaps.md).

### 4. Convenção > configuração

Um tema (escuro, o do Kof), zero builders. Estados iniciais documentados e
travados por teste.

### 5. Zero mecanismo novo

Source Kof puro compondo os mesmos primitivos. A biblioteca inteira
some amanhã? Seu app troca cada widget pelos primitivos equivalentes e
continua compilando.

### 6. Lógica pura antes de pixel

Toda decisão de componente é função testável (`nextPage`, `monthGrid`,
`ratioFill`, `split`). Os widgets são cola sobre funções cujos valores os
testes afirmam exatamente. É o espírito de `kof test` aplicado à UI:
PASS/FAIL por nome, sem abrir janela.

### 7. Limites honestos

O que depende de mecanismo inexistente está em [gaps.md](gaps.md) com
código (`UIW001..UIW051`) — documentado, nunca fingido. Quando a
plataforma fecha um gap, o mecanismo entra como widget e o código migra
para "fechados" — sem mudar a assinatura da casa.

## A linha entre intenção e mecanismo

Sintomas de violação (todos rejeitados na API):

- exigir `Color.rgba(...)` para "um alerta com cara de erro"
- pedir árvore pronta quando a intenção é conteúdo (`Dialog` aceita handle,
  mas `MessageDialog` aceita String)
- expor ids de DOM, CSS ou hex — não existem aqui
- estado global escondido sem contrato (`radioSelected() == -1` é
  documento, não acidente)

## Human first, LLM friendly by consequence

O mesmo vocabulário serve para humanos lerem e modelos gerarem:
`reference/api.md` é a fonte única de assinaturas; `gaps.md` é a fonte
única de "ainda não".
