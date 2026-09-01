---
titulo: O que achávamos que estávamos construindo
resumo: A ilusão do demo — por que o caminho do protótipo à produção é mais longo do que parece.
notas: |
  O contraste dos dois blocos de código é o ponto. Não explicar demais, deixar
  a plateia rir do segundo.
---

<!-- slide -->
## O agente do demo

```python
while not done:
    action = llm(context)
    result = execute(action)
    context += result
```

Vinte linhas. Funciona na apresentação.
<!-- /slide -->

Todo agente começa assim, e não há nada de errado nisso. Esse laço é genuinamente a ideia
central: um modelo que decide, uma ferramenta que executa, um contexto que acumula. Em uma
tarde se constrói algo que impressiona.

O problema é que a distância entre esse laço e um sistema que roda para clientes pagantes não
é uma questão de refinar o laço. Quase nada do que falta está dentro dele.

Quem executa quando ninguém está olhando? O que acontece se cair na iteração 7 de 12? Quanto
custou essa execução e de quem é a cobrança? Quem autorizou essa ferramenta a tocar naquele
dado? Como se responde, seis meses depois, à pergunta "por que o sistema fez isso"?

Nenhuma dessas perguntas é sobre IA. Todas elas precisam estar respondidas antes de existir
um produto.
