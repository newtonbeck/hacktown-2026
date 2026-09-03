<!--
  Capa (Figma, página 1). O gerador emite o título em três linhas — `.capa-antes`,
  `#` (destaque) e `.capa-depois` — a partir de `capa:` do palestra.yaml, mais a
  assinatura. O sinal gigante ao fundo vem do frontmatter (`pontuacao`); a lagosta
  é asset do tema.
-->
<script setup>
defineProps({
  pontuacao: { type: String, default: '' },
})
</script>

<template>
  <div class="slidev-layout cover">
    <div v-if="pontuacao" class="deco" aria-hidden="true">{{ pontuacao }}</div>
    <div class="cover-texto">
      <slot />
    </div>
    <img class="cover-mascote plain" src="/theme/lagosta.png" alt="">
  </div>
</template>
