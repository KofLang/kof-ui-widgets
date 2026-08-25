# 06 — Navegação: tabs, accordion, paginação, navbar, busca

`src/05-navigation.kf`

Navegar aqui é trocar texto de um corpo via transição pura — sem router,
sem histórico. O conteúdo é `List<String>`; cada "página" é o novo texto
do corpo.

## Tabs

```kof
Tabs(List<String> titles, List<String> pages): TabParts  // .root(), até 4 abas
activeTab(): Int
tabBody(titles, pages, index): String                    // pura
```

Strip de botões + corpo `▸ título\n\nconteúdo`. Clicar grava o índice em
`TabState.active` e rebinda o corpo.

## Accordion

```kof
Accordion(String title, String content): AccordionParts  // .root()
accordionBody(content, open): String                     // pura: "" quando fechada
accordionMark(open): String                              // pura: ▾ / ▸
```

O marcador ▾/▸ é irmão do botão e gira junto com `SectionOpen.open`.

## Pagination

```kof
Pagination(Int total): PagerParts        // .root()
nextPage(p, total) / prevPage(p, total)  // puras, clampam em [1,total]
pagerLabel(page, total): String          // "página   2 / 10" alinhada
```

`‹ prev` / `next ›` ao redor do rótulo. `total = 0` trava na página 1 e
mostra "sem páginas" — nunca divide por zero.

## Breadcrumbs

```kof
Breadcrumbs(List<String> parts): Int     // "conta  ›  perfil"
```

## Navbar

```kof
Navbar(List<String> routes): NavParts    // .root(), até 4 rotas
navRoute(): String                       // rota ativa (default "home")
```

Botões de rota + divisor + status `→ rota`. Trocar de rota hoje é trocar
texto/status; conteúdo por rota é composição sua sobre `navRoute()`.

## SearchBox (busca e command palette)

```kof
SearchBox(List<String> dataset, String placeholder): SearchParts  // .root()
countMatches(dataset, query): Int                                 // pura
searchReport(dataset, query): String                              // pura, top 5
SearchState.query / .matches                                      // leitura externa
```

Input + botão buscar + relatório com os primeiros 5 hits. É também o seu
command palette: passe comandos como dataset (`"salvar arquivo"`,
"`abrir settings`") e despache sobre `SearchState.query`.

## Quando usar o quê

| Preciso... | Use |
|------------|-----|
| alternar visões no mesmo lugar | Tabs |
| detalhe opcional dobrável | Accordion |
| fatiar lista longa | Pagination |
| marcar onde o usuário está | Breadcrumbs/Navbar |
| achar item num conjunto conhecido | SearchBox |
