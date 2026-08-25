# Instalação

## Requisito

Uma distribuição Kof com `kof.ui` (≥ 0.0.14-alpha):

```bash
kof version
```

A biblioteca é **source Kof puro** — nada para compilar ou empacotar além
do repositório dela.

## As três formas de incluir

### 1. build.sh (a forma canônica)

```bash
OUT=$(scripts/build.sh meu-app.kf)     # concatena src/*.kf em ordem + seu app
kof run "$OUT" --target=js
```

A ordem dos módulos é a ordem dos prefixos numéricos (`00-core.kf` →
`10-io.kf`) — determinística e legível.

### 2. Colar

O conteúdo de `src/*.kf` no topo do seu `.kf`. Mesma coisa da forma 1, à
mão — para protótipos descartáveis.

### 3. Script de exemplo (para desenvolver aqui)

```bash
scripts/run-example.sh hello       # monta e roda no js
scripts/run-example.sh dashboard --target=jvm
```

Os scripts usam o `kof` do `PATH`; para outro binário:
`KOF=/caminho/kof scripts/test.sh`.

## Estrutura do repositório

```
kof-ui-widgets/
├── README.md               # visão geral e quick start
├── VERSION                 # 0.2.0-alpha (convenção do Kof)
├── LICENSE                 # BSD 3-Clause
├── src/                    # a biblioteca: uma família por arquivo
│   ├── 00-core.kf          #   App, cores, helpers puros
│   ├── 01-typography.kf    #   texto nos três níveis + variações
│   ├── 02-layout.kf        #   Section/Panel/Card, respiro, marcadores
│   ├── 03-forms.kf         #   TextField + validação pura
│   ├── 04-choices.kf       #   Checkbox/ToggleSwitch/RadioGroup/Rating
│   ├── 05-navigation.kf    #   Tabs/Accordion/Pagination/Navbar/SearchBox
│   ├── 06-overlays.kf      #   Dialog/Confirm/Drawer/Tooltip/Toast/Alert
│   ├── 07-data.kf          #   DataTable/TreeView/ListView/StatCard/Avatar
│   ├── 08-datetime.kf      #   Calendar/DatePicker/TimePicker
│   ├── 09-charts.kf        #   Sparkline/Bars/Donut/Gauge/progressBar
│   └── 10-io.kf            #   FilePicker com preview
├── examples/               # programas completos: hello, perfil, tarefas,
│                           # dashboard, files
├── tests/                  # suíte por família (test "nome" { assert })
├── scripts/                # build.sh · run-example.sh · check.sh · test.sh
└── docs/                   # learn/ · reference/ · gaps.md · filosofia
```

## Verificar a instalação

```bash
git clone <este-repo> && cd kof-ui-widgets
scripts/run-example.sh hello        # abre "Olá"
scripts/test.sh                     # suítes: PASS por nome
```

Janela aberta e suítes verdes: biblioteca instalada.

## Licença

BSD 3-Clause — redistribuição permitida com atribuição; veja `LICENSE`.
Programas que usam a biblioteca não herdam obrigação nenhuma além da nota
de copyright se redistribuírem o source.
