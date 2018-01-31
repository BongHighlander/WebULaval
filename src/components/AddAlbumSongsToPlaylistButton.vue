<template>
  <div class="dropdown" v-bind:class="{'is-active': buttonClicked}">
    <div class="dropdown-trigger">
      <button class="button is-info" v-on:click="onClick" aria-haspopup="true" aria-controls="dropdown-menu">
        <i class="fa fa-plus" aria-hidden="true"></i>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content" v-for="playlist in playlists"
           v-bind:key="playlist.id">
        <div v-on:click="addAlbum(playlist)">
          <a class="dropdown-item">
            <span class="icon is-small">
              <i class="fa fa-plus" aria-hidden="true"></i>
            </span>
            <span v-if="playlist.name !== ''">
              {{playlist.name}}
               <i v-if="albumSummited.indexOf(playlist.id) > -1" class="is-success fa fa-check" aria-hidden="true"></i>
            </span>
            <span v-else>
              Unnamed Playlist
               <i v-if="albumSummited.indexOf(playlist.id) > -1" class="is-success fa fa-check" aria-hidden="true"></i>
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
      albumTracks: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      playlists: [],
      userId: '',
      buttonClicked: false,
      albumSummited: []
    }),
    methods: {
      summitAlbum(playlistId){
        this.albumSummited.push(playlistId)
      },
      onClick() {
        this.buttonClicked = !this.buttonClicked;
      },
      async addAlbum(playlist) {
        const newPlaylist = this.albumTracks.concat(playlist.tracks);
        await secureApi.modifyPlaylistInfo(playlist.id, playlist.name, playlist.owner, newPlaylist, false);
        this.summitAlbum(playlist.id);
        //this.onClick();
      }
    },
    async created() {
      let theJson = await secureApi.getTokenInfo(true);
      this.userId = await theJson.id;
      this.playlists = await secureApi.getPlaylistsFromUser(this.userId, true);
    }
  };
</script>
