<!--
  Imagem no slide todo (Figma 4:46). Substitui o layout nativo `image`, que pintava
  a imagem como background: aqui ela é um <img> emoldurado sobre a textura, com
  margem fina. `backgroundSize` continua aceito (vira object-fit) por compatibilidade
  com os marcadores do core.
-->
<script setup>
defineProps({
  image: { type: String, default: '' },
  backgroundSize: { type: String, default: 'contain' },
})
</script>

<template>
  <div class="slidev-layout image">
    <img v-if="image" class="image-cheia" :src="image" :style="{ objectFit: backgroundSize }" alt="">
    <slot />
  </div>
</template>
