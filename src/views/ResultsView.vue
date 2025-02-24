<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { supabase } from "../lib/supabaseClient";

const pokemons = ref([]);
const limit = 20;
const offset = ref(0);
const loading = ref(false);
const allLoaded = ref(false);

const winPercentage = (wins, losses) => {
  const total = wins + losses;
  return total === 0 ? 0 : (wins / total) * 100;
};

const fetchPokemons = async () => {
  if (loading.value || allLoaded.value) return;
  loading.value = true;

  const { data, error } = await supabase
    .from("pokemons")
    .select("id, name, wins, losses, image_url");

  if (error) {
    console.error("Error fetching Pokémon results:", error);
  }

  const sortedPokemons = data
    .map((pokemon) => ({
      ...pokemon,
      winRate: winPercentage(pokemon.wins, pokemon.losses),
    }))
    .sort((a, b) => {
      if (b.winRate === a.winRate) {
        return b.wins - a.wins;
      }

      return b.winRate - a.winRate;
    });

  // Paginate: Add only the next set of Pokémon
  const newPokemons = sortedPokemons.slice(offset.value, offset.value + limit);
  if (newPokemons.length < limit) allLoaded.value = true;

  pokemons.value.push(...newPokemons);
  offset.value += limit;

  loading.value = false;
};

// Infinite scrolling
const handleScroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    fetchPokemons();
  }
};

onMounted(() => {
  fetchPokemons();
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="min-h-screen bg-stone-900 p-6">
    <div class="max-w-2xl mx-auto">
      <div
        v-for="pokemon in pokemons"
        :key="pokemon.id"
        class="bg-stone-800 p-4 rounded-lg mb-4 flex items-center"
      >
        <img :src="pokemon.image_url" :alt="pokemon.name" class="w-16 h-16 rounded-full" />
        <div class="ml-4">
          <h3 class="text-xl font-bold">{{ pokemon.name }}</h3>
          <p class="text-stone-400">
            <span class="text-green-400/80">Wins: {{ pokemon.wins }}</span> |
            <span class="text-red-400/80">Losses: {{ pokemon.losses }}</span>
          </p>
          <p class="font-semibold">Win Rate: {{ pokemon.winRate.toFixed(1) }}%</p>
        </div>
      </div>

      <p v-if="loading" class="text-center text-stone-500 mt-4">Loading more...</p>
      <p v-if="allLoaded" class="text-center text-stone-500 mt-4">No more Pokémon to load.</p>
    </div>
  </div>
</template>
