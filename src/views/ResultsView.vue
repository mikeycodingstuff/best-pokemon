<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";
import collect from "collect.js";

const pokemons = ref(collect());

const formattedId = (id) => {
  return `#${id.toString().padStart(4, "0")}`;
};

const winPercentage = (wins, losses) => {
  const total = wins + losses;
  return total === 0 ? 0 : (wins / total) * 100;
};

const fetchPokemons = async () => {
  const { data, error } = await supabase
    .from("pokemons")
    .select("id, name, wins, losses, image_url");

  if (error) {
    console.error("Error fetching Pokémon results:", error);
  }

  pokemons.value = collect(data)
    .map((pokemon) => ({
      ...pokemon,
      winRate: winPercentage(pokemon.wins, pokemon.losses),
    }))
    .sortBy("wins")
    .sortByDesc("winRate")
};

onMounted(() => {
  fetchPokemons();
});
</script>

<template>
  <div class="min-h-screen bg-stone-900 p-6 pt-12">
    <div class="max-w-2xl mx-auto flex flex-col gap-4">
      <div
        v-for="pokemon in pokemons"
        :key="pokemon.id"
        class="bg-stone-800 p-4 rounded-lg flex items-center"
      >
        <img :src="pokemon.image_url" :alt="pokemon.name" class="w-16 h-16 rounded-full" />

        <div class="ml-4 w-full flex flex-col gap-y-2">
          <div class="flex justify-between">
            <h3 class="text-xl font-bold">{{ pokemon.name }}</h3>
            <p class="text-stone-400">ID: {{ formattedId(pokemon.id) }}</p>
          </div>

          <div class="flex justify-between">
            <p class="font-semibold text-stone-300">win rate: {{ pokemon.winRate.toFixed(1) }}%</p>
            <div class="text-stone-300 flex gap-2">
              <span class="text-green-400/80">{{ pokemon.wins }} wins</span>
              <span class="text-red-400/80">{{ pokemon.losses }} losses</span>
            </div>
          </div>
        </div>
      </div>

      <p v-if="loading" class="text-center text-stone-500 mt-4">Loading more...</p>
      <p v-if="allLoaded" class="text-center text-stone-500 mt-4">No more Pokémon to load.</p>
    </div>
  </div>
</template>
