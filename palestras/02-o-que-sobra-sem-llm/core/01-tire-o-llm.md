---
titulo: Tire o LLM do seu agente
resumo: A pergunta que dá título à palestra e o que ela vai e não vai cobrir.
slide:
  layout: default
notas: |
  Abrir pela agenda, sem slide de gancho: a pergunta do título já está na capa.
  No slide da Ground, uma frase: o que o agente faz para o cliente. Não vender —
  é contexto para o resto da palestra.
---

O que sobra ainda é um sistema? Quanto do seu código você teria que jogar fora?

Essa é a pergunta que organiza a palestra. A resposta curta, no nosso caso, é: sobra quase tudo.
O modelo é uma chamada de função no meio de um sistema que tem fila, deploy, volume persistente,
proxy, banco de dados, webhook, tabela de preços e log. Nada disso sabe o que é um token.

<!-- slide -->
## O que vamos ver

1. **A Ground** — quem somos e o que o nosso agente faz
2. **A história** — de dezembro de 2025 até hoje: v1 própria, OpenClaw, OpenClaw as a service
3. **O harness, peça por peça** — deploy, chat, conexões, playbooks/execução/auditoria, billing e segurança
4. **A tese** — nada disso é novo; é engenharia de software dos últimos 20 anos com um componente não determinístico no meio
<!-- /slide -->

<!-- slide:image image=assets/ground-landing.png -->
<!-- /slide -->

## A Ground

**AI Revenue Agents for Commerce.** Um agente de IA que trabalha para times de e-commerce, dentro
das ferramentas que o time já usa: Shopify, Klaviyo, Attentive, Postscript. Com clientes pagantes
desde o primeiro dia — o que muda tudo no que vem a seguir.

A Ground existe para vender esse agente. Isso importa para a palestra porque cada decisão de
arquitetura que vamos ver foi tomada com cliente esperando do outro lado: não dava para quebrar
uma loja em produção para testar uma ideia de harness.

O que esta palestra **não** é: um tutorial de prompt, uma comparação de modelos ou uma defesa de
um framework. É o relato de um time pequeno que, ao construir um agente para clientes pagantes,
descobriu que a maior parte do trabalho estava em lugares que já conhecia de outros sistemas.

A palavra que vamos usar para "tudo ao redor do modelo" é **harness**: o arreio que prende um
componente imprevisível a um sistema que precisa ser previsível. Quem trabalha com sistemas
distribuídos vai reconhecer cada peça.
