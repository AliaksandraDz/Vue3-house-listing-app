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

    <router-link :to="{ name: 'HomeView' }" class="btn btn-back">
      <picture>
          <!-- Small devices -->
          <source srcset="../assets/ic_back_white@3x.png" media="(max-width: 768px)">
          <!-- Large devices -->
          <source srcset="../assets/ic_back_grey@3x.png">
          <img class="btn-back-icon" src="../assets/ic_back_grey@3x.png" alt="Back">
      </picture> 
      <span class="btn-back-label">Back to overview</span>
    </router-link>

    <!-- Small devices -->
    <div class="house-actions-sm" v-if="houseDetails?.madeByMe">
      <router-link
        :to="{ name: 'HouseEditView', params: { id: $route.params.id }}"
        class="btn btn-edit">
          <img class="btn-edit-icon" src="../assets/ic_edit_white@3x.png" alt="Edit" />
      </router-link>

      <button class="btn btn-delete" @click="showModal = true">
          <img class="btn-delete-icon" src="../assets/ic_delete_white@3x.png" alt="Delete" />
      </button>
    </div>

      <img
        class="main-house-card-image"
        :src="houseDetails?.image"
        alt="House"
      />

      <div class="main-house-card-info">
        <div class="main-house-card-header">
          <h1 class="main-house-card-title">
            {{ houseDetails?.location?.street }} {{ houseDetails?.location?.houseNumber }} {{ houseDetails?.location?.houseNumberAddition }}
          </h1>

          <!-- Large devices -->
          <div class="house-actions" v-if="houseDetails?.madeByMe">
            <router-link
              :to="{ name: 'HouseEditView', params: { id: $route.params.id }}"
              class="btn btn-edit">
                <img class="btn-edit-icon" src="../assets/ic_edit@3x.png" alt="Edit" />
            </router-link>

            <button class="btn btn-delete" @click="showModal = true">
                <img class="btn-delete-icon" src="../assets/ic_delete@3x.png" alt="Delete" />
            </button>
          </div>
      </div>

        <p class="main-house-card-meta">
          <span class="meta-item">
            <img src="../assets/ic_location@3x.png" alt="Location" />
            {{ houseDetails?.location?.zip }} {{ houseDetails?.location?.city }}
          </span>
        </p>

        <p class="main-house-card-meta">
          <span class="meta-item">
            <img src="../assets/ic_price@3x.png" alt="Price" />
            {{ houseDetails?.price?.toLocaleString('nl-NL') }}
          </span>

          <span class="meta-item">
            <img src="../assets/ic_size@3x.png" alt="Size" />
            {{ houseDetails?.size }} m2
          </span>

          <span class="meta-item">
            <img src="../assets/ic_construction_date@3x.png" alt="Construction Year" />
            Built in {{ houseDetails?.constructionYear }}
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
            <img src="../assets/ic_garage@3x.png" alt="Garage" />
            {{ houseDetails?.hasGarage ? 'Yes' : 'No' }}
          </span>
        </p>
        
        <p class="main-house-card-description">
          {{ houseDetails?.description }}
        </p>

      </div>
    </article>

    <div class="recommended-houses">
      <h2>Recommended for you</h2>
      <div v-for="recommendedHouse in recommendations" :key="recommendedHouse.id" class="recommended-house">
          <div class="recommended-card-info" @click="navigateToHouseDetails(recommendedHouse.id)">
              <img :src="recommendedHouse.image" class="recommended-card-info-img" alt="House Image" />
              <div class="recommended-card-text">
                  <h3 class="recommended-house-card-title">{{ recommendedHouse.location.street }}
                    {{ recommendedHouse.location.houseNumber }} {{ recommendedHouse.location?.houseNumberAddition }}</h3>
                  <p class="recommended-house-card-price">€ {{ recommendedHouse.price.toLocaleString('nl-NL') }} </p>
                  <p class="recommended-house-card-location">{{ recommendedHouse.location.zip }} {{ recommendedHouse.location.city }}</p>
                  <p class="recommended-house-meta">
                    <span class="meta-item">
                      <img src="../assets/ic_bed@3x.png" alt="Bed" /> {{ recommendedHouse.rooms.bedrooms }}
                    </span> 
                    <span class="meta-item">
                      <img src="../assets/ic_bath@3x.png" alt="Bath" /> {{ recommendedHouse.rooms.bathrooms }}
                    </span>
                    <span class="meta-item">
                      <img src="../assets/ic_size@3x.png" alt="Size" /> {{ recommendedHouse.size }} m2
                    </span>
                  </p>
              </div>
          </div>
      </div>
    </div>
    <ModalComponent v-if="showModal && houseDetails" :house="houseDetails" @close="showModal = false"/>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/stores/store'
import ModalComponent from '@/components/ModalComponent.vue'

/* -----------------------------------
* Router and Store
* ------------------------------------
* route is used to access route params & query (house id, delete flag)
* router is used for navigation to other house detail pages
* store is used for holding all houses
*/

const route = useRoute()
const router = useRouter()
const store = useStore()

/* -----------------------------------
* Reactive state
* ------------------------------------
* houseDetails is used for a currently selected house
* isLoading controls loading UI
* showModal controls delete confirmation modal
* recommendations is a list of recommended houses
*/

const houseDetails = ref(null)
const isLoading = ref(true)
const showModal = ref(route.query.delete === "true");
const recommendations = ref([]);

/* -----------------------------------
* Fetch house data and recommendations
* ------------------------------------
* 1. Fetch all houses (if not already loaded)
* 2. Find current house by id
* 3. Generate recommendations based on price similarity
*/

const fetchData = async (id) => {
  isLoading.value = true

  try {

    await store.getHouses()

    const currentHouse = store.houses.find(h => h.id === id)
    if (!currentHouse) {
      houseDetails.value = null
      recommendations.value = []
      return
    }

    houseDetails.value = currentHouse

    recommendations.value = store.houses
      .filter(h => h.id !== id)
      .map(h => ({
        ...h,
        priceDiff: Math.abs(currentHouse.price - h.price)
      }))
      .sort((a, b) => a.priceDiff - b.priceDiff)
      .slice(0, 3)

  } catch (err) {
    console.error('Error while fetching house:', err)
    houseDetails.value = null
    recommendations.value = []
  } finally {
    isLoading.value = false
  }
}

/* -----------------------------------
* Watch route changes
* ------------------------------------
* Re-fetch data when:
* - user navigates to another house
* - component is loaded for the first time
*/

watch(
  () => route.params.id,
  (id) => {
    if (!id) return
    fetchData(Number(id))
  },
  { immediate: true }
)

const navigateToHouseDetails = (houseId) => {
    router.push({ name: 'HouseDetailsView', params: { id: houseId } });
};

</script>

<style scoped>

    .house-details {
      display: flex;
      justify-content: center;
      box-sizing: border-box;
    }
    
    .main-house-card {
      flex: 1 1 50%;
      box-sizing: border-box;
    }
    
    .recommended-houses {
      flex: 1 1 20%;
      box-sizing: border-box;
      margin-top: 76px;
    }
    .recommended-houses h2 {
      padding-bottom: 15px;
    }
    
    .recommended-house-meta {
      display: flex;
      font-size: 15px;
      padding-top: 7px;
      gap: 20px;
      color: var(--dark-grey);
    }
    
    .recommended-house-card-title {
      font-size: 15px;
      color: var(--black);
      font-weight: 700;
    }
    
    .recommended-house-card-price {
      font-size: 15px;
      color: var(--dark-grey);
      font-weight: 600;
    }
    
    .recommended-house-card-location {
      font-size: 15px;
      color: var(--grey);
      font-weight: 500;
    }
    
    .main-house-card-image {
      object-fit: cover;
      flex-shrink: 0;
      margin-right: 28px;
      z-index: -1;
      width: 100%;
    }
    
    .main-house-card-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: center;
      padding: 30px;
      background-color: var(--white);
    }
    
    .main-house-card-info p {
      color: var(--dark-grey);
    }
    
    .main-house-card-price {
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .main-house-card-address {
      margin-bottom: 12px;
    }
    
    .main-house-card-meta {
      display: flex;
      align-items: center;
      gap: 30px;
      font-size: 14.4px;
      font-weight: 600;
    }
    .main-house-card-description {
      padding-top: 10px;
    }
    .btn-back {
      background-color: transparent;
      padding: 30px 0;
    }
    .btn-delete, .btn-edit {
      background-color: transparent;
      padding: 0 0 0 10px;
    }
    .main-house-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .recommended-house {
      background-color: var(--white);
      position: relative; 
      margin-bottom: 20px;
      width: 100%;
      border-radius: 5px;
      box-shadow: 0 3px 10px var(--light-grey);
    }
    .recommended-card-info {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .recommended-card-info-img {
      width: 120px;
      height: 120px;
      border-radius: 15px;
      padding: 10px;
    }

    /* Large devices */
    @media (min-width: 769px) {

      .main {
        width: 100%;
        max-width: 1300px;
        margin-inline: auto;
        padding-inline: 24px;
        padding-top: 70px;
      }

      .house-details {
        gap: 100px;
      }
      .house-actions-sm {
        display: none
      }
      .house-actions {
        display: flex;
        gap: 8px;
      }
      .btn-back-label {
        font-size: 16px;
        color: var(--black);
        font-family: "Montserrat";
        font-weight: 600;
      }
      .recommended {
        width: 40%;
        margin: -20px 0 0 30px;
      }
    }

    /* Small devices */
    @media (max-width: 768px) {
      .house-details{
        flex-direction: column;
        padding-bottom: 50px;
      }
      .main-house-card, .recommended-houses {
        flex: 100%;
        position: relative; 
      }
      .recommended-houses {
        padding-inline: 20px;
      }
      .main-house-card-info {
        border-radius: 40px 40px 0px 0px;
        margin-top: -40px;
        position: relative;
      }
      .recommended-houses {
        margin-top: 30px;
      }
      .btn-back-label {
        display: none;
      }
      .btn-back {
        position: absolute;
        top: 12px;
        left: 12px;
        z-index: 10;
        border-radius: 50%;
        padding: 8px;
      }
      .house-actions-sm {
        display: flex;
        gap: 8px;
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 10;
        padding: 8px;
      }
      .house-actions {
        display: none
      }
      .recommended {
        width: 90%;
        margin: 100px auto 
      }
    }

</style>