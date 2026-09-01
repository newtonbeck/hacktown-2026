---
titulo: O que muda com agentes
resumo: A diferença entre preencher um campo e ler fontes heterogêneas com julgamento.
notas: |
  Aqui é onde a palestra vira. Enfatizar "ler fonte que não foi feita para ser lida por máquina".
---

<!-- slide -->
## A diferença

| Automação clássica | Agente |
| --- | --- |
| Precisa de campo estruturado | Lê texto que não foi feito para máquina |
| Regra fixa | Decide o que é relevante |
| Falha silenciosa | Consegue dizer "não achei" |
<!-- /slide -->

A mudança concreta não é "a IA escreve o e-mail". Escrever o e-mail sempre foi a parte fácil.
A mudança é que agora existe algo capaz de ler um relatório anual em PDF, uma página de
carreiras, uma thread de suporte e a última call gravada — quatro formatos que nenhum ETL
jamais unificaria — e sair de lá com uma afirmação verificável sobre aquela conta.

Isso destrava as três primeiras categorias da seção anterior. Pesquisa deixa de exigir leitura
humana. Enriquecimento deixa de exigir que as chaves batam, porque a junção passa a ser
semântica e não relacional. Higiene de CRM deixa de ser um segundo trabalho, porque o registro
é subproduto da execução, não uma etapa depois dela.

Há um ganho menos óbvio e mais importante: um agente pode reportar incerteza. Uma regra que
não encontra o dado deixa o campo em branco e segue. Um agente pode dizer "não encontrei
evidência de que essa empresa esteja contratando" — e isso é informação, não ausência dela.
