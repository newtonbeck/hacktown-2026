<!--
  Título, descrição opcional e diagrama (Figma 4:290): título no alto, a linha menor
  vinda de `## Título: complemento`, o mermaid numa caixa branca que ocupa o resto do
  slide e dois raios no canto superior direito. O SVG nasce dentro de um shadow root,
  fora do alcance do CSS, então este script o força a `width/height: 100%` para caber
  na caixa preservando a proporção — independentemente do `{scale}` da cerca.
-->
<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const root = ref(null)
const observers = []
let timer = null

function fit(shadow) {
  const svg = shadow.querySelector('svg')
  if (!svg) return
  for (const attr of ['width', 'height']) if (svg.hasAttribute(attr)) svg.removeAttribute(attr)
  const wanted = { width: '100%', height: '100%', maxWidth: 'none' }
  for (const [prop, value] of Object.entries(wanted)) if (svg.style[prop] !== value) svg.style[prop] = value
}

onMounted(() => {
  // O shadow root e o SVG chegam depois do mount (o mermaid renderiza assíncrono):
  // espera cada host ficar pronto antes de ajustar e observar.
  const pending = new Set(root.value?.querySelectorAll('.mermaid') ?? [])
  const started = Date.now()
  const tick = () => {
    for (const host of pending) {
      const shadow = host.shadowRoot
      if (!shadow?.querySelector('svg')) continue
      pending.delete(host)
      fit(shadow)
      const observer = new MutationObserver(() => fit(shadow))
      observer.observe(shadow, { childList: true, subtree: true, attributes: true })
      observers.push(observer)
    }
    if (pending.size && Date.now() - started < 15000) timer = setTimeout(tick, 50)
  }
  tick()
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  observers.forEach((o) => o.disconnect())
})
</script>

<template>
  <div ref="root" class="slidev-layout diagrama">
    <slot />
    <img class="icone raio-alto" src="/theme/raio.svg" alt="">
    <img class="icone raio-baixo" src="/theme/raio.svg" alt="">
  </div>
</template>
