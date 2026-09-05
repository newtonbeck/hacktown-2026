<!--
  Título e lista (Figma 4:2): título no alto, corpo abaixo e o L no canto superior
  direito. O visual está em style.css; lib/fit.ts encolhe o corpo se não couber.
-->
<script setup>
import { ref } from 'vue'
import { useFit } from '../lib/fit'

const root = ref(null)
useFit(root)
</script>

<template>
  <div ref="root" class="slidev-layout lista">
    <div class="corpo">
      <slot />
    </div>
    <img class="icone l-shape" src="/theme/l-shape.svg" alt="">
  </div>
</template>
