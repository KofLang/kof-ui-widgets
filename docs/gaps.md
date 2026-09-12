# Gaps da plataforma — os limites honestos

A filosofia do Kof: a intenção compila em todos os alvos; quem não consegue
executá-la **diz isso em compile-time, com código**. Esta biblioteca segue
o mesmo espírito: o que depende de mecanismo inexistente está listado aqui
com código de gap — nunca fingido na API.

> **Baseline:** Kof **0.3.22-beta** (issue #78 — primitivas visuais por
> widget). Vários gaps antigos foram fechados pela plataforma e viraram
> recursos da biblioteca (ver "Fechados" abaixo).

## Fechados pela plataforma (viraram widget/helper)

| Código | Era gap | Hoje |
|--------|---------|------|
| UIW002 | hover/foco/teclado | `.on(type, handler)` em qualquer widget + `Event.key/value/x/y/target/relatedTarget/stopPropagation` (UI006). O `TextField`/`SearchBox` já leem `input` ao vivo |
| UIW004 | gap/width/height em containers | `Box/Stack/Spacer/Wrap/Grid/Center/Align` + `setFlexBasis`/`setMaxWidth` (#78). `Content`/`Fill`/`Hero` usam |
| UIW007 | textarea | widget `Textarea` (UI003); `MultilineField` já usa |
| UIW010 | Button sem cor/ícone | `setBorder`/`setGradient`/`setShadow` (#78) estilizam o próprio Button; `Icon(name)` da plataforma ao lado |
| UIW030 | canvas/SVG | `Canvas` 2D completo (fillText/measureText/save/restore/drawImage — UI009); família `13-canvas` |
| UIW040 | case mapping | `String.toUpperCase()/toLowerCase()` + `strings.capitalize/uncapitalize`; `avatarInitials` usa |

## Ainda abertos

| Código | Gap | Impacta | Alternativa hoje |
|--------|-----|---------|------------------|
| UIW001 | vincular ação após criar handle (self-capture) | menus dinâmicos, reconfigurar botão existente | `Component` (`state`/`view`) para re-render; esqueleto de [01-patterns](learn/01-patterns.md) |
| UIW003 | theming configurável pós-criação | trocar tema global sem recriar janela | `w.theme = Theme.dark()` na criação; `useDarkTheme` + `CurrentTheme` |
| UIW005 | drag-and-drop (pointer events) | kanban, reorder, sliders arrastáveis | botões ± como controles |
| UIW006 | seleção múltipla de arquivos / file dialog nativo | upload real | FilePicker por caminho (kof.io) |
| UIW008 | timer só na JVM (`time.*` reporta TIME001 fora dela — e é onde não há render) | animar a UI no alvo JS | ✕ manual no JS; interval disponível para lógica JVM headless |
| UIW020 | `time.now()` Long sem conversão Long→Int nem formatação | relógio ao vivo, datas absolutas | Calendar/DatePicker relativos e puros (`time.dayOfWeek/daysInMonth/isLeapYear`) |
| UIW031 | kof.io no alvo JS | FilePicker carregar no browser | funciona JVM/Native; JS reporta no preview |

## Regressões de plataforma (baseline 0.3.22-beta)

Estas não são gaps de design: são bugs da plataforma que **bloqueiam a
suíte headless** da biblioteca. O código da biblioteca está correto (usa as
APIs reais); a prova de DOM continua no Chrome (`scripts/browser-tests.mjs`).

| Código | Sintoma | Repro mínima |
|--------|---------|--------------|
| UIW050 | `kof test --target jvm` morre com `VerifyError: Bad type on operand stack` / `areturn` quando uma função top-level devolve handle de UI (`Label`, `Window`, `View`, ...) | `mk(String s): Label { return Label(s) }` + `kof test --target jvm` |
| UIW051 | no runner headless JS (GraalJS sem browser) o stub de DOM não tem `dataset`/`setAttribute`/`classList` nem `fillText`/`measureText` no contexto 2D → `setFont`, `setName`/`setReadonly` e texto no Canvas lançam `TypeError` | `Label("x").setFont(Font("DejaVu Sans", 14))` em `kof test --target js` |

**Contorno de teste:** a suíte pura roda em `--target js` (lógica idêntica
nos alvos); os testes de construção de DOM que tocam esses primitivos são
verificados no browser (`scripts/browser-tests.mjs`), onde o DOM é real.

## Como tratamos cada um

1. **Documentado antes de inventado** — nenhum widget finge suportar o que
   a plataforma não dá (anti-padrão fake idioms do training/).
2. **Transição pura primeiro** — quando o mecanismo chegar, a lógica já
   existe testada; só a cola muda.
3. **API estável** — widgets que migram para mecanismos novos mantêm
   assinatura; o que muda é o interior.
4. **Delegar à stdlib** — calendário (`kof.time`), predicados
   (`kof.validation`), texto (`kof.strings`) e números (`kof.math`) vêm da
   plataforma; a biblioteca só converte contrato e desenha (R2).
