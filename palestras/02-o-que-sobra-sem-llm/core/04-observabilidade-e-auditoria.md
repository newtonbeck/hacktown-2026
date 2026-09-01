---
titulo: Observabilidade e auditoria
resumo: Por que log não basta e por que reproduzir uma decisão é um requisito de produto.
notas: |
  Contar o caso do cliente perguntando "por que o agente fez isso" e a gente não
  conseguindo responder. Foi o que forçou o replay.
---

<!-- slide -->
## A pergunta que quebra tudo

> "Por que o agente fez isso?"

Log não responde. Métrica não responde.

Só responde quem guardou **o contexto exato** da decisão.
<!-- /slide -->

Em software determinístico, observabilidade responde a "o que aconteceu". A entrada mais o
código explicam a saída, então basta saber onde quebrou. Em um sistema com um modelo no meio,
a mesma entrada pode produzir saídas diferentes, e "onde quebrou" deixa de ser suficiente.

Isso transforma o trace em um artefato de produto, não de operação. O que precisa estar
guardado é o contexto completo que o modelo viu no momento da decisão: prompt final, conteúdo
recuperado, definição das ferramentas disponíveis, versão do modelo, parâmetros. Sem esse
conjunto, a execução é irreproduzível — e uma execução irreproduzível é indefensável diante de
um cliente, de um auditor ou de um incidente.

Auditoria é o mesmo dado com outro requisito: retenção longa, imutabilidade e um modelo de
acesso próprio. Vale desenhar as duas coisas juntas desde o início, porque tentar extrair
auditoria de um sistema de traces amostrado e com TTL de sete dias não funciona.
