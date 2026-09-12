# Referência da API — todas as assinaturas

Convenções: widgets construtores em `PascalCase` devolvem handle `Int` (ou
`record` de partes com `.root()`); lógica pura em `camelCase` devolve
valores. `Int` de widget atravessa funções livremente; operações de membro
(`.setText`, `.bind`) só no escopo criador — ver
[learn/01-patterns](learn/01-patterns.md).

## Primitivos da plataforma usados/integrados

**Baseline: Kof 0.3.22-beta.** A biblioteca compõe o que a plataforma expõe
— não reimplementa (R2):

- **Widgets**: `Link(text, url)`, `Image(src)`, `Icon(name[, size])`,
  `Textarea`, `Select(options)`, `Form(children)`, `Fieldset`, `Ul/Ol`,
  `Table`, `Iframe/Video/Audio/Hr`, `Canvas`.
- **Fonte**: `Font(family, size[, bold])` + `.setFont(font)` em
  Label/Button/Input/View/Link. `Code`/`DataTable` usam monospace.
- **Eventos** (UI006): `.on(type, handler)` em qualquer widget DOM;
  `Event.key/value/x/y/target/relatedTarget/stopPropagation`.
- **Estado** (Fase 8): `Store(initial)` com `.get()/.set(v)/.subscribe(f)`;
  `Component` com `view`/`state`/`stateSet`/`onMount`/`onDispose`/`effect`.
- **Navegação** (Fase 7): `Router.route/go/replace/back/forward/param/
  current/depth`.
- **Layout** (Fase 4): `Box/Stack/Spacer/Wrap/Grid/Center/Align`.
- **Primitivas visuais** (issue #78): `setBorder(color, w)`,
  `setShadow(color, offsetY, blur)`, `setGradient(a, b, angle)`,
  `setFlexBasis(px)`, `setMaxWidth(px)` em qualquer widget DOM (no-op
  JVM/Native; reais no KofJS).
- **stdlib**: `time.*` (calendário), `math.*`, `strings.*`, `validation.*`
  — a biblioteca delega e mantém só o contrato da casa.

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
| `Section(title) / Card(title)` | Int (View com elevação) |
| `Panel(content: Int)` | Int (View moldurada) |
| `Hero(title, subtitle)` | Int (View com gradiente) |
| `Content(maxWidth, child: Int)` | Int (View com max-width) |
| `Fill(child: Int)` | Int (View flex) |
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
| `Checkbox(label)` | CheckboxParts (estado por instância) |
| `ToggleSwitch(label)` | SwitchParts (estado por instância) |
| `RadioGroup(options ≤4)` / `radioSelected()` | RadioParts / Int (espelho `RadioMirror.lastSelected`) |
| `Rating(subject)` | RatingParts (estado por instância) |
| `flip(v) / toggleStars(current, target) / ratingFace(stars)` | puras |

## 05-navigation

| Assinatura | Devolve |
|------------|---------|
| `Tabs(titles, pages ≤4)` | TabParts (aba ativa por instância) |
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
| `Avatar(name)` / `avatarInitials(n) / avatarColor(n)` | AvatarParts / puras (iniciais em caixa alta) |
| `Empty()` / `EmptyState.EMPTY_TEXT` | Int / String |

## 08-datetime

O calendário civil vem de `kof.time` (`dayOfWeek` ISO convertido para
0=domingo; `isLeapYear`/`daysInMonth`/`isWeekend`).

| Assinatura | Devolve |
|------------|---------|
| `Calendar(year, month)` / `monthGrid(y, m)` | Int / String |
| `dayOfWeek(y,m,d) / daysInMonth(y,m) / isLeapYear(y) / isWeekend(y,m,d)` | puras |
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

## 11-design

| Assinatura | Devolve |
|------------|---------|
| `CurrentTheme() / useDarkTheme(dark)` | Theme / void |
| `SurfaceColor() / SecondaryColor() / BackgroundColor() / MutedColor()` | Int (Color) |
| `StyledText(t, style) / DisplayText(t) / BodyText(t) / Caption(t)` | Int (Label) |
| `Surface(children, bg, fg, padding, radius)` | Int (View) |
| `ContentCard(title, description, children)` | Int (View) |
| `ColorSwatch(name, color)` | Int (View) |
| `shadowOffset(level) / shadowBlur(level) / shadowAlpha(level)` | Int (puras) |
| `ShadowColor(level)` | Int (Color) |
| `Elevate(view, level) / Outline(view, color, width)` | Int (View) |
| `formatMoney(cents, symbol) / formatPercent(v, total) / formatDate(y,m,d) / zeroPad(v,w)` | String |

## 12-inputs · 13-canvas

| Assinatura | Devolve |
|------------|---------|
| `InputField(caption, placeholder, type)` | FieldParts (root/input/hint) |
| `PasswordField(caption)` | FieldParts |
| `MultilineField(caption, placeholder)` | MultilineParts (Textarea) |
| `SelectField(caption, options)` | SelectParts |
| `RangeField(caption, initial)` | FieldParts |
| `Counter(caption, initial)` | Component (estado reativo) |
| `CanvasBars(labels, values, color)` | Canvas |
| `CanvasLine(values, color) / CanvasRing(percent, color)` | Canvas |
| `chartMax(values) / chartHeight(v, max, h)` | puras |
