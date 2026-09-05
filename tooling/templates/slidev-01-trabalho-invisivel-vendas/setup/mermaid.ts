// Diagramas na caixa branca (Figma 4:290), no tema padrão do mermaid — é o que o design mostra.
import { defineMermaidSetup } from '@slidev/types'

export default defineMermaidSetup(() => ({
  theme: 'default',
  themeVariables: {
    fontSize: '17px',
    background: '#ffffff',
  },
}))
