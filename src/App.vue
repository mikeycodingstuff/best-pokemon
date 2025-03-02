<template>
  <div class="h-screen">
    <div class="p-3">
      <div class="flex justify-center">
        <RouterLink to="/" class="text-7xl">best pokémon</RouterLink>
      </div>
      <nav class="flex p-3 gap-5 justify-center mt-5">
        <RouterLink to="/">home</RouterLink>
        <RouterLink to="/about">about</RouterLink>
        <RouterLink to="/results">results</RouterLink>
      </nav>
    </div>

    <main>
      <RouterView />
    </main>
  </div>
</template>
