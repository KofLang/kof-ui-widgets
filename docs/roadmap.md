# Evolução

O que falta não é "roadmap de features": é **mecanismo de plataforma**.
Cada item depende de um gap documentado em [`gaps.md`](gaps.md) com código
próprio — quando o Kof resolver o mecanismo, o componente entra no mesmo
dia, mantendo a assinatura já prevista aqui.

## Fechados na última atualização (Kof 0.4.0-beta / issue #78)

| Gap | Entrou |
|-----|--------|
| UIW002 (eventos) | leitura ao vivo de `input`/`change`/`focus`/`keydown`; `Event` com payload |
| UIW004 (layout flexível) | `Content` (max-width), `Fill` (flex), `Hero` (gradiente) |
| UIW007 (textarea) | `MultilineField` sobre o `Textarea` da plataforma |
| UIW030 (canvas) | família `13-canvas` (barras, linha, anel) |
| UIW040 (case) | iniciais em caixa alta (`avatarInitials`) |
| UIW050/UIW051 (regressões JVM/JS) | suíte headless verde nos 3 alvos |
| UIW052 (assert falso no JS) | `assert` falha corretamente em `--target js` |
| UIW008 (timer no JS) | `time.interval`/`scheduler.every` + `cancel` nos 4 alvos (TIME001 fechado na plataforma 15/09); `ToastAutoDismiss(message, ms)`, `Clock()` e `Spinner(frames, ms)` entregam o auto-dismiss e a animação (Spinner se cancela via handle-sombra; o self-cancel canônico ainda trava no Kof4j §253). **Skeleton animado entregue 18/09**: era "pendente de design" na linha do UIW008 — o mecanismo (timer do UIW008) já existia, só faltava o desenho; entrou `skeletonShimmer(step, width)` (pura, travada em valor exato) + `Skeleton(rows, width, ms)` (vivo, onda diagonal, sem cancel como o Clock — evita o §253) nos 3 alvos. Prova: `tests/08-datetime.kf` (valores exatos da pure + fase deslocada ao DOM no JS) |
| UIW020 (formatação de tempo) | `todayIso`/`formatDateIso`/`parseDateIso`/`addDays`/`diffDays` na stdlib + `clockTime(millis)`/`Clock()` na lib → relógio ao vivo real nos 3 alvos (no-op em JVM/Native, render no JS) |
| — | primitivas visuais: `Elevate`/`Outline` (setShadow/setBorder) |
| UIW031 (kof.io no JS) | **16/09** (`de9d5fc`): `readText`/`writeText`/`exists`/`size`/`readFile`/`writeFile` delegados ao host GraalJS — round-trip byte-parity nos 3 alvos; o `FilePicker` carrega no browser |
| UIW001 (ação pós-criação) | **16/09**: `.on()` pós-criação (UI006) + `set*` (#78) nos 3 alvos → `ReconfigButton` (botão que troca o próprio rótulo ao clicar) e menus dinâmicos. Self-capture na declaração segue SEM092 no native (Kof4j §253 face B) |
| UIW005 (drag-and-drop) | **16/09**: ponteiro real (mousedown/mousemove/mouseup + `Event.x()`) → `Slider` arrastável (transição pura `sliderValue`, verde nos 3 alvos; drag provado no Chrome). Kanban/reorder são widgets sobre o mesmo mecanismo, não gap de plataforma |

## Próximos (dependentes de mecanismo)

| Quando resolver | Entra |
|-----------------|-------|
| UIW003 (theming pós-criação) | troca de tema global sem recriar janelas |
| UIW006 (file dialog) | upload real |

## Versionamento

`VERSION` na raiz (`0.4.0-alpha`), mesma convenção do Kof. Enquanto alpha:
API pode mudar entre minors; qualquer remoção é documentada em
[`gaps.md`](gaps.md) antes de sair.

A biblioteca declara a **baseline de plataforma** (hoje 0.4.0-beta) no
[`README`](../README.md) e em [`gaps.md`](gaps.md): features novas dependem
das primitivas daquela versão.
