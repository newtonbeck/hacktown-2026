---
titulo: Tire o LLM do seu agente
resumo: A pergunta que dá título à palestra e o que ela vai e não vai cobrir.
slide:
  layout: default
notas: |
  Abrir devagar. Deixar a pergunta do primeiro slide no ar uns segundos antes de
  avançar. Avisar: palestra avançada, vamos entrar em arquitetura de verdade,
  15 min de perguntas no final — anotem.
---

<!-- slide:center -->
# Tire o LLM do seu agente.

O que sobra ainda é um sistema?

Quanto do seu código você teria que jogar fora?
<!-- /slide -->

Essa é a pergunta que organiza a palestra. A resposta curta, no nosso caso, é: sobra quase tudo.
O modelo é uma chamada de função no meio de um sistema que tem fila, deploy, volume persistente,
proxy, banco de dados, webhook, tabela de preços e log. Nada disso sabe o que é um token.

<!-- slide -->
## O que vamos ver

1. **A história** — de dezembro de 2025 até hoje: v1 própria, OpenClaw, OpenClaw as a service
2. **O harness, peça por peça** — chat, deploy, skills, conexões, execução, billing, segurança, observabilidade
3. **A tese** — nada disso é novo; é engenharia de software dos últimos 20 anos com um componente não determinístico no meio

*Palestra avançada. Vamos falar de ECS, SQS, sidecar, proxy e banco de dados. 15 minutos para perguntas no final.*
<!-- /slide -->

O que esta palestra **não** é: um tutorial de prompt, uma comparação de modelos ou uma defesa de
um framework. É o relato de um time pequeno que, ao construir um agente para clientes pagantes,
descobriu que a maior parte do trabalho estava em lugares que já conhecia de outros sistemas.

A palavra que vamos usar para "tudo ao redor do modelo" é **harness**: o arreio que prende um
componente imprevisível a um sistema que precisa ser previsível. Quem trabalha com sistemas
distribuídos vai reconhecer cada peça.
