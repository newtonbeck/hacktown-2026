<!--
  Layout "capitulo": abre um capítulo da palestra com um `#` e nada mais. No core,
  o marcador é `slide:capitulo`. Mesmo desenho do layout `titulo` (Figma 4:355),
  sem o parágrafo de entrada; o comportamento está em lib/titulo.ts.
-->
<script setup>
import { ref } from 'vue'
import { useTitulo } from '../lib/titulo'

const root = ref(null)
const { deco } = useTitulo(root)
</script>

<template>
  <div ref="root" class="slidev-layout titulo capitulo">
    <div class="deco" :class="{ 'deco-interrogacao': deco === '?' }" aria-hidden="true">{{ deco }}</div>
    <div class="corpo">
      <slot />
    </div>
  </div>
</template>
