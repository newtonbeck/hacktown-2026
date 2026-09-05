/**
 * Comportamento comum dos layouts `titulo` e `capitulo` (Figma 4:355).
 *
 * - O sinal gigante ao fundo é "?" se o título termina em interrogação, "!" nos demais;
 *   o "?" ou "!" final sai do texto do título, porque o sinal já faz esse papel.
 * - `# Título, complemento` vira o título grande mais uma linha menor abaixo, alinhada
 *   à esquerda com ele ("Cosmoprof" e, embaixo, "11 a 13 de julho").
 * - O título encolhe até caber (lib/fit.ts).
 */
import { onMounted, ref, type Ref } from 'vue'
import { useFit } from './fit'

export function useTitulo(root: Ref<HTMLElement | null>) {
  const deco = ref('!')

  const separa = (el: HTMLElement) => {
    // Só texto puro: com <strong> ou outro filho, o título fica como veio.
    if (el.children.length) return
    const m = /^([^,]+),\s+(.+)$/.exec(el.textContent?.trim() ?? '')
    if (!m) return
    const principal = document.createElement('span')
    principal.className = 'titulo-principal'
    principal.textContent = m[1]
    const detalhe = document.createElement('span')
    detalhe.className = 'titulo-detalhe'
    detalhe.textContent = m[2]
    el.textContent = ''
    el.append(principal, detalhe)
  }

  /** Tira o "?" ou "!" do fim do título; o sinal gigante já o representa. */
  const tiraPontuacao = (el: HTMLElement) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    let ultimo: Text | null = null
    for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.textContent?.trim()) ultimo = n as Text
    if (ultimo) ultimo.textContent = ultimo.textContent!.replace(/\s*[?!]+\s*$/, '')
  }

  onMounted(() => {
    const el = root.value?.querySelector<HTMLElement>('h1')
    if (!el) return
    separa(el)
    if ((el.textContent ?? '').trim().endsWith('?')) deco.value = '?'
    tiraPontuacao(el)
  })
  useFit(root, { min: 26 })

  return { deco }
}
