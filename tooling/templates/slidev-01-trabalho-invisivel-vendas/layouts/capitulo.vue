<!--
  Layout "capitulo": abre um capítulo da palestra com um `#` e nada mais. No core,
  o marcador é `slide:capitulo`. Mesmo desenho do layout `titulo` (Figma 4:355),
  sem o parágrafo de entrada.
-->
<script setup>
import { onMounted, ref } from 'vue'
import { useFit } from '../lib/fit'

const root = ref(null)
const deco = ref('!')
onMounted(() => {
  const titulo = root.value?.querySelector('h1')?.textContent?.trim() ?? ''
  if (titulo.endsWith('?')) deco.value = '?'
})
useFit(root, { min: 26 })
</script>

<template>
  <div ref="root" class="slidev-layout titulo capitulo">
    <div class="deco" aria-hidden="true">{{ deco }}</div>
    <div class="corpo">
      <slot />
    </div>
  </div>
</template>
