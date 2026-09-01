---
titulo: Billing, limites e segurança
resumo: As três exigências que só aparecem quando existe um cliente pagante do outro lado.
notas: |
  Esta seção é a que separa "projeto interno" de "produto". Não pular mesmo
  se o tempo estiver curto.
---

<!-- slide -->
## O que só aparece com cliente pagante

- **Medição** por execução, por tenant, por ferramenta
- **Cota e limite** aplicados *antes* de gastar, não no relatório
- **Permissão** por ferramenta e por dado, não por usuário
- **Isolamento** entre tenants em um sistema que lê texto arbitrário
<!-- /slide -->

Billing de agente é medição de custo variável, e isso é mais parecido com nuvem do que com
SaaS por assento. É preciso atribuir tokens, chamadas de ferramenta e tempo de execução a um
tenant e a uma unidade de trabalho — e fazer isso durante a execução, porque cota que só é
verificada depois é um relatório, não um limite.

Segurança tem uma torção específica. O modelo consome texto de fontes que não estão sob
controle: página web, e-mail recebido, documento enviado pelo cliente. Esse texto pode conter
instruções. Isso significa que a autorização não pode depender do que o modelo decidiu — ela
precisa estar na camada que executa a ferramenta, avaliando a identidade do chamador e não a
intenção declarada.

É a lição do SQL injection com outra roupa: nunca deixe o dado virar comando. Vinte anos
depois, o mesmo princípio, num lugar novo.
