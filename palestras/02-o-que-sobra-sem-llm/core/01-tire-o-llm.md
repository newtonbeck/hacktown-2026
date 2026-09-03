---
titulo: Tire o LLM do seu agente
resumo: A pergunta que dá título à palestra e o que ela vai e não vai cobrir.
slide:
  layout: default
notas: |
  O slide do HackTown é regra da organização: mostrar e seguir. Na apresentação
  pessoal, não recitar o currículo — dizer só o suficiente para a plateia saber
  de onde vem o que vai ser contado. Depois, a agenda.
  Nos slides da Ground, não vender: é contexto. O ponto a plantar é que os três
  produtos são modelos pequenos, não LLM — o agente é o primeiro imprevisível.
---

O que sobra ainda é um sistema? Quanto do seu código você teria que jogar fora?

Essa é a pergunta que organiza a palestra. A resposta curta, no nosso caso, é: sobra quase tudo.
O modelo é uma chamada de função no meio de um sistema que tem fila, deploy, volume persistente,
proxy, banco de dados, webhook, tabela de preços e log. Nada disso sabe o que é um token.

<!-- slide:image image=assets/hacktown-apartidario.png backgroundSize=contain -->
<!-- /slide -->

<!-- slide -->
## Newton Beck

**@newtonbeck** no Twitter, no GitHub e no LinkedIn

- +15 anos construindo software
- **Elo7** e **Nubank**, no Brasil
- **Personio** e **Perspective**, na Alemanha
- Hoje: engenharia na **Ground**, em Nova York
<!-- /slide -->

<!-- slide -->
## O que vamos ver

1. **A Ground** — quem somos e o que fazemos
2. **A história** — de dezembro de 2025 até hoje: v1 própria, OpenClaw, OpenClaw as a service
3. **O harness, peça por peça** — deploy, chat, conexões, playbooks/execução/auditoria, billing e segurança
4. **A tese** — nada disso é novo; é engenharia de software dos últimos 20 anos com um componente não determinístico no meio
<!-- /slide -->

<!-- slide:image image=assets/ground-landing.png -->
<!-- /slide -->

<!-- slide -->
## A Ground

Empresa de IA em Nova York. Nossos clientes são lojas Shopify.

- **Greet AI** — modelo leve que roda no browser e escolhe o melhor momento de mostrar o pop-up de oferta em troca do e-mail do visitante
- **ReCartify** — identificação do visitante para disparar fluxos de abandono de busca, de carrinho e de compra
- **ReBeat AI** — modelo de predição de compra: sugere o próximo produto para quem já comprou na loja
<!-- /slide -->

Repare que nenhum dos três é um LLM. São modelos pequenos, treinados para uma tarefa, medidos em
receita atribuída. É o tipo de IA que a Ground já vendia antes de existir agente nenhum — e é bom
ter isso em mente, porque a palestra inteira é sobre o que precisou ser construído quando o
componente no meio deixou de ser previsível.

O agente entra depois, como um quarto produto: em vez de rodar dentro da loja, ele trabalha ao
lado do time que opera a loja. Isso importa para a palestra porque cada decisão de arquitetura que
vamos ver foi tomada com cliente pagante esperando do outro lado: não dava para quebrar uma loja
em produção para testar uma ideia de harness.

O que esta palestra **não** é: um tutorial de prompt, uma comparação de modelos ou uma defesa de
um framework. É o relato de um time pequeno que, ao construir um agente para clientes pagantes,
descobriu que a maior parte do trabalho estava em lugares que já conhecia de outros sistemas.

A palavra que vamos usar para "tudo ao redor do modelo" é **harness**: o arreio que prende um
componente imprevisível a um sistema que precisa ser previsível. Quem trabalha com sistemas
distribuídos vai reconhecer cada peça.
