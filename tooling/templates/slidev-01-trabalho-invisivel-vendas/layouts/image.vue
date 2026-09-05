<!--
  Imagem grande (Figma 4:46): fundo azul sem a borda marrom, o print quase no slide
  inteiro e o L no canto inferior esquerdo. Substitui o layout nativo `image`, que
  pintava a imagem como background. `backgroundSize` vira object-fit, por
  compatibilidade com os marcadores do core.
-->
<script setup>
defineProps({
  image: { type: String, default: '' },
  backgroundSize: { type: String, default: 'cover' },
})
</script>

<template>
  <div class="slidev-layout image">
    <img v-if="image" class="image-cheia" :src="image" :style="{ objectFit: backgroundSize }" alt="">
    <slot />
    <img class="icone l-shape" src="/theme/l-shape.svg" alt="">
  </div>
</template>
