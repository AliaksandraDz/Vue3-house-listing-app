<template>
  <div v-for="house in store.houses" :key="house.id" class="houses-list">
    <HouseListing :house="house" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import HouseListing from '@/components/HouseListing.vue'
import { useStore } from '@/stores/store'

const store = useStore();

onMounted(() => {
  store.getHouses();
});
</script>