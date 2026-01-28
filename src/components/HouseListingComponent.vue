<template>
  <router-link :to="{ name: 'HouseDetailsView', query: { delete: clickedOnDelete}, params: { id: house.id }}">
    <article class="house-card">
      <img class="house-card-image" :src="house.image" alt="House"/>
      <div class="house-card-info">
        <h2 class="house-card-title">{{ house.location.street }} {{ house.location.houseNumber }} {{ house.location?.houseNumberAddition }}
          <div class="house-card-actions" v-if="house.madeByMe">
            <router-link
              :to="{ name: 'HouseEditView', params: { id: house.id }}"
              class="btn btn-edit">
                <img class="btn-edit-icon" src="../assets/ic_edit@3x.png" alt="Edit" />
            </router-link>
            <button class="btn btn-delete" @click="clickedOnDelete = true">
                <img class="btn-delete-icon" src="../assets/ic_delete@3x.png" alt="Delete" />
            </button>
          </div>
        </h2>
        <p class="house-card-price">€ {{ house.price.toLocaleString('nl-NL') }}</p>
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

<script>
import { ref } from 'vue'

export default {
  name: 'HouseListingComponent',
  props: {
    house: {
      type: Object,
      required: true,
    },
  },

  setup() {

    /* -----------------------------------
    * Local state
    * ------------------------------------
    * clickedOnDelete →
    * - Becomes true when delete button is clicked
    * - Passed as query param to HouseDetailsView
    * - Used there to auto-open the delete modal
    */

    const clickedOnDelete = ref(false)

    return { clickedOnDelete }
  }
}
</script>

<style>

      .house-card {
        display: flex;
        align-items: stretch;
        background: var(--white);
        border-radius: 7px;
        box-shadow: 0 3px 10px var(--light-grey);
        padding: 20px 24px;
        margin-inline: auto;
        width: 100%;
      }

      .house-card-actions {
        display: flex;
        gap: 8px;
      }

      .house-card-actions .btn {
        background-color: transparent;
      }
    
      .house-card-info h3,
      .house-card-info p {
        font-family: "Open Sans";
      }

      .house-card-image {
        border-radius: 7px;
        object-fit: cover;
        flex-shrink: 0;
        margin-right: 28px;
      }
      
      .house-card-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
        justify-content: center;
        width: 100%
      }
      
      .house-card-title {
        width: 100%;
        display: flex;
        justify-content: space-between;
        color: var(--black);
        font-weight: 700;
      }
      
      .house-card-price {
        font-weight: 600;
        color: var(--dark-grey);
      }
      
      .house-card-address {
        color: var(--grey);
        font-weight: 500;
      }
      
      .house-card-meta {
        display: flex;
        align-items: center;
        gap: 20px;
        font-size: 16px;
        color: var(--dark-grey);
        font-weight: 500;
      }
      
      .meta-item {
        display: inline-flex;
        align-items: center;
        gap: 6.4px;
      }

      .meta-item img {
        width: 18px;
      }
      
      .house-card:hover {
        cursor: pointer;
        box-shadow: 0 5px 10px var(--light-grey);
        transform: translateY(-1px);
        transition: box-shadow 0.15s ease, transform 0.15s ease;
      }
    
      /* Small devices */
      @media (max-width: 768px) {
        .house-card {
          width: 100%;
          padding: 15px;
          margin-bottom: 15px;
        }

        .house-card-image {
          width: 130px;
          height: 130px;
        }

        .house-card-info h3,
        .house-card-info p {
          font-size: 12px;
        }
      }
    
      /* Large devices */
      @media (min-width: 769px) {
        /* .houses-list,
        .loading {
          padding-inline: 300px;
        } */
    
        .house-card {
          padding: 20px 24px;
          margin-bottom: 20px;
        }
    
        .house-card-info h3,
        .house-card-info p {
          font-size: 16px;
        }
    
        .house-card-image {
          width: 150px;
          height: 150px;
        }
      }

</style>