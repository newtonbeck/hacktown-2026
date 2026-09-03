# Tema do deck 02

Sobreposição de `tooling/templates/slidev/` para o deck `02-o-que-sobra-sem-llm`. O gerador copia
primeiro a pasta compartilhada e depois esta, arquivo por arquivo — o que existe aqui vence.

O visual vem do Figma "LLM - Newton" (`8OkijdnUIMwqZWaQNa9LUX`), um template por tipo de slide:

| Layout Slidev | Template no Figma | Quando o gerador escolhe |
| --- | --- | --- |
| `cover` | página 1 (capa) | primeiro slide, com `capa:` do `palestra.yaml` |
| `lista` | 4:2 | `<!-- slide -->` com texto, lista ou tabela |
| `image` | 4:46 | `<!-- slide:image image=… -->` (imagem no slide todo) |
| `imagem` | 4:174 | `<!-- slide -->` com `<img>` ou `![…]` |
| `codigo` | 4:239 | `<!-- slide -->` com bloco de código |
| `diagrama` | 4:290 | `<!-- slide -->` com bloco ```mermaid |
| `titulo` / `capitulo` | 4:355 | `<!-- slide:capitulo -->`, ou bloco cujo título é `#` |

`public/theme/` guarda os assets do tema (textura de fundo e a lagosta), servidos em `/theme/…`.
Os ícones "retro" dos templates (mão, cubo, raio) ficaram de fora por enquanto.
