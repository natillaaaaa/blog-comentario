// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',

  modules: ['@nuxt/content'],

  css: ['~/assets/css/blog.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      titleTemplate: '%s - Blog de Contenido Social',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Blog del curso EIF-511 Arquitectura de Información con comentarios mediante Utterances.' }
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  },

  // Repositorio público de GitHub donde Utterances guarda los comentarios.
  // Cámbielo aquí o defina la variable de entorno NUXT_PUBLIC_UTTERANCES_REPO
  // (por ejemplo en Netlify: Site configuration > Environment variables).
  runtimeConfig: {
    public: {
      utterancesRepo: 'natillaaaaa/blog-comentario'
    }
  },

  // Sitio completamente estático (npm run generate -> .output/public)
  nitro: {
    preset: 'netlify-static',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/blog']
    }
  }
})
