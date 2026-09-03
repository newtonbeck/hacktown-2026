<!--
  Layout "capitulo": só o título, centralizado, para dar respiro e abrir um novo
  capítulo da palestra. No core, o marcador do bloco é `slide:capitulo` e o corpo
  é só um `#`. O visual está em style.css, em `.slidev-layout.capitulo`.
-->
<template>
  <div class="slidev-layout capitulo">
    <slot />
  </div>
</template>
