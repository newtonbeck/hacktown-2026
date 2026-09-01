/**
 * Parser de um subconjunto de YAML — suficiente para o frontmatter usado em
 * palestras/<slug>/core/*.md e palestras/<slug>/palestra.yaml.
 *
 * Suporta: escalares, mapas aninhados, listas de escalares e blocos literais (`|`).
 * Não suporta: âncoras, listas de mapas, JSON inline. Se precisar disso, o formato
 * do core provavelmente está complexo demais.
 */

const scalar = (raw) => {
  const v = raw.trim().replace(/\s+#.*$/, '').trim();
  if (/^"(.*)"$/.test(v) || /^'(.*)'$/.test(v)) return v.slice(1, -1);
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === 'null' || v === '~' || v === '') return null;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
};

const indentOf = (line) => line.search(/\S/);

function parseBlock(lines, start, indent, out) {
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || /^\s*#/.test(line)) { i++; continue; }
    const ind = indentOf(line);
    if (ind < indent) break;

    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line.trim());
    if (!match) { i++; continue; }
    const [, key, rest] = match;

    if (rest === '|' || rest === '|-' || rest === '>') {
      const buf = [];
      let base = null;
      i++;
      while (i < lines.length) {
        const l = lines[i];
        if (!l.trim()) { buf.push(''); i++; continue; }
        if (indentOf(l) <= ind) break;
        base ??= indentOf(l);
        buf.push(l.slice(base));
        i++;
      }
      const text = buf.join('\n').replace(/\s+$/, '');
      // `>` dobra as quebras em espaço; `|` preserva.
      out[key] = rest === '>' ? text.replace(/\s*\n\s*/g, ' ') : text;
      continue;
    }

    if (rest !== '') { out[key] = scalar(rest); i++; continue; }

    let j = i + 1;
    while (j < lines.length && !lines[j].trim()) j++;
    if (j >= lines.length || indentOf(lines[j]) <= ind) { out[key] = null; i++; continue; }

    if (lines[j].trim().startsWith('- ')) {
      const arr = [];
      i = j;
      while (i < lines.length) {
        const l = lines[i];
        if (!l.trim()) { i++; continue; }
        if (indentOf(l) <= ind || !l.trim().startsWith('- ')) break;
        arr.push(scalar(l.trim().slice(2)));
        i++;
      }
      out[key] = arr;
      continue;
    }

    const child = {};
    i = parseBlock(lines, j, indentOf(lines[j]), child);
    out[key] = child;
  }
  return i;
}

export function parseYaml(text) {
  const out = {};
  parseBlock(text.split(/\r?\n/), 0, 0, out);
  return out;
}

export function parseFrontmatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/.exec(raw);
  if (!m) return { data: {}, body: raw };
  return { data: parseYaml(m[1]), body: raw.slice(m[0].length) };
}

const needsQuote = (s) => /[:#\-{}\[\]&*!|>'"%@`]|^\s|\s$/.test(s);

/** Serializa um escalar para frontmatter YAML de saída. */
export function yamlScalar(value) {
  if (value == null) return "''";
  if (typeof value !== 'string') return String(value);
  return needsQuote(value) ? `'${value.replace(/'/g, "''")}'` : value;
}
