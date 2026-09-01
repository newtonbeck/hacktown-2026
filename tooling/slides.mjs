#!/usr/bin/env node
/**
 * Runner dos decks: `npm run slides <palestra> [dev|build|export]`.
 * <palestra> aceita o slug inteiro ou só o prefixo numérico (`01`).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, PALESTRAS_DIR } from './lib/core.mjs';

const [query, command = 'dev', ...rest] = process.argv.slice(2);

const slugs = fs.readdirSync(PALESTRAS_DIR, { withFileTypes: true })
  .filter((e) => e.isDirectory()).map((e) => e.name).sort();

if (!query) {
  console.error(`uso: npm run slides <palestra> [dev|build|export]\npalestras: ${slugs.join(', ')}`);
  process.exit(1);
}

const matches = slugs.filter((s) => s === query || s.startsWith(`${query}-`) || s.includes(query));
if (matches.length !== 1) {
  console.error(matches.length ? `"${query}" é ambíguo: ${matches.join(', ')}` : `"${query}" não encontrado. Disponíveis: ${slugs.join(', ')}`);
  process.exit(1);
}

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: ROOT, shell: process.platform === 'win32' });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

run('node', [path.join(ROOT, 'tooling', 'generate.mjs')]);

const entry = path.join('slides', matches[0], 'slides.md');
const args = command === 'dev' ? [entry] : [command, entry];
if (command === 'export') args.push('--output', path.join('slides', matches[0], `${matches[0]}.pdf`));
run('slidev', [...args, ...rest]);
