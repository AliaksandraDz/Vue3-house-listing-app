<template>
    <div class="house-details">
      <!-- show loader or fallback while fetching -->
      <article class="main-house-card" v-if="houseDetails">
        <img
          class="house-card-image"
          :src="houseDetails.image"
          alt="House"
        />

        <!-- to delete and edit only my houses, two options
            <button v-if="houseDetails.madeByMe">Edit</button>
        <button v-if="houseDetails.madeByMe">Delete</button>

        <div v-if="houseDetails?.madeByMe" class="owner-actions">
            <button class="btn-edit">Edit</button>
            <button class="btn-delete">Delete</button>
        </div> -->

        <div class="house-card-info">
          <h3 class="house-card-title">
            {{ houseDetails.location.street }} {{ houseDetails.location.houseNumber }}
          </h3>
  
          <p class="house-card-price">€ {{ houseDetails.price }}</p>
          <p class="house-card-address">
            {{ houseDetails.location.zip }} {{ houseDetails.location.city }}
          </p>
  
          <p class="house-card-meta">
            <span class="meta-item">
              <img src="../assets/ic_bed@3x.png" alt="Bed" />
              {{ houseDetails.rooms.bedrooms }}
            </span>
  
            <span class="meta-item">
              <img src="../assets/ic_bath@3x.png" alt="Bath" />
              {{ houseDetails.rooms.bathrooms }}
            </span>
  
            <span class="meta-item">
              <img src="../assets/ic_size@3x.png" alt="Size" />
              {{ houseDetails.size }} m2
            </span>
          </p>
        </div>
      </article>
  
      <div v-else class="main-house-card --loading">
        Loading house...
      </div>
  
      <div class="recommended-houses">Im Recommended!</div>
    </div>
  </template>
  
  <script setup>
  import { ref, watchEffect } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useStore } from '@/stores/store'; // keep as you had it
  
  const route = useRoute();
  const router = useRouter();
  const store = useStore();
  
  const houseDetails = ref(null);
  const isLoading = ref(true);
  
  const fetchData = async () => {
    // if no id in params, bail out early
    const idParam = route.params.id;
    if (!idParam) {
      houseDetails.value = null;
      isLoading.value = false;
      return;
    }
  
    isLoading.value = true;
    console.log('isLoading :', isLoading.value);
    try {
      // ensure houses are loaded (your store should handle caching if needed)
      await store.getHouses();
      console.log('Fetched houses:', store.houses);
  
      const id = parseInt(idParam, 10);
      const found = store.houses.find((h) => h.id === id);
  
      if (found) {
        houseDetails.value = found;
        console.log('Found house:', houseDetails.value);
      } else {
        console.error(`House with ID ${idParam} not found.`);
        houseDetails.value = null;
        // optional: redirect back to list if not found
        // router.replace({ name: 'HousesList' });
      }
    } catch (err) {
      console.error('Error while fetching houses:', err);
      houseDetails.value = null;
    } finally {
      isLoading.value = false;
      console.log('isLoading :', isLoading.value);
    }
  };
  
  // re-run fetch when route.params.id changes
  watchEffect(() => {
    // watchEffect will re-run when route.params.id changes because route is reactive
    fetchData();
  });
  </script>
  