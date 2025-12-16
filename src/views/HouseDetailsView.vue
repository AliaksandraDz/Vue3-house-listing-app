<template>
    <div class="house-details">
    <!-- Loader -->
    <div v-if="isLoading" class="main-house-card --loading">
      Loading house...
    </div>

    <!-- Error / not found -->
    <div v-else-if="!houseDetails" class="main-house-card --loading">
      House not found
    </div>

    <!-- Only render when data exists -->
    <article v-else class="main-house-card">
      <img
        class="main-house-card-image"
        :src="houseDetails?.image"
        alt="House"
      />

      <!-- to delete and edit only my houses, two options
          <button v-if="houseDetails.madeByMe">Edit</button>
      <button v-if="houseDetails.madeByMe">Delete</button>

      <div v-if="houseDetails?.madeByMe" class="owner-actions">
          <button class="btn-edit">Edit</button>
          <button class="btn-delete">Delete</button>
      </div> -->

      <div class="main-house-card-info">
        <h3 class="main-house-card-title">
          {{ houseDetails?.location?.street }} {{ houseDetails?.location?.houseNumber }}
        </h3>

        <p class="main-house-card-price">€ {{ houseDetails.price }}</p>
        <p class="main-house-card-address">
          {{ houseDetails?.location?.zip }} {{ houseDetails?.location?.city }}
        </p>

        <p class="main-house-card-meta">
          <span class="meta-item">
            <img src="../assets/ic_bed@3x.png" alt="Bed" />
            {{ houseDetails?.rooms?.bedrooms }}
          </span>

          <span class="meta-item">
            <img src="../assets/ic_bath@3x.png" alt="Bath" />
            {{ houseDetails?.rooms?.bathrooms }}
          </span>

          <span class="meta-item">
            <img src="../assets/ic_size@3x.png" alt="Size" />
            {{ houseDetails?.size }} m2
          </span>
        </p>
        
        <p class="main-house-card-description">
          {{ houseDetails?.description }}
        </p>

      </div>
    </article>

    <div class="recommended-houses">Im Recommended!</div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/stores/store'

const route = useRoute()
const store = useStore()

const houseDetails = ref(null)
const isLoading = ref(true) // start as true

watchEffect(async () => {
  const idParam = route.params.id
  if (!idParam) return

  isLoading.value = true
  try {
    const id = Number(idParam)
    houseDetails.value = await store.getHouseById(id)
  } catch (err) {
    console.error('Error while fetching house:', err)
    houseDetails.value = null
  } finally {
    isLoading.value = false
  }
})
</script>
