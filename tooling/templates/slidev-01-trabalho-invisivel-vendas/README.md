# Tema do deck 01

Sobreposição de `tooling/templates/slidev/` para o deck `01-trabalho-invisivel-vendas`. O gerador
copia primeiro a pasta compartilhada e depois esta, arquivo por arquivo — o que existe aqui vence.

O visual vem do Figma "LLM - Newton (Copy)" (`Onbl98d5H1beh1glWl08q1`, time Ground), um template
por tipo de slide. Cada template é uma **página** do arquivo, e o design é 3840×2160: as medidas
do `style.css` são as do Figma divididas por 3,918 (o slide do Slidev tem 980×552).

| Layout Slidev | Template no Figma | Quando o gerador escolhe |
| --- | --- | --- |
| `cover` | página 1 (`0:1`) | primeiro slide, com `capa.linhas` do `palestra.yaml` |
| `texto` | `4:127` | `<!-- slide -->` sem título (só parágrafos) |
| `lista` | `4:2` | `<!-- slide -->` com `##`, lista ou tabela |
| `image` | `4:46` | `<!-- slide:image image=… -->` (imagem no slide todo) |
| `diagrama` | `4:290` | `<!-- slide -->` com bloco ```mermaid |
| `titulo` / `capitulo` | `4:355` | `<!-- slide:capitulo -->`, ou bloco cujo título é `#` |
| `hacktown` | `14:205` | `<!-- slide:hacktown image=… -->` (slide obrigatório do evento) |
| `imagem`, `codigo` | — | `<img>`/`![…]` ou bloco de código; seguem o grid de `4:2` |

Fonte: **Unbounded** (Google Fonts) em todo texto, com espaçamento de 10% do corpo. Pesos:
Regular no corpo, Medium na linha menor do diagrama, SemiBold em títulos e negrito, Black nas
palavras em destaque da capa.

`public/theme/` guarda os assets exportados do Figma, servidos em `/theme/…`: `fundo.jpg`
(grid azul com a borda marrom), `fundo-azul.jpg` (grid azul inteiro, do slide de imagem
grande), `raio.svg` e `l-shape.svg` (os ícones "retro", que o Figma estica sem preservar a
proporção — por isso `preserveAspectRatio="none"`).

`lib/fit.ts` mede o `.corpo` de cada slide depois do mount e encolhe `--fit-size` até o
conteúdo caber. O corpo do Figma (23px de Unbounded) não comporta uma tabela ou seis bullets;
o fit preserva o desenho quando cabe e degrada em vez de cortar quando não cabe.
