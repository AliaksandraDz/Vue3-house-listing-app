<template>
  <div class="container">
    <section class="houses-page main">

      <!-- Top row: title + create button -->
      <div class="houses-header">
        <h1 class="houses-title">Houses</h1>

        <router-link :to="{ name: 'HouseCreateView' }" class="create-link">
          <button class="btn btn-primary btn-create">
            <img
              src="../assets/ic_plus_grey@3x.png"
              alt="Create"
              class="btn-create-icon-sm"
            />
            <img
              src="../assets/ic_plus_white@3x.png"
              alt="Create"
              class="btn-create-icon-lg"
            />
            <span class="btn-create-label">Create new</span>
          </button>
        </router-link>
      </div>

      <!-- Search + sort controls -->
      <div class="houses-controls">
        <SearchBar v-model="store.searchInput" placeholder="Search for a house" />
        <SortToggle v-model="store.isActive" />
      </div>

      <!-- Results counter -->
      <h2 v-if="store.searchInput.length > 0 && store.filteredHouses.length == 1" 
        class="search-result">
        {{ store.filteredHouses.length }} result found
      </h2>
      <h2 v-else-if="store.searchInput.length > 0 && store.filteredHouses.length > 0" 
        class="search-result">
        {{ store.filteredHouses.length }} results found
      </h2>
    </section>

    <!-- List of houses -->
    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-else class="houses-list">
      <HouseListingComponent v-for="house in store.filteredHouses" :key="house.id" :house="house" />
      <div v-show="store.filteredHouses.length === 0" class="no-results">
        <img src="../assets/img_empty_houses@3x.png" alt="No results" />
        <p class="no-results-text">No results found.</p>
        <p>Please try another keyword.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import HouseListingComponent from '@/components/HouseListingComponent.vue'
import SearchBar from '@/components/SearchBar.vue'
import SortToggle from '@/components/SortToggle.vue'

import { ref } from 'vue'
import { onMounted } from 'vue';
import { useStore } from '@/stores/store'

const store = useStore();
const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true
  await store.getHouses()
  isLoading.value = false
})

</script>

<style scoped>

</style>