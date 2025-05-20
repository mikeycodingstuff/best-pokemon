<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import collect from 'collect.js'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { formattedId } from '@/utils/format.js'

const pokemons = ref(collect())
const errorMessage = ref('')

onMounted(async () => {
  await fetchPokemons()
})

const fetchPokemons = async () => {
  const { data, error } = await supabase.from('pokemons').select('*')
  if (error) {
    errorMessage.value = 'Failed to load Pokémon 😔'
  } else {
    pokemons.value = getRandomPokemons(data, 2)
  }
}

const getRandomPokemons = (pokemonsList, n) => {
  return collect(pokemonsList).random(n)
}

const handleVote = async (winnerId) => {
  if (pokemons.value.count() !== 2) return

  const [firstPokemon, secondPokemon] = pokemons.value
  const loserId = firstPokemon.id === winnerId ? secondPokemon.id : firstPokemon.id

  await supabase
    .from('pokemons')
    .update({ wins: firstPokemon.id === winnerId ? firstPokemon.wins + 1 : secondPokemon.wins + 1 })
    .eq('id', winnerId)

  await supabase
    .from('pokemons')
    .update({
      losses: firstPokemon.id === loserId ? firstPokemon.losses + 1 : secondPokemon.losses + 1,
    })
    .eq('id', loserId)

  await fetchPokemons()
}
</script>

<template>
  <div class="h-full justify-center flex bg-stone-100 dark:bg-stone-900">
    <div class="p-6 lg:p-10 h-fit lg:mt-10">
      <h1 class="text-3xl text-center">pick the best pokémon!</h1>
      <div class="flex justify-center items-center mt-10 lg:mt-24">
        <ErrorMessage v-if="errorMessage" :message="errorMessage" />

        <div v-else-if="pokemons.count() === 2" class="flex gap-12 lg:gap-28">
          <div
            v-for="pokemon in pokemons"
            :key="pokemon.id"
            class="flex flex-col items-center p-3 py-6 lg:w-sm max-w-3xs lg:min-h-[400px] justify-between text-center rounded-2xl bg-gradient-to-b from-stone-300/50 to-stone-300/50 dark:from-stone-700 dark:to-stone-700 hover:cursor-pointer hover:from-rose-300/50 hover:to-amber-300/50 dark:hover:from-rose-300/90 dark:hover:to-amber-200/90 transition duration-300 hover:scale-105 group"
            @click="handleVote(pokemon.id)"
          >
            <h2
              class="text-3xl w-full wrap-break-word dark:text-rose-300 dark:group-hover:text-stone-900 transition-colors"
            >
              {{ pokemon.name }}{{}}
            </h2>
            <img
              :src="pokemon.image_url"
              :alt="pokemon.name"
              width="250"
              height="250"
              class="object-cover mb-4"
            />
            <h2
              class="text-stone-500 dark:text-stone-400 dark:group-hover:text-stone-500 font-semibold transition-colors"
            >
              {{ formattedId(pokemon.id) }}
            </h2>
          </div>
        </div>
        <p v-else>Loading Pokémon...</p>
      </div>
    </div>
  </div>
</template>
