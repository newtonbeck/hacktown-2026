---
titulo: Dezembro de 2025 — a v1
resumo: Três demos, uma discussão de arquitetura e um agente feito à mão com o SDK da OpenAI, tools, vector database e um loop próprio.
slide:
  layout: default
notas: |
  Contar a história de verdade: 8 de dezembro, três demos (OpenAI Agents SDK,
  CrewAI, LangChain) para uma discussão de arquitetura à tarde. Escolhemos o SDK
  da OpenAI. Mostrar o loop e deixar a plateia perceber que ele é pequeno.
fontes:
  - https://openai.github.io/openai-agents-python/
  - https://platform.openai.com/docs/guides/tools-file-search
  - https://www.anthropic.com/engineering/building-effective-agents
---

<!-- slide -->
## 8 de dezembro de 2025

> "Preparei três demos simples de agente com três ferramentas diferentes: OpenAI Agents SDK, CrewAI e LangChain. A ideia é usar as demos como ponto de partida para a discussão de arquitetura hoje à tarde."

*— mensagem no Slack da Ground, manhã de uma segunda-feira*
<!-- /slide -->

Foi assim que começou. Três frameworks, três demos de uma tela, uma reunião. A decisão daquela
tarde foi a mais conservadora possível: usar o SDK de agentes da OpenAI, que tinha o menor número
de abstrações entre nós e o modelo, e construir o resto.

<!-- slide -->
## A v1, em uma tela

```python
while not done:
    response = llm(messages, tools=TOOLS)
    for call in response.tool_calls:
        messages.append(execute(call))
    done = response.finished
```

- **Tools**: Shopify, Klaviyo, Attentive, Postscript — as que já tínhamos
- **Vector database** para o contexto da empresa
- **Um loop**, nosso, de umas dezenas de linhas
<!-- /slide -->

A v1 era genuinamente isso. Um laço que chama o modelo, executa as ferramentas que ele pediu,
devolve o resultado e repete. Um vector database para dar ao agente contexto sobre a empresa do
cliente. E as ferramentas que a Ground já tinha construído para o nosso ICP — e-commerces que
rodam em Shopify e fazem marketing em Klaviyo, Attentive e Postscript.

Funcionou. Em janeiro estava na mão de uma parte dos clientes. E foi exatamente aí que a
pergunta desta palestra apareceu pela primeira vez: o que faltava para isso virar produto não
estava em nenhuma linha daquele laço.

<!-- slide -->
## O que o loop não responde

- Quem executa quando ninguém está olhando?
- Quanto custou essa execução, e de quem é a cobrança?
- O que o agente fez às 3h da manhã, e por quê?
- Como a skill que uma pessoa criou vira skill da empresa inteira?
- Como isso roda para 50 empresas sem misturar nada?

*Nenhuma dessas perguntas é sobre IA.*
<!-- /slide -->

Todo agente começa com esse laço, e não há nada de errado nisso — é a ideia central: um modelo
que decide, uma ferramenta que executa, um contexto que acumula. O problema é que a distância
entre esse laço e um sistema que roda para clientes pagantes não é uma questão de refinar o laço.
Quase nada do que falta está dentro dele.
