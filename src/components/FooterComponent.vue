<template>
  <footer>
    <nav class="nav-footer">
      <router-link :to="{ name: 'HomeView' }" :class="{ 'router-link-exact-active': isHome }">
        <img class="btn-home" alt="btn-home">
      </router-link>
      <router-link :to="{ name: 'AboutView' }" :class="{ 'router-link-exact-active': isAbout }">
        <img class="btn-about" alt="btn-about">
      </router-link>
    </nav>
  </footer>
</template>
  
<script setup>
  import { useActivePage } from '@/composables/useActivePage';

  const { isHome, isAbout } = useActivePage();
</script>

<style>

      footer {
        position: fixed;
        bottom: 0;
        background: var(--white);
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      }
      
      .nav-footer {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        padding-inline: 80px;
      }
      
      .nav-footer a {
        color: var(--dark-grey);
        text-decoration: none;
      }
      
      .btn-home {
        content: url("../assets/ic_mobile_navigarion_home@3x.png");
      }
      a.router-link-exact-active .btn-home {
        content: url("../assets/ic_mobile_navigarion_home_active@3x.png");
      }
      .btn-about {
        content: url("../assets/ic_mobile_navigarion_info@3x.png");
      }
      a.router-link-exact-active .btn-about {
        content: url("../assets/ic_mobile_navigarion_info_active@3x.png");
      }
      
      .btn-home {
        float: left;
        height: 30px;
      }
      .btn-about {
        float: right;
        height: 30px;
      }
      
      /* Hide footer on large devices */

      @media (min-width: 769px) {
        footer {
          display: none;
        }
      }

</style>
