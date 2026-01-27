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

<style>

    .sort-toggle {
      display: inline-flex;
      border-radius: 7px;
      overflow: hidden;
      background-color: var(--grey);
    }
    
    .sort-toggle-btn {
      padding: 5px 50px;
      border: none;
      background: transparent;
      color: var(--white);
      font-weight: 700;
      height: 46px;
    }
    @media (min-width: 769px) {
      .sort-toggle-btn {
        font-size: 18px;
      }
    }
  
    @media (max-width: 768px) {
      .sort-toggle-btn{
        font-size: 12px;
      }
      .sort-toggle {
        width: 100%;
      }
    
      .sort-toggle-btn {
        flex: 1;
        text-align: center;
        padding-inline: 0;
      }
    }
    
    .sort-toggle-btn--active {
      background-color: var(--red);
    }

</style>
