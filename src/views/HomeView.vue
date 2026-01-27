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

<style>

      .houses-list {
        margin: 0 auto 25px auto;
        display: flex;
        flex-direction: column;
        gap: 1.5px;
      }
      .houses-page {
        margin: 32px 0 0 0;
        display: flex;
        flex-direction: column;
      }
      /* top row: title + create button */
      .houses-header {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        margin-bottom: 28px;
        width: 100%;
        margin-inline: auto;
      }
      
      .houses-title {
        font-weight: 700;
        margin: 0;
      }
      
      .btn-primary {
        background-color: var(--red);
        color: var(--white);
        border-radius: 7px;
        padding: 5px 25px;
        text-transform: uppercase;
        font-weight: 600;
        height: 46px;
      }
        /* create button icon and label */
      .btn-create-icon-sm {
        height: 18px;
      }
      
      .create-button img {
        display: none;
      }
      
      .btn-create-label {
        white-space: nowrap;
        font-weight: 700;
      }
      .search-result {
        width: 100%;
      }
        /* Search + toggle row */
      .houses-controls {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        margin-bottom: 28px;
        width: 100%;
        margin-inline: auto;
      }
      /* Large devices */
      @media (min-width: 769px) {
        .btn-primary {
          font-size: 18px;
        }
        .btn-create-icon-sm {
          display: none;
        }
        .search-result {
          padding-bottom: 20px;
        }
      }
      /* Small devices */
      @media (max-width: 768px) {
        .btn-primary {
          font-size: 12px;
        }
        .btn-create-icon-lg {
          display: none;
        }
        .houses-page {
          width: 100%; 
        }
        .houses-title {
          font-size: 25.6px;
          text-align: center;
          flex: 1;
        }
        .search-result {
          width: 100%;
          padding: 0 20px 20px;
        }
        .houses-list,
        .loading  {
          padding: 0 0 50px;
        }
        .btn-create-label {
          display: none;
        }
      
        .btn-primary.btn-create {
          padding: 6.4px 9.6px;
          border-radius: 50%;
          background-color: var(--soft-white);
        }
      
        .houses-controls {
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          margin: 0;
          padding: 0 0 20px;
        }
      }

</style>