<template>
  <div class="house-create">
    <div class="container">
      <div class="house-create-wrapper">
        <div class="create-header-row">
          <router-link :to="{ name: 'HomeView' }" class="btn btn-edit-back">
            <img class="btn-create-back-icon" src="../assets/ic_back_grey@3x.png" alt="Back" />
            <p class="back-label">Back to overview</p>
          </router-link>
          <h1 class="create-header-sm">Create new listing</h1>
        </div>

        <h1 class="create-header-lg">Create new listing</h1>
        <HouseForm
          :form="form"
          :validation="v$"
          :currentYear="currentYear"
          :hasImage="hasImage"
          :imageError="imageError"
          :imagePreviewUrl="imagePreviewUrl"
          :submitLabel="isSubmitting ? 'Loading…' : 'Post'"
          :submitDisabled="v$.$invalid || imageError || isSubmitting"
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
  import { ref, computed } from 'vue'
  import { useStore } from '@/stores/store'
  import { useRouter } from 'vue-router'
  import useVuelidate from '@vuelidate/core'
  import { required, minLength, maxLength, minValue, maxValue, helpers } from '@vuelidate/validators'


  export default {
    name: 'HouseCreateView',

    components: {
      HouseForm
    },

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

      // Stores the selected image file
      const imageFile = ref(null)
      // Tracks if the user interacted with the image input
      const imageTouched = ref(false)
      // Temporary URL used to show image preview
      const imagePreviewUrl = ref('')

      // True if an image is currently selected
      const hasImage = computed(() => !!imageFile.value)

      // True if user interacted but no image is selected
      const imageError = computed(() => {
        return imageTouched.value && !imageFile.value
      })

      // Stores the selected file and generates a preview URL
      const onImageChange = (event) => {
        imageTouched.value = true
        const file = event.target.files?.[0]

        if (!file) {
          imageFile.value = null
          imagePreviewUrl.value = ''
          return
        }

        imageFile.value = file
        imagePreviewUrl.value = URL.createObjectURL(file)
      }

      // Resets image state and removes preview
      const onImageClear = () => {
        imageTouched.value = true
        imageFile.value = null
        imagePreviewUrl.value = ''
      }

      /* -----------------------------------
      * Form submission
      * ------------------------------------
      * 1. Touch all validations
      * 2. Abort if invalid
      * 3. Build FormData
      * 4. Send data to store
      * 5. Redirect to detail page
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
          data.append('madeByMe', true)

          const imageData = new FormData()
          imageData.append('image', imageFile.value)

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
        hasImage,
        imageError,
        imagePreviewUrl,
        onImageChange,
        onImageClear,
        handleSubmit,
        currentYear,
        isSubmitting,
        v$,
        updateField
      }
    }
  }
</script>