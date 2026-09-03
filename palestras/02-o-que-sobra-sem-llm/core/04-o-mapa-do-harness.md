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
flowchart TD
  D[Deploy<br/>ECS · ECR · EFS] --> L
  C[Chat<br/>SNS · SQS · sidecar] --> L
  S[Skills<br/>materialização] --> L
  I[Conexões<br/>Pipedream] --> L
  E[Execução<br/>run · schedule] --> L
  L((OpenClaw<br/>+ LLM))
  L --> B[Billing<br/>proxy · preços]
  L --> G[Segurança<br/>fechado por padrão]
  L --> O[Observabilidade<br/>runs · logs]
  style L fill:#2f6f4f,color:#fff
```
<!-- /slide -->

<!-- slide -->
## O que usamos para construir

- **ECR** — uma imagem do agente para toda a frota
- **ECS** — *tasks* para o deploy, *serviços* para os agentes que ficam de pé
- **SNS + SQS** — o caminho por onde toda mensagem entra

***

*Serviço gerenciado, nada exótico. A dificuldade nunca esteve aqui.*
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
