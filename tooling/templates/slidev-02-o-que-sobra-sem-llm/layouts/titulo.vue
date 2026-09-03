<!--
  Só título (Figma 4:355): parágrafo de entrada opcional no alto, `#` grande e um
  sinal gigante em oliva ao fundo — "?" se o título termina em interrogação, "!"
  nos demais casos.
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
  <div ref="root" class="slidev-layout titulo">
    <div class="deco" aria-hidden="true">{{ deco }}</div>
    <div class="titulo-texto">
      <slot />
    </div>
  </div>
</template>
