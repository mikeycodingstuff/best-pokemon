<template>
  <div class="p-3">
    <RouterLink to="/" class="flex justify-center text-7xl">Best Pokémon</RouterLink>
    <nav class="flex p-3 gap-3 justify-center">
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/results">Results</RouterLink>
    </nav>
  </div>
  <main>
    <RouterView />
  </main>
</template>
