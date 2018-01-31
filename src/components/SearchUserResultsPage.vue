<template>
  <div id="search-results">
    <nav-menu v-bind:isLoggedIn="true"></nav-menu>
    <div class="column is-two-thirds-desktop is-offset-2-desktop">
      <div>
        <header class="card-header"><h1 class="title">User search&nbsp<i class="fa fa-user-circle"
                                                                         aria-hidden="true"></i></h1></header>
      </div>
      <div v-if="userList.length > 0">
        <div class="columns is-multiline" v-for="user in userList"
             v-bind:key="user.id" v-bind:user="user">
          <div class="column is-one-fifth">
            <p class="title is-4">{{user.name}}</p>
          </div>
          <div class="column is-one-fifth">
            <a v-bind:href="'/#/userpage/' +user.id" class="button is-info">View User</a>
          </div>
          <div v-if="user.id !== loggedInUserId" class="column is-one-fifth">
            <button class="button is-info" v-on:click="logicUser(user)">
            <span class="icon is-small" v-if="isAlreadyFollowedByLoggedInUser(user)">
              <i class="fa fa-check"></i>
            </span>
              <span v-if="isAlreadyFollowedByLoggedInUser(user)">Unfollow</span>
              <span v-else>Follow</span>
            </button>
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

  export default {
    name: 'SearchResults',
    components: {
      'nav-menu': Navigation,
      'hero-footer': Footer
    },
    data: () => ({
      searchType: 'searchType null',
      searchField: 'searchId null',
      searchData: 'searchData null',
      userList: [],
      loggedInUserId: undefined,
      followedUsers: []
    }),
    methods: {
      async searchResult(field, allowRedirectOnNoAuth) {
        this.searchData = await secureApi.userSearch(field, allowRedirectOnNoAuth);
        this.userList = this.searchData;
      },
      async reInit() {
        this.searchField = this.$route.params.id;
        await this.searchResult(this.searchField, true);
      },
      async reInitFollowedUsers() {
        let theJson = await secureApi.getTokenInfo(true);
        this.followedUsers = theJson.following;
      },
      async logicUser(user) {
        let isFollowed = await this.isAlreadyFollowedByLoggedInUser(user);
        if (isFollowed) {
          let unfollowedUserIndex = this.followedUsers.findIndex(unfollowedUser => unfollowedUser.email === user.email);
          if (unfollowedUserIndex !== -1) {
            await secureApi.unfollowUser(this.followedUsers[unfollowedUserIndex]._id, true);
            this.followedUsers.splice(unfollowedUserIndex, 1);
          }
        }
        else {
          await secureApi.followUser(user.id, true);
          this.followedUsers.push(user);
        }
      },
      isAlreadyFollowedByLoggedInUser(user) {
        let isFollowed = false;
        for (let followedUser of this.followedUsers) {
          if (followedUser.email === user.email) {
            isFollowed = true;
          }
        }
        return isFollowed;
      }
    },
    created: async function () {
      utils.verifyAuthWithRedirect(true);
      this.searchType = this.$route.params.type;
      this.searchField = this.$route.params.id;
      await this.searchResult(this.searchField, true);
      let theJson = await secureApi.getTokenInfo(true);
      this.loggedInUserId = theJson.id;
      this.email = theJson.email;
      this.followedUsers = theJson.following;
    },
    watch: {
      '$route': 'reInit',
      'followedUsers': 'reInitFollowedUsers'
    },
  };
</script>

<style lang="sass">
  @import "bulma_global"
</style>
