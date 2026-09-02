# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> `README.md` é um symlink para este arquivo.

## O que é este repositório

Materiais das palestras de Newton no **Hacktown 2026**. Não é um produto: é um repositório de
conteúdo em Markdown com duas saídas geradas — decks Slidev e um site estático Starlight.

| Pasta | Palestra |
| --- | --- |
| `palestras/01-trabalho-invisivel-vendas/` | O trabalho invisível que a IA está tirando das equipes de vendas |
| `palestras/02-o-que-sobra-sem-llm/` | O que sobra quando você tira o LLM do seu agente? |

**Todo texto voltado ao público é pt-BR.** Nomes de arquivo, identificadores e código em
inglês/kebab-case.

## A regra que organiza tudo: `slides/` e `site/` são descartáveis

```
palestras/<slug>/core/*.md   ← FONTE DA VERDADE (versionada)
tooling/                     ← gerador + templates (versionado)
        │  npm run gen
        ├──► slides/<slug>/  (Slidev)     — .gitignore
        └──► site/           (Starlight)  — .gitignore
```

- **Nunca edite nada dentro de `slides/` ou `site/`.** Esses diretórios são apagados e reescritos
  a cada `npm run gen`; não estão no git. `tooling/generate.mjs` é o único código autorizado a
  escrever neles.
- Mudança de **conteúdo** → `palestras/<slug>/core/`.
- Mudança de **tema, layout ou configuração** → `tooling/templates/slidev/` ou
  `tooling/templates/astro/`, copiados verbatim para a saída.
- Mudança em **como o core vira slide/página** → `tooling/generate.mjs`.
- Não há workspaces. Todas as dependências vivem no `package.json` da raiz, e os projetos
  gerados não têm `package.json` próprio: eles resolvem a partir do `node_modules` da raiz
  (que o npm mantém plano). Astro roda com `--root site`; Slidev recebe o caminho do
  `slides.md`. Gerenciador de pacotes: **npm**.

## Comandos

```bash
npm install
npm run gen                       # regenera slides/ e site/ a partir do core

npm run slides 01                 # dev do deck (aceita slug inteiro ou prefixo "01")
npm run slides 01 build           # SPA estática em slides/<slug>/dist
npm run slides 02 export          # PDF (requer: npm i -D playwright-chromium)

npm run site:dev                  # gen + astro dev
npm run site:build                # gen + astro build → site/dist
npm run site:preview

npm run deploy                    # site:build + wrangler deploy (Workers Static Assets)
```

`slides` e `site:*` rodam `gen` antes — não é preciso chamá-lo à mão.

## Contrato de conteúdo do `core/`

Cada arquivo em `core/` é **uma seção**, e a ordem alfabética do nome (`01-`, `02-`…) define a
ordem no deck e no sidebar do site. Frontmatter:

```yaml
---
titulo: Anatomia do trabalho invisível   # obrigatório — vira título da página e do sidebar
resumo: uma linha                        # description do site
slide:
  layout: default                        # layout padrão dos slides desta seção
notas: |                                 # vira nota do apresentador no Slidev; NÃO vai pro site
  Não correr aqui.
fontes:                                  # renderizado como "## Fontes" no site; não vai pro slide
  - https://exemplo.com
---
```

O corpo alimenta as duas saídas de formas diferentes:

- **Site** recebe o corpo inteiro.
- **Deck** recebe apenas o que estiver entre marcadores. Cada bloco vira um slide:

```md
<!-- slide:center -->
# O gancho, curto o suficiente para caber na tela
<!-- /slide -->

O desenvolvimento fica fora do bloco: contexto, números, argumento. Só o site mostra isso.
```

`<!-- slide:center -->` sobrescreve o layout da seção; `<!-- slide -->` usa o padrão. Uma seção
pode ter zero blocos (só site) ou vários (vários slides).

## Diagramas

Mermaid é o padrão e vive dentro do core, em bloco ` ```mermaid `. O gerador trata cada destino
de um jeito:

- **Slidev**: o bloco passa intacto — mermaid é nativo lá.
- **Site**: `mermaidToDiv()` converte para `<div class="mermaid">` com HTML escapado, porque o
  Expressive Code do Starlight engoliria o fence como bloco de código. A renderização é
  client-side em `tooling/templates/astro/src/components/Head.astro` (override do `<head>` do
  Starlight), que reage a troca de tema via `data-theme`.

Para os poucos diagramas conceituais que Mermaid faz mal, exporte SVG do Excalidraw para
`palestras/<slug>/assets/` — vale a mesma regra da seção seguinte.

## Imagens

Arquivos binários (prints `.png`, `.gif`, SVG, diagramas gerados) ficam em
`palestras/<slug>/assets/` e são **sempre referenciados como `assets/arquivo.png`** no core:

```md
![Chat do agente](assets/chat.png)
<img src="assets/run.gif" class="plain">
```

O gerador reescreve o prefixo para cada saída, porque cada uma serve o arquivo de um lugar:
`/assets/…` no deck (que vira `public/` do Slidev) e `/<slug>/assets/…` no site. Nunca escreva
esses prefixos à mão no core — só `assets/`.

- Imagem em bloco `<!-- slide -->` aparece nas duas saídas; fora do bloco, só no site.
- CSS dos templates limita a altura (`360px`) e põe uma moldura leve. `class="full"` sobe o
  limite (imagem sem título), `class="plain"` tira a moldura (diagrama com fundo transparente).
- Para print ao lado de texto, use os layouts do tema com atributo no marcador:
  `<!-- slide:image-right image=assets/chat.png -->`. Qualquer `chave=valor` no marcador vira
  frontmatter daquele slide; `slide:` no frontmatter da seção serve de default para todos.
- Prints legíveis a 5 metros: recorte a região que importa em vez de mostrar a tela inteira.

## Armadilhas conhecidas

- `tooling/lib/yaml.mjs` é um parser de **subconjunto** de YAML (escalares, mapa aninhado, lista
  de escalares, blocos `|` e `>`). Não há dependência de YAML no projeto. Se o frontmatter
  precisar de algo além disso, o formato do core provavelmente está complexo demais — mas se for
  mesmo necessário, troque por uma lib em vez de esticar o parser. O parser é sem dependências
  de propósito: `npm run gen` funciona em um clone antes do `npm install`.
- Uma linha começando com `---` dentro de um bloco `<!-- slide -->` quebra a separação de slides
  do Slidev. Use `***` para régua horizontal.
- GIF não anima em `npm run slides <slug> export`: o PDF congela o primeiro quadro. Se a
  animação for o argumento do slide, apresente pelo deck, não pelo PDF.
- Starlight ≥ 0.39 não aceita mais `{ label, autogenerate }` no sidebar; tem que ser
  `{ label, items: [{ autogenerate }] }`.
- `resetDir()` preserva `node_modules`, `dist` e `.astro` ao limpar a saída, para não invalidar
  o cache de build a cada `gen`.

## Convenções de conteúdo

- Uma ideia por seção. Passou de ~400 palavras, provavelmente são duas seções.
- Número, benchmark ou afirmação sobre o mercado precisa de `fontes:`. Não invente métricas —
  o site expõe a procedência e a palestra depende dela.
