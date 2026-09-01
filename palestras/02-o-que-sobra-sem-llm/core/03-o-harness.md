---
titulo: O harness
resumo: O inventário do que cerca o modelo — e a constatação de que o modelo é a menor peça.
slide:
  layout: default
notas: |
  Deixar o diagrama na tela enquanto fala. Apontar para o quadradinho do LLM
  quando disser "isso é o que a gente achava que era o produto".
---

<!-- slide -->
## O que de fato foi construído

```mermaid
flowchart TB
  subgraph H[harness]
    direction TB
    O[Observabilidade<br/>traces, métricas, replay]
    A[Auditoria<br/>quem, quando, por quê]
    B[Billing<br/>medição, cotas, limites]
    E[Execução<br/>fila, retry, idempotência]
    S[Agendamento<br/>cron, eventos, backpressure]
    I[Integrações<br/>auth, rate limit, schema drift]
    G[Segurança<br/>permissão, isolamento, segredos]
    L((LLM))
  end
  style L fill:#2f6f4f,color:#fff
```
<!-- /slide -->

Esse desenho é a palestra inteira em uma imagem. O círculo no meio é a parte que dá nome ao
produto e a que menos código consome.

Vale insistir em uma distinção: o harness não é infraestrutura genérica que se resolve
comprando um PaaS. Cada uma dessas caixas tem uma exigência específica que vem do fato de o
componente central ser não determinístico e caro.

Observabilidade normal registra o que aconteceu; aqui é preciso registrar por que uma decisão
foi tomada, com qual contexto, e conseguir reproduzir aquilo. Billing normal conta requisições;
aqui a unidade de custo varia por execução em uma ordem de grandeza. Execução normal assume que
retry é seguro; aqui uma repetição pode enviar o mesmo e-mail duas vezes.

O harness é infraestrutura clássica com requisitos torcidos por uma peça imprevisível no meio.
