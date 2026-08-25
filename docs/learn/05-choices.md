# 05 — Escolhas: checkbox, switch, radio e rating

`src/04-choices.kf`

Todos os componentes desta família seguem o esqueleto de
[01-patterns](01-patterns.md): **estado local por instância** (captura box)
+ transição pura + rebind de irmão capturado. Cada um expõe `.root()`
para bind; onde a lógica do app precisa ler a escolha, há espelho estático
documentado.

## Checkbox

```kof
Checkbox(String label): CheckboxParts   // .root()
flip(Bool): Bool                         // transição pura
```

O colchete `[ ]`/`[x]` é um label irmão que a ação rebinda — nunca o
próprio botão (self-capture não é suportado pela plataforma). O estado
`on` é box da própria instância: dois checkboxes independentes na mesma
tela funcionam.

```kof
Int termos = Checkbox("aceito os termos").root()
form.bind(termos)
// se o app precisa da decisão, trate dentro de uma ação sua
// (ou espelhe num estático seu — receita em 01-patterns)
```

## ToggleSwitch

```kof
ToggleSwitch(String label): SwitchParts  // .root()
```

Knob textual `○ off` / `● on`. Mesma mecânica do checkbox com cara de
switch.

## RadioGroup

```kof
RadioGroup(List<String> options): RadioParts  // .root(), até 4 opções
radioSelected(): Int                          // espelho: última seleção (-1 inicial)
```

Um botão por opção; clicar grava o índice no estado local (o rodapé mostra
`> opção`) E no espelho `RadioMirror.lastSelected`. O `-1` inicial é
contrato documentado (não é sentinela escondida).

Por que 4? As ações precisam capturar o índice de cada botão
estaticamente — sem loop com captura variável (gap da plataforma). Mais
opções: componha dois grupos ou use [Tabs](06-navigation.md).

## Rating

```kof
Rating(String subject): RatingParts      // .root()
toggleStars(current, target): Int        // pura: mesma nota zera
ratingFace(stars): String                // ☆☆☆..★★★ (pura)
```

Três botões ★/★★/★★★. Clicar na estrela já marcada volta a zero —
comportamento definido por `toggleStars`, testado isoladamente.

## Instâncias independentes

Desde a captura por referência, cada componente carrega o próprio estado:
duas checkboxes, dois switches e dois grupos de rádio na mesma tela não
interferem entre si. Os testes constroem múltiplas instâncias para travar
isso (`tests/04-choices.kf`).
