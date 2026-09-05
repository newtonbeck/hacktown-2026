<!--
  Layout "codigo": título no alto e bloco de código abaixo. Não tem template no
  Figma; segue o grid do slide de título e lista (4:2). O visual está em style.css.
-->
<script setup>
import { ref } from 'vue'
import { useFit } from '../lib/fit'

const root = ref(null)
useFit(root)
</script>

<template>
  <div ref="root" class="slidev-layout codigo">
    <div class="corpo">
      <slot />
    </div>
  </div>
</template>
