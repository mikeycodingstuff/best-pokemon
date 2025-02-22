<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

const pokemons = ref([])

async function getPokemons() {
  const { data } = await supabase.from('pokemons').select()
  pokemons.value = data
}

onMounted(() => {
  getPokemons()
})
</script>

<template>
  <ul class="list-none">
    <li v-for="pokemon in pokemons" :key="pokemon.id">{{ pokemon.name }}</li>
  </ul>
</template>
