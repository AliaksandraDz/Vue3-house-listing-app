<template>
  <div class="house-create">
      <div class="house-create-wrapper">
        <div class="create-header-row">
          <router-link :to="{ name: 'HouseDetailsView',
            query: { delete: false }, params: { id: $route.params.id } }" 
            class="btn btn-edit-back">
            <img class="btn-edit-back-icon" src="../assets/ic_back_grey@3x.png" alt="Back" />
            <p class="back-label">Back to detail page</p>
          </router-link>
          <h1 class="create-header-sm">Edit listing</h1>
        </div>

      <h1 class="create-header-lg">Edit listing</h1>

      <form @submit.prevent="handleSubmit">
        <!-- STREET -->
        <div class="full-size">
          <label>Street name*</label>
          <input
            type="text"
            required
            minlength="2"
            maxlength="20"
            v-model="form.location.street"
            placeholder="Enter the street name"
          />
        </div>

        <!-- HOUSE NUMBER -->
        <div class="half-size">
          <label>House number*</label>
          <input
            type="number"
            required
            min="1"
            max="2000"
            v-model="form.location.houseNumber"
            placeholder="Enter the house number"
          />
        </div>

        <!-- ADDITION -->
        <div class="half-size">
          <label>Addition (optional)</label>
          <input
            type="text"
            v-model="form.location.houseNumberAddition"
            placeholder="e.g. A"
          />
        </div>

        <!-- ZIP -->
        <div class="full-size">
          <label>Postal code*</label>
          <input
            type="text"
            required
            pattern="^[1-9][0-9]{3} ?(?!sa|SA|sd|SD|ss|SS)[a-zA-Z]{2}$"
            minlength="6"
            maxlength="7"
            v-model="form.location.zip"
            placeholder="e.g. 1000 AA"
          />
        </div>

        <!-- CITY -->
        <div class="full-size">
          <label>City*</label>
          <input
            type="text"
            required
            minlength="2"
            maxlength="20"
            v-model="form.location.city"
            placeholder="e.g. Utrecht"
          />
        </div>

        <!-- IMAGE -->
        <div class="full-size">
          <label>Upload picture (PNG or JPG)*</label>
          <div class="input-wrapper" 
          :class="{ 'has-image': image || originalImageUrl }"
          ref="imageWrapper"
          >
            <input
              type="file"
              accept="image/png, image/jpeg"
              @change="handleImageChange"
            />
            <button
              v-if="image || originalImageUrl"
              class="clear-button-white"
              @click.prevent="clearImage"
            >
              <img src="../assets/ic_clear_white@3x.png" alt="Clear" />
            </button>
          </div>
        </div>

        <!-- PRICE -->
        <div class="full-size">
          <label>Price*</label>
          <input
            type="number"
            required
            min="300"
            v-model="form.price"
            placeholder="e.g. €150.000"
          />
        </div>

        <!-- SIZE -->
        <div class="half-size">
          <label>Size*</label>
          <input
            type="number"
            required
            min="10"
            v-model="form.size"
            placeholder="e.g. 60m2"
          />
        </div>

        <!-- GARAGE -->
        <div class="half-size">
          <label>Garage*</label>
          <select required v-model="form.hasGarage">
            <option disabled value="">Select</option>
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </div>

        <!-- ROOMS -->
        <div class="half-size">
          <label>Bedrooms*</label>
          <input type="number" 
              required min="1" 
              v-model="form.rooms.bedrooms"
              placeholder="Enter amount" 
          />
        </div>

        <div class="half-size">
          <label>Bathrooms*</label>
          <input type="number" 
              required min="1" 
              v-model="form.rooms.bathrooms" 
              placeholder="Enter amount"
          />
        </div>

        <!-- YEAR -->
        <div class="full-size">
          <label>Construction date*</label>
          <input
            type="number"
            required
            min="1700"
            :max="currentYear"
            v-model="form.constructionYear"
            placeholder="e.g. 1990"
          />
        </div>

        <!-- DESCRIPTION -->
        <div class="full-size">
          <label>Description*</label>
          <textarea
            required
            minlength="5"
            rows="4"
            v-model="form.description"
            placeholder="Enter description"
          />
        </div>

        <div class="form-btn-wrapper">
          <button class="submit-form-button">
            {{ isSubmitting ? 'Loading…' : 'Edit' }}
          </button>
        </div>
      </form>
      </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/stores/store'

export default {
  name: 'HouseEditView',

  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const form = ref({
      location: {
        street: '',
        houseNumber: '',
        houseNumberAddition: '',
        zip: '',
        city: '',
      },
      price: '',
      size: '',
      hasGarage: '',
      rooms: {
        bedrooms: '',
        bathrooms: '',
      },
      constructionYear: '',
      description: '',
    })

    const image = ref(null)
    const imageWrapper = ref(null)
    const originalImageUrl = ref(null)
    const hasNewImage = ref(false)
    const imageRemoved = ref(false)
    const isSubmitting = ref(false)
    const currentYear = new Date().getFullYear()

    // Load house data
    onMounted(async () => {
      try {
        const house = await store.getHouseById(route.params.id)

        form.value.location.street = house.location.street
        form.value.location.houseNumber = house.location.houseNumber
        form.value.location.houseNumberAddition = house.location.houseNumberAddition || ''
        form.value.location.zip = house.location.zip
        form.value.location.city = house.location.city

        form.value.price = house.price
        form.value.size = house.size
        form.value.hasGarage = house.hasGarage

        form.value.rooms.bedrooms = house.rooms.bedrooms
        form.value.rooms.bathrooms = house.rooms.bathrooms

        form.value.constructionYear = house.constructionYear
        form.value.description = house.description

        // Optional: show existing image as background
        if (house.image && imageWrapper.value) {
          imageWrapper.value.style.backgroundImage = `url(${house.image})`
          imageWrapper.value.style.backgroundSize = 'cover'
          originalImageUrl.value = house.image
        }
      } catch (err) {
        console.error('Failed to load house:', err)
      }
    })

    const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    image.value = file
    hasNewImage.value = true

    if (imageWrapper.value) {
      imageWrapper.value.style.backgroundImage =
        `url(${URL.createObjectURL(file)})`
      imageWrapper.value.style.backgroundSize = 'cover'
    }
  }

    const clearImage = () => {
      image.value = null
      hasNewImage.value = false
      originalImageUrl.value = null
      imageRemoved.value = true
      
      if (imageWrapper.value) {
      imageWrapper.value.style.backgroundImage = ''
      }
    }

    const handleSubmit = async () => {
      isSubmitting.value = true

      try {
        const data = new FormData()
        data.append('price', form.value.price)
        data.append('bedrooms', form.value.rooms.bedrooms)
        data.append('bathrooms', form.value.rooms.bathrooms)
        data.append('size', form.value.size)
        data.append('streetName', form.value.location.street)
        data.append('houseNumber', form.value.location.houseNumber)
        data.append('numberAddition', form.value.location.houseNumberAddition)
        data.append('zip', form.value.location.zip)
        data.append('city', form.value.location.city)
        data.append('constructionYear', form.value.constructionYear)
        data.append('hasGarage', String(form.value.hasGarage))
        data.append('description', form.value.description)

        let imageData = null
        if (hasNewImage.value) {
          imageData = new FormData()
          imageData.append('image', image.value)
        }

        await store.editHouse(data, imageData, route.params.id)

        router.push({
          name: 'HouseDetailsView',
          params: { id: route.params.id },
        })
      } catch (err) {
        console.error('Edit house failed:', err)
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      form,
      image,
      imageWrapper,
      originalImageUrl,
      hasNewImage,
      handleImageChange,
      clearImage,
      handleSubmit,
      currentYear,
      isSubmitting,
    }
  },
}
</script>
