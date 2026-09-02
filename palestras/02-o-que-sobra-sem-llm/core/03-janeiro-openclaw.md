---
titulo: Janeiro de 2026 — OpenClaw
resumo: Enquanto a v1 ia para clientes, um projeto open source de um desenvolvedor austríaco virava o repositório mais estrelado do GitHub. Decidimos não competir com ele.
slide:
  layout: default
notas: |
  A linha do tempo é o argumento: o repo nasceu duas semanas antes da nossa
  reunião de dezembro e explodiu na mesma semana em que soltamos a v1. Contar a
  decisão com honestidade: manter o loop próprio era competir com 80 mil forks.
  Mencionar a nomenclatura (Clawdis → Clawdbot → Moltbot → OpenClaw) como piada
  rápida, sem gastar tempo.
fontes:
  - https://github.com/openclaw/openclaw
  - https://docs.openclaw.ai/concepts/architecture
  - https://docs.openclaw.ai/concepts/memory
  - https://docs.openclaw.ai/tools/skills
  - https://simonwillison.net/2026/May/16/openclaw-names/
  - https://news.ycombinator.com/item?id=46760237
  - https://www.forbes.com/sites/ronschmelzer/2026/01/30/moltbot-molts-again-and-becomes-openclaw-pushback-and-concerns-grow/
  - https://steipete.me/posts/2026/openclaw
  - https://github.blog/open-source/maintainers/openclaw-went-viral-meet-the-maintainers-building-and-securing-it/
  - https://en.wikipedia.org/wiki/OpenClaw
---

<!-- slide -->
## Duas linhas do tempo

| | Ground | OpenClaw |
| --- | --- | --- |
| 24 nov 2025 | | repo criado — "Warelay", um relay de WhatsApp |
| 8 dez 2025 | três demos, discussão de arquitetura | vira "Clawdis", gateway de WhatsApp para agentes |
| jan 2026 | **v1 nos primeiros clientes** | "Clawdbot" · HN front page em 26/01 |
| 27–30 jan | | Moltbot → **OpenClaw** |
| fev 2026 | experimentos com OpenClaw interno | ~200 mil estrelas; criador vai para a OpenAI, projeto vira fundação |
| mar 2026 | **decisão: OpenClaw as a service** | ultrapassa o React como repo mais estrelado |
<!-- /slide -->

Quando fizemos a reunião de dezembro, o OpenClaw tinha duas semanas de vida e outro nome. Quando
a v1 chegou aos clientes, ele estava na primeira página do Hacker News. Em março, era o
repositório mais estrelado do GitHub. Hoje, 388 mil estrelas e 81 mil forks.

<!-- slide -->
## O que é o OpenClaw, em um slide

- Agente pessoal **self-hosted**, MIT, TypeScript — criado por Peter Steinberger (PSPDFKit)
- **Gateway**: um daemon, fonte da verdade de sessões e roteamento
- **Channels**: WhatsApp, Telegram, Slack, Discord… ou o seu
- **Memória em Markdown no disco** — "o modelo só lembra o que foi salvo em arquivo"
- **Skills**: pastas com `SKILL.md`, instaláveis do ClawHub
- Agnóstico de modelo: Anthropic, OpenAI, Gemini, Bedrock, locais…
<!-- /slide -->

Três coisas nesse desenho importam para o resto da palestra. O *channel* é uma abstração de
entrada plugável — dá para escrever o seu. A memória e as skills são **arquivos**, o que tem
consequências para deploy e persistência. E ele é feito para rodar sozinho, para uma pessoa, na
máquina dela — não para rodar para cinquenta empresas em um cluster.

<!-- slide -->
## A decisão

Manter o loop próprio era competir com 80 mil forks em cima de um problema que não é o nosso.

**O que é nosso:** playbooks compartilhados, conexões do e-commerce, multi-tenant, billing, auditoria.

**O que não é:** o loop, a memória, o formato de skill, o protocolo de tool call.

***

Rodamos um OpenClaw interno. Funcionou. Decidimos oferecer **OpenClaw as a service** — e o resto da palestra é o que foi preciso construir para isso.
<!-- /slide -->

O OpenClaw não era um produto para nossos clientes. Era um agente pessoal, feito para o
desenvolvedor rodar na própria máquina, com o próprio terminal e a própria chave de API. Tinha
buracos de segurança conhecidos, um ecossistema de skills com malware e nenhuma noção de
"empresa". Mas o núcleo — o loop, a memória, as skills, os channels — era melhor e evoluía mais
rápido do que o nosso jamais evoluiria.

A decisão foi tratar o OpenClaw como um componente: **não fazer fork**, não mexer dentro, e
construir tudo o que faltava ao redor. Essa restrição — mexer só ao redor — é o que deu forma a
todo o harness. Ela é o motivo de existirem sidecars, proxies e uma task de deploy, e não patches.
