<template>
    <div class="search-bar">
        <button class="search-bar-icon" type="button">
            <img src="../assets/ic_search@3x.png" alt="Search" />
        </button>

        <input
            type="text"
            class="search-bar-input"
            :value="modelValue"
            placeholder="Search for a house"
            @input="$emit('update:modelValue', $event.target.value)"
        />

        <button
            v-if="modelValue.length > 0"
            class="search-bar-clear"
            type="button"
            @click="$emit('update:modelValue', '')"
        >
            <img src="../assets/ic_clear@3x.png" alt="Clear" />
        </button>
    </div>
</template>

<script>
export default {
    name: 'SearchBar',

    props: {
        modelValue: {
            type: String,
            required: true
        }
    },

    emits: ['update:modelValue']
}
</script>  