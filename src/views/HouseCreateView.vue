<template>
  <div class="house-create">
    <div class="container">
      <div class="house-create-wrapper">
        <div class="create-header-row">
          <router-link to="/" class="btn btn-edit-back">
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

    /* -----------------------------------
    * Router and Store
    * ------------------------------------
    * router is used to navigate after successful submit
    * store is used to handle API calls (addHouse)
    */

    const router = useRouter()
    const store = useStore()

    /* -----------------------------------
    * Form state
    * ------------------------------------
    * All form fields are grouped into one reactive object
    * so Vuelidate can validate the full structure.
    */

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
    * Returns true when a field has been touched AND is invalid
    * Used to conditionally show error styles/messages
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
    * Image upload state
    * ------------------------------------
    * image        -> selected file
    * imageWrapper -> DOM ref used to show preview background
    * imageTouched -> tracks whether user interacted with image input
    */

    // const image = ref(null)
    // const imageWrapper = ref(null)
    
    const imageFile = ref(null)
    const imageTouched = ref(false)
    const imagePreviewUrl = ref('')

    const hasImage = computed(() => !!imageFile.value)

    /* -----------------------------------
    * Image validation
    * ------------------------------------
    * Shows error if user interacted but no image is selected
    */

    const imageError = computed(() => {
      return imageTouched.value && !imageFile.value
    })

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

    const onImageClear = () => {
      imageTouched.value = true
      imageFile.value = null
      imagePreviewUrl.value = ''
    }

    /* -----------------------------------
    * Handle image selection
    * ------------------------------------
    * Stores file and sets preview as background image
    */

    // const handleImageChange = (e) => {
    //   const file = e.target.files[0]

    //   imageTouched.value = true

    //   if (!file) {
    //     image.value = null
    //     return
    //   }

    //   image.value = file

    //   if (imageWrapper.value) {
    //     imageWrapper.value.style.backgroundImage =
    //       `url(${URL.createObjectURL(file)})`
    //     imageWrapper.value.style.backgroundSize = 'cover'
    //   }
    // }

    /* -----------------------------------
    * Clear selected image
    * ------------------------------------
    * Resets image state and removes preview
    */

    // const clearImage = () => {
    //   image.value = null
    //   imageTouched.value = true
    //   if (imageWrapper.value) {
    //     imageWrapper.value.style.backgroundImage = ''
    //   }
    // }

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
