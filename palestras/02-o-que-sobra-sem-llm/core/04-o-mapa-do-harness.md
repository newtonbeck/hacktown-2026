---
titulo: O mapa do harness
resumo: O inventário do que foi construído ao redor do OpenClaw — e a ordem em que vamos percorrer.
slide:
  layout: default
notas: |
  Este diagrama volta em quase toda seção. Apontar para o círculo do LLM ao dizer
  "isso é o que a gente achava que era o produto". Não explicar cada caixa agora —
  só mostrar o tamanho do resto.
---

<!-- slide:capitulo -->
# O harness, peça por peça
<!-- /slide -->

<!-- slide -->
## O que de fato foi construído

```mermaid
flowchart TD
  D[Deploy<br/>ECS · ECR · EFS] --> L
  C[Chat<br/>SNS · SQS · sidecar] --> L
  I[Conexões] --> L
  S[Playbooks e<br/>materialização] --> L
  E[Execução, agendamento<br/>e auditoria] --> L
  L((OpenClaw<br/>+ LLM))
  L --> B[Billing<br/>proxy · preços]
  L --> G[Segurança<br/>fechado por padrão]
  style L fill:#2f6f4f,color:#fff
```
<!-- /slide -->

Esse desenho é a palestra inteira em uma imagem. O círculo é o agente propriamente dito — o
OpenClaw com um modelo atrás. Tudo em volta é o que tivemos que construir para que ele pudesse
ser vendido como produto, e a ordem das caixas é a ordem em que vamos percorrer.

Vale insistir em uma distinção: o harness não é infraestrutura genérica que se resolve comprando
um PaaS. Cada caixa tem uma exigência específica que vem do fato de o componente central ser
**não determinístico**, **caro por chamada** e **influenciável pelo texto que lê**.

Auditoria normal registra o que aconteceu; aqui é preciso registrar o que o agente estava
tentando fazer em cada passo de uma run — e é por isso que o log não tem caixa própria no
desenho: ele nasce dentro da execução, escrito pelo próprio playbook. Billing normal conta
requisições; aqui a unidade de custo varia por execução em uma ordem de grandeza. Segurança
normal protege o perímetro; aqui o próprio agente é um usuário com credenciais e precisa ser
tratado como tal.

<!-- slide:capitulo -->
# O que usamos para construir
<!-- /slide -->

O que usamos para construir é deliberadamente banal: serviço gerenciado, nada exótico. A
dificuldade nunca esteve aqui — mas vale mostrar as três peças, porque tudo o que vem depois
se apoia nelas.

<!-- slide -->
## Docker + ECR: uma imagem para a frota

```mermaid
flowchart LR
  DF["Dockerfile<br/>OpenClaw + sidecars"] -- docker build --> IM["Imagem<br/>do agente"]
  IM -- docker push --> ECR[("ECR<br/>registry da AWS")]
```

*A mesma imagem para todas as empresas. O que muda é configuração.*
<!-- /slide -->

Um `Dockerfile` descreve o agente: o OpenClaw, os sidecars e as dependências. Ele é compilado em
uma **imagem** e publicado no **ECR**, o registry da própria AWS. Nenhuma empresa tem imagem
própria; a diferença entre elas mora nas variáveis de ambiente e no disco, nunca no build.

<!-- slide -->
## ECS: a mesma imagem, task ou serviço

```mermaid
flowchart LR
  ECR[("ECR<br/>imagem do agente")] -- pull --> CL
  subgraph CL["Cluster ECS"]
    direction TB
    T["Task — roda, termina e sai<br/>o deploy de uma empresa"]
    S["Serviço — fica de pé e reinicia<br/>o agente de uma empresa"]
  end
```
<!-- /slide -->

O ECS baixa essa imagem do ECR e a executa de duas formas. Como **task**, quando o trabalho tem
fim: o deploy de uma empresa roda, provisiona, termina e sai. Como **serviço**, quando o processo
precisa ficar de pé e ser reiniciado se cair: é assim que vive o agente de cada empresa.

<!-- slide -->
## SNS + SQS: uma fila por empresa

```mermaid
flowchart LR
  EV["Evento<br/>mensagem · playbook · schedule"] --> SNS{{"Tópico SNS"}}
  SNS -- filtro: empresa A --> Q1[("Fila SQS A")]
  SNS -- filtro: empresa B --> Q2[("Fila SQS B")]
  SNS -- filtro: empresa C --> Q3[("Fila SQS C")]
  Q1 --> C1["Sidecar do agente A"]
  Q2 --> C2["Sidecar do agente B"]
  Q3 --> C3["Sidecar do agente C"]
```
<!-- /slide -->

Todo evento entra por um **tópico SNS** único. Cada empresa tem uma **fila SQS** inscrita nesse
tópico, com um filtro pelo seu id, e o sidecar do agente daquela empresa é o único consumidor da
sua fila. O produtor não sabe quantos agentes existem, e um agente fora do ar não perde mensagem:
ela espera na fila.
