<template>
  <div class="house-edit">
    <div class="container">
      <div class="house-edit-wrapper">
        <div class="edit-header-row">
          <router-link :to="{ name: 'HouseDetailsView',
            query: { delete: false }, params: { id: $route.params.id } }" 
            class="btn btn-edit-back">
            <img class="btn-edit-back-icon" src="../assets/ic_back_grey@3x.png" alt="Back" />
            <p class="back-label">Back to detail page</p>
          </router-link>
          <h1 class="edit-header-sm">Edit listing</h1>
        </div>

      <h1 class="edit-header-lg">Edit listing</h1>
      <HouseForm
        :form="form"
        :validation="v$"
        :currentYear="currentYear"

        :hasImage="hasImage"
        :imageError="imageError"
        :imagePreviewUrl="imagePreviewUrl"

        :submitLabel="isSubmitting ? 'Loading…' : 'Save'"
        :submitDisabled="(v$.$anyDirty && v$.$invalid) || imageError || isSubmitting"

        @update-field="updateField"
        @image-change="onImageChange"
        @image-clear="onImageClear"
        @submit="handleSubmit"
      />
      </div>
    </div>
  </div>
</template>

<script>
import HouseForm from '@/components/HouseForm.vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/stores/store'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, minValue, maxValue, helpers } from '@vuelidate/validators'

export default {
  name: 'HouseEditView',

  components: {
    HouseForm
  },

  setup() {

    /* -----------------------------------
    * Router, Route & Store
    * ------------------------------------
    * route is used to access route params (house id)
    * router is used to navigate after successful save
    * store is used for fetching and updating house data
    */

    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    /* -----------------------------------
    * Form state
    * ------------------------------------
    * Mirrors the house object structure from the API
    * Used by v-model and Vuelidate
    */

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

    const updateField = ({ path, value }) => {
      const keys = path.split('.')
      let target = form.value

      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]]
      }

      target[keys[keys.length - 1]] = value
    }


    /* -----------------------------------
    * General UI state
    * ------------------------------------
    * currentYear is used for max validation on construction year
    * isSubmitting disables submit button while request is running
    */

    const currentYear = new Date().getFullYear()
    const isSubmitting = ref(false)

    /* -----------------------------------
    * Validation helper
    * ------------------------------------
    * Shows errors only after user interaction
    */

    // const hasError = (field) => field.$dirty && field.$invalid

    /* -----------------------------------
    * Custom ZIP code validator
    * ------------------------------------
    * Validates Dutch postal codes (e.g. 1234 AB)
    * Wrapped with helpers to work nicely with Vuelidate
    */

    const zipPattern = helpers.withMessage(
      'Invalid postal code format.',
      helpers.withParams(
        { type: 'zipPattern' },
        (value) => {
          if (!value) return true
          return /^[1-9][0-9]{3} ?(?!sa|SA|sd|SD|ss|SS)[a-zA-Z]{2}$/.test(value)
        }
      )
    )

    /* -----------------------------------
    * Vuelidate rules
    * ------------------------------------
    * Mirrors the structure of the form object
    * Each field contains its own validation rules
    */

    const rules = {
      location: {
        street: { required, minLength: minLength(2), maxLength: maxLength(50) },
        houseNumber: { required, minValue: minValue(1) },
        zip: { required, zipPattern, minLength: minLength(6), maxLength: maxLength(7) },
        city: { required, minLength: minLength(2), maxLength: maxLength(50) }
      },
      price: { required },
      size: { required, minValue: minValue(10) },
      hasGarage: { required },
      rooms: {
        bedrooms: { required, minValue: minValue(1) },
        bathrooms: { required, minValue: minValue(1) }
      },
      constructionYear: { required, minValue: minValue(1700), maxValue: maxValue(currentYear) },
      description: { required, minLength: minLength(15), maxLength: maxLength(10000) }
    }

    /* -----------------------------------
    * Initialize Vuelidate
    * ------------------------------------
    * v$ contains validation state & helpers
    */

    const v$ = useVuelidate(rules, form)

    /* -----------------------------------
    * Image handling state
    * ------------------------------------
    * image             -> newly selected file
    * imageWrapper      -> DOM ref for preview background
    * originalImageUrl  -> existing image from API
    * hasNewImage       --> tracks if user selected a new image
    */

    const imageFile = ref(null)
    const imagePreviewUrl = ref('')
    const originalImageUrl = ref('')
    const imageTouched = ref(false)


    /* -----------------------------------
    * Image presence check
    * ------------------------------------
    * Returns true if either:
    * - a new image is selected
    * - or an existing image is already present
    */

    const hasImage = computed(() => {
      return !!(imageFile.value || originalImageUrl.value)
    })

    /* -----------------------------------
    * Image validation
    * ------------------------------------
    * Editing requires an image to exist,
    * but not necessarily a new one
    */

    
    const imageError = computed(() => {
      return imageTouched.value && !hasImage.value
    })

    /* -----------------------------------
    * Handle new image selection
    * ------------------------------------
    * Stores file, marks it as new,
    * and updates preview background
    */

    // const handleImageChange = (e) => {
    //   const file = e.target.files[0]
    //   imageError.value = false
    //   if (!file) return

    //   image.value = file
    //   hasNewImage.value = true

    //   if (imageWrapper.value) {
    //     imageWrapper.value.style.backgroundImage =
    //       `url(${URL.createObjectURL(file)})`
    //     imageWrapper.value.style.backgroundSize = 'cover'
    //   }
    // }

    /* -----------------------------------
    * Clear image
    * ------------------------------------
    * Removes both new and original image
    */

    // const clearImage = () => {
    //   image.value = null
    //   hasNewImage.value = false
    //   originalImageUrl.value = null

    //   if (imageWrapper.value) {
    //   imageWrapper.value.style.backgroundImage = ''
    //   }
    // }

    const onImageChange = (event) => {
      imageTouched.value = true
      const file = event.target.files?.[0]
      if (!file) return

      imageFile.value = file
      imagePreviewUrl.value = URL.createObjectURL(file)
    }

    const onImageClear = () => {
      imageTouched.value = true
      imageFile.value = null
      imagePreviewUrl.value = ''
      originalImageUrl.value = ''
    }


    /* -----------------------------------
    * Load existing house data
    * ------------------------------------
    * Runs once when component mounts
    * Fills the form and sets image preview
    */

    onMounted(async () => {
      const house = await store.getHouseById(route.params.id)

      form.value = {
        location: {
          street: house.location.street,
          houseNumber: house.location.houseNumber,
          houseNumberAddition: house.location.houseNumberAddition || '',
          zip: house.location.zip,
          city: house.location.city
        },
        price: house.price,
        size: house.size,
        hasGarage: house.hasGarage,
        rooms: {
          bedrooms: house.rooms.bedrooms,
          bathrooms: house.rooms.bathrooms
        },
        constructionYear: house.constructionYear,
        description: house.description
      }

      originalImageUrl.value = house.image || ''
      imagePreviewUrl.value = house.image || ''
    })


    /* -----------------------------------
    * Form submission
    * ------------------------------------
    * 1. Touch validations
    * 2. Abort if invalid
    * 3. Send updated data
    * 4. Upload image only if changed
    * 5. Redirect to detail view
    */

    const handleSubmit = async () => {
      v$.value.$touch()
      imageTouched.value = true

      if (v$.value.$invalid || imageError.value) return

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
        if (imageFile.value) {
          imageData = new FormData()
          imageData.append('image', imageFile.value)
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
      imagePreviewUrl,
      // image,
      // imageWrapper,
      originalImageUrl,
      // hasNewImage,
      // handleImageChange,
      // clearImage,
      handleSubmit,
      currentYear,
      isSubmitting,
      imageError,
      v$,
      hasImage,
      updateField,
      onImageChange,
      onImageClear,
    }
  },
}
</script>
