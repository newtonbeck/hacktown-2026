<!--
  Só título (Figma 4:355): parágrafo de entrada opcional no alto à esquerda, `#`
  grande embaixo à direita e um sinal gigante em roxo ao fundo — "?" se o título
  termina em interrogação, "!" nos demais casos. Títulos longos encolhem até caber.
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
  <div ref="root" class="slidev-layout titulo">
    <div class="deco" aria-hidden="true">{{ deco }}</div>
    <div class="corpo">
      <slot />
    </div>
  </div>
</template>
