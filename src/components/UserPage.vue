<template>
  <div class="body">
    <nav-menu v-bind:isLoggedIn="true"></nav-menu>
    <section class="section">
      <div class="container">
        <div class="no-bg-hl has-text-centered"><img id="avatar" v-bind:src="gravatarURL"/></div>
        <div class="level">
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Name</p>
              <p class="title">{{username}}</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Email Address</p>
              <p class="title">{{email}}</p>
            </div>
          </div>
          <div class="level-item has-text-centered" v-if="!isPageOfLoggedInUser">
            <button class="button is-info" v-on:click="logicUser()">
              <span class="icon is-small" v-if="alreadyFollowedByLoggedInUser">
                <i class="fa fa-check"></i>
              </span>
              <span v-if="alreadyFollowedByLoggedInUser">Unfollow</span>
              <span v-else>Follow</span>
            </button>
          </div>
        </div>
        <p class="title has-text-centered">Following</p>
        <div class="columns is-multiline">
          <followedUserBox
            v-for="user in followedUsers"
            :key="user._id"
            :followedUser="user"
            :canUnfollow="isPageOfLoggedInUser"
            @doUnfollowUser="doUnfollowUser"
          ></followedUserBox>
        </div>
      </div>
      <router-link v-bind:to="'/playlists/'+userId" class="title has-text-centered title-link">Playlists</router-link>
      <div class="columns is-multiline">
        <template v-for="playlist in playlists">
          <div v-if="!/^\s*$/.test(playlist.name)" class="column is-one-fifth">
            <span>{{playlist.name}} ({{playlist.tracks.length}})</span>
          </div>
          <div v-else class="column is-one-fifth">
            <span>Unnamed Playlist ({{playlist.tracks.length}})</span>
          </div>
        </template>
      </div>
    </section>
    <hero-footer v-bind:forcePushDown="true"></hero-footer>
  </div>
</template>

<script>
  /* eslint-disable */
  import Navigation from '@/components/Navigation';
  import * as utils from '@/utils';
  import * as secureApi from '@/secureApi';
  import Footer from '@/components/Footer';
  import followedUserBox from './followedUserBox.vue';

  export default {
    name: "UserPage",
    components: {
      'nav-menu': Navigation,
      'hero-footer': Footer,
      followedUserBox,
    },
    data: () => ({
      email: undefined,
      username: undefined,
      userId: undefined,
      followedUsers: [],
      playlists: [],
      loggedInUserId: undefined,
      alreadyFollowedByLoggedInUser: undefined,
      isPageOfLoggedInUser: true,
      gravatarURL: undefined
    }),
    computed: {},
    methods: {
      async logicUser() {
        if (!this.alreadyFollowedByLoggedInUser) {
          await secureApi.followUser(this.userId, true);
          this.alreadyFollowedByLoggedInUser = true;
        } else {
          let loggedInUserInfo = await secureApi.getTokenInfo(true);
          for (let followedUser of loggedInUserInfo.following) {
            if (followedUser.email === this.email) {
              await secureApi.unfollowUser(followedUser._id, true);
            }
          }
          this.alreadyFollowedByLoggedInUser = false;
        }
      },
      async doUnfollowUser(email, followId) {

        let userId = await utils.getUserIdFromEmail(email);
        if (userId === null) {
        }
        else {
          await secureApi.unfollowUser(followId, true);
          let unfollowedUserIndex = this.followedUsers.findIndex(user => user.email === email);
          if (unfollowedUserIndex !== -1) {
            this.followedUsers.splice(unfollowedUserIndex, 1);
          }
        }
      },
      async computeAlreadyFollowed() {
        let loggedInUserInfo = await secureApi.getTokenInfo(true);
        for (let followedUser of loggedInUserInfo.following) {
          if (followedUser.email === this.email) {
            return true;
          }
        }
        return false;
      },
      async init() {
        utils.verifyAuthWithRedirect(true);
        let theJson = await secureApi.getUser(this.$route.params.user_id, true);
        this.email = await theJson.email;
        this.username = await theJson.name;
        this.userId = await theJson.id;
        this.followedUsers = await theJson.following;
        this.playlists = await secureApi.getPlaylistsFromUser(this.userId, true);
        let theJson2 = await secureApi.getTokenInfo(true);
        this.loggedInUserId = theJson2.id;
        this.isPageOfLoggedInUser = this.userId === this.loggedInUserId;
        this.alreadyFollowedByLoggedInUser = await this.computeAlreadyFollowed();
        this.gravatarURL = utils.getGravatar(this.email, 200);
      }
    },
    created() {
      this.init();
    },
    watch: {
      async '$route.params.user_id'() {
        await this.init();
      }
    }

  }
</script>
<style>
  a.title-link {
    display: block !important;
    color: hsl(217, 71%, 53%)
  }

  #avatar {
    border: 2px solid
  }
</style>
