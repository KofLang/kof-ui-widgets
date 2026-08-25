# Referência da API — todas as assinaturas

Convenções: widgets construtores em `PascalCase` devolvem handle `Int` (ou
`record` de partes com `.root()`); lógica pura em `camelCase` devolve
valores. `Int` de widget atravessa funções livremente; operações de membro
(`.setText`, `.bind`) só no escopo criador — ver
[learn/01-patterns](learn/01-patterns.md).

## 00-core

| Assinatura | Devolve |
|------------|---------|
| `App(title: String)` | Int (Window pronta) |
| `SurfaceColor() / ErrorColor() / PrimaryColor() / TextColor()` | Int (Color) |
| `repeat(piece: String, n: Int)` | String |
| `padEnd(s, width) / padStart(s, width)` | String |
| `ellipsis(s, width) / substringN(s, a, b)` | String |
| `countChar(s, ch) / indexOf(s, needle) / lastIndexOf(s, needle)` | Int |
| `join(parts: List<String>, sep: String)` | String |
| `clamp(v, min, max) / wrapNext(i, n) / wrapPrev(i, n) / str(v)` | Int |

## 01-typography · 02-layout

| Assinatura | Devolve |
|------------|---------|
| `Heading(t) / Subheading(t) / Text(t) / Muted(t) / Code(t) / Link(l)` | Int (Label) |
| `Quote(t)` | Int (View com barra) |
| `Section(title) / Card(title)` | Int (View; aceita mais binds) |
| `Panel(content: Int)` | Int (View moldurada) |
| `VSpace(px) / HSpace(px) / Divider()` | Int |
| `Badge(text) / Chip(text)` | Int |
| `Tag(text, color: Int)` | Int |

## 03-forms

| Assinatura | Devolve |
|------------|---------|
| `TextField(caption, placeholder)` | TextFieldParts `.root()` |
| `TextFieldState.value` | String (sincronizado pelo ↻) |
| `isBlank(s) / minLength(s,n) / maxLength(s,n) / isEmail(s) / isNumber(s)` | Bool |
| `validationSummary(errors: List<String>)` | String |

## 04-choices

| Assinatura | Devolve |
|------------|---------|
| `Checkbox(label)` / `isChecked()` | CheckboxParts / Bool |
| `ToggleSwitch(label)` / `isSwitchOn()` | SwitchParts / Bool |
| `RadioGroup(options ≤4)` / `radioSelected()` | RadioParts / Int (-1 inicial) |
| `Rating(subject)` / `ratingStars()` | RatingParts / Int |
| `flip(v) / setStars(n) / ratingFace(stars)` | puras |

## 05-navigation

| Assinatura | Devolve |
|------------|---------|
| `Tabs(titles, pages ≤4)` / `activeTab()` | TabParts / Int |
| `Accordion(title, content)` | AccordionParts |
| `Pagination(total)` / `nextPage(p,t) / prevPage(p,t) / pagerLabel(p,t)` | PagerParts / puras |
| `Breadcrumbs(parts)` | Int (Label) |
| `Navbar(routes ≤4)` / `navRoute()` | NavParts / String |
| `SearchBox(dataset, placeholder)` / `countMatches(ds,q) / searchReport(ds,q)` | SearchParts / puras |
| `SearchState.query / .matches` | leitura externa |

## 06-overlays

| Assinatura | Devolve |
|------------|---------|
| `Dialog(title, content: Int)` | Int (Window mostrada) |
| `MessageDialog(title, message)` | Int |
| `Confirm(title, question)` / `confirmAnswered()` | ConfirmParts / Bool |
| `Drawer(title, content: Int)` | DrawerParts |
| `Tooltip(term, explanation)` | TooltipParts (gatilho no fluxo) |
| `Toast(message)` | Int |
| `Alert(kind: "ok"\|"info"\|"warn"\|"error", message)` | Int (banner inline) |
| `alertGlyph(kind) / alertColor(kind)` | String / Int (puras) |

## 07-data

| Assinatura | Devolve |
|------------|---------|
| `DataTable(headersCsv, rows)` / `tableText(h, rows)` | Int / String |
| `split(s, sep)` | List<String> |
| `TreeView(paths) / treeText(paths)` | Int / String |
| `ListView(items, numbered)` / `listText(i, n)` | Int / String |
| `Timeline(events)` / `timelineText(e)` | Int / String |
| `StatCard(label, value, trend)` | StatCardParts |
| `Avatar(name)` / `avatarInitials(n) / avatarColor(n)` | AvatarParts / puras |
| `Empty()` / `EmptyState.EMPTY_TEXT` | Int / String |

## 08-datetime

| Assinatura | Devolve |
|------------|---------|
| `Calendar(year, month)` / `monthGrid(y, m)` | Int / String |
| `dayOfWeek(y,m,d) / daysInMonth(y,m) / isLeapYear(y)` | puras |
| `prevMonth(m) / nextMonth(m)` | puras |
| `DatePicker() / TimePicker()` | PickerParts |
| `DateState.year/.month/.day` · `TimeState.hour/.minute` | leitura externa |
| `timeLabel()` | String ("09:15") |

## 09-charts

| Assinatura | Devolve |
|------------|---------|
| `Sparkline(values)` / `sparkline(values)` | Int / String |
| `HBar(v, max, width) / progressBar(v, max)` | String |
| `BarsChart(labels, values, height)` | Int |
| `Donut(percent)` / `donutText(p)` | Int / String |
| `Gauge(v, max)` / `gaugeText(v, m)` | Int / String |
| `ratioFill(v, max, w) / ratioPercent(v, max)` | puras |

## 10-io

| Assinatura | Devolve |
|------------|---------|
| `FilePicker(label)` | FilePickerParts |
| `FilePickerState.loadedPath` | String |
| `filePreview(content)` | String (5 linhas + rodapé) |
