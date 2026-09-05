<!--
  Slide obrigatório do HackTown (Figma 14:205): a imagem da organização recortada
  numa moldura de 589×403 com sombra, sobre o fundo padrão. No core, o marcador é
  `slide:hacktown image=assets/....png`.
-->
<script setup>
defineProps({
  image: { type: String, default: '' },
})
</script>

<template>
  <div class="slidev-layout hacktown">
    <div v-if="image" class="moldura">
      <img :src="image" alt="">
    </div>
    <slot />
  </div>
</template>
