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

<!-- slide -->
## O que de fato foi construído

```mermaid
flowchart LR
  subgraph H[" "]
    direction LR
    D[Deploy<br/>ECS · ECR · EFS]
    C[Chat<br/>SNS · SQS · sidecar]
    S[Skills<br/>materialização]
    I[Conexões<br/>Pipedream · internas]
    E[Execução<br/>run · schedule · webhook]
    B[Billing<br/>proxy · tabela de preços]
    G[Segurança<br/>fechado por padrão]
    O[Observabilidade<br/>runs · logs]
  end
  L((OpenClaw<br/>+ LLM))
  C --> L
  S --> L
  I --> L
  E --> L
  L --> B
  L --> O
  D -.-> L
  G -.-> L
  style L fill:#2f6f4f,color:#fff
```
<!-- /slide -->

Esse desenho é a palestra inteira em uma imagem. O círculo é o agente propriamente dito — o
OpenClaw com um modelo atrás. Tudo em volta é o que tivemos que construir para que ele pudesse
ser vendido como produto, e a ordem das caixas é a ordem em que vamos percorrer.

Vale insistir em uma distinção: o harness não é infraestrutura genérica que se resolve comprando
um PaaS. Cada caixa tem uma exigência específica que vem do fato de o componente central ser
**não determinístico**, **caro por chamada** e **influenciável pelo texto que lê**.

Observabilidade normal registra o que aconteceu; aqui é preciso registrar o que o agente estava
tentando fazer em cada passo de uma run. Billing normal conta requisições; aqui a unidade de
custo varia por execução em uma ordem de grandeza. Segurança normal protege o perímetro; aqui o
próprio agente é um usuário com credenciais e precisa ser tratado como tal.
