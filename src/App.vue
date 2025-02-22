<template>
  <div class="p-3">
  <h1 class="text-center text-7xl">Best Pokémon</h1>
  <nav class="flex p-3 gap-3 justify-center">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/test">Test</RouterLink>
  </nav>
  </div>
  <main>
    <RouterView />
  </main>
</template>
