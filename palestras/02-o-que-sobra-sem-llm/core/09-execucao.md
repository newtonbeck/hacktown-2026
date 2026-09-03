---
titulo: Execução
resumo: Três gatilhos — Run, Schedule e webhook — e um único mecanismo: uma system message entregue ao agente.
slide:
  layout: default
notas: |
  Ponto-chave: não inventamos um "executor de playbooks". Todo gatilho vira uma
  mensagem na mesma fila do chat, só que de sistema. Um caminho de entrada só,
  três origens. Isso simplificou muito o debug.
---

<!-- slide:capitulo -->
# Execução, agendamento e logs
<!-- /slide -->

<!-- slide -->
## Três gatilhos, um mecanismo

| Gatilho | Quem dispara | O que chega no agente |
| --- | --- | --- |
| **Run** | usuário clica no playbook | system message |
| **Schedule** | agendador, via `schedule_update` | system message |
| **Webhook** | evento externo (pedido no Shopify, novo lead…) | system message + payload |

*Mesma fila, mesmo sidecar, mesmo channel do chat.*
<!-- /slide -->

Um playbook precisa poder ser executado de três formas: à mão, no relógio e em reação a um evento
de fora. A tentação é construir três subsistemas. Nós construímos um: todos os gatilhos produzem
uma **system message** — uma mensagem que não veio de um humano, mas que entra pelo mesmo channel
e é processada pelo mesmo agente.

Isso significa que o agente não distingue "o usuário pediu" de "o cron pediu" na infraestrutura;
a distinção está no conteúdo da mensagem e no contexto que ela carrega (qual playbook, qual
gatilho, qual payload). Toda a máquina de fila, sidecar e callbacks descrita na seção do chat é
reaproveitada sem uma linha nova.

<!-- slide -->
## O agendamento é um evento como outro qualquer

- O schedule é salvo no backend, junto com o playbook
- Alterou o horário → evento `schedule_update` → sidecar de materialização atualiza o agente
- Na hora certa, o backend publica a system message na fila da empresa
- O agente não tem cron. Ele tem uma fila.
<!-- /slide -->

Tirar o relógio de dentro do agente foi uma decisão deliberada. Se o cron vivesse no container,
um redeploy no meio da noite pularia uma execução e ninguém saberia. Com o agendador no backend,
o disparo é um registro no banco, tem retry e tem log — e se o agente estiver fora, a mensagem
espera na fila.

Webhooks seguem o mesmo caminho: o evento externo bate no backend, o backend identifica o
playbook inscrito naquele evento e publica a system message com o payload. O agente recebe
"chegou um pedido novo, aqui está o JSON, execute o playbook X".
