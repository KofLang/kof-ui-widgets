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

## O que ficou de fora e por quê

Relógio ao vivo precisa de `now()` (Long) convertido para campos — a
plataforma não tem conversão Long→Int nem formatação de tempo
([gaps.md](../gaps.md), UIW020). Fuso horário, locale e DST: idem.
Quando entrarem, entram como funções puras testáveis primeiro.
