# 04 — Formulários

`src/03-forms.kf`

## TextField

```kof
TextField(String caption, String placeholder): TextFieldParts
```

"campo com legenda". Legenda muted + Input + hint de status + botão ↻ que
sincroniza o valor digitado para `TextFieldState.value`.

```kof
var nome = TextField("Nome", "como te chamam?")
form.bind(nome.root())

// depois de um clique em qualquer botão da tela:
salvar(TextFieldState.value)
```

**Por que o botão ↻ existe**: a plataforma não tem evento de teclado — o
valor do Input só é legível dentro de uma ação. O TextField expõe a leitura
de duas formas: direta (leia `input.text()` numa ação sua, se você criou o
Input) ou via estado (`TextFieldState.value`), atualizada pelo ↻.

Multi-instância: todos os TextField compartilham `TextFieldState` (limite
alpha — ver [01-patterns](01-patterns.md)). Para campos independentes,
crie os Inputs direto e capture-os nas suas ações.

## Validação pura

Funções sem tela, 100% testáveis:

| Função | Contrato |
|--------|----------|
| `isBlank(s)` | string vazia |
| `minLength(s,n)` / `maxLength(s,n)` | limites inclusivos |
| `isEmail(s)` | tem @ antes do ponto, nada vazio nos extremos |
| `isNumber(s)` | só dígitos; vazio é falso |
| `indexOf(s, needle)` | primeira ocorrência ou -1 |

### Resumo para o formulário

```kof
validationSummary(List<String>): String
```

Recebe os erros e devolve o texto do label de status:

```text
sem erros            → "✓ tudo certo"
["nome", "email"]    → "✕ corrija 2 campo(s):\n• nome\n• email"
```

### Receita: formulário com validação no submit

```kof
class Cadastro { static String erros = "" }

main() {
    var w = App("Cadastro")
    var email = Input("voce@exemplo.com")
    var status = Label("")

    var btn = Button("criar conta", () -> {
        var erros = listOf<String>()
        if (!isEmail(email.text())) { erros.add("email inválido") }
        status.setText(validationSummary(erros))
    })
    ...
}
```

A validação roda na ação porque depende do valor digitado — mas as regras
(`isEmail` etc.) são puras e testadas.
