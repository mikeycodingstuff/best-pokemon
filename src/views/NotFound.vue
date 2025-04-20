<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center">
    <h1 class="text-5xl font-bold">404 - Page Not Found</h1>
    <p class="text-xl mt-4">Oops! The page you're looking for doesn't exist.</p>
    <RouterLink
      to="/"
      class="mt-6 px-4 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-700 hover:cursor-pointer transition focus:outline-none focus-visible:ring-2 focus:ring-stone-100"
    >
      Go Home
    </RouterLink>
  </div>
</template>
