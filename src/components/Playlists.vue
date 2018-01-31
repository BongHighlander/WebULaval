<template xmlns="http://www.w3.org/1999/html">
  <div>
    <nav-menu v-bind:isLoggedIn="true"></nav-menu>
    <div>
      <header class="card-header"><p class="card-header-title">Playlists</p></header>
    </div>
    <div class="card-content">
      <template v-if="canModify">
        <label for="playlist-namer" class="label">Create a new playlist :
          <div class="field has-addons">
            <div class="control">
              <input name="playlist-namer" id="playlist-namer" class="input" type="text" v-model="nameInput"
                     placeholder="New playlist's name">
            </div>
            <div class="control">
              <button class="button is-info" v-on:click="createPlaylist(nameInput)">
                <i class="fa fa-plus" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </label>
      </template>
    </div>
    <div class="card-content">
      <div v-for="(playlist, playlistIndex) in playlists"
           v-bind:key="playlist.id">
        <div v-if="!/^\s*$/.test(playlist.name)" class="hero is-primary is-small">
          <div class="hero-body columns" v-bind:id="'penis'+playlist.id">
            <div class="container">
              <h1 class="title name-delete-title column">
                {{playlist.name}}
              </h1>
            </div>
            <template v-if="canModify">
              <div class="container column">
                <button class="button is-danger button-delete-title" v-on:click="deletePlaylist(playlist.id)">
                  <i class="fa fa-times" aria-hidden="true"></i>
                </button>
              </div>
            </template>
          </div>
        </div>
        <div v-else="" class="hero is-primary is-small">
          <div class="hero-body columns" v-bind:id="'penis'+playlist.id">
            <div class="container">
              <h1 class="title name-delete-title column">
                Unnamed Playlist
              </h1>
            </div>
            <template v-if="canModify">
              <div class="container column">
                <button class="button is-danger button-delete-title" v-on:click="deletePlaylist(playlist.id)">
                  <i class="fa fa-times" aria-hidden="true"></i>
                </button>
              </div>
            </template>
          </div>
        </div>

        <playlist v-bind:albumTracks="playlist.tracks" v-bind:isAlbumPlaylist="false"
                  v-bind:playlistId="playlist.id" v-bind:playlists="playlists"
                  v-bind:addSongManually="addSongManually"
                  v-bind:canModify="canModify"></playlist>
        <template v-if="canModify">
          <div class="field has-addons">
            <div class="control">
              <label class="label">
                Change playlist name:
                <input
                  name="playlist-renamer" class="input" v-model="playlist.name" type="text"
                  v-on:focus="oldNames[playlistIndex]=playlist.name;editFlags[playlistIndex] = true;">
              </label>
            </div>
          </div>
        </template>
        <template v-if="canModify">
          <div class="field has-addons">
            <div class="control">
              <div v-if="show(playlistIndex, playlist.name, oldNames[playlistIndex])" class="control">
                <button v-on:click="cancelRename(playlistIndex, false)" class="button is-info cancel-rename ">
                  Cancel Changes
                </button>
                <button v-on:click="renameThePlaylist(playlistIndex)" class="button is-info rename">
                  Rename playlist
                </button>
              </div>
            </div>
          </div>
        </template>
        <br/>
      </div>
    </div>
    <hero-footer v-bind:forcePushDown="false"></hero-footer>
  </div>

</template>

<script>
  /* eslint-disable */
  import Navigation from '@/components/Navigation';
  import * as secureApi from "@/secureApi";
  import * as utils from '@/utils';
  export default {
    name: 'Playlists',
    components: {
      'nav-menu': Navigation,
      'playlist': Playlist,
      'hero-footer': Footer
    },
    data: () => ({
      playlists: [],
      nameInput: "",
      editFlags: [],
      oldNames: [],
      userId: '',
      email: '',
      canModify: false
    }),
    computed: {},
    methods: {
      show(playlistIndex, playlistName, oldPlaylistName) {
        return this.editFlags[playlistIndex] && playlistName !== oldPlaylistName;
      },
      cancelRename(playlistIndex) {
        this.editFlags[playlistIndex] = false;
        this.playlists[playlistIndex].name = this.oldNames[playlistIndex];

      },

      async renameThePlaylist(playlistIndex) {
        Vue.set(this.editFlags, playlistIndex, false);
        this.editFlags[playlistIndex] = false;
        await secureApi.modifyPlaylistInfo(this.playlists[playlistIndex].id, this.playlists[playlistIndex].name, true);
      },
      async createPlaylist(playlistName) {
        let playlist = await secureApi.addPlaylist(playlistName, true);
        this.playlists.push(playlist);
        this.editFlags.push(false);
        this.oldNames.push(playlistName);
        this.nameInput = "";
      },
      async deletePlaylist(id,) {
        await secureApi.deletePlaylist(id, true);
        let i = 0;
        for (; i < this.playlists.length; i++) {
          if (this.playlists[i].id === id) {
            break;
          }
        }
        this.playlists.splice(i, 1);
        this.editFlags.splice(i, 1);
        this.oldNames.splice(i, 1);
      },
      setEditFlags() {
        this.editFlags = new Array(this.playlists.length).fill(false);
      },
      setOldNames() {
        this.oldNames = new Array(this.playlists.length).fill(false);
      },
      addSongManually(playlistId, track) {
        let isThePlaylist = function (playlist) {
          return playlist.id === playlistId;
        };
        let playlist = this.playlists.find(isThePlaylist);
        playlist.tracks.push(track);
      },
      async init() {
        utils.verifyAuthWithRedirect(true);
        let theJson2 = await secureApi.getTokenInfo(true);
        let loggedInUserId = await theJson2.id;
        let theJson = await secureApi.getUser(this.$route.params.user_id, true);
        this.userId = await theJson.id;
        this.email = await theJson.email;
        this.playlists = await secureApi.getPlaylistsFromUser(this.userId, true);
        this.canModify = loggedInUserId === this.userId;

        this.setEditFlags();
        this.setOldNames();
      }
    },
    created() {
      this.init()
    },
    watch: {
      async '$route.params.user_id'() {
        await this.init();
      }
    }
  };
  import Playlist from './Playlist.vue';
  import Vue from 'vue'

  import Footer from '@/components/Footer';

</script>
<style lang="sass" scoped>
  @import "bulma_global"
  @import "album.css"

  .h1.name-delete-title
    display: inline

  .button.cancel-rename, button.rename, button.button-delete-title
    display: inline

  .card
    margin-bottom: 100px

  .div
    flex-direction: row
    display: flex
    flex-wrap: wrap
</style>
