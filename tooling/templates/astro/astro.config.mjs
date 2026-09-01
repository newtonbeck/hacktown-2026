// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const palestras = JSON.parse(
  readFileSync(new URL('./palestras.json', import.meta.url), 'utf8'),
);

export default defineConfig({
  site: 'https://hacktown-2026.workers.dev',
  outDir: './dist',
  integrations: [
    starlight({
      title: 'Hacktown 2026',
      description: 'Material das palestras de Newton no Hacktown 2026',
      defaultLocale: 'root',
      locales: { root: { label: 'Português', lang: 'pt-BR' } },
      customCss: ['./src/styles/custom.css'],
      components: { Head: './src/components/Head.astro' },
      pagination: true,
      sidebar: palestras.map((p) => ({
        label: p.curto,
        items: [{ autogenerate: { directory: p.slug } }],
      })),
    }),
  ],
});
