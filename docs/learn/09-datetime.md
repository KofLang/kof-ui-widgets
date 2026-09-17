# 09 — Data e hora: calendário e pickers

`src/08-datetime.kf`

O calendário civil vem de `kof.time` (S7-wedge, paridade JVM/JS/Native):
`time.dayOfWeek` (ISO), `time.isLeapYear`, `time.daysInMonth`,
`time.isWeekend`. A biblioteca só converte para o contrato da casa
(0=domingo) — não reimplementa a plataforma. Os testes afirmam âncoras
históricas (`24/ago/2026 == segunda`, `1/jan/1970 == quinta`) antes de
qualquer pixel existir.

## Calendar

```kof
Calendar(Int year, Int month): Int        // grade estática
monthGrid(year, month): String            // pura
dayOfWeek(y, m, d): Int                   // pura: 0=domingo .. 6=sábado
daysInMonth(y, m) / isLeapYear(y)         // puras
isWeekend(y, m, d): Bool                  // pura (sábado/domingo)
prevMonth(m) / nextMonth(m)               // puras: wrap 12↔1
```

Grade domingo-primeiro com cabeçalho `D S T Q Q S S`:

```text
ago 2026
D  S  T  Q  Q  S  S
                       1
 2  3  4  5  6  7  8
...
```

A grade exata de agosto/2026 é asserção na suíte — se alguém mexer no
algoritmo, o teste aponta a linha.

## DatePicker

```kof
DatePicker(): PickerParts                 // .root()
DateState.year / .month / .day            // leitura externa
```

‹ › navegam meses (wrap correto de ano). Seleção de dia específico fica
de fora até a plataforma ter alvo clicável por célula — o grid é texto.

## TimePicker

```kof
TimePicker(): PickerParts                 // .root()
TimeState.hour / .minute                  // leitura externa
timeLabel(): String                       // "09:15" zero-empilhado
```

Passos de +1h e +15min com wrap de 24h/60min via `wrapNext`.

## Relógio e spinner ao vivo

```kof
Clock(): Label                       // "YYYY-MM-DD HH:MM:SS", atualiza a cada 1s
Spinner(frames, ms): Label           // ⠋⠙⠹… anima `frames` passos de `ms` e para
clockTime(millis: Long): String      // pura — "HH:MM:SS"
spinnerFrame(step: Int): String      // pura — quadro de `step` (wrap 8)
Skeleton(rows, width, ms): SkeletonParts   // placeholder com onda `▓` sobre `░`
skeletonShimmer(step: Int, width: Int): String  // pura — barra de `step` (wrap width)
```

Ambos usam o timer do `time.interval` (UIW008). `Clock` compõe `todayIso()`
da stdlib com `clockTime(time.now())` e roda a vida do app; `Spinner` anima e
**se cancela sozinho** lendo um handle-sombra (o job nunca lê a var do próprio
`time.interval` — o self-cancel canônico trava no Kof4j §253). Em JVM/Native
o `setText` é no-op; a prova dos valores é a transição pura, travada em
âncoras absolutas (não no relógio do host).

`Skeleton` fecha a linha "pendente de design" do roadmap: `rows` barras de
`width` células em um `View` de superfície; a cada `ms` um brilho `▓` varre
cada barra, defasado de `step + p` por linha — onda diagonal. Vive com o
widget (interval sem cancel, como o `Clock`; o §253 não é tocado). `ms <= 0`
congela a fase de construção; `rows <= 0` dá caixa vazia. O `.bars` do
`SkeletonParts` expõe as `Label`s (mesmo shape do `ReorderList`), então o
chamado pode esconder/mostrar sem recompôr.

Fuso: `time.tzOffsetSeconds()` existe em JVM/JS (native = gap honesto
TIME003 da plataforma). DST e locale seguem fora. Nota de casa: o
`padStart` preenche com **espaço** — o pad do relógio é zero (`pad2`), e
`timeLabel` foi corrigido para bater com a doc ("09:15", não " 9:15").
