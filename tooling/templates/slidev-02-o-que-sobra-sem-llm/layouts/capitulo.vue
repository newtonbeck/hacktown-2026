<!--
  Layout "capitulo": abre um capítulo da palestra com um `#` e nada mais. No core,
  o marcador é `slide:capitulo`. Mesmo desenho do layout `titulo` (Figma 4:355).
-->
<script setup>
import { onMounted, ref } from 'vue'

const root = ref(null)
const deco = ref('!')
onMounted(() => {
  const titulo = root.value?.querySelector('h1')?.textContent?.trim() ?? ''
  if (titulo.endsWith('?')) deco.value = '?'
})
</script>

<template>
  <div ref="root" class="slidev-layout titulo capitulo">
    <div class="deco" aria-hidden="true">{{ deco }}</div>
    <div class="titulo-texto">
      <slot />
    </div>
  </div>
</template>
