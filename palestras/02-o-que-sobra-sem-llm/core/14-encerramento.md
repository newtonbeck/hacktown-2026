---
titulo: Encerramento
resumo: Quatro recomendações para quem está no meio disso, e a frase final.
slide:
  layout: default
notas: |
  Terminar na frase do slide de fechamento. Não adicionar nada depois. Abrir
  para perguntas — 15 minutos.
---

## Se eu fosse começar hoje

1. **Não faça fork do agente.** Coloque o que é seu ao lado dele — sidecar, proxy, volume. O agente vai ser trocado; o harness fica.
2. **Source of truth fora do agente desde o dia 1.** Chat, playbooks, runs, custo: tudo no banco. O disco do agente é cache.
3. **Cobre em dólar, não em token.** Ninguém que compra sabe o que é um token.
4. **Feche antes de abrir.** Sem endpoint, sem download, e só depois decida o que publicar e por onde.

A primeira recomendação é a que mais economizou tempo. Trocamos de arquitetura de agente uma vez
(loop próprio → OpenClaw) e de forma de operar outra (OpenClaw interno → as a service). O que
sobreviveu às duas trocas foi o harness, porque ele nunca esteve dentro do agente.

A segunda é a que mais evitou incidente. Toda vez que algo importante dependeu de estado que só
existia no container, deu problema. Toda vez que o banco era a verdade e o agente um derivado,
o problema se resolveu com um "delete e baixe de novo".

# O LLM é a parte fácil.

O produto é o harness.

E o harness você já sabe construir.

Se sobrar uma frase desta palestra, que seja essa. O modelo é o componente que muda de nome a
cada seis meses; o que segura o produto de pé é a mesma engenharia de sempre, e ela não vai
envelhecer no próximo release.

<!-- slide:capitulo -->
# Perguntas?
<!-- /slide -->

<!-- slide:center -->
# Obrigado!

**@newtonbeck** no Twitter, no GitHub e no LinkedIn

**terra.joinground.com**
<!-- /slide -->
