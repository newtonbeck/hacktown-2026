---
titulo: Nada disso é novo
resumo: O mapeamento entre cada peça do harness da Ground e o fundamento de engenharia que ela reaproveita.
slide:
  layout: default
notas: |
  Esta é a tese. Falar devagar. Percorrer a tabela linha a linha, lembrando a
  seção onde cada peça apareceu. O alívio da plateia aqui é palpável: o que eles
  já sabem continua valendo.
fontes:
  - https://12factor.net/
  - https://learn.microsoft.com/en-us/azure/architecture/patterns/sidecar
---

<!-- slide -->
## O harness já tinha nome

| O que construímos | Como sempre se chamou |
| --- | --- |
| Channel fechado, fila por empresa | Pub/sub, fan-out, filtro de assinatura |
| Sidecar de mensagens, de materialização, de billing | Sidecar pattern |
| Uma imagem, config por empresa, task de deploy | 12-factor, imutabilidade de artefato |
| Estado em `.md` + EFS | Volume persistente |
| Playbooks no DB, materializados no agente | Source of truth + cache derivado |
| Run, Schedule, webhook → system message | Event-driven, fila como interface |
| Proxy localhost que mede tokens | Reverse proxy, metering |
| Sem endpoint, sem download, credenciais injetadas | Menor privilégio, redução de superfície |
| Run + logs | Registro de execução, auditoria |
<!-- /slide -->

A conclusão prática é otimista. A parte difícil de construir agentes não exigiu um corpo de
conhecimento novo — exigiu o que a indústria acumulou construindo sistemas distribuídos,
multi-tenant e auditáveis nos últimos vinte anos. Cada linha dessa tabela tem livro, página de
documentação e gente sênior que sabe fazer.

Isso inverte uma ansiedade comum. "Preciso virar pesquisador de ML para trabalhar com isso?" Não.
Quem sabe desenhar um sistema que sobrevive a falha parcial, que isola tenants, que cobra certo
e que consegue explicar o próprio comportamento está muito mais perto de entregar um agente em
produção do que quem sabe ajustar um prompt.

## O que é genuinamente novo cabe em três linhas

1. O componente central é **não determinístico**
2. É **caro por chamada**, e o custo varia por execução
3. É **influenciável pelo texto que processa**

*Três propriedades. Mudam as constantes dos problemas conhecidos. Não mudam a natureza deles.*

O que mudou de fato é pequeno e vale nomear. Um componente não determinístico torna o registro
por execução obrigatório, não opcional. Um componente caro por chamada torna o metering um
requisito de produto, não de finanças. Um componente influenciável pelo texto torna a autorização
na camada de ferramenta uma questão de segurança, não de UX. As constantes mudaram; as equações
são as mesmas.
