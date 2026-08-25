# 05 — Escolhas: checkbox, switch, radio e rating

`src/04-choices.kf`

Todos os componentes desta família seguem o esqueleto de
[01-patterns](01-patterns.md): estado estático + transição pura + rebind de
irmão capturado. Cada um expõe um getter do estado e um `.root()` para bind.

## Checkbox

```kof
Checkbox(String label): CheckboxParts   // .root()
isChecked(): Bool                        // estado global do tipo
flip(Bool): Bool                         // transição pura
```

O colchete `[ ]`/`[x]` é um label irmão que a ação rebinda — nunca o
próprio botão (self-capture não é suportado pela plataforma).

```kof
var termos = Checkbox("aceito os termos")
form.bind(termos.root())
// num submit:
if (isChecked()) { avancar() }
```

## ToggleSwitch

```kof
ToggleSwitch(String label): SwitchParts  // .root()
isSwitchOn(): Bool
```

Knob textual `○ off` / `● on`. Mesma mecânica do checkbox com cara de
switch.

## RadioGroup

```kof
RadioGroup(List<String> options): RadioParts  // .root(), até 4 opções
radioSelected(): Int                          // -1 = nada selecionado
```

Um botão por opção; clicar grava o índice em `RadioState.selected` e
mostra `> opção` no rodapé. O `-1` inicial é contrato documentado (não é
sentinela escondida).

Por que 4? As ações precisam capturar o índice de cada botão
estaticamente — sem loop com captura variável (gap da plataforma). Mais
opções: componha dois grupos ou use [Tabs](06-navigation.md).

## Rating

```kof
Rating(String subject): RatingParts      // .root()
ratingStars(): Int                       // 0..3
setStars(n): Int                         // transição pura: mesma nota zera
ratingFace(stars): String                // ☆☆☆..★★★ (pura)
```

Três botões ★/★★/★★★. Clicar na estrela já marcada volta a zero —
comportamento definido por `setStars`, testado isoladamente.

## Estados iniciais garantidos

| Componente | Início |
|------------|--------|
| Checkbox | off |
| Switch | off |
| RadioGroup | -1 |
| Rating | 0 estrelas |

Os testes afirmam esses defaults (`tests/04-choices.kf`) — se alguém mudar
o default sem querer, a suíte quebra antes do seu usuário.
