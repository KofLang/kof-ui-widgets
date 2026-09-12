# Evolução

O que falta não é "roadmap de features": é **mecanismo de plataforma**.
Cada item depende de um gap documentado em [`gaps.md`](gaps.md) com código
próprio — quando o Kof resolver o mecanismo, o componente entra no mesmo
dia, mantendo a assinatura já prevista aqui.

## Fechados na última atualização (Kof 0.3.22-beta / issue #78)

| Gap | Entrou |
|-----|--------|
| UIW002 (eventos) | leitura ao vivo de `input`/`change`/`focus`/`keydown`; `Event` com payload |
| UIW004 (layout flexível) | `Content` (max-width), `Fill` (flex), `Hero` (gradiente) |
| UIW007 (textarea) | `MultilineField` sobre o `Textarea` da plataforma |
| UIW030 (canvas) | família `13-canvas` (barras, linha, anel) |
| UIW040 (case) | iniciais em caixa alta (`avatarInitials`) |
| — | primitivas visuais: `Elevate`/`Outline` (setShadow/setBorder) |

## Próximos (dependentes de mecanismo)

| Quando resolver | Entra |
|-----------------|-------|
| UIW001 (ação pós-criação) | menus dinâmicos, botão reconfigurável |
| UIW003 (theming pós-criação) | troca de tema global sem recriar janelas |
| UIW005 (drag-and-drop) | Kanban, reorder de listas, Slider arrastável |
| UIW006 (file dialog) | upload real |
| UIW008 (timer no JS) | Toast auto-dismiss, Spinner/Skeleton animados |
| UIW020 (formatação de tempo) | Clock vivo, datas absolutas |
| UIW031 (kof.io no JS) | FilePicker no browser |
| UIW050/UIW051 (regressões) | suíte de construção headless verde de novo |

## Versionamento

`VERSION` na raiz (`0.4.0-alpha`), mesma convenção do Kof. Enquanto alpha:
API pode mudar entre minors; qualquer remoção é documentada em
[`gaps.md`](gaps.md) antes de sair.

A biblioteca declara a **baseline de plataforma** (hoje 0.3.22-beta) no
[`README`](../README.md) e em [`gaps.md`](gaps.md): features novas dependem
das primitivas daquela versão.
