<template>
  <div>
    <nav-menu v-bind:isLoggedIn="true"></nav-menu>
    <router-link to="/">
      <section class="hero-ubeat is-large is-bold" id="main-hero">
        <div class="hero-body">
          <h1 class="title">
            Welcome to UBeat
            <span class="icon is-small"><i class="fa fa-music"></i></span>
          </h1>
        </div>
      </section>
    </router-link>
    <router-link to="/album/574050396">
      <section class="hero-album is-large" id="album-hero">
        <div class="hero-body">
          <h1 class="title">
            Album
          </h1>
        </div>
      </section>
    </router-link>
    <router-link to="/artist/5040714">
      <section class="hero-artist is-large" id="artist-hero">
        <div class="hero-body">
          <h1 class="title">
            Artist
          </h1>
        </div>
      </section>
    </router-link>
    <hero-footer v-bind:forcePushDown="false"></hero-footer>
  </div>

</template>

<script>
  import * as utils from '@/utils';
  import Navigation from '@/components/Navigation';
  import Footer from '@/components/Footer';

  export default {
    name: 'Home',
    components: {
      'nav-menu': Navigation,
      'hero-footer': Footer
    },
    data: () => ({
      hello: 'world'
    }),
    created() {
      utils.verifyAuthWithRedirect(true);
    }
  };
</script>


<style lang="sass" scoped>
  @import "bulma_global"

  .hero-ubeat
    @extend .hero
    background-image: url('./img/ubeat.jpeg')
    background-position: center center
    background-repeat: no-repeat
    background-size: cover

  .hero-artist
    @extend .hero
    background-image: url('./img/artist.jpeg')
    background-position: center center
    background-repeat: no-repeat
    background-size: cover
    flex-direction: row
    flex-wrap: wrap
    align-content: center

  .hero-album
    @extend .hero
    background-image: url('./img/album.jpeg')
    background-position: center center
    background-repeat: no-repeat
    background-size: cover
    flex-direction: row
    flex-wrap: wrap
    align-content: center

  .hero-body:hover .title, .hero-body.hover .title
    color: #00d1b2

  .hero:hover
    filter: drop-shadow(8px 8px 10px black)
</style>

