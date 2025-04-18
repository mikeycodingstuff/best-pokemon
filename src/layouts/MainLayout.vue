<template>
  <div class="h-screen">
    <div class="p-3">
      <div class="flex justify-center">
        <RouterLink
          to="/"
          class="text-7xl text-indigo-300 hover:text-indigo-400 transition-colors duration-300"
        >
          best pokémon
        </RouterLink>
      </div>
      <nav class="flex p-3 gap-5 justify-center mt-5">
        <RouterLink
          to="/"
          class="text-xl hover:text-indigo-300 hover:cursor-pointer transition-colors"
        >
          home
        </RouterLink>
        <RouterLink
          to="/about"
          class="text-xl hover:text-indigo-300 hover:cursor-pointer transition-colors"
        >
          about
        </RouterLink>
        <RouterLink
          to="/results"
          class="text-xl hover:text-indigo-300 hover:cursor-pointer transition-colors"
        >
          results
        </RouterLink>
      </nav>
    </div>

    <main>
      <RouterView />
    </main>
  </div>
</template>
