<template>
  <div id="artist">
    <nav-menu v-bind:isLoggedIn="true"></nav-menu>
    <div class="column is-two-thirds-desktop is-offset-2-desktop">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">Artist</p>
        </header>

        <div class="card-content">
          <div class="content">
            <p class="title is-4">{{artistData.artistName}}</p>
            <a :href="artistData.artistLinkUrl"
               style="display:inline-block;overflow:hidden;background:url(//tools.applemusic.com/assets/shared/badges/en-us/music-lrg.svg) no-repeat;width:175px;height:50px;"></a>
          </div>

          <div class="media">
            <figure class="image is-256x256">
              <img src="https://static-openask-com.s3.amazonaws.com/content/images/tests/large/888_test.jpg">
            </figure>
          </div>

          <div class="content style">
            <p>Style : {{artistData.primaryGenreName}}</p>
          </div>
          <div class="content album-list">
            <p><strong>Album list ({{albums.resultCount}})</strong></p>


            <div
              v-for="album in albums.results"
              v-bind:key="album.collectionId"
              v-bind:album="album"
              class="box columns"
            >
              <div class="media-left column is-one-third">
                <figure class="album-cover"><img v-bind:src="album.artworkUrl100"
                                                 class="responsive-image">
                </figure>
              </div>
              <div class="media-content column">
                <p><strong>{{album.collectionName}}</strong></p>
                <p>Release Date : {{(new Date(album.releaseDate)).toLocaleDateString()}}</p>
                <div><a v-bind:href="'/#/album/' + album.collectionId" class="button is-info">View album</a></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <hero-footer v-bind:forcePushDown="false"></hero-footer>
  </div>
</template>

<script>
  /* eslint-disable */
  import * as secureApi from '@/secureApi';
  import Navigation from '@/components/Navigation';
  import * as utils from '@/utils'
  import Footer from '@/components/Footer';

  export default {
    name: "Artist",
    components: {
      'nav-menu': Navigation,
      'hero-footer': Footer
    },
    data: () => ({
      artistData: "artistData null",
      albums: "albums null",
    }),
    methods: {
      async getArtist(id, allowRedirectOnNoAuth) {
        let res = await secureApi.getArtist(id, allowRedirectOnNoAuth);
        this.artistData = res.results[0];
      },
      async getAlbumsOfArtist(id, allowRedirectOnNoAuth) {
        this.albums = await secureApi.getAlbumsOfArtist(id, allowRedirectOnNoAuth);
      },
    },
    created: async function () {
      utils.verifyAuthWithRedirect(true);
      await this.getArtist(this.$route.params.artist_id, true);
      await this.getAlbumsOfArtist(this.$route.params.artist_id, true);
    },
    watch: {
      async '$route.params.artist_id'() {
        utils.verifyAuthWithRedirect(true);
        await this.getArtist(this.$route.params.artist_id, true);
        await this.getAlbumsOfArtist(this.$route.params.artist_id, true);
      }
    }
  };
</script>

<style lang="sass">
  @import "artist.css"

</style>
