<template>
    <form @submit.prevent="$emit('submit')" novalidate>
        <!-- STREET -->
        <div class="full-size">
        <label>Street name*</label>
        <input
            type="text"
            :value="form.location.street"
            placeholder="Enter the street name"
            @input="$emit('update-field', { path: 'location.street', value: $event.target.value })"
            @blur="validation.location.street.$touch()"
            :class="{ error: hasError(validation.location.street) }"
        />

        <p v-if="hasError(validation.location.street)" class="error-text">
            <span v-if="validation.location.street.required.$invalid">
            Required field missing.
            </span>
            <span v-else-if="validation.location.street.minLength.$invalid">
            Street must be at least 2 characters long.
            </span>
            <span v-else-if="validation.location.street.maxLength.$invalid">
            Street cannot be longer than 50 characters.
            </span>
        </p>
        </div>

        <!-- HOUSE NUMBER -->
        <div class="half-size">
        <label>House number*</label>
        <input
            type="number"
            :value="form.location.houseNumber"
            placeholder="Enter the house number"
            @input="$emit('update-field', { path: 'location.houseNumber', value: $event.target.value })"
            @blur="validation.location.houseNumber.$touch()"
            :class="{ error: hasError(validation.location.houseNumber) }"
        />

        <p v-if="hasError(validation.location.houseNumber)" class="error-text">
            <span v-if="validation.location.houseNumber.required.$invalid">
            Required field missing.
            </span>
            <span v-else-if="validation.location.houseNumber.minValue.$invalid">
            House number must be at least 1.
            </span>
        </p>
        </div>

        <!-- ADDITION -->
        <div class="half-size">
        <label>Addition (optional)</label>
        <input
            type="text"
            :value="form.location.houseNumberAddition"
            placeholder="e.g. A"
            @input="$emit('update-field', { path: 'location.houseNumberAddition', value: $event.target.value })"
        />
        </div>

        <!-- ZIP -->
        <div class="full-size">
        <label>Postal code*</label>
        <input
            type="text"
            :value="form.location.zip"
            placeholder="e.g. 1000 AA"
            @input="$emit('update-field', { path: 'location.zip', value: $event.target.value })"
            @blur="validation.location.zip.$touch()"
            :class="{ error: hasError(validation.location.zip) }"
        />

        <p v-if="hasError(validation.location.zip)" class="error-text">
            <span v-if="validation.location.zip.required.$invalid">Required field missing.</span>
            <span v-else-if="validation.location.zip.zipPattern.$invalid">Invalid postal code format.</span>
        </p>
        </div>

        <!-- CITY -->
        <div class="full-size">
        <label>City*</label>
        <input
            type="text"
            :value="form.location.city"
            placeholder="e.g. Utrecht"
            @input="$emit('update-field', { path: 'location.city', value: $event.target.value })"
            @blur="validation.location.city.$touch()"
            :class="{ error: hasError(validation.location.city) }"
        />

        <p v-if="hasError(validation.location.city)" class="error-text">
            <span v-if="validation.location.city.required.$invalid">
            Required field missing.
            </span>
            <span v-else-if="validation.location.city.minLength.$invalid">
            City must be at least 2 characters long.
            </span>
            <span v-else-if="validation.location.city.maxLength.$invalid">
            City cannot be longer than 50 characters.
            </span>
        </p>
        </div>

        <!-- IMAGE -->
        <div class="full-size">
        <label>Upload picture (PNG or JPG)*</label>

        <div class="input-wrapper" :class="{ 'has-image': hasImage }" :style="imagePreviewStyle">
            <input type="file" accept="image/png, image/jpeg" @change="$emit('image-change', $event)" />

            <button
            v-if="hasImage"
            class="clear-button-white"
            type="button"
            @click="$emit('image-clear')"
            >
            <img class="btn-clearImage" src="../assets/ic_clear_white@3x.png" alt="Clear" />
            </button>
        </div>

        <p v-if="imageError" class="error-text">Required field missing.</p>
        </div>

        <!-- PRICE -->
        <div class="full-size">
        <label>Price*</label>
        <input
            type="number"
            :value="form.price"
            placeholder="e.g. €150.000"
            @input="$emit('update-field', { path: 'price', value: $event.target.value })"
            @blur="validation.price.$touch()"
            :class="{ error: hasError(validation.price) }"
        />

        <p v-if="hasError(validation.price)" class="error-text">
            Required field missing.
        </p>
        </div>

        <!-- SIZE -->
        <div class="half-size">
        <label>Size*</label>
        <input
            type="number"
            :value="form.size"
            placeholder="e.g. 60 m2"
            @input="$emit('update-field', { path: 'size', value: $event.target.value })"
            @blur="validation.size.$touch()"
            :class="{ error: hasError(validation.size) }"
        />

        <p v-if="hasError(validation.size)" class="error-text">
            <span v-if="validation.size.required.$invalid">
            Required field missing.
            </span>
            <span v-else-if="validation.size.minValue.$invalid">
            Size must be at least 10 m2.
            </span>
        </p>
        </div>

        <!-- GARAGE -->
        <div class="half-size">
        <label>Garage*</label>
        <select
            :value="form.hasGarage"
            @change="$emit('update-field', {
                path: 'hasGarage',
                value: $event.target.value === 'true'
            })"
        >
            <option disabled value="">Select</option>
            <option :value="true">Yes</option>
            <option :value="false">No</option>
        </select>

        <p v-if="hasError(validation.hasGarage)" class="error-text">
            Required field missing.
        </p>
        </div>

        <!-- ROOMS -->
        <div class="half-size">
        <label>Bedrooms*</label>
        <input
            type="number"
            :value="form.rooms.bedrooms"
            placeholder="Enter amount"
            @input="$emit('update-field', { path: 'rooms.bedrooms', value: $event.target.value })"
            @blur="validation.rooms.bedrooms.$touch()"
            :class="{ error: hasError(validation.rooms.bedrooms) }"
        />

        <p v-if="hasError(validation.rooms.bedrooms)" class="error-text">
            <span v-if="validation.rooms.bedrooms.required.$invalid">
            Required field missing.
            </span>
            <span v-else-if="validation.rooms.bedrooms.minValue.$invalid">
            Number of bedrooms must be at least 1.
            </span>
        </p>
        </div>

        <div class="half-size">
        <label>Bathrooms*</label>
        <input
            type="number"
            :value="form.rooms.bathrooms"
            placeholder="Enter amount"
            @input="$emit('update-field', { path: 'rooms.bathrooms', value: $event.target.value })"
            @blur="validation.rooms.bathrooms.$touch()"
            :class="{ error: hasError(validation.rooms.bathrooms) }"
        />

        <p v-if="hasError(validation.rooms.bathrooms)" class="error-text">
            <span v-if="validation.rooms.bathrooms.required.$invalid">
            Required field missing.
            </span>
            <span v-else-if="validation.rooms.bathrooms.minValue.$invalid">
            Number of bathrooms must be at least 1.
            </span>
        </p>
        </div>

        <!-- YEAR -->
        <div class="full-size">
        <label>Construction date*</label>
        <input
            type="number"
            :value="form.constructionYear"
            placeholder="e.g. 1990"
            @input="$emit('update-field', { path: 'constructionYear', value: $event.target.value })"
            @blur="validation.constructionYear.$touch()"
            :class="{ error: hasError(validation.constructionYear) }"
        />

        <p v-if="hasError(validation.constructionYear)" class="error-text">
            <span v-if="validation.constructionYear.required.$invalid">
            Required field missing.
            </span>
            <span v-else-if="validation.constructionYear.minValue.$invalid">
            Year must be 1700 or later.
            </span>
            <span v-else-if="validation.constructionYear.maxValue.$invalid">
            Year cannot be later than {{ currentYear }}.
            </span>
        </p>
        </div>

        <!-- DESCRIPTION -->
        <div class="full-size">
        <label>Description*</label>
        <textarea
            rows="4"
            :value="form.description"
            placeholder="Enter description"
            @input="$emit('update-field', { path: 'description', value: $event.target.value })"
            @blur="validation.description.$touch()"
            :class="{ error: hasError(validation.description) }"
        />

        <p v-if="hasError(validation.description)" class="error-text">
            <span v-if="validation.description.required.$invalid">
            Required field missing.
            </span>
            <span v-else-if="validation.description.minLength.$invalid">
            Description must be at least 15 characters long.
            </span>
            <span v-else-if="validation.description.maxLength.$invalid">
            Description cannot be longer than 10000 characters.
            </span>
        </p>
        </div>

        <div class="form-btn-wrapper">
        <button class="submit-form-button" :disabled="submitDisabled">
            {{ submitLabel }}
        </button>
        </div>
    </form>
    </template>  

<script>
export default {
  name: 'HouseForm',

  props: {
    form: { type: Object, required: true },
    validation: { type: Object, required: true },

    currentYear: { type: Number, required: true },

    submitLabel: { type: String, required: true },
    submitDisabled: { type: Boolean, required: true },

    hasImage: { type: Boolean, required: true },
    imageError: { type: Boolean, required: true },
    imagePreviewUrl: { type: String, default: '' },
  },

  emits: ['submit', 'image-change', 'image-clear', 'update-field'],

  computed: {
    imagePreviewStyle() {
      if (!this.imagePreviewUrl) return {}
      return {
        backgroundImage: `url(${this.imagePreviewUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    },
  },

  methods: {
    hasError(field) {
      return field.$dirty && field.$invalid
    },
  },
}
</script>