import { computed } from 'vue';
import { useRoute } from 'vue-router';

export function useActivePage() {
  const route = useRoute();

  const isHome = computed(() => route?.name === 'home');
  const isAbout = computed(() => route?.name === 'about');

  return {
    isHome,
    isAbout,
  };
}