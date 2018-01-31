<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  /* eslint-disable */
  import Footer from '@/components/Footer';

  export default {
    name: 'app',
    components: {
      'hero-footer': Footer
    },
  };
</script>

<style lang="css">
  @import "components/custom_global.css";
  @import "components/bulma_global.sass";
</style>
