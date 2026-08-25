# Roadmap

Limites honestos primeiro — o que a biblioteca **não** faz hoje e por quê.

## Gaps (dependem da plataforma)

| Widget | Gap | Código do gap |
|--------|-----|---------------|
| `Toggle` / `Checkbox` | ação precisa ser vinculada após criar o handle (self-capture na inicialização) | `UIW001` |
| `Tabs` / `Menu` | idem + seleção persistente entre cliques | `UIW002` |
| Temas configuráveis | `Style`/`Theme` fixos por widget hoje; trocar tema global exige recriar os handles | `UIW003` |

Estes widgets entram no mesmo dia em que o `kof.ui` resolver o mecanismo.
Nada aqui será fingido com estado global frágil — ver
[patterns.md](patterns.md).

## Próximos passos possíveis (composição pura, sem gap)

- `Progress(value, max): Int` — wrapper que guarda o label e expõe rebind
  via padrão de campos estáticos do app
- `KeyValue(key, value)` — linha "chave: valor" para painéis
- `List(items)` — coluna de linhas a partir de `List<String>`
- `Empty(message)` — placeholder para lista vazia ("nada por aqui ainda")

Cada item só entra se passar no teste da filosofia: **é uma intenção
recorrente? dá para fazer bem com os primitivos atuais? o nome verbaliza o
quê?**

## Versionamento

`VERSION` na raiz, mesma convenção do Kof (`0.1.0-alpha`). Enquanto alpha:
mudanças de API podem acontecer entre minors; widgets removidos serão
documentados como gap antes de sair.
