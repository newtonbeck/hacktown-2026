/**
 * Encolhe o corpo do texto até o conteúdo caber no slide.
 *
 * O design do Figma tem um corpo fixo (90px em 3840 de largura, 23px aqui), e a
 * Unbounded é uma fonte larga: um slide com uma tabela ou seis bullets não cabe
 * nesse corpo. Em vez de cortar o conteúdo, o layout mede `.corpo` depois de
 * montar (e de novo quando as fontes carregam) e reduz `--fit-size` de meio em
 * meio pixel até nada transbordar, respeitando um mínimo legível.
 *
 * `prepare` roda antes de medir (para desfazer ajustes de uma rodada anterior) e
 * `after` depois de encolher (para ajustes que dependem do tamanho final).
 */
import { onBeforeUnmount, onMounted, type Ref } from 'vue'

interface FitOptions {
  min?: number
  prepare?: () => void
  after?: () => void
}

export function useFit(root: Ref<HTMLElement | null>, { min = 13, prepare, after }: FitOptions = {}) {
  let observer: ResizeObserver | null = null

  const fit = () => {
    const el = root.value
    if (!el) return
    prepare?.()
    const box = el.querySelector<HTMLElement>('.corpo') ?? el
    el.style.removeProperty('--fit-size')
    const start = parseFloat(getComputedStyle(el).getPropertyValue('--fit-size')) || 23
    let size = start
    const overflows = () =>
      box.scrollHeight > box.clientHeight + 1 || box.scrollWidth > box.clientWidth + 1
    while (size > min && overflows()) {
      size -= 0.5
      el.style.setProperty('--fit-size', `${size}px`)
    }
    after?.()
  }

  onMounted(() => {
    fit()
    // As fontes do Google chegam depois do mount; a medida antes delas está errada.
    document.fonts?.ready.then(fit)
    if ('ResizeObserver' in window && root.value) {
      observer = new ResizeObserver(fit)
      observer.observe(root.value)
    }
  })

  onBeforeUnmount(() => observer?.disconnect())
}
