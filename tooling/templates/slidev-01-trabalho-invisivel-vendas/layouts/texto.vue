<!--
  Só texto (Figma 4:127): o gerador escolhe este layout para um bloco sem título.
  Coluna de texto à esquerda, centrada na vertical, e dois raios à direita.
-->
<script setup>
import { ref } from 'vue'
import { useFit } from '../lib/fit'

const root = ref(null)
useFit(root)
</script>

<template>
  <div ref="root" class="slidev-layout texto">
    <div class="corpo">
      <slot />
    </div>
    <img class="icone raio-alto" src="/theme/raio.svg" alt="">
    <img class="icone raio-baixo" src="/theme/raio.svg" alt="">
  </div>
</template>
