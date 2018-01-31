<template>
  <div id="search-results">
    <nav-menu v-bind:isLoggedIn="true"></nav-menu>
    <div class="column is-two-thirds-desktop is-offset-2-desktop">
      <div>
        <header v-if="searchType === 'global'" class="card-header"><h1 class="title">Global search&nbsp<i
          class="fa fa-globe" aria-hidden="true"></i></h1></header>
        <header v-else-if="searchType === 'track'" class="card-header"><h1 class="title">Track search&nbsp<i
          class="fa fa-music" aria-hidden="true"></i></h1></header>
        <header v-else-if="searchType === 'artist'" class="card-header"><h1 class="title">Artist search&nbsp<i
          class="fa fa-eye" aria-hidden="true"></i></h1></header>
        <header v-else="searchType === 'collection'" class="card-header"><h1 class="title">Album search&nbsp<i
          class="fa fa-tablet" aria-hidden="true"></i></h1></header>
      </div>
      <br/>
      <div v-if="trackList.length > 0">
        <h1 class="title">Tracks&nbsp<i class="fa fa-music" aria-hidden="true"></i></h1>
        <playlist v-bind:albumTracks="trackList" v-bind:isAlbumPlaylist="true"
                  v-bind:playlists="playlists" v-bind:isGlobalSearch="true" v-bind:canModify="true"></playlist>
      </div>
      <div v-if="albumList.length > 0" class="album-list">
        <h1 class="title">Albums&nbsp<i class="fa fa-tablet" aria-hidden="true"></i></h1>
        <div v-for="album in albumList"
             v-bind:key="album.collectionId"
             v-bind:album="album"
             class="box columns">
          <div class="media-left column is-one-third">
            <figure class="album-cover"><img v-bind:src="album.artworkUrl100"
                                             class="responsive-image">
            </figure>
          </div>
          <div class="media-content column">
            <p><strong>{{album.collectionName}}</strong></p>
            <p><strong>{{album.artistName}}</strong></p>
            <div><a v-bind:href="'/#/album/' + album.collectionId" class="button is-info">View album</a></div>
          </div>
        </div>
      </div>
      <br/>
      <div v-if="artistList.length > 0">
        <h1 class="title">Artists&nbsp
          <i class="fa fa-eye" aria-hidden="true"></i>
        </h1>
        <div v-for="artist in artistList"
             v-bind:key="artist.artistId"
             v-bind:artist="artist"
             class="box columns">
          <div class="media-left column is-one-third">
            <p class="title is-4">{{artist.artistName}}</p>
            <a :href="artist.artistLinkUrl"
               style="display:inline-block;overflow:hidden;background:url(//tools.applemusic.com/assets/shared/badges/en-us/music-lrg.svg) no-repeat;width:175px;height:50px;"></a>
          </div>
          <div class="media-content column">
            <p><strong>Style : {{artist.primaryGenreName}}</strong></p>
            <a v-bind:href="'/#/artist/' + artist.artistId" class="button is-info">View Artist</a>
          </div>
        </div>
      </div>

    </div>
    <hero-footer v-bind:forcePushDown="false"></hero-footer>
  </div>
</template>

<script>
  /* eslint-disable */
  import * as utils from '@/utils';
  import * as secureApi from '@/secureApi';
  import Navigation from '@/components/Navigation';
  import Footer from '@/components/Footer';
  import Playlist from './Playlist.vue';

  export default {
    name: 'SearchResults',
    components: {
      'playlist': Playlist,
      'nav-menu': Navigation,
      'hero-footer': Footer
    },
    data: () => ({
      playlists: [],
      searchType: 'searchType null',
      searchField: 'searchId null',
      searchData: 'searchData null',
      trackList: [],
      albumList: [],
      artistList: [],
      userList: [],
      limit: undefined,
      userId: undefined
    }),
    methods: {
      sortGlobalSearch(result) {
        if (result.wrapperType === 'track') {
          this.trackList.push(result);
        } else if (result.wrapperType === 'collection') {
          this.albumList.push(result)
        } else if (result.wrapperType === 'artist') {
          this.artistList.push(result)
        }
      },
      async searchResult(type, field, limit, allowRedirectOnNoAuth) {
        switch (type) {
          case 'global':
            this.searchData = await secureApi.globalSearch(field, limit, allowRedirectOnNoAuth);
            this.searchData.results.map(this.sortGlobalSearch);
            break;
          case 'artist':
            this.searchData = await secureApi.artistSearch(field, limit, allowRedirectOnNoAuth);
            this.artistList = this.searchData.results;
            break;
          case 'album':
            this.searchData = await secureApi.albumSearch(field, limit, allowRedirectOnNoAuth);
            this.albumList = this.searchData.results;
            break;
          case 'track':
            this.searchData = await secureApi.trackSearch(field, limit, allowRedirectOnNoAuth);
            this.trackList = this.searchData.results;
            break;
        }
      },
      async init(){
        let theJson = await secureApi.getTokenInfo(true);
        this.userId = await theJson.id;
        this.playlists = await secureApi.getPlaylistsFromUser(this.userId, true);
        this.searchType = this.$route.params.type;
        this.limit = this.$route.params.limit;
        this.searchField = this.$route.params.id;
        await this.searchResult(this.searchType, this.searchField, this.limit, true);
      },
      async reInit () {
        utils.verifyAuthWithRedirect(true);
        this.playlists = [];
        this.artistList = [];
        this.albumList = [];
        this.trackList = [];
        this.playlists = await secureApi.getPlaylistsFromUser(this.userId, true);
        this.searchType = this.$route.params.type;
        this.limit = this.$route.params.limit;
        this.searchField = this.$route.params.id;
        await this.searchResult(this.searchType, this.searchField, this.limit, true);
      },
    },
    created: async function () {
      utils.verifyAuthWithRedirect(true);
      this.init();
    },
    watch: {
      '$route': 'reInit',
      async '$route.params.id'() {
        await this.init();
      }
    }
  };
</script>

<style lang="sass">
  @import "bulma_global"
  @import "searchResultsPage.css"
</style>
