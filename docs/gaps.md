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
| UIW001 | vincular ação **depois** de criar o handle (menus dinâmicos, botão reconfigurável) | **16/09**: a plataforma deixou isso possível — `.on(type, handler)` fora da árvore de Component (UI006, `f0907c2`) + `setText`/`set*` pós-criação (#78) funcionam nos **3 alvos**. Nasce `ReconfigButton(labelOn, labelOff, id)`: um botão que troca o próprio rótulo a cada clique, sem recriar nada. Ressalva honesta: a variante *self-capture na inicialização* (`var btn = Button(…, () -> btn.setText(…))` — o handler lê a var em declaração) roda em jvm/js (Kof4j §253 face A) mas ainda **falha em native** (SEM092 até a face B, §253 nat). Prova: `tests/12-inputs-canvas.kf` "ReconfigButton monta…" (jvm/native/js) + `scripts/browser-drag.mjs` (clique real troca o rótulo no DOM) |
| UIW005 | drag-and-drop (pointer events) — sliders arrastáveis | **16/09**: os primitivos de ponteiro existem (`mousedown`/`mousemove`/`mouseup` + `Event.x()`=clientX do DOM real — UIW002/UI006). Nasce `Slider(caption, min, max, step, initial)` (Component vivo): arrastar sobre o card move o polegar via transição **pura** `sliderValue` (verde nos 3 alvos; no-op em jvm/native onde o gesto não dispara). Prova: `tests/12-inputs-canvas.kf` (4 testes de `sliderValue` com valores exatos) + `scripts/browser-drag.mjs` (Chrome: drag +40px leva 20 → 70). Kanban/reorder são o próximo passo sobre o MESMO mecanismo — não falta primitiva, falta desenho de widget → **UIW053, 17/09** |
| UIW053 | lista reordenável por arraste (kanban-lite) — o próximo passo do UIW005 | **17/09**: nasce `ReorderList(caption, labels, id)` sobre o MESMO mecanismo de ponteiro (eixo Y: `Event.y()`, o `reorderTarget`/`reorderAt` são puros, verde nos 3 alvos; live-snap com âncora fixa no mousedown como no Slider). ▲▼ por linha dão o caminho determinístico que roda nos 3 alvos; o arraste é real só no browser (prova: `scripts/browser-reorder.mjs` no Chrome — drag move a linha 0 duas posições e o clique ▲▼ commuta). **Ressalva honesta:** o corpo do view evita `if`+statements-depois dentro do loop por causa do **Kof4j §266** (miscompile silencioso no JS: os statements vão para a cláusula update do `for(;…;…)` e os `let` dos locais ficam fora de escopo; em `view` o `catch` do `kofUiRender` engole e a UI monta VAZIA). O contorno da lib: a marca `(arrastando)` vem da função pura `reorderMark(dragging, where, p)` (corpo de método parseia à parte). Prova: `tests/14-reorder.kf` (9 testes com valores exatos, incl. trajetória desce→inverte→volta) + browser-reorder no DOM real |

## Ainda abertos

| Código | Gap | Impacta | Alternativa hoje |
|--------|-----|---------|------------------|
| UIW003 | theming configurável pós-criação | trocar tema global sem recriar janela | `w.theme = Theme.dark()` na criação; `useDarkTheme` + `CurrentTheme` |
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
