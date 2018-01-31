<template>
  <div class="dropdown" v-bind:class="{'is-active': buttonClicked}" v-on:mouseleave="onBlur">
    <div class="dropdown-trigger">
      <button class="button is-info" v-on="{'click':onClick}" aria-haspopup="true"
              aria-controls="dropdown-menu">
        <i class="fa fa-plus" aria-hidden="true"></i>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <template v-for="playlist in playlists">
        <a  v-on:click="addSong(playlist.id, track, true, songAdded);" class="dropdown-item" style="cursor:pointer">

          <span class="icon is-small">
          <i  class="fa fa-plus" aria-hidden="true"></i>
          </span>
          <span>
            {{(playlist.name !== '' ? playlist.name : 'Unnammed Playlist')}}
            <i v-if="songSummited.indexOf(playlist.id) > -1" class="is-success fa fa-check" aria-hidden="true"></i>
          </span>
        </a>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import * as secureApi from '@/secureApi';

  export default {
    name: 'AddPlaylistButton',
    props: ["track", "playlists", "songAdded"],
    data: () => ({
      buttonClicked: false,
      songSummited: []
    }),
    methods: {
      summitSong(playlistId){
        this.songSummited.push(playlistId)
      },
      onClick() {
        this.buttonClicked = !this.buttonClicked;
      },
      onBlur() {
        this.buttonClicked = false;
        this.songSummited = [];
      },
      async addSong(playlistId, track, allowRedirectOnNoAuth, callback) {
        await secureApi.addSongToPlaylist(playlistId, track, allowRedirectOnNoAuth);
        this.summitSong(playlistId);
        callback(playlistId, track);
      },
    },
    created() {
    }
  };
</script>
<style lang="sass" scoped>

</style>
