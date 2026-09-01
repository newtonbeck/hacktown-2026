---
titulo: Encerramento
resumo: O que fazer com essa constatação ao voltar para o próprio código.
notas: |
  Terminar na frase do slide. Não adicionar nada depois.
---

<!-- slide:center -->
# O LLM é a parte fácil

O produto é o harness.

E o harness você já sabe construir.
<!-- /slide -->

Duas recomendações concretas para quem está no meio disso.

A primeira é tratar o modelo como uma dependência substituível desde o primeiro dia. Se trocar
de provedor exige mexer em mais de um lugar do sistema, a fronteira está no lugar errado — e
essa fronteira vai ser testada, porque o mercado de modelos ainda vai se mover muito.

A segunda é parar de escrever do zero o que já existe. Fila, workflow durável, tracing,
metering e autorização são categorias maduras, com implementações boas e baratas. O tempo
economizado aí é o único tempo que sobra para trabalhar no que realmente diferencia o produto —
que quase nunca é o laço do agente.
