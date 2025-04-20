<template>
  <div class="h-screen">
    <div class="p-3">
      <div class="flex justify-center">
        <RouterLink
          to="/"
          class="text-7xl p-3 rounded text-indigo-300 hover:text-indigo-400 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus:ring-indigo-500"
        >
          best pokémon
        </RouterLink>
      </div>
      <nav class="flex p-3 gap-5 justify-center mt-5">
        <RouterLink
          to="/"
          class="px-1 rounded text-xl hover:text-indigo-300 hover:cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus:ring-indigo-500"
        >
          home
        </RouterLink>
        <RouterLink
          to="/about"
          class="px-1 rounded text-xl hover:text-indigo-300 hover:cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus:ring-indigo-500"
        >
          about
        </RouterLink>
        <RouterLink
          to="/results"
          class="px-1 rounded text-xl hover:text-indigo-300 hover:cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus:ring-indigo-500"
        >
          results
        </RouterLink>
      </nav>
    </div>

    <main>
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>
