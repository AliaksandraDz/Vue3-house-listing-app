<template>
    <div class="house-create">
        <div class="house-create-wrapper">
            <router-link to="/" class="btn btn-edit-back">
            <img class="btn-edit-back-icon" src="../assets/ic_back_grey@3x.png" alt="Back" />
            <p class="back-label">Back to overview</p>
        </router-link>

        <h1>Create new listing</h1>
  
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
            <div class="input-wrapper" :class="{ 'has-image': image }" ref="imageWrapper">
              <input
                type="file"
                accept="image/png, image/jpeg"
                required
                @change="handleImageChange"
              />
              <button
                v-if="image"
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
              {{ isSubmitting ? 'Loading…' : 'Post' }}
            </button>
          </div>
        </form>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from '@/stores/store'
import { useRouter } from 'vue-router'

export default {
  name: 'HouseCreateView',

  setup() {

    const router = useRouter()
    const store = useStore()

    const form = ref({
      location: {
        street: '',
        houseNumber: '',
        houseNumberAddition: '',
        zip: '',
        city: ''
      },
      price: '',
      size: '',
      hasGarage: '',
      rooms: {
        bedrooms: '',
        bathrooms: ''
      },
      constructionYear: '',
      description: ''
    })

    const image = ref(null)
    const imageWrapper = ref(null)
    const isSubmitting = ref(false)
    const currentYear = new Date().getFullYear()

    const handleImageChange = (e) => {
      image.value = e.target.files[0]

      if (image.value && imageWrapper.value) {
        imageWrapper.value.style.backgroundImage =
          `url(${URL.createObjectURL(image.value)})`
        imageWrapper.value.style.backgroundSize = 'cover'
      }
    }

    const clearImage = () => {
      image.value = null
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

        const imageData = new FormData()
        imageData.append('image', image.value)

        const createdHouse = await store.addHouse(data, imageData)

        router.push({
            name: 'HouseDetailsView',
            params: { id: createdHouse.id }
        })
      } catch (err) {
        console.error('Create house failed:', err)
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      form,
      image,
      imageWrapper,
      handleImageChange,
      clearImage,
      handleSubmit,
      currentYear,
      isSubmitting
    }
  }
}
</script>
