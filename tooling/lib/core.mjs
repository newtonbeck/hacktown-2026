import fs from 'node:fs';
import path from 'node:path';
import { parseYaml, parseFrontmatter } from './yaml.mjs';

export const ROOT = path.resolve(import.meta.dirname, '..', '..');
export const PALESTRAS_DIR = path.join(ROOT, 'palestras');

/**
 * Blocos marcados vão para o deck; todo o corpo vai para o site.
 * Marcador: `<!-- slide:layout chave=valor -->`. Os pares viram frontmatter do
 * slide no Slidev (ex.: `image-right image=assets/chat.png`).
 */
const SLIDE_BLOCK =
  /<!--\s*slide(?::([a-z0-9-]+))?((?:\s+[a-z][\w-]*=[^\s>]+)*)\s*-->\r?\n([\s\S]*?)<!--\s*\/slide\s*-->/g;

const parseAttrs = (raw) =>
  Object.fromEntries(
    (raw ?? '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((pair) => {
        const i = pair.indexOf('=');
        return [pair.slice(0, i), pair.slice(i + 1).replace(/^["']|["']$/g, '')];
      }),
  );

export function extractSlides(body) {
  const slides = [];
  for (const m of body.matchAll(SLIDE_BLOCK)) {
    slides.push({ layout: m[1] || null, attrs: parseAttrs(m[2]), content: m[3].trim() });
  }
  return slides;
}

/** Remove só os marcadores: a prosa do gancho continua fazendo parte da página do site. */
export const stripSlideMarkers = (body) =>
  body.replace(
    /^[ \t]*<!--\s*\/?slide(?::[a-z0-9-]+)?(?:\s+[a-z][\w-]*=[^\s>]+)*\s*-->[ \t]*\r?\n?/gm,
    '',
  );

/**
 * No core a imagem é sempre `assets/arquivo.png`. Cada saída serve o arquivo de
 * um lugar diferente — `/assets/` no deck (public do Slidev), `/<slug>/assets/`
 * no site — então o gerador reescreve o prefixo na hora de emitir.
 */
const ASSET_REF = /(\]\(|\bsrc=["']|\bposter=["'])assets\//g;
export const rewriteAssets = (text, prefix) => text.replace(ASSET_REF, (_, lead) => lead + prefix);

/** Mesma reescrita, para valor solto (atributo do marcador, `image=assets/x.png`). */
export const assetPath = (value, prefix) =>
  typeof value === 'string' && value.startsWith('assets/')
    ? prefix + value.slice('assets/'.length)
    : value;

export function readPalestras() {
  if (!fs.existsSync(PALESTRAS_DIR)) return [];
  return fs
    .readdirSync(PALESTRAS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()
    .map((slug) => {
      const dir = path.join(PALESTRAS_DIR, slug);
      const metaPath = path.join(dir, 'palestra.yaml');
      if (!fs.existsSync(metaPath)) throw new Error(`Falta ${path.relative(ROOT, metaPath)}`);
      const meta = parseYaml(fs.readFileSync(metaPath, 'utf8'));

      const coreDir = path.join(dir, 'core');
      const sections = fs
        .readdirSync(coreDir)
        .filter((f) => f.endsWith('.md'))
        .sort()
        .map((file, index) => {
          const { data, body } = parseFrontmatter(fs.readFileSync(path.join(coreDir, file), 'utf8'));
          if (!data.titulo) throw new Error(`${slug}/core/${file}: frontmatter sem \`titulo\``);
          return {
            id: file.replace(/\.md$/, ''),
            order: index + 1,
            data,
            body: body.trim(),
            slides: extractSlides(body),
          };
        });

      return { slug, dir, meta, sections };
    });
}
