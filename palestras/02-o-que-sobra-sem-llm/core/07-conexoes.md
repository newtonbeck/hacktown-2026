---
titulo: Conexões
resumo: Um agente vale pelas ferramentas que alcança — Playwright para o browser, Pipedream para 3 mil apps e as nossas próprias tools para o que importa ao ICP.
slide:
  layout: default
notas: |
  Seção curta. A ideia: não construa integração, compre a cauda longa e construa
  só a cabeça. #fikdik do Pipedream. Mencionar que nosso ICP (Shopify, Klaviyo,
  Attentive, Postscript) já tinha tools internas da v1 — reaproveitadas.
fontes:
  - https://pipedream.com/connect
  - https://pipedream.com/docs/connect/mcp/developers
  - https://newsroom.workday.com/2025-11-19-Workday-Signs-Definitive-Agreement-to-Acquire-Pipedream
  - https://playwright.dev/
---

<!-- slide:capitulo -->
# Conexões
<!-- /slide -->

<!-- slide:image image=assets/conexoes-ui.png backgroundSize=contain -->
<!-- /slide -->

<!-- slide -->
## Um agente vale pelas ferramentas que alcança

| Camada | O quê | Por quê |
| --- | --- | --- |
| **Browser** | Playwright | o que não tem API |
| **Cauda longa** | Pipedream Connect — 3.000+ apps via MCP | não vamos escrever 3 mil integrações |
| **Cabeça** | tools internas: Shopify, Klaviyo, Attentive, Postscript | é o nosso ICP; controle total |

*#fikdik: Pipedream Connect. Auth gerenciada por usuário final, proxy para a API bruta e um servidor MCP remoto.*
<!-- /slide -->

O OpenClaw sozinho conversa. Para trabalhar, precisa alcançar sistemas. Organizamos isso em
três camadas, em ordem crescente de esforço nosso.

A primeira é o **browser**. O agente tem um Playwright à disposição para o que não tem API — um
painel antigo, um relatório que só existe em uma tela. É a ferramenta de último recurso, e a mais
perigosa do ponto de vista de injeção de instruções, porque o agente lê páginas que não
controlamos.

A segunda é a **cauda longa**. Nenhum time pequeno vai escrever integrações para Google Drive,
Notion, HubSpot, Gmail, Slack e mais três mil serviços. O Pipedream Connect faz isso: autenticação
OAuth gerenciada por usuário final, ações e triggers prontos, e um servidor MCP remoto que o
agente consome direto. Em uma tarde, o agente passou a alcançar mais de três mil aplicações.
(O Pipedream foi comprado pela Workday em dezembro de 2025 — vale acompanhar o que muda.)

A terceira é a **cabeça**: as ferramentas para o que os nossos clientes realmente usam todo dia.
O ICP da Ground são e-commerces em Shopify que fazem marketing em Klaviyo, Attentive e Postscript.
Nós já tínhamos tools para essas quatro desde antes do agente — foram elas que alimentaram a v1
de dezembro — e para elas mantemos as nossas: controle de escopo, de rate limit e de erro fino,
porque é aí que o agente gasta a maior parte do tempo.

A regra prática: compre a cauda longa, construa só a cabeça, e deixe o browser para o resto.

<!-- slide:image image=assets/connection-seo.png backgroundSize=contain -->
<!-- /slide -->
