import { defineStore } from 'pinia';
import { baseUrl } from '../shared/baseUrl';

export const useHouseStore = defineStore('houseStore', {
    state: () => ({
      houses: [],
      isActive: 'price',
      searchInput: '',
    }),
    actions: {
      async getHouses() {
        const res = await fetch(baseUrl, {
          method: "GET",
          headers: {
            "X-Api-Key": apiKey,
          },
        });
        const data = await res.json();
        this.houses = data;
        if(res.error) {
          console.log(res.error),
        };
      },
    },
});