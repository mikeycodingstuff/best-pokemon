<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from './lib/supabaseClient';

// Reactive reference for the two Pokémon data
const pokemons = ref([]);

// Fetch Pokémon data when the component is mounted
onMounted(async () => {
  const { data, error } = await supabase.from('pokemons').select('*');
  if (error) {
    console.error('Error fetching Pokémon:', error);
  } else {
    // Randomly select 2 Pokémon
    pokemons.value = getRandomPokemons(data, 2);
  }
});

// Function to randomly select n Pokémon from the list
const getRandomPokemons = (pokemonsList, n) => {
  const shuffled = pokemonsList.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

// Function to handle voting
const handleVote = async (pokemonId) => {
  const { data, error } = await supabase
    .from('pokemon')
    .update({ votes: (votes) => votes + 1 })
    .eq('id', pokemonId);

  if (error) {
    console.error('Error voting:', error);
  } else {
    console.log('Vote successful!');
    // After voting, select a new pair of random Pokémon
    const { data: allPokemons, error: fetchError } = await supabase
      .from('pokemons')
      .select('*');

    if (fetchError) {
      console.error('Error fetching new Pokémon:', fetchError);
    } else {
      pokemons.value = getRandomPokemons(allPokemons, 2);
    }
  }
};
</script>

<template>
  <div class="flex justify-center ">
    <h1>Vote for your favorite Pokémon!</h1>
    <div v-if="pokemons.length === 2">
      <div v-for="pokemon in pokemons" :key="pokemon.id">
        <img :src="pokemon.image_url" :alt="pokemon.name" width="150" />
        <h3>{{ pokemon.name }}</h3>
      </div>
      <div>
        <button @click="handleVote(pokemons[0].id)">Vote for {{ pokemons[0].name }}</button>
        <button @click="handleVote(pokemons[1].id)">Vote for {{ pokemons[1].name }}</button>
      </div>
    </div>
    <p v-else>Loading Pokémon...</p>
  </div>
</template>
