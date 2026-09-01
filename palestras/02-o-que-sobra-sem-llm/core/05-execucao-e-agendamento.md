---
titulo: Execução e agendamento
resumo: Durabilidade, idempotência e o fato de que agentes são processos longos, não requisições.
notas: |
  Se a plateia for técnica, dá para gastar mais tempo aqui. Perguntar quem já
  reprocessou uma fila e mandou e-mail duplicado.
---

<!-- slide -->
## Um agente não é um request

- Roda por **minutos ou horas**, não milissegundos
- Cai no meio e precisa **retomar**, não recomeçar
- Retry pode **repetir um efeito colateral no mundo real**
- Custo por execução é **alto o bastante para não desperdiçar**
<!-- /slide -->

A primeira arquitetura de quase todo mundo é síncrona: o usuário dispara, o servidor roda o
laço, devolve a resposta. Ela sobrevive até o primeiro timeout de gateway.

O que substitui isso é execução durável: cada passo é persistido, o estado vive fora do
processo, e uma queda retoma do último ponto conhecido em vez de reiniciar. É exatamente o
problema que workflow engines resolvem há duas décadas — e a resposta certa quase sempre é
adotar uma, não escrever a sua.

A parte que não é reaproveitável é a idempotência dos efeitos. Repetir uma chamada de leitura
é grátis; repetir "envia o e-mail" não é. Cada ferramenta precisa declarar se é segura para
retry, e as que não são precisam de chave de idempotência de verdade, carregada pelo passo e
respeitada pelo destino.

Agendamento adiciona a dimensão de que ninguém está olhando. Um agente que roda de madrugada
falha em silêncio, e o custo de uma falha silenciosa que se repete por trinta noites é
diferente do de um erro na cara do usuário.
