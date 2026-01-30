<template>
  <header>
    <nav class="nav-header">
      <router-link :to="{ name: 'HomeView' }">
        <img alt="logo" src="../assets/img_logo_dtt@3x.png">
      </router-link>
      <router-link :to="{ name: 'HomeView' }" :class="{ 'router-link-active': isHome }">Houses</router-link>
      <router-link :to="{ name: 'AboutView' }" :class="{ 'router-link-active': isAbout }">About</router-link>
    </nav>
  </header>
</template>
  
<script setup>
  import { useActivePage } from '@/composables/useActivePage';

  const { isHome, isAbout } = useActivePage();
</script>
  
<style>

      header {
        background: var(--white);
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1;
      }
      
      .nav-header {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 70px;
        max-width: 1300px;
        padding-inline: 24px;
      }
      
      .nav-header img {
        height: 35px;
        width: 103px;
      }
      
      .nav-header a {
        color: var(--grey);
        text-decoration: none;
        font-size: 18px;
        font-family: "Montserrat";
        font-weight: 500;
      }
      
      .nav-header a.router-link-active {
        color: var(--black);
        font-family: "Montserrat";
        font-weight: 700;
      }
      
      /* Hide header on small devices */

      @media (max-width: 768px) {
        header {
          display: none;
        }
      }

</style>