# Evolução

O que falta não é "roadmap de features": é **mecanismo de plataforma**.
Cada item depende de um gap documentado em [`gaps.md`](gaps.md) com código
próprio — quando o Kof resolver o mecanismo, o componente entra no mesmo
dia, mantendo a assinatura já prevista aqui.

| Quando resolver | Entra |
|-----------------|-------|
| UIW001 (ação pós-criação) | Checkbox/Radio multi-instância, menus dinâmicos |
| UIW002 (hover/foco/teclado) | Tooltip por hover, atalhos, navegação por teclado |
| UIW003 (theming pós-criação) | troca de tema global sem recriar janelas |
| UIW004 (gap/layout flexível) | Grid real, SplitPane, Resizable, responsivo |
| UIW005 (drag-and-drop) | Kanban, reorder de listas, Slider arrastável |
| UIW007 (textarea) | CodeEditor, Terminal interativo |
| UIW008 (timer) | Toast auto-dismiss, Spinner/Skeleton animados |
| UIW020 (formatação de tempo) | Clock vivo, datas absolutas |

## Versionamento

`VERSION` na raiz (`0.3.0-alpha`), mesma convenção do Kof. Enquanto alpha:
API pode mudar entre minors; qualquer remoção é documentada em
[`gaps.md`](gaps.md) antes de sair.
