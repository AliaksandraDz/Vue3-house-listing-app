<template>

    <div class="house-details main">
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

    <router-link to="/" class="btn btn-back">
      <picture>
          <!-- Small devices -->
          <source srcset="../assets/ic_back_white@3x.png" media="(max-width: 768px)">
          <!-- Large devices -->
          <source srcset="../assets/ic_back_grey@3x.png">
          <img class="btn-back-icon" src="../assets/ic_back_grey@3x.png" alt="Back">
      </picture> 
      <span class="btn-back-label">Back to overview</span>
    </router-link>

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

        <p class="main-house-card-meta">
          <span class="meta-item">
            <img src="../assets/ic_location@3x.png" alt="Location" />
            {{ houseDetails?.location?.zip }} {{ houseDetails?.location?.city }}
          </span>
        </p>

        <p class="main-house-card-meta">
          <span class="meta-item">
            <img src="../assets/ic_price@3x.png" alt="Price" />
            {{ houseDetails?.price }}
          </span>

          <span class="meta-item">
            <img src="../assets/ic_size@3x.png" alt="Size" />
            {{ houseDetails?.size }} m2
          </span>

          <span class="meta-item">
            <img src="../assets/ic_construction_date@3x.png" alt="Construction Year" />
            {{ houseDetails?.constructionYear }}
          </span>
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
