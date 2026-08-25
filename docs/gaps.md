# Gaps da plataforma — os limites honestos

A filosofia do Kof: a intenção compila em todos os alvos; quem não consegue
executá-la **diz isso em compile-time, com código**. Esta biblioteca segue
o mesmo espírito: o que depende de mecanismo inexistente está listado aqui
com código de gap — nunca fingido na API.

| Código | Gap | Impacta | Alternativa hoje |
|--------|-----|---------|------------------|
| UIW001 | vincular ação após criar handle (self-capture) | Toggle/Checkbox de instância única, menus dinâmicos | esqueleto de [01-patterns](learn/01-patterns.md) com irmão rebindável |
| UIW002 | eventos de hover/foco/teclado | Tooltip por hover, atalhos, navegação por tab | Tooltip por clique; foco implícito |
| UIW003 | theming configurável pós-criação | trocar tema global sem recriar janela | um tema só (escuro do Kof), por decisão |
| UIW004 | propriedade gap/width/height em containers | layouts responsivos, split/resizable | VSpace/HSpace, Row/Column fixos |
| UIW005 | drag-and-drop (pointer events) | kanban, reorder, sliders arrastáveis | botões ± como controles |
| UIW006 | seleção múltipla de arquivos / file dialog nativo | upload real | FilePicker por caminho (kof.io) |
| UIW007 | editor multilinha (textarea) | code editor, terminal interativo | Input de linha + preview somente-leitura |
| UIW008 | timer só na JVM (`time.*` reporta TIME001 fora dela — e é onde não há render) | animar a UI no alvo JS | ✕ manual no JS; interval disponível para lógica JVM headless |
| UIW010 | Button sem cor/ícone embutidos | botões semânticos visuais | prefixos de texto (✓, ✕); `Icon(name)` da plataforma ao lado do botão |
| UIW020 | `now()` Long sem conversão Long→Int nem formatação | relógio ao vivo, datas absolutas | Calendar/DatePicker relativos e puros |
| UIW030 | canvas/SVG | charts proporcionais | família charts em texto monoespaçado |
| UIW031 | kof.io no alvo JS | FilePicker carregar no browser | funciona JVM/Native; JS reporta no preview |
| UIW040 | case mapping (maiúsculas/minúsculas) | initials uppercase, busca case-insensitive | texto como escrito; contains exato |

## Como tratamos cada um

1. **Documentado antes de inventado** — nenhum widget finge suportar o que
   a plataforma não dá (anti-padrão fake idioms do training/).
2. **Transição pura primeiro** — quando o mecanismo chegar, a lógica já
   existe testada; só a cola muda.
3. **API estável** — widgets que migram para mecanismos novos mantêm
   assinatura; o que muda é o interior.
