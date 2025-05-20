<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { supabase } from '../lib/supabaseClient'
import collect from 'collect.js'
import ErrorMessage from '@/components/ErrorMessage.vue'
import Fuse from 'fuse.js'
import { formattedId } from '@/utils/format.js'

const pokemons = ref(collect())
const errorMessage = ref('')
const sortBy = ref('winRate')
const desc = ref(false)
const searchQuery = ref('')
const showBackToTop = ref(false)

const winPercentage = (wins, losses) => {
  const total = wins + losses
  return total === 0 ? 0 : (wins / total) * 100
}

const fetchPokemons = async () => {
  const { data, error } = await supabase
    .from('pokemons')
    .select('id, name, wins, losses, image_url')

  if (error) {
    errorMessage.value = 'Failed to load Pokémon data 😔'
    return
  }

  pokemons.value = collect(data).map((pokemon) => ({
    ...pokemon,
    winRate: winPercentage(pokemon.wins, pokemon.losses),
  }))
}

const sortedPokemons = computed(() => {
  const reverseSortFields = collect(['wins', 'losses', 'winRate'])

  if (desc.value) {
    if (reverseSortFields.contains(sortBy.value)) {
      if (sortBy.value === 'wins' || sortBy.value === 'losses') {
        return pokemons.value.sortByDesc('winRate').sortBy(sortBy.value)
      }

      if (sortBy.value === 'winRate') {
        return pokemons.value.sortBy('losses').sortByDesc('wins').sortBy(sortBy.value)
      }

      return pokemons.value.sortBy(sortBy.value)
    } else {
      return pokemons.value.sortByDesc(sortBy.value)
    }
  }

  if (reverseSortFields.contains(sortBy.value)) {
    if (sortBy.value === 'wins' || sortBy.value === 'losses') {
      return pokemons.value.sortBy('winRate').sortByDesc(sortBy.value)
    }

    if (sortBy.value === 'winRate') {
      return pokemons.value.sortByDesc('losses').sortBy('wins').sortByDesc(sortBy.value)
    }

    return pokemons.value.sortByDesc(sortBy.value)
  } else {
    return pokemons.value.sortBy(sortBy.value)
  }
})

const toggleSortOrder = () => {
  desc.value = !desc.value
}

const filteredPokemons = computed(() => {
  if (!searchQuery.value.trim()) {
    return sortedPokemons.value
  }

  const fuse = new Fuse(sortedPokemons.value.items, {
    keys: ['name', 'id'],
    threshold: 0.3,
  })

  const result = fuse.search(searchQuery.value)

  return result.map((r) => r.item)
})

const onScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

watch(searchQuery, (val) => {
  localStorage.setItem('searchQuery', val)
})

onMounted(() => {
  searchQuery.value = localStorage.getItem('searchQuery') || ''
  fetchPokemons()
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="bg-stone-100 dark:bg-stone-900 p-6 pt-12">
    <div class="max-w-2xl mx-auto flex flex-col gap-4 relative">
      <div class="flex justify-between items-center">
        <select
          v-model="sortBy"
          class="p-2 rounded border-r-8 border-transparent bg-stone-300/70 hover:bg-stone-400/70 dark:bg-stone-800 dark:text-stone-300 hover:cursor-pointer dark:hover:bg-stone-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          <option value="id">id</option>
          <option value="name">name</option>
          <option value="wins">wins</option>
          <option value="losses">losses</option>
          <option value="winRate">win rate</option>
        </select>
        <button
          @click="toggleSortOrder"
          class="p-2 rounded bg-stone-300/70 hover:bg-stone-400/70 dark:bg-stone-800 dark:text-stone-300 hover:cursor-pointer dark:hover:bg-stone-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          <svg
            v-if="desc"
            class="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 14L12 8L18 14"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 10L12 16L18 10"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <div class="relative">
        <input
          v-model="searchQuery"
          placeholder="search..."
          class="w-full p-2 pr-10 rounded caret-rose-300 bg-stone-300/70 dark:bg-stone-800 dark:text-stone-300 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2 p-2 hover:text-rose-300 hover:cursor-pointer focus:outline-none"
          aria-label="Clear search"
        >
          ✕
        </button>
      </div>

      <ErrorMessage v-if="errorMessage" :message="errorMessage" class="mt-12" />

      <div
        v-for="pokemon in filteredPokemons"
        :key="pokemon.id"
        class="bg-stone-300/70 dark:bg-stone-800 dark:text-stone-300 p-4 rounded-lg flex items-center"
      >
        <img :src="pokemon.image_url" :alt="pokemon.name" class="w-24 h-24 rounded-full" />

        <div class="ml-4 w-full flex flex-col gap-y-2">
          <div class="flex justify-between">
            <h2 class="text-xl font-bold text-rose-400/80 dark:text-rose-300">
              {{ pokemon.name }}
            </h2>
            <p class="text-stone-500 dark:text-stone-400">ID: {{ formattedId(pokemon.id) }}</p>
          </div>

          <div class="flex justify-between">
            <p class="font-semibold text-stone-500 dark:text-stone-400">
              win rate: {{ pokemon.winRate.toFixed(1) }}%
            </p>
            <div class="text-stone-300 flex gap-2">
              <span class="text-green-500/80 dark:text-green-400/80">{{ pokemon.wins }} wins</span>
              <span class="text-red-500/80 dark:text-red-400/80">{{ pokemon.losses }} losses</span>
            </div>
          </div>
        </div>
      </div>
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-4 right-4 p-3 rounded-lg shadow-lg bg-gradient-to-b from-stone-300/50 to-stone-300/50 dark:from-stone-700 dark:to-stone-700 hover:cursor-pointer hover:from-rose-300/50 hover:to-amber-300/50 dark:hover:from-rose-300/90 dark:hover:to-amber-200/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-stone-100"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 14L12 8L18 14"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
