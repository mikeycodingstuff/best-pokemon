<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const pokemons = ref([]);

onMounted(async () => {
  await fetchPokemons();
});

const fetchPokemons = async () => {
  const { data, error } = await supabase.from("pokemons").select("*");
  if (error) {
    console.error("Error fetching Pokémon:", error);
  } else {
    pokemons.value = getRandomPokemons(data, 2);
  }
};

const getRandomPokemons = (pokemonsList, n) => {
  const shuffled = [...pokemonsList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

const handleVote = async (winnerId) => {
  if (pokemons.value.length !== 2) return;

  const [firstPokemon, secondPokemon] = pokemons.value;
  const loserId = firstPokemon.id === winnerId ? secondPokemon.id : firstPokemon.id;

  const { error: winError } = await supabase
    .from("pokemons")
    .update({ wins: firstPokemon.id === winnerId ? firstPokemon.wins + 1 : secondPokemon.wins + 1 })
    .eq("id", winnerId);

  const { error: lossError } = await supabase
    .from("pokemons")
    .update({
      losses: firstPokemon.id === loserId ? firstPokemon.losses + 1 : secondPokemon.losses + 1,
    })
    .eq("id", loserId);

  if (winError || lossError) {
    console.error("Error updating votes:", winError || lossError);
  } else {
    console.log("Vote successful!");
    await fetchPokemons();
  }
};
</script>

<template>
  <div class="h-screen w-screen bg-stone-900">
    <div class="py-12">
      <h1 class="text-3xl text-center">Vote for your favourite Pokémon!</h1>
    </div>
    <div class="flex justify-center items-center mt-12">
      <div v-if="pokemons.length === 2" class="flex gap-32">
        <div v-for="pokemon in pokemons" :key="pokemon.id" class="flex flex-col items-center">
          <img
            :src="pokemon.image_url"
            :alt="pokemon.name"
            width="200"
            height="200"
            class="object-cover"
          />
          <h3>{{ pokemon.name }}</h3>
          <button
            @click="handleVote(pokemon.id)"
            class="px-4 py-2 mt-4 rounded-lg bg-indigo-500 hover:cursor-pointer hover:bg-indigo-700 transition duration-300 hover:scale-110"
          >
            Vote
          </button>
        </div>
      </div>
      <p v-else>Loading Pokémon...</p>
    </div>
  </div>
</template>
