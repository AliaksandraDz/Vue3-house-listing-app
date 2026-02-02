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

      // Updates deeply nested fields dynamically
      const updateField = ({ path, value }) => {
        const keys = path.split('.')
        let target = form.value

        for (let i = 0; i < keys.length - 1; i++) {
          target = target[keys[i]]
        }

        target[keys[keys.length - 1]] = value
      }

      // currentYear is used for max validation on construction year
      const currentYear = new Date().getFullYear()

      // Disables submit button while request is running
      const isSubmitting = ref(false)

      // Validates Dutch postal codes
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
        constructionYear: { required, minValue: minValue(1950), maxValue: maxValue(currentYear) },
        description: { required, minLength: minLength(15), maxLength: maxLength(10000) }
      }

      const v$ = useVuelidate(rules, form)

      // Newly selected image file
      const imageFile = ref(null)
      // Temporary URL for preview of a new image
      const imagePreviewUrl = ref('')
      // Existing image from the API
      const originalImageUrl = ref('')
      // Tracks if the user interacted with the image input
      const imageTouched = ref(false)

      // True if there is a newly selected image, or an existing image from the server
      const hasImage = computed(() => {
        return !!(imageFile.value || originalImageUrl.value)
      })
      
      // True if user interacted but no image is selected
      const imageError = computed(() => {
        return imageTouched.value && !hasImage.value
      })

      // Stores the selected file and generates a preview URL
      // The original image remains until explicitly cleared
      const onImageChange = (event) => {
        imageTouched.value = true
        const file = event.target.files?.[0]
        if (!file) return

        imageFile.value = file
        imagePreviewUrl.value = URL.createObjectURL(file)
      }

      // Removes both the newly selected image and the existing image from the server
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
        originalImageUrl,
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
