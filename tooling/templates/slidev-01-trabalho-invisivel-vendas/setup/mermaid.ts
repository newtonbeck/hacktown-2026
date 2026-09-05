// Diagramas na caixa branca (Figma 4:290), no tema padrão do mermaid — é o que o design mostra.
//
// O SVG é escalado para caber na caixa, então aumentar só a fonte não muda nada: o que
// deixa o texto legível do fundo da sala é fonte grande com pouco espaço entre os nós,
// para o texto ocupar uma fatia maior do desenho.
import { defineMermaidSetup } from '@slidev/types'

export default defineMermaidSetup(() => ({
  theme: 'default',
  themeVariables: {
    fontSize: '30px',
    background: '#ffffff',
  },
  flowchart: {
    nodeSpacing: 16,
    rankSpacing: 26,
    padding: 8,
    wrappingWidth: 300,
    useMaxWidth: false,
  },
  sequence: {
    actorMargin: 30,
    messageMargin: 30,
    useMaxWidth: false,
  },
}))
