<!-- app/pages/blog/index.vue -->
<script setup lang="ts">
useHead({ title: 'Blog' })

const { data: posts } = await useAsyncData('blog-list', () => {
  return queryCollection('blog')
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'author', 'date', 'image', 'tags')
    .all()
})

const fmt = (d: string | Date) =>
  new Date(d).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
</script>

<template>
  <div>
    <h1>Blog</h1>
    <p class="muted">{{ posts?.length }} artículos · cada uno con su propio hilo de comentarios</p>
    <ul class="post-list">
      <li v-for="post in posts" :key="post.path">
        <NuxtLink :to="post.path" class="post-item">
          <img :src="post.image" :alt="post.title" loading="lazy">
          <div>
            <h2>{{ post.title }}</h2>
            <p>{{ post.description }}</p>
            <p class="muted small">{{ post.author }} · {{ fmt(post.date) }}</p>
            <p class="tags">
              <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
            </p>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
