import { computed } from 'vue';
import { useRoute } from 'vue-router';

export function useActivePage() {
  const route = useRoute();

  const isHome = computed(() => route?.name === 'home'|| route.name === 'HouseDetails' || route.name === 'HouseDetailsView' || route.name === 'HouseEditView');
  const isAbout = computed(() => route?.name === 'about');

  return {
    isHome,
    isAbout,
  };
}