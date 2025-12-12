<template>
  <router-link :to="{ name: 'HouseDetails', params: { id: house.id }}">
    <article class="house-card">
      <img class="house-card-image" :src="house.image" alt="House"/>
      <div class="house-card-info">
        <h3 class="house-card-title">{{ house.location.street }} {{ house.location.houseNumber }}</h3>
        <p class="house-card-price">€ {{ house.price }}</p>
        <p class="house-card-address">{{ house.location.zip }} {{ house.location.city }}</p>
        <p class="house-card-meta">
          <span class="meta-item">
            <img src="../assets/ic_bed@3x.png" alt="Bed" />{{ house.rooms.bedrooms }}
          </span>
          <span class="meta-item">
            <img src="../assets/ic_bath@3x.png" alt="Bath" />{{ house.rooms.bathrooms }} 
          </span>
          <span class="meta-item">
            <img src="../assets/ic_size@3x.png" alt="Size" />{{ house.size }} m2
          </span>
        </p>
      </div>
    </article>
  </router-link>
</template>

<script setup>
  defineProps({
    house: Object
  });
</script>