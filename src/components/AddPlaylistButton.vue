<template>
  <div class="dropdown" v-bind:class="{'is-active': buttonClicked}" v-on:mouseleave="onBlur">
    <div class="dropdown-trigger">
      <button class="button is-info" v-on="{'click':onClick}" aria-haspopup="true" aria-controls="dropdown-menu">
        <i class="fa fa-plus" aria-hidden="true"></i>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content" v-for="playlist in playlists"
           v-bind:key="playlist.id">
        <div v-on:click="addSong(playlist.id,track,true)">
          <a class="dropdown-item">
            <span class="icon is-small">
              <i class="fa fa-plus" aria-hidden="true"></i>
            </span>
            <span v-if="playlist.name !== ''">
              {{playlist.name}}
            </span>
            <span v-else>
              Unnamed Playlist
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import * as secureApi from '@/secureApi';


  export default {
    name: 'AddPlaylistButton',
    props: {
      track: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      playlists: [],
      buttonClicked: false
    }),
    methods: {
      async getVuePlaylists(allowRedirectOnNoAuth) {
        this.playlists = await secureApi.getPlaylists(allowRedirectOnNoAuth);
      },
      onClick() {
        this.buttonClicked = !this.buttonClicked;
      },
      onBlur() {
        this.buttonClicked = false;
      },
      addSong(playlistId, track, allowRedirectOnNoAuth) {
        secureApi.addSongToPlaylist(playlistId, track, allowRedirectOnNoAuth);
        this.onClick();
      }
    },
    created() {
      this.getVuePlaylists(true);
    }
  };
</script>
<style lang="sass" scoped>

</style>
