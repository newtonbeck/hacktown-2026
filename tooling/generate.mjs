#!/usr/bin/env node
/**
 * Gera slides/ e site/ a partir de palestras/<slug>/core/*.md.
 * Ambos os diretórios são descartáveis e estão no .gitignore: este script é a
 * única coisa autorizada a escrever neles.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, readPalestras, stripSlideMarkers, rewriteAssets, assetPath } from './lib/core.mjs';
import { yamlScalar } from './lib/yaml.mjs';

const TEMPLATES = path.join(ROOT, 'tooling', 'templates');
/** Prefixo público dos arquivos de `palestras/<slug>/assets/` em cada saída. */
const DECK_ASSETS = '/assets/';
const siteAssets = (slug) => `/${slug}/assets/`;
const SLIDES_OUT = path.join(ROOT, 'slides');
const SITE_OUT = path.join(ROOT, 'site');

const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.endsWith('\n') ? content : `${content}\n`);
};

/** Limpa a saída preservando node_modules/dist/cache para não invalidar o build. */
const resetDir = (dir, keep = []) => {
  if (fs.existsSync(dir)) {
    for (const entry of fs.readdirSync(dir)) {
      if (keep.includes(entry)) continue;
      fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
    }
  }
  fs.mkdirSync(dir, { recursive: true });
};

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Expressive Code (Starlight) engoliria o bloco ```mermaid como código.
 * Convertemos para <div class="mermaid">, que o Head.astro renderiza no cliente.
 * No Slidev o bloco fica intacto — lá o mermaid é nativo.
 *
 * O bloco pode trazer opções do Slidev na linha da cerca (```mermaid {scale: 0.6}),
 * que só fazem sentido no deck: o SVG do mermaid nasce dentro de um shadow root e
 * o CSS de fora não o alcança, então `scale` é o único jeito de caber na altura do
 * slide. Aqui elas são descartadas.
 */
const mermaidToDiv = (body) =>
  body.replace(/^```mermaid[^\n]*\r?\n([\s\S]*?)^```[ \t]*$/gm,
    (_, code) => `<div class="mermaid">\n${escapeHtml(code.trimEnd())}\n</div>`);

// ---------------------------------------------------------------- slides

/** Templates específicos de um deck (`tooling/templates/slidev-<slug>/`), copiados por cima dos compartilhados. */
const deckTemplates = (slug) => path.join(TEMPLATES, `slidev-${slug}`);

/**
 * `<!-- slide -->` sem layout deixa o gerador escolher pelo conteúdo, quando o tema
 * do deck tem um layout para aquele tipo de slide (diagrama, código, imagem, título
 * ou lista). Marcador explícito (`capitulo`, `image`, `image-right`…) vence; sem
 * tema próprio, fica o layout do Slidev.
 */
function inferLayout(content) {
  if (/^```mermaid/m.test(content)) return 'diagrama';
  if (/^```/m.test(content)) return 'codigo';
  if (/<img\b|!\[/.test(content)) return 'imagem';
  if (/^# /m.test(content)) return 'titulo';
  return 'lista';
}

function resolveLayout(overlay, layout, content) {
  if (layout !== 'default' && layout !== 'center') return layout;
  const inferred = inferLayout(content);
  return fs.existsSync(path.join(overlay, 'layouts', `${inferred}.vue`)) ? inferred : layout;
}

/** `## Título: complemento` vira título + linha menor, como no template de diagrama do Figma. */
const splitSubtitle = (content) =>
  content.replace(/^## (.+?): (.+)$/m, (_, titulo, resto) => `## ${titulo}\n\n<p class="subtitulo">${resto}</p>`);

function generateSlides(palestras) {
  resetDir(SLIDES_OUT, ['node_modules']);

  for (const p of palestras) {
    const deckDir = path.join(SLIDES_OUT, p.slug);
    const lines = [];

    lines.push('---');
    lines.push('theme: default');
    lines.push(`title: ${yamlScalar(p.meta.titulo)}`);
    lines.push(`info: ${yamlScalar(p.meta.resumo ?? '')}`);
    lines.push(`author: ${yamlScalar(p.meta.autor ?? '')}`);
    lines.push('class: text-left');
    lines.push('transition: slide-left');
    lines.push('mdc: true');
    lines.push('drawings:');
    lines.push('  persist: false');
    lines.push('# GERADO por `npm run gen` — edite palestras/' + p.slug + '/core/, não este arquivo.');
    lines.push('layout: cover');
    // `capa:` do palestra.yaml quebra o título em três linhas (a do meio é o destaque)
    // e escolhe o sinal gigante ao fundo. Sem `capa:`, a capa é só o título.
    const capa = p.meta.capa ?? {};
    if (capa.pontuacao) lines.push(`pontuacao: ${yamlScalar(String(capa.pontuacao))}`);
    lines.push('---');
    lines.push('');
    if (capa.destaque) {
      if (capa.antes) lines.push(`<p class="capa-antes">${capa.antes}</p>`, '');
      lines.push(`# ${capa.destaque}`);
      if (capa.depois) lines.push('', `<p class="capa-depois">${capa.depois}</p>`);
    } else {
      lines.push(`# ${p.meta.titulo}`);
    }
    // O `resumo` fica só no `info:` (painel do apresentador) e no site: um parágrafo
    // inteiro na capa não se lê a cinco metros.
    const assinatura = [p.meta.autor, [p.meta.data, p.meta.evento].filter(Boolean).join(' ')]
      .filter(Boolean);
    if (assinatura.length) {
      lines.push('', `<div class="capa-assinatura">${assinatura.map((l) => `<span>${l}</span>`).join('')}</div>`);
    }

    const overlay = deckTemplates(p.slug);
    let count = 0;
    for (const section of p.sections) {
      // `slide:` da seção vira default; o marcador do bloco sobrescreve chave a chave.
      const { layout: sectionLayout, ...sectionAttrs } = section.data.slide ?? {};
      for (const slide of section.slides) {
        count++;
        lines.push('', '---');
        lines.push(`layout: ${resolveLayout(overlay, slide.layout ?? sectionLayout ?? 'default', slide.content)}`);
        for (const [key, value] of Object.entries({ ...sectionAttrs, ...slide.attrs })) {
          lines.push(`${key}: ${yamlScalar(assetPath(String(value), DECK_ASSETS))}`);
        }
        lines.push('---', '');
        let content = rewriteAssets(slide.content, DECK_ASSETS);
        if (fs.existsSync(overlay)) content = splitSubtitle(content);
        lines.push(content);
        if (section.data.notas) {
          lines.push('', '<!--', rewriteAssets(section.data.notas, DECK_ASSETS), '-->');
        }
      }
    }

    write(path.join(deckDir, 'slides.md'), lines.join('\n'));
    fs.cpSync(path.join(TEMPLATES, 'slidev'), deckDir, { recursive: true });
    // Tema próprio do deck, se houver: sobrepõe arquivo a arquivo o template compartilhado.
    if (fs.existsSync(overlay)) fs.cpSync(overlay, deckDir, { recursive: true });
    // Slidev serve `public/` do diretório do slides.md na raiz da URL.
    const deckAssets = path.join(p.dir, 'assets');
    if (fs.existsSync(deckAssets)) {
      fs.cpSync(deckAssets, path.join(deckDir, 'public', 'assets'), { recursive: true });
    }
    console.log(`slides/${p.slug}/slides.md  (${count} slides de ${p.sections.length} seções)`);
  }
}

// ------------------------------------------------------------------ site

function sitePage({ title, description, order, body }) {
  const fm = ['---', `title: ${yamlScalar(title)}`];
  if (description) fm.push(`description: ${yamlScalar(description)}`);
  if (order != null) fm.push('sidebar:', `  order: ${order}`);
  fm.push('---', '', '');
  return fm.join('\n') + body;
}

function generateSite(palestras) {
  resetDir(SITE_OUT, ['node_modules', 'dist', '.astro']);
  fs.cpSync(path.join(TEMPLATES, 'astro'), SITE_OUT, { recursive: true });

  const docs = path.join(SITE_OUT, 'src', 'content', 'docs');

  const index = [
    'Material de apoio das palestras. Cada palestra tem aqui o conteúdo completo —',
    'incluindo o que não coube nos slides.',
    '',
    ...palestras.flatMap((p) => [
      `## [${p.meta.titulo}](/${p.slug}/)`,
      '',
      p.meta.resumo ?? '',
      '',
    ]),
  ].join('\n');
  write(path.join(docs, 'index.md'), sitePage({
    title: palestras[0]?.meta.evento ?? 'Palestras',
    description: 'Material das palestras',
    body: index,
  }));

  for (const [i, p] of palestras.entries()) {
    const overview = [
      p.meta.resumo ?? '',
      '',
      '## Nesta palestra',
      '',
      ...p.sections.map((s) => `- [${s.data.titulo}](/${p.slug}/${s.id}/)`),
    ].join('\n');
    write(path.join(docs, p.slug, 'index.md'), sitePage({
      title: p.meta.titulo,
      description: p.meta.resumo,
      order: 0,
      body: overview,
    }));

    for (const s of p.sections) {
      let body = mermaidToDiv(rewriteAssets(stripSlideMarkers(s.body), siteAssets(p.slug)));
      if (Array.isArray(s.data.fontes) && s.data.fontes.length) {
        body += ['', '', '## Fontes', '',
          ...s.data.fontes.map((f) =>
            /^https?:\/\//.test(f) ? `- <${f}>` : `- ${f}`)].join('\n');
      }
      write(path.join(docs, p.slug, `${s.id}.md`), sitePage({
        title: s.data.titulo,
        description: s.data.resumo,
        order: s.order,
        body,
      }));
    }

    const assets = path.join(p.dir, 'assets');
    if (fs.existsSync(assets)) {
      fs.cpSync(assets, path.join(SITE_OUT, 'public', p.slug, 'assets'), { recursive: true });
    }
    console.log(`site/src/content/docs/${p.slug}/  (${p.sections.length} páginas)${i === palestras.length - 1 ? '' : ''}`);
  }

  write(path.join(SITE_OUT, 'palestras.json'), JSON.stringify(
    palestras.map((p) => ({ slug: p.slug, titulo: p.meta.titulo, curto: p.meta.titulo_curto ?? p.meta.titulo })),
    null, 2));
}

// ------------------------------------------------------------------ main

let palestras;
try {
  palestras = readPalestras();
} catch (err) {
  console.error(`\nerro: ${err.message}\n`);
  process.exit(1);
}
if (!palestras.length) {
  console.error('Nenhuma palestra em palestras/. Nada a gerar.');
  process.exit(1);
}
generateSlides(palestras);
generateSite(palestras);
console.log(`\n${palestras.length} palestras geradas.`);
