<!--
  Capa (Figma, página 1): título em três linhas centralizadas, com as palavras em
  destaque em peso Black, assinatura nos cantos e o raio ao centro. O gerador emite
  o título a partir de `capa.linhas` do palestra.yaml e a assinatura em seguida.
-->
<template>
  <div class="slidev-layout cover">
    <slot />
    <img class="icone cover-raio" src="/theme/raio.svg" alt="">
  </div>
</template>
