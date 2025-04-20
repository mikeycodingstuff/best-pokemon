<script setup>
import NavLink from '@/components/NavLink.vue'
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="p-3">
      <div class="flex justify-center">
        <RouterLink
          to="/"
          class="text-7xl p-3 rounded bg-gradient-to-r from-rose-300 to-rose-300 text-transparent bg-clip-text hover:from-rose-300 hover:to-amber-300 transition-colors duration-500 focus:outline-none focus-visible:ring-4 focus:ring-rose-300"
        >
          best pokémon
        </RouterLink>
      </div>

      <nav class="flex p-3 gap-5 justify-center mt-5">
        <NavLink to="/">home</NavLink>
        <NavLink to="/about">about</NavLink>
        <NavLink to="/results">results</NavLink>
      </nav>
    </div>

    <main class="grow">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>
