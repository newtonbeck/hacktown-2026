---
titulo: Onde o agente mora
resumo: Um serviço ECS por empresa, imagem no ECR, uma task de deploy que provisiona tudo e um EFS com access point por empresa para que o estado em Markdown sobreviva.
slide:
  layout: default
notas: |
  Falar do porquê de um serviço por empresa: isolamento de estado e de credenciais
  vale mais que densidade. O detalhe do disco é o que a plateia técnica vai perguntar
  — o estado do OpenClaw é arquivo .md, e arquivo não sobrevive a um redeploy sem
  volume. No diagrama da task, não ler passo a passo: o ponto é o tamanho da lista.
fontes:
  - https://docs.aws.amazon.com/AmazonECS/latest/developerguide/efs-volumes.html
  - https://docs.aws.amazon.com/efs/latest/ug/efs-access-points.html
  - https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking-awsvpc.html
---

<!-- slide -->
## Um serviço por empresa

```mermaid
flowchart LR
  ECR[(ECR<br/>imagem do agente)]
  DT[Task de deploy]
  DB[(Backend / DB)]
  subgraph CL[Cluster ECS]
    subgraph S1[Serviço · empresa A]
      A1[Agente] --- SC1[Sidecars]
      V1[(EFS<br/>/empresa-A)]
    end
    subgraph S2[Serviço · empresa B]
      A2[Agente] --- SC2[Sidecars]
      V2[(EFS<br/>/empresa-B)]
    end
  end
  ECR --> DT
  DB -- env vars --> DT
  DT --> S1
  DT --> S2
```
<!-- /slide -->

Todos os agentes rodam no mesmo cluster ECS, mas **cada instância do serviço roda para uma
empresa diferente**. A decisão foi de isolamento, não de escala: o estado do agente, as
credenciais das conexões e as skills são de uma empresa, e a forma mais barata de garantir que
nunca vazem para outra é não compartilhar processo.

<!-- slide -->
## O deploy é uma task

```mermaid
flowchart TD
  T[Task de deploy<br/>ORGANIZATION_ID] --> Q{Já existe serviço?}
  Q -- ativo --> N[não faz nada]
  Q -- parado --> U[liga de novo]
  Q -- não --> S[Segredo da empresa<br/>shared + chaves das conexões]
  S --> R[Recursos<br/>EFS · fila SQS ← SNS · logs]
  R --> D[Task definition<br/>agente + sidecars]
  D --> E[Serviço ECS<br/>openclaw-empresa]
```
<!-- /slide -->

O agente é uma **imagem Docker no ECR**, a mesma para todas as empresas. O que muda entre elas é
**configuração**, nunca imagem — o 12-factor de sempre. A task de deploy é o único lugar que sabe
montar o ambiente de uma empresa, e ela é idempotente: rodar de novo em uma empresa que já está
no ar não faz nada; em uma que foi desligada, só religa.

Quando é provisionamento de verdade, a lista é comprida — e o tamanho dela é o argumento. O
segredo da empresa é remontado a partir de um segredo compartilhado da frota mais as chaves de
cada conexão; nasce um access point de EFS, uma fila SQS com DLQ inscrita no tópico SNS e filtrada
pelo id da empresa, um log group, uma task definition com o agente e seus sidecars e, no fim, o
serviço no ECS. Nada disso é sobre IA. É provisionamento de tenant, e já existia com esse nome
muito antes de existir agente.

<!-- slide -->
## Estado em `.md` precisa de disco

- O OpenClaw guarda memória, configuração e skills em **arquivos Markdown**
- Container é efêmero. Redeploy = perde tudo.
- Um **EFS** para a frota, com um **access point por empresa** montado no agente
- Redeploy troca a imagem; o diretório da empresa continua lá
<!-- /slide -->

Aqui está uma das exigências torcidas pelo componente central. Um serviço stateless comum não
liga para redeploy. O OpenClaw, por desenho, é *stateful em arquivos*: memória de longo prazo,
preferências, skills instaladas — tudo em `.md` no disco. Sem um volume persistente, cada deploy
nosso apagaria a memória do agente do cliente.

A solução é a mais antiga possível: um disco. É um único EFS para a frota inteira, mas cada
empresa entra nele por um *access point* próprio, com raiz em `/{id-da-empresa}`, tráfego
cifrado e autorização por IAM. O container monta isso em `/efs` e nunca enxerga o diretório de
outra empresa; o deploy troca a imagem sem tocar no volume. O que é "do OpenClaw" vive no
disco; o que é nosso vive no banco — e essa fronteira é o assunto das próximas seções.

A primeira delas responde à caixa que ficou sem explicação no diagrama: os **sidecars** ao lado
do agente em cada serviço. Com a casa construída, falta mostrar como uma mensagem entra nela.
