# Gaps da plataforma — os limites honestos

A filosofia do Kof: a intenção compila em todos os alvos; quem não consegue
executá-la **diz isso em compile-time, com código**. Esta biblioteca segue
o mesmo espírito: o que depende de mecanismo inexistente está listado aqui
com código de gap — nunca fingido na API.

> **Baseline:** Kof **0.4.0-beta** (issue #78 — primitivas visuais por
> widget; e as regressões UIW050/UIW051 que bloqueavam a suíte headless).
> UIW052 entrou na linha de desenvolvimento `beta-0.4.0` (próxima release).
> Vários gaps antigos foram fechados pela plataforma e viraram recursos da
> biblioteca (ver "Fechados" abaixo).

## Fechados pela plataforma (viraram widget/helper)

| Código | Era gap | Hoje |
|--------|---------|------|
| UIW002 | hover/foco/teclado | `.on(type, handler)` em qualquer widget + `Event.key/value/x/y/target/relatedTarget/stopPropagation` (UI006). O `TextField`/`SearchBox` já leem `input` ao vivo |
| UIW004 | gap/width/height em containers | `Box/Stack/Spacer/Wrap/Grid/Center/Align` + `setFlexBasis`/`setMaxWidth` (#78). `Content`/`Fill`/`Hero` usam |
| UIW007 | textarea | widget `Textarea` (UI003); `MultilineField` já usa |
| UIW010 | Button sem cor/ícone | `setBorder`/`setGradient`/`setShadow` (#78) estilizam o próprio Button; `Icon(name)` da plataforma ao lado |
| UIW030 | canvas/SVG | `Canvas` 2D completo (fillText/measureText/save/restore/drawImage — UI009); família `13-canvas` |
| UIW040 | case mapping | `String.toUpperCase()/toLowerCase()` + `strings.capitalize/uncapitalize`; `avatarInitials` usa |
| UIW050 | handle de UI/mídia apagado para `int` no bytecode era tratado como referência → `VerifyError: Bad type on operand stack` quando uma função top-level devolvia `Label`/`Window`/`View` | 0.4.0-beta (commit `45a2caf5`): `JvmTypeMapper`/`JvmOpEmitter` reconhecem handle apagado para `int` (primitive-vs-referência, comparações/hash de record, `areturn`). `mk(String s): Label { return Label(s) }` roda em `--target jvm` |
| UIW051 | no runner headless JS o stub de DOM não tinha `dataset`/`setAttribute`/`classList` nem `fillText`/`measureText` no contexto 2D → `setFont`, `setName`/`setReadonly` e texto no Canvas lançavam `TypeError` | 0.4.0-beta: o stub headless cobre os primitivos usados pela biblioteca; `Label("x").setFont(...)`, `Input.setName/setReadonly` e `Canvas.fillText/measureText` rodam em `--target js` |
| UIW052 | no JS um `Bool` é `true`/`false` real, mas o teste de "falso" do `assert` emitia `(cond === 0)` — sempre `false` → **um assert falso PASSAVA** (escondia falha de teste) | `beta-0.4.0` (`JsComparisons`, §186): `EQ 0` → `!left` (contraparte do `NE 0` → truthiness). Um `assert(1 == 2)` agora falha corretamente em `--target js` |
| UIW008 | timer só na JVM (`time.*` reportava TIME001 fora dela — e é onde não há render) | **0.4.0-beta / 15/09**: `TIME001` fechado na plataforma nos 4 alvos — `time.interval`/`scheduler.every` + `cancel` rodam no browser (via `setInterval` real) e no headless (fila cooperativa bombeada por `time.sleep`). Nasce `ToastAutoDismiss(message, ms)`. Ressalva honesta: o idiom canônico de self-cancel `var id = time.interval(…, () -> { time.cancel(id) })` ainda trava (Kof4j **§253** — SEM011 na var do próprio interval; SIGSEGV no native ao lê-la dentro do job); a lib cancela via **handle-sombra** (o job lê uma Str capturada comum, verde nos 3 alvos) — ver `06-overlays` |
| UIW020 | `time.now()` Long sem conversão Long→Int nem formatação; datas absolutas inatingíveis | **0.4.0-beta**: a stdlib `kof.time` (S7e/S7c) traz `todayIso()`, `formatDateIso(y,m,d)`, `parseDateIso`, `isToday`, `addDays`/`diffDays` — datas absolutas formatadas nos 3 alvos; na lib entraram `clockTime(millis)` (pura, UTC) e `Clock()`/`Spinner(frames,ms)` (vivos, UIW008). O cast `time.now() as Int` continua saturante (regra 6 / Kof4j §181 — truncamento de Long>Int congelado, não gap da lib) |
| UIW031 | `kof.io` no alvo JS (FilePicker não carregava no browser) | **16/09**: o KofJS delega `readText`/`writeText`/`exists`/`size`/`readFile`/`writeFile` ao host GraalJS (`kof_platform.*`) — round-trip byte-parity com JVM/Native nos 3 alvos; o `FilePicker` carrega no browser agora. Prova: `tests/10-io.kf` "kof.io round-trip existe nos 3 alvos" |

## Ainda abertos

| Código | Gap | Impacta | Alternativa hoje |
|--------|-----|---------|------------------|
| UIW001 | vincular ação após criar handle (self-capture) | menus dinâmicos, reconfigurar botão existente | `Component` (`state`/`view`) para re-render; esqueleto de [01-patterns](learn/01-patterns.md) |
| UIW003 | theming configurável pós-criação | trocar tema global sem recriar janela | `w.theme = Theme.dark()` na criação; `useDarkTheme` + `CurrentTheme` |
| UIW005 | drag-and-drop (pointer events) | kanban, reorder, sliders arrastáveis | botões ± como controles |
| UIW006 | seleção múltipla de arquivos / file dialog nativo | upload real | FilePicker por caminho (kof.io) |

## Suíte headless (pós UIW050/051/052)

As três regressões acima bloqueavam a suíte headless: a de JVM (`UIW050`)
matava qualquer teste que atravessasse um handle por função, e as de JS
(`UIW051` stub de DOM, `UIW052` assert falso passando) escondiam falha no
alvo JS. Com elas fechadas, `scripts/test.sh` roda verde nos **três alvos**
(`TARGET=jvm|native|js`, 12/12 famílias) e `scripts/check.sh` valida os
exemplos — a prova de DOM fina (pixels) continua no Chrome
(`scripts/browser-tests.mjs`).

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
