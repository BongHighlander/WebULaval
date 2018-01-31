<template>
  <div class="card-content" id="Playlist">
    <div class="content">
      <table class="table is-striped is-hoverable is-narrow">
        <thead class="table-title">
        <tr>
          <th></th>
          <th><abbr title="play-icon"></abbr></th>
          <th><abbr title="id">#</abbr></th>
          <th><abbr title="song-name">Name</abbr></th>
          <th v-if="!isAlbumPlaylist">Album</th>
          <th v-if="isGlobalSearch">Album</th>
          <th v-if="!isAlbumPlaylist">Artist</th>
          <th v-if="isGlobalSearch">Artist</th>
          <th v-if="!isAlbumPlaylist">Genre</th>
          <th v-if="isGlobalSearch">Genre</th>
          <th><abbr title="song-long">Length</abbr></th>
          <th v-if="!isAlbumPlaylist"></th>
        </tr>
        </thead>
        <tbody class="table-body">
        <tr class="pistes-table-row" v-for="(track,trackIndex) in albumTracks"
            v-bind:key="track.trackId">
          <td>
            <template v-if="canModify">
              <add-playlist-button v-bind:track="track" v-bind:playlists="playlists"
                                   v-bind:songAdded="songAdded"></add-playlist-button>
            </template>
          </td>
          <td class="pistes-table-row-content-icon">
            <button v-on:click="playSongStopOthers(track.previewUrl)" class="play-button">
              <span v-if="track.previewUrl !== audioElement.src">▶</span>
              <span v-else>❚❚</span>
            </button>
          </td>
          <td class="pistes-table-row-content-id">{{trackIndex + 1}}</td>
          <td class="pistes-table-row-content-song-name">{{track.trackName}}</td>
          <td v-if="!isAlbumPlaylist">
            <a v-bind:href="'/#/album/' + track.collectionId" class="album-link">{{track.collectionName}}</a>
          </td>
          <td v-if="isGlobalSearch">
            <a v-bind:href="'/#/album/' + track.collectionId" class="album-link">{{track.collectionName}}</a>
          </td>
          <td v-if="!isAlbumPlaylist">
            <a v-bind:href="'/#/artist/' + track.artistId" class="artist-link">{{track.artistName}}</a>
          </td>
          <td v-if="isGlobalSearch">
            <a v-bind:href="'/#/artist/' + track.artistId" class="artist-link">{{track.artistName}}</a>
          </td>
          <td v-if="!isAlbumPlaylist">{{track.primaryGenreName}}</td>
          <td v-if="isGlobalSearch">{{track.primaryGenreName}}</td>
          <td class="pistes-table-row-content-song-duration">{{renderLength(track.trackTimeMillis)}}</td>
          <td v-if="!isAlbumPlaylist && canModify">
            <button class="button is-danger button-delete-title"
                    v-on:click="removeTrack(playlistId, track.trackId, true)">
              <i class="fa fa-times" aria-hidden="true"></i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import * as secureApi from '@/secureApi';
  import AddPlaylistButton from './AddSongToPlaylistButton.vue';

  export default {
    name: 'Playlist',
    components: {
      'add-playlist-button': AddPlaylistButton
    },
    props: ['albumTracks', 'isAlbumPlaylist', 'playlistId', 'playlists', 'addSongManually', 'isGlobalSearch', 'canModify'],
    data: () => ({
      audioElement: new Audio()
    }),
    methods: {
      async removeTrack(playlistId, trackId, allowRedirectOnNoAuth) {
        await secureApi.deleteSongFromPlaylist(playlistId, trackId, allowRedirectOnNoAuth);
        let i = 0;
        for (; i < this.albumTracks.length; i++) {
          if (this.albumTracks[i].trackId === trackId) {
            break;
          }
        }
        this.albumTracks.splice(i, 1);
        this.audioElement.pause();
      },
      playSongStopOthers(songURL) {
        if (this.audioElement.src === songURL) {
          this.audioElement.pause();
          this.audioElement = new Audio();

        } else {
          this.audioElement.pause();
          this.audioElement = new Audio(songURL);
          this.audioElement.play();
        }
      },
      getSecondsString(num) {
        let strNum = '';
        if (num < 10) {
          strNum = `0${num}`;
        } else {
          strNum = `${num}`;
        }
        return strNum;
      },
      renderLength(lengthMLS) {
        const secondsTotal = Math.floor(lengthMLS / 1000);
        const hours = Math.floor(secondsTotal / 3600);
        const minutes = Math.floor((secondsTotal % 3600) / 60);
        const seconds = this.getSecondsString(secondsTotal % 60);

        const strHours = (hours !== 0 ? `${hours}:` : '');
        return `${strHours}${minutes}:${seconds}`;
      },
      songAdded(playlistId, track) {
        let isThePlaylist = function (playlist) {
          return playlist.id === playlistId;
        };
        let playlist = this.playlists.find(isThePlaylist);
        playlist.tracks.push(track);
      }
    },
    created() {
    },
    beforeDestroy() {
      this.audioElement.pause();
    }
  };
</script>
<style lang="sass">
  @import "bulma_global"
  @import "album.css"
</style>
