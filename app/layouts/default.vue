<!-- app/layouts/default.vue -->
<template>
  <div class="site">
    <TheHeader />
    <main class="container">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
