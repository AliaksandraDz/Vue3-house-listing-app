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

<style>

  /* Search bar */
  .search-bar {
    position: relative;
    flex: 1;
    max-width: 500px;
  }
  
  .search-bar-input {
    width: 100%;
    height: 46px;
    padding-left: 60px;
    padding-right: 50px;
    border-radius: 7px;
    border: none;
    background-color: var(--light-grey);
    color: var(--dark-grey);
    font-size: 16px;
    outline: none;
  }
  
  .search-bar-input::placeholder {
    color: var(--grey);
  }
  
  /* Search button */
  .search-bar-icon {
    position: absolute;
    left: 17px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: none;
    cursor: default;
  }
  .search-bar-icon img {
    width: 18px;
    height: 18px;
  }
  
  /* Clear button */
  .search-bar-clear {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
  }
  /* Small devices */
  @media (max-width: 768px) {
    .search-bar-input {
      height: 44px;
      font-size: 15px;
    }
    .search-bar {
      max-width: none;
    }
  }

</style>