<template>
  <div class="body">
    <nav-menu v-bind:isLoggedIn="true"></nav-menu>
    <div v-if="validAlbum" class="column is-two-thirds-desktop is-offset-2-desktop">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Album
          </p>
        </header>
        <div class="card-content">
          <div class="card-aside-left">
            <p v-if="artistData" class="title is-4">{{artistData.artistName}} - {{albumData.collectionName}}</p>
            <div class="media" v-on="{mouseover: overImage, mouseleave: leaveImage}">
              <figure class="image is-centered is-256x256"><img v-bind:src="albumData.artworkUrl100"
                                                                class="responsive-image">
              </figure>
              <div class="img-button" v-if="overAlbumImage">
                <add-album-button v-bind:albumTracks="albumTracks"></add-album-button>
              </div>
            </div>
            <div class="content details">
              <div>
                <div>Genre : {{albumData.primaryGenreName}}</div>
                <div>Release Date : {{(new Date(albumData.releaseDate)).toLocaleDateString()}}</div>
                <div>Total Songs : {{albumTracks.length}}</div>
                <div v-if="artistData"><a :href="'/#/artist/' + artistData.artistId" class="button is-info">
                  View artist
                </a></div>
              </div>
            </div>
          </div>
          <playlist v-bind:albumTracks="albumTracks" v-bind:isAlbumPlaylist="true"
                    v-bind:playlistId="albumData.collectionId" v-bind:playlists="playlists"
                    v-bind:canModify="true"></playlist>
        </div>
      </div>
    </div>
    <hero-footer v-bind:forcePushDown="false"></hero-footer>
  </div>
</template>


<script>
  /* eslint-disable */
  import Navigation from '@/components/Navigation';
  import Playlist from './Playlist.vue';
  import * as secureApi from '@/secureApi';
  import * as utils from '@/utils';
  import AddAlbumButton from './AddAlbumSongsToPlaylistButton.vue';
  import Footer from '@/components/Footer';

  export default {
    name: 'Album',
    components: {
      'nav-menu': Navigation,
      AddAlbumButton,
      'playlist': Playlist,
      'add-album-button': AddAlbumButton,
      'hero-footer': Footer
    },
    data: () => ({
      statusCode: undefined,
      validAlbum: undefined,
      albumData: undefined,
      albumResponse: undefined,
      artistData: undefined,
      albumTracks: [],
      currentlyPlayingIndex: undefined,
      toggleFlags: [],
      isPresentFlags: [],
      overAlbumImage: false,
      playlists: [],
      userId: '',
    }),
    methods: {
      overImage() {
        this.overAlbumImage = true;
      },
      leaveImage() {
        this.overAlbumImage = false;
      },
      trackIsPresent(trackId, playlist) {
        for (let trackObj of playlist.tracks) {
          if (trackObj.trackId === trackId) {
            return true;
          }
        }

        return false;
      },
      async deleteSongFromPlaylist(playlistId, trackId, playlistIndex, allowRedirectOnNoAuth) {
        await secureApi.deleteSongFromPlaylist(playlistId, trackId, allowRedirectOnNoAuth);
        for (let i = 0; i < this.playlists[playlistIndex].tracks.length; i++) {
          if (this.playlists[playlistIndex].tracks[i].trackId === trackId) {
            this.playlists[playlistIndex].tracks.splice(i, 1);
            break;
          }
        }
      },
      async addSongToPlaylist(playlistId, trackObj, allowRedirectOnNoAuth) {
        await secureApi.addSongToPlaylist(playlistId, trackObj, allowRedirectOnNoAuth);
        for (let i = 0; i < this.playlists.length; i++) {
          if (this.playlists[i].trackOrAlbum === playlistId) {
            this.playlists[i].tracks.push(trackObj);
            break;
          }
        }
      },
      isGoodStatus(statusCode) {
        return 200 <= statusCode && statusCode < 400;
      },
      async setAlbumDataAndResponse(allowRedirectOnNoAuth) {
        let albumId = this.$route.params.album_id;
        let res = await secureApi.getAlbum(albumId, allowRedirectOnNoAuth);
        this.albumResponse = await res.theResponse;
        if (this.isGoodStatus(this.albumResponse.status)) {
          let theJson = await res.theJson;
          this.albumData = theJson.results[0];
        }
      },
      setAlbumResponseStatusCode() {
        this.statusCode = this.albumResponse.status;
      },
      async setArtistData(allowRedirectOnNoAuth) {
        let res = await secureApi.getArtist(this.albumData.artistId, allowRedirectOnNoAuth);
        this.artistData = res.results[0];
      },
      async setAlbumTracks(allowRedirectOnNoAuth) {
        let res = await secureApi.getTracksOfAlbum(this.albumData.collectionId, allowRedirectOnNoAuth);

        this.albumTracks = res.results;
      },
      setUpToggleFlags() {
        this.toggleFlags = new Array(this.albumTracks.length);
        this.toggleFlags.fill(false);
      },
    },
    created: async function () {
      await utils.verifyAuthWithRedirect(true);
      await this.setAlbumDataAndResponse(true);
      let theJson = await secureApi.getTokenInfo(true);
      this.userId = await theJson.id;
      this.setAlbumResponseStatusCode();
      this.validAlbum = this.isGoodStatus(this.statusCode);
      if (!this.validAlbum)
        return;
      this.setArtistData(true);
      this.setAlbumTracks(true);
      this.setUpToggleFlags();
      this.playlists = await secureApi.getPlaylistsFromUser(this.userId, true);

    },
    watch: {
      async '$route.params.album_id'() {
        await utils.verifyAuthWithRedirect(true);
        await this.setAlbumDataAndResponse(true);
        this.setAlbumResponseStatusCode();
        this.validAlbum = this.isGoodStatus(this.statusCode);
        if (!this.validAlbum)
          return;
        this.setArtistData(true);
        this.setAlbumTracks(true);
        this.setUpToggleFlags();
      }
    }
  }
</script>
<style lang="sass" scoped>
  @import "bulma_global"
  @import "album.css"

  .media
    display: inline-block
    position: relative

  .img-button
    position: absolute
    bottom: 0
    right: 0
</style>
<style>
</style>
