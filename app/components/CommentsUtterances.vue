<!-- app/components/CommentsUtterances.vue -->
<!--
  Inserta el widget de Utterances (https://utteranc.es).
  Cada página queda asociada a un issue del repositorio de comentarios.

  Props:
    repo       repositorio "usuario/repo" (por defecto el de runtimeConfig)
    issueTerm  'pathname' | 'url' | 'title' | 'og:title' | cualquier texto fijo
    theme      'github-light' | 'github-dark' | 'preferred-color-scheme' | ...
-->
<script setup lang="ts">
const config = useRuntimeConfig()

const props = withDefaults(defineProps<{
  repo?: string
  issueTerm?: string
  theme?: string
}>(), {
  repo: '',
  issueTerm: 'pathname',
  theme: 'preferred-color-scheme'
})

const container = ref<HTMLElement | null>(null)
const route = useRoute()

const repoName = computed(() => props.repo || String(config.public.utterancesRepo))

function loadComments() {
  if (!container.value) return
  // Se limpia el widget anterior para que cada página muestre su propio hilo
  container.value.innerHTML = ''
  const script = document.createElement('script')
  script.src = 'https://utteranc.es/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('repo', repoName.value)
  script.setAttribute('issue-term', props.issueTerm)
  script.setAttribute('label', 'comments')
  script.setAttribute('theme', props.theme)
  container.value.appendChild(script)
}

// onMounted: sólo en el navegador (en el pre-renderizado queda el <div> vacío)
onMounted(loadComments)
// Al navegar de un artículo a otro se recarga el hilo correspondiente
watch(() => [route.path, props.issueTerm], loadComments)
</script>

<template>
  <section class="comments-section" aria-labelledby="comments-title">
    <h2 id="comments-title">Comentarios</h2>
    <p class="muted small">
      Inicie sesión con GitHub para comentar. Los comentarios se publican en
      <a :href="`https://github.com/${repoName}/issues`" target="_blank" rel="noopener">{{ repoName }}</a>.
    </p>
    <div ref="container" class="comments" />
  </section>
</template>
