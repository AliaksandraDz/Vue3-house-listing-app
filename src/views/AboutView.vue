<template>
  <div class="about container">
    <h1 class="about-header-sm">About</h1>
    <h1 class="about-title">About DTT Real Estate</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque quis elit ex. Vivamus ut nulla lorem. Mauris metus lorem, condimentum non nulla non, tempus porta libero. Sed in convallis velit. Morbi accumsan volutpat molestie. Pellentesque suscipit dolor purus, eu finibus tellus commodo nec. Vivamus nibh sem, ornare in urna ac, consectetur vehicula lorem.</p>
    <p>Phasellus id interdum metus. Cras sed neque vestibulum, dignissim felis in, imperdiet mi.</p>
    <h1>Design and Development</h1>
    <div class="about-logo">
      <img src="../assets/img_logo_dtt@3x.png" alt="Logo" />
      <span>By DTT
        <br />
        <a href="https://www.d-tt.nl">www.d-tt.nl</a>
      </span>
    </div>
  </div>
</template>

<style>

.about-header-sm {
    font-size: 25.6px;
  }
  .about-logo{
    display: flex; align-items: center;
  }
  .about-logo span {
    padding-left: 15px;
  }
  .about-logo span a {
    text-decoration: none;
    color: var(--blue);
  }

  /* Large devices */
  @media (min-width: 769px) {
    .about-title {
      padding: 25px 0;
    }
    .about-logo {
      padding: 20px 0;
    }
    .about-logo img {
      width: 250px;
      padding-right: 15px;
    }
    .about p {
      padding-bottom: 20px;
    }
    .about-header-sm {
        display: none
    }
  }

  /* Small devices */
  @media (max-width: 768px) {
    .about h1,
    .about h2,
    .about p,
    .about div {
      padding: 10px 20px;
    }
    .about-header-sm {
      text-align: center;
      padding: 25px;
    }
    .about-logo img {
      width: 150px;
      padding-right: 15px;
    }
  }

</style>