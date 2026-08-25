# 01 — Padrões: estado interativo sem framework

UI interativa tem um problema clássico: quem responde ao clique precisa ver
o mundo que mudou. No Kof a resposta é uma convenção só, herdada do
`kof.ui` — a biblioteca não inventa nada aqui, apenas aplica e documenta.

## As três regras

1. **Lambdas capturam cópias somente-leitura.** A foto do valor no momento
   da criação.
2. **Estado mutável entre cliques vive em campos estáticos de classe.**
   A lambda lê/escreve o campo, nunca a cópia.
3. **Handles TIPADOS criados antes da lambda podem ser rebindados à
   vontade.** `label.setText(...)`, `lista.bind(...)`, `input.text()` dentro
   da ação — é o padrão do contador de `learn/35-kof-ui.md`.

Cópias `Int` servem apenas para montar listas de layout:

```kof
var resumo = Text(progressBar(0, 0))     // TIPADO: rebindável
Int resumoH = resumo                      // Int: só para listOf(...)

var btn = Button("ok", () -> {
    Contagem.total = Contagem.total + 1           // estático
    resumo.setText(str(Contagem.total))           // typed capture
})
```

## O esqueleto de todo componente interativo

Cada componente da biblioteca segue a mesma anatomia:

```kof
class XState {                 // 1. estado: estático e pequeno
    static Bool on = false
}

record XParts(Int root)        // 2. partes expostas como handles Int

X(String label): XParts {      // 3. construtor monta TUDO no próprio escopo
    var mark = Label(marca())             // irmão criado ANTES da ação
    var b = Button(label, () -> {
        XState.on = flip(XState.on)       // 4. transição PURA...
        mark.setText(marca())             // ...e rebind do irmão
    })
    ...
}

flip(Bool v): Bool { ... }     // 5. a lógica mora em função pura testável
```

A lambda é cola; a lógica é pura. Por isso a suíte consegue afirmar valores
exatos (`nextPage(1,10) == 2`) sem abrir janela nenhuma.

## Limitação alpha: uma instância por tipo

`CheckboxState.on` é único: dois `Checkbox` compartilham o estado. Para
componentes independentes, aplique o esqueleto acima com a SUA classe de
estado — dez linhas, zero mágica. Quando a plataforma permitir registrar
estado por handle, os componentes migram sem mudar a API.

## Anti-padrões

- **Estado duplicado**: contador num campo estático E no texto do label. O
  texto deriva: recalcule na transição.
- **Sentinelas**: `-1` "sem valor" espalhado; se a ausência importa,
  nomeie (`radioSelected() == -1` é contrato documentado de RadioGroup).
- **Mecanismo na tela**: ids de DOM/CSS/hex dentro do handler de clique.
