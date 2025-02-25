<template>
  <div class="p-3">
    <RouterLink to="/" class="flex justify-center text-7xl">best pokémon</RouterLink>
    <nav class="flex p-3 gap-3 justify-center">
      <RouterLink to="/about">about</RouterLink>
      <RouterLink to="/results">results</RouterLink>
    </nav>
  </div>
  <main>
    <RouterView />
  </main>
</template>
