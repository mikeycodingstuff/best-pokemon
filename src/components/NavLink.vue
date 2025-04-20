<script setup>
defineProps({
  to: {
    type: String,
    default: '/',
  },
})
</script>

<template>
  <RouterLink
    :to="to"
    class="px-1 rounded text-xl text-stone-700 dark:text-stone-200 hover:text-rose-300 hover:cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus:ring-rose-300 focus:text-rose-300"
  >
    <slot />
  </RouterLink>
</template>
