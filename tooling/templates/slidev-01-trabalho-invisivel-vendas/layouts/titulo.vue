<!--
  Só título (Figma 4:355): parágrafo de entrada opcional no alto à esquerda, `#`
  grande embaixo à direita, por cima de um sinal gigante em roxo ao fundo. O
  comportamento (sinal, título com vírgula, encolher e ancorar) está em lib/titulo.ts.
-->
<script setup>
import { ref } from 'vue'
import { useTitulo } from '../lib/titulo'

const root = ref(null)
const { deco } = useTitulo(root)
</script>

<template>
  <div ref="root" class="slidev-layout titulo">
    <div class="deco" :class="{ 'deco-interrogacao': deco === '?' }" aria-hidden="true">{{ deco }}</div>
    <div class="corpo">
      <slot />
    </div>
  </div>
</template>
