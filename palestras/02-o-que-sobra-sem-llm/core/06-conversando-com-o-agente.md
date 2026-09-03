---
titulo: Conversando com o agente
resumo: Como uma mensagem do front-end chega a um agente que não tem porta aberta para o mundo — e a primeira aparição do sidecar.
slide:
  layout: default
notas: |
  Primeira peça do harness. Insistir: o agente não tem endpoint público. Toda a
  conversa passa por SNS → SQS → sidecar. Aqui nasce o padrão sidecar, que vai
  voltar três vezes. Falar do filtro por company_id na subscription.
fontes:
  - https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html
  - https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html
  - https://learn.microsoft.com/en-us/azure/architecture/patterns/sidecar
---

<!-- slide:capitulo -->
# Chat
<!-- /slide -->

## Regra zero: o agente é fechado para o mundo

- Nenhum endpoint público. Nenhuma porta exposta.
- Toda mensagem entra por um **channel** nosso: mensagem + metadados (empresa, usuário)
- O agente não sabe o que é HTTP de cliente. Ele só lê uma fila.

O OpenClaw tem o conceito de *channel*: a porta por onde mensagens entram (Slack, WhatsApp,
Telegram…). Nós criamos o nosso. Ele não escuta em nenhuma porta pública — é um consumidor de
fila. Isso resolve de uma vez autenticação, isolamento entre empresas e a superfície de ataque:
o agente literalmente não tem como receber uma mensagem que não veio do nosso backend.

<!-- slide:image image=assets/chat-ui.png backgroundSize=contain -->
<!-- /slide -->

<!-- slide -->
## Dois containers, um host

```mermaid
flowchart LR
  subgraph H[Host · uma task ECS]
    direction TB
    A[Container principal<br/>agente OpenClaw]
    S[Container sidecar<br/>código nosso]
    A <-->|localhost| S
    A -.-|disco compartilhado| S
  end
  S <--> I[(Nossa infra<br/>SQS · backend)]
```
<!-- /slide -->

<!-- slide -->
## Conheçam o sidecar

<img src="assets/sidecar.png" alt="Moto com sidecar: o motociclista dirige e o cachorro de goggles vai no sidecar ao lado">
<!-- /slide -->

<!-- slide -->
## Dois containers, um host

Um **segundo container**, no mesmo host e com o mesmo ciclo de vida do agente, que faz o que o
agente não deveria fazer:

- **Fala com a nossa infra** — SQS, backend. O agente não fala.
- **Guarda as credenciais** que o agente não precisa ter
- **Conversa com o agente** por `localhost` ou pelo disco compartilhado
- **É trocado sem mexer** na imagem do agente

***

*O agente fica burro de propósito. O sidecar é quem conhece a casa.*
<!-- /slide -->

Esse é o padrão que vai se repetir na palestra inteira. O OpenClaw é código de terceiros, que
evolui rápido e que não queremos manter um fork. Toda vez que precisamos de um comportamento
que é nosso — consumir fila, sincronizar playbooks, medir tokens — colocamos um processo ao lado,
no mesmo serviço, falando com o agente por localhost ou pelo sistema de arquivos.

O padrão tem nome e página de documentação há uma década: *sidecar*, o mesmo que o Envoy usa em
malhas de serviço ou que agentes de log usam para ler stdout de um container vizinho. Nada aqui
foi inventado; foi reaproveitado.

<!-- slide -->
## O caminho de uma mensagem

```mermaid
sequenceDiagram
  participant FE as Front-end
  participant BE as Backend
  participant SNS as SNS
  participant SQS as SQS<br/>(fila da empresa)
  participant SC as Sidecar
  participant AG as Agente
  FE->>BE: POST /chat
  BE->>BE: salva mensagem
  BE->>SNS: publish(company_id, user, texto)
  SNS->>SQS: fan-out filtrado por company_id
  SC->>SQS: poll
  SC->>AG: entrega no channel
  AG-->>BE: callbacks (progresso, tool calls)
  AG->>BE: resposta final
  BE->>FE: chat atualizado
```
<!-- /slide -->

O front-end faz um POST para o backend. O backend persiste a mensagem e publica em um tópico
SNS. Cada agente tem **a sua própria fila SQS**, inscrita no tópico com uma *filter policy* pelo
id da empresa. É o fan-out clássico — a mesma mensagem nunca chega a dois agentes.

Do lado do agente, no mesmo serviço ECS, um processo separado fica consumindo a fila e entregando
cada mensagem ao channel do OpenClaw. Quando o agente termina a tarefa, ele (e os callbacks
intermediários) chama um endpoint no backend para atualizar o chat. O chat vive no banco de
dados, não no agente.
