<!-- app/pages/index.vue -->
<script setup lang="ts">
useHead({ title: 'Inicio' })

// Caja de noticias: las tres entradas más recientes
const { data: latest } = await useAsyncData('home-latest', () => {
  return queryCollection('blog')
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'image', 'date')
    .limit(3)
    .all()
})

const fmt = (d: string | Date) =>
  new Date(d).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
</script>

<template>
  <div>
    <section class="hero">
      <h1>Contenido social en la web</h1>
      <p class="lead">
        Un blog sobre los patrones de contenido social: mezcla editorial, voces personales,
        nano-pirámide invertida y más. Cada artículo tiene su propio hilo de comentarios
        gracias a <a href="https://utteranc.es" target="_blank" rel="noopener">Utterances</a>.
      </p>
      <NuxtLink to="/blog" class="button">Ver todos los artículos</NuxtLink>
    </section>

    <section>
      <h2>Últimas entradas</h2>
      <div class="cards">
        <NuxtLink v-for="post in latest" :key="post.path" :to="post.path" class="card">
          <img :src="post.image" :alt="post.title" loading="lazy">
          <div class="card-body">
            <time class="muted small">{{ fmt(post.date) }}</time>
            <h3>{{ post.title }}</h3>
            <p>{{ post.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
