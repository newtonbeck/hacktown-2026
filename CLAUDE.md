# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é este repositório

Materiais das palestras do **Newton no Hacktown 2026**. Não é um produto: é um repositório de
conteúdo com três saídas geradas a partir de **uma única fonte da verdade em Markdown**.

As duas palestras:

| Pasta | Título |
| --- | --- |
| `palestras/01-trabalho-invisivel-vendas/` | O trabalho invisível que a IA está tirando das equipes de vendas |
| `palestras/02-o-que-sobra-sem-llm/` | O que sobra quando você tira o LLM do seu agente? |

**Idioma de todo o conteúdo: português do Brasil.** Código, nomes de arquivo e identificadores em
inglês/kebab-case; texto voltado ao público sempre em pt-BR.

## Arquitetura: core → slides → site

O princípio central e a razão de existir da estrutura:

```
palestras/<slug>/core/*.md   ← FONTE DA VERDADE (única)
        ├──► palestras/<slug>/slides/slides.md   (Slidev — apresentação)
        └──► site/                               (Astro Starlight — consulta pós-palestra)
```

Regras que decorrem disso:

- **Nunca edite conteúdo dentro de `slides/` ou `site/`.** Se o texto de uma ideia mudou, ele muda
  em `core/` e as duas saídas reaproveitam. `slides/` e `site/` contêm apresentação/layout, não prosa.
- `core/` é dividido em arquivos numerados por seção (`01-abertura.md`, `02-...`), com frontmatter
  YAML. A numeração define a ordem tanto do deck quanto da navegação do site.
- Slides puxam seções do core via `src:` do Slidev; o site puxa via content loader do Astro apontando
  para `../palestras/*/core`. Ou seja: o mesmo arquivo `.md` é lido por dois consumidores — mudanças
  em frontmatter quebram os dois, verifique ambos.
- Slides não são o core inteiro: um slide mostra o *gancho*, o site mostra o *desenvolvimento*.
  O core carrega os dois níveis; a camada de apresentação escolhe o que expor.

## Stack

- **Slides**: [Slidev](https://sli.dev) — Markdown, Mermaid nativo, modo apresentador, export PDF.
- **Site**: [Astro](https://astro.build) + Starlight — estático, busca via Pagefind.
- **Deploy do site**: Cloudflare (Workers Static Assets ou Pages) via `wrangler`.
- **Diagramas**: Mermaid como padrão (vive no Markdown, versionável, renderiza nos dois destinos).
  Excalidraw só para os 2–3 diagramas conceituais "hero" que Mermaid não expressa bem — exporte
  `.svg` para `palestras/<slug>/assets/`.
- **Workspace**: pnpm workspaces (`site/` e cada `palestras/*/slides/` são pacotes).

## Comandos

> Nada foi instalado ainda. Ao fazer o scaffold, mantenha estes nomes de script para que os comandos
> abaixo continuem válidos.

```bash
pnpm install

# Slides de uma palestra (dev com hot reload em http://localhost:3030)
pnpm --filter slides-01 dev
pnpm --filter slides-01 build         # SPA estática
pnpm --filter slides-01 export        # PDF

# Site de consulta
pnpm --filter site dev
pnpm --filter site build              # gera site/dist
pnpm --filter site preview

# Deploy do site no Cloudflare
pnpm --filter site build && npx wrangler deploy
```

## Convenções de conteúdo

- Uma ideia por seção de `core/`; se uma seção passa de ~400 palavras, ela provavelmente são duas.
- Blocos de código e diagramas Mermaid ficam no `core/` — nunca duplicados no deck.
- Números, benchmarks e afirmações sobre produto precisam de fonte no frontmatter da seção
  (`sources:`). O site expõe isso; o slide não. Não invente métricas.
- Notas do apresentador ficam no deck (`<!-- -->` do Slidev), não no core — são efêmeras da fala.
