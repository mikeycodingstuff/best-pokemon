<script setup>
defineProps({
  message: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="flex justify-center">
    <p class="text-red-500 text-xl font-semibold bg-red-400/30 rounded-lg px-4 py-2 text-center">
      {{ message }}
    </p>
  </div>
</template>
