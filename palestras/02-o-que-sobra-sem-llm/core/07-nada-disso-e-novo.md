---
titulo: Nada disso é novo
resumo: O mapeamento entre cada peça do harness e o fundamento de engenharia que ela reaproveita.
slide:
  layout: default
notas: |
  Esta é a tese. Falar devagar. O alívio da plateia júnior aqui é palpável:
  o que eles já sabem continua valendo.
---

<!-- slide -->
## O harness já tinha nome

| Problema "de agente" | Fundamento |
| --- | --- |
| Retomar após falha | Workflow durável |
| Retry seguro | Idempotência |
| Por que fez isso | Tracing distribuído |
| Custo por execução | Metering |
| Ferramenta arbitrária | Autorização e sandbox |
| Texto vira comando | Injection |
<!-- /slide -->

A conclusão prática é otimista. A parte difícil de construir agentes não exige um corpo de
conhecimento novo — exige o corpo de conhecimento que a indústria acumulou construindo sistemas
distribuídos, multi-tenant e auditáveis nos últimos vinte anos.

Isso inverte uma ansiedade comum. A pergunta "preciso virar pesquisador de ML para trabalhar
com isso?" tem resposta negativa. Quem sabe desenhar um sistema que sobrevive a falha parcial,
que cobra certo e que consegue explicar o próprio comportamento está muito mais perto de
entregar um agente em produção do que quem sabe ajustar um prompt.

O que é genuinamente novo é pequeno: um componente central não determinístico, caro por
chamada, e capaz de ser influenciado pelo conteúdo que processa. Três propriedades. Elas
mudam as constantes de vários problemas conhecidos, mas não mudam a natureza deles.
