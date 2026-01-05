<template>
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
      <!-- search -->
      <div class="search-bar">
        <button class="search-bar-icon" type="button">
          <img src="../assets/ic_search@3x.png" alt="Search" />
        </button>

        <input
          type="text"
          class="search-bar-input"
          v-model="store.searchInput"
          placeholder="Search for a house"
        />

        <button
          v-if="store.searchInput.length > 0"
          class="search-bar-clear"
          type="button"
          @click="store.searchInput = ''"
        >
          <img src="../assets/ic_clear@3x.png" alt="Clear" />
        </button>
      </div>

      <!-- price / size toggle -->
      <div class="sort-toggle">
        <button
          class="sort-toggle-btn"
          :class="{ 'sort-toggle-btn--active': store.isActive === 'price' }"
          @click="store.isActive = 'price'"
          type="button"
        >
          Price
        </button>
        <button
          class="sort-toggle-btn"
          :class="{ 'sort-toggle-btn--active': store.isActive === 'size' }"
          @click="store.isActive = 'size'"
          type="button"
        >
          Size
        </button>
      </div>
    </div>

    <!-- results counter -->
    <p v-if="store.searchInput.length > 0 && store.filteredHouses.length > 0" 
      class="search-result">
      {{ store.filteredHouses.length }} results found
    </p>
    <div v-show="store.filteredHouses.length === 0" class="no-results">
      <img src="../assets/img_empty_houses@3x.png" alt="No results" />
      <p class="no-results-text">No results found.</p>
      <p>Please try another keyword.</p>
    </div>

    <!-- list of houses -->
  </section>
  <div class="houses-list">
    <HouseListingComponent v-for="house in store.filteredHouses" :key="house.id" :house="house" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import HouseListingComponent from '@/components/HouseListingComponent.vue'
import { useStore } from '@/stores/store'

const store = useStore();

onMounted(() => {
  store.getHouses();
});
</script>