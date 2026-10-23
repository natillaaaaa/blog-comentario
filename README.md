# Tarea 5 — Comentarios con Utterances en el blog (Nuxt 4 + Nuxt Content)

**Curso:** EIF-511 Arquitectura de Información — Sesión 12: Contenido Social
**Estudiante:** Camilo Redondo

## 🔗 Sitio publicado

**https://TU-SITIO.netlify.app** ← *(reemplazar por el enlace real después de publicar)*

**Repositorio de comentarios (Utterances):** https://github.com/natillaaaaa/blog-comentario ← *(reemplazar)*

---

## Qué se hizo

| Punto de la tarea | Cómo se resolvió |
|---|---|
| 1. Repositorio público para comentarios con Utterances | Repositorio `natillaaaaa/blog-comentario` (público) con la app [Utterances](https://github.com/apps/utterances) instalada. |
| 2. Comentarios en todas las páginas de contenido del blog | Componente `app/components/CommentsUtterances.vue` incluido en `app/pages/blog/[...slug].vue`, la plantilla que despliega **cada** artículo. Cada artículo usa su propio *issue* (hilo). |
| Verificar que cada blog muestra su propio hilo | Cada artículo tiene enlaces **← Anterior / Siguiente →**; al navegar, el widget se recarga con el término del nuevo artículo (ver sección *Verificación*). |
| 3. Publicar el sitio | Netlify, como sitio estático (`npm run generate` → carpeta `dist`). Configuración en `netlify.toml`. |
| 4. Entregar zip + readme con el enlace | Este archivo. |

### Cómo funciona el componente de comentarios

`CommentsUtterances.vue` sigue el Tutorial 8 del curso:

- En `onMounted` crea dinámicamente el `<script src="https://utteranc.es/client.js">` con los atributos `repo`, `issue-term`, `label="comments"` y `theme`. Así el script solo se ejecuta en el navegador; en el pre-renderizado queda el `<div>` vacío.
- Con `watch` sobre la ruta, limpia el widget anterior y lo vuelve a cargar al pasar de un artículo a otro.
- En la página del artículo se usa además `:key="post.path"`, lo que obliga a crear un componente nuevo por artículo.
- **Término del issue:** se pasa la ruta del artículo sin la barra inicial (por ejemplo `blog/mezcla-editorial`). Es exactamente lo que genera `issue-term="pathname"`, pero no cambia si el hosting agrega una barra final a la URL (`/blog/mezcla-editorial/`), lo que evitaría que un mismo artículo termine con dos hilos distintos.
- El tema es `preferred-color-scheme` (claro u oscuro según el sistema del lector).
- El repositorio se toma de `runtimeConfig.public.utterancesRepo` (en `nuxt.config.ts`), que también se puede definir con la variable de entorno `NUXT_PUBLIC_UTTERANCES_REPO`.

```vue
<!-- app/pages/blog/[...slug].vue (fragmento) -->
<CommentsUtterances :key="post.path" :issue-term="issueTerm" />
```

---

## Pasos para dejarlo funcionando

### 1. Crear el repositorio de comentarios e instalar Utterances

1. En GitHub: **New repository** → nombre `blog-comentarios` → **Public** → *Create repository*.
2. Ir a **https://github.com/apps/utterances** → *Install* → *Only select repositories* → elegir `blog-comentarios` → *Install*.

### 2. Poner el nombre del repositorio en el proyecto

Reemplazar `natillaaaaa/blog-comentario` por `su-usuario-de-github/blog-comentarios` en:

- `nuxt.config.ts` → `runtimeConfig.public.utterancesRepo`
- `netlify.toml` → `NUXT_PUBLIC_UTTERANCES_REPO`

### 3. Probar en local

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev          # http://localhost:3000
```

Para revisar la versión estática:

```bash
npm run generate     # genera la carpeta dist/
npx serve dist
```

### 4. Publicar en Netlify

**Opción A — desde un repositorio de GitHub (recomendada):**

1. Subir este proyecto a un repositorio de GitHub (puede ser otro distinto al de comentarios).
2. En Netlify: *Add new site* → *Import an existing project* → GitHub → elegir el repositorio.
3. Netlify lee `netlify.toml` automáticamente:
   - Build command: `npm run generate`
   - Publish directory: `dist`
4. *Deploy*. Copiar la URL `https://….netlify.app` en la parte superior de este README.

**Opción B — arrastrar y soltar:** ejecutar `npm run generate` y arrastrar la carpeta `dist/` a https://app.netlify.com/drop.

> También funciona en GitHub Pages o Cloudflare Pages: basta con publicar el contenido de `dist/` después de `npm run generate`.

---

## Verificación (cada artículo con su propio hilo)

1. Abrir el sitio publicado → **Blog** → abrir *La mezcla editorial*.
2. Bajar hasta **Comentarios**, iniciar sesión con GitHub y escribir un comentario de prueba.
3. Pulsar **Siguiente →** (*Voces personales*): el hilo aparece vacío, porque es otro *issue*. Comentar algo distinto.
4. Volver con **← Anterior**: aparece solo el primer comentario.
5. En `https://github.com/natillaaaaa/blog-comentario/issues` se ve un *issue* por artículo comentado, titulado con su ruta (`blog/mezcla-editorial`, `blog/voces-personales`, …) y con la etiqueta `comments`.

Prueba automatizada realizada antes de la entrega (navegador sin interfaz, recorriendo los 6 artículos con los botones Anterior/Siguiente): en cada página se insertó **un solo** widget, con el término correcto:

```
blog/mezcla-editorial
blog/voces-personales
blog/reenvio-y-comentario
blog/iniciadores-de-conversacion
blog/nano-piramide-invertida
blog/medir-la-presencia-social
```

> El primer comentario de cada artículo lo crea el bot de Utterances como *issue* nuevo. Si un artículo aún no tiene comentarios, el widget muestra el cuadro vacío para escribir el primero.

---

## Estructura del proyecto

```
tarea5-blog-comentarios/
├── app/
│   ├── app.vue
│   ├── assets/css/blog.css            # estilos del blog (claro/oscuro)
│   ├── components/
│   │   ├── CommentsUtterances.vue     # ← widget de comentarios
│   │   ├── TheHeader.vue
│   │   └── TheFooter.vue
│   ├── layouts/default.vue
│   └── pages/
│       ├── index.vue                  # portada con caja de noticias
│       └── blog/
│           ├── index.vue              # listado por fecha descendente
│           └── [...slug].vue          # detalle + Anterior/Siguiente + comentarios
├── content/blog/                      # 6 artículos en Markdown
├── public/images/blog/                # imágenes destacadas (SVG)
├── content.config.ts                  # colección "blog": author, date, image, tags
├── nuxt.config.ts                     # módulos, CSS, repo de Utterances, preset estático
├── netlify.toml                       # build y publicación en Netlify
├── .env.example
└── package.json
```

## Tecnologías

- Nuxt 4 + Nuxt Content 3 (colección `blog` validada con Zod)
- Utterances (comentarios almacenados como *issues* de GitHub; sin publicidad ni rastreo)
- Netlify (sitio estático, preset `netlify-static`)
