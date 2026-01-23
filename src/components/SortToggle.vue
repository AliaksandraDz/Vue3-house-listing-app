<template>
    <div class="sort-toggle">
        <button
            class="sort-toggle-btn"
            :class="{ 'sort-toggle-btn--active': modelValue === 'price' }"
            @click="$emit('update:modelValue', 'price')"
        >
        Price
        </button>

        <button
            class="sort-toggle-btn"
            :class="{ 'sort-toggle-btn--active': modelValue === 'size' }"
            @click="$emit('update:modelValue', 'size')"
        >
        Size
        </button>
    </div>
</template>

<script>
export default {
    name: 'SortToggle',

    props: {
        modelValue: {
            type: String,
            required: true
        }
    },

    emits: ['update:modelValue']
}
</script>
