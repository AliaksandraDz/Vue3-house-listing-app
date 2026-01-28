import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import './assets/create and edit.css'

const pinia = createPinia();

pinia.use(({ store }) => {
  store.$router = router
});

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')