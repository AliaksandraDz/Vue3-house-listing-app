import { defineStore } from 'pinia';
import { baseUrl } from '../shared/baseUrl';
import { apiKey } from '../shared/apiKey';

export const useStore = defineStore('store', {
    state: () => ({
      houses: [],
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
          console.log(res.error);
        };
      },
    },
});