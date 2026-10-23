<!-- app/pages/blog/[...slug].vue -->
<script setup lang="ts">
const route = useRoute()

// Algunos hostings (GitHub Pages, servidores estáticos) agregan una barra final
// a la URL (/blog/x/). Se quita para que coincida con el campo `path` del contenido.
const path = route.path.replace(/\/+$/, '') || '/'

const { data: post } = await useAsyncData(path, () => {
  return queryCollection('blog').path(path).first()
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artículo no encontrado', fatal: true })
}

// Artículo anterior y siguiente, para navegar de un blog a otro
const { data: allPosts } = await useAsyncData('blog-nav', () => {
  return queryCollection('blog')
    .order('date', 'ASC')
    .select('path', 'title')
    .all()
})

const surround = computed(() => {
  const list = allPosts.value ?? []
  const i = list.findIndex(p => p.path === path)
  return [i > 0 ? list[i - 1] : null, i >= 0 && i < list.length - 1 ? list[i + 1] : null]
})

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogImage: post.value.image
})

// Término del issue: la ruta del artículo sin la barra inicial
// (ej. "blog/mezcla-editorial"). Es lo mismo que usaría issue-term="pathname",
// pero sin depender de si el hosting agrega una barra final a la URL.
const issueTerm = computed(() => post.value!.path.replace(/^\//, ''))

const fmt = (d: string | Date) =>
  new Date(d).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
</script>

<template>
  <article class="post">
    <NuxtLink to="/blog" class="back">← Volver al blog</NuxtLink>

    <header class="post-header">
      <h1>{{ post!.title }}</h1>
      <p class="muted">Por <strong>{{ post!.author }}</strong> · <time>{{ fmt(post!.date) }}</time></p>
      <p class="tags">
        <span v-for="tag in post!.tags" :key="tag" class="tag">#{{ tag }}</span>
      </p>
      <img :src="post!.image" :alt="post!.title" class="cover">
    </header>

    <ContentRenderer :value="post!" class="prose" />

    <nav class="surround" aria-label="Otros artículos">
      <NuxtLink v-if="surround[0]" :to="surround[0].path" class="prev">
        <span class="muted small">← Anterior</span>
        {{ surround[0].title }}
      </NuxtLink>
      <span v-else />
      <NuxtLink v-if="surround[1]" :to="surround[1].path" class="next">
        <span class="muted small">Siguiente →</span>
        {{ surround[1].title }}
      </NuxtLink>
    </nav>

    <!-- Comentarios: un hilo (issue) distinto por cada artículo -->
    <CommentsUtterances :key="post!.path" :issue-term="issueTerm" />
  </article>
</template>
