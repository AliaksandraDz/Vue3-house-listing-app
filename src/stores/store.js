import { defineStore } from 'pinia';
import { baseUrl } from '../shared/baseUrl';
import { apiKey } from '../shared/apiKey';

export const useStore = defineStore('store', {
  state: () => ({
    houses: [],
    isActive: 'price',
    searchInput: '',
  }),

  actions: {
    async getHouses() {
      const res = await fetch(`${baseUrl}`, {
        method: "GET",
        headers: { "X-Api-Key": apiKey },
      });

      if (!res.ok) {
        console.error('Failed to fetch houses', res.status);
        return;
      }

      this.houses = await res.json();

    },

    async getHouseById(id) {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: { "X-Api-Key": apiKey },
      });
    
      if (!res.ok) {
        throw new Error(`Failed to fetch house ${id}`);
      }
    
      const data = await res.json()
      return data[0]  // always return a single object
    },

    async deleteHouse(id) {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
          "X-Api-Key": apiKey
        },
      });
          
      if (!res.ok) {
        throw new Error(`Failed to delete house ${id}`);
      }
    },

    toggleActive(buttonType) {
      this.isActive = buttonType;
    },

    // for post add "madeByMe": true

    clearSearch() {
      this.searchInput = '';
    },
  },

  getters: {
    filteredHouses(state) {
      const query = state.searchInput.toLowerCase().trim();

      const sorted = [...state.houses].sort((a, b) => {
        if (state.isActive === 'price') return a.price - b.price;
        if (state.isActive === 'size') return a.size - b.size;
        return 0;
      });

      if (!query) return sorted;

      return sorted.filter((house) => {
        if (!house.location) return false;
        const street = house.location.street?.toLowerCase() || '';
        const city = house.location.city?.toLowerCase() || '';
        return street.includes(query) || city.includes(query);
      });
    },
  },
});
