<template>
  <div>
    <nav class="navbar has-shadow is-primary">
      <div class="navbar-brand">
        <div class="nav-item">
          <router-link to="/">
            <a class="no-bg-hl navbar-item title is-tab" id="company-name-nav">
              UBeat
            </a>
          </router-link>
        </div>
        <div class="navbar-item">
          <template v-if="isLoggedIn">
            <router-link class="navbar-item is-tab" v-bind:to="'/playlists/'+userId">
              Playlists
            </router-link>
          </template>
        </div>
        <button v-on:click="activeBurger" v-bind:class="{'is-active': burgerActive}" class="button navbar-burger"
                id="the-burger">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div class="navbar-menu" v-bind:class="{'is-active': burgerActive}">
        <div class="navbar-start">
          <div class="no-bg-hl navbar-item" v-on="{mouseover: onOverSearch, mouseleave:leaveSearch}"
               v-bind:class="{'is-active': searchActive}">
            <template v-if="isLoggedIn">

              <div class="no-bg-hl navbar-item">
                <div class="field has-addons">
                  <div class="control">
                    <input class="input" v-model="searchField"
                           v-on:keyup="searchItem(searchField, currentSearchOption)" type="text"
                           placeholder="Find a track, album, song or user here" ref="searchbar">
                  </div>
                  <div class="control">
                    <span v-if="currentSearchOption !== 'user'">
                      <a v-bind:href="'/#/search/' + currentSearchOption + '/' + limit + '/' + searchField"
                         class="button is-info">
                      <i class="fa fa-search" aria-hidden="true"
                         v-on:click="searchItem($refs.searchbar.value, $refs.searchoptions.options[$refs.searchoptions.selectedIndex].value)"
                         v-on:keyup.enter="searchItem($refs.searchbar.value, $refs.searchoptions.options[$refs.searchoptions.selectedIndex].value)"></i>
                      </a>
                    </span>
                    <span v-else>
                      <a v-bind:href="'/#/search/' + currentSearchOption + '/' + searchField" class="button is-info">
                      <i class="fa fa-search" aria-hidden="true"
                         v-on:click="searchItem($refs.searchbar.value, $refs.searchoptions.options[$refs.searchoptions.selectedIndex].value)"
                         v-on:keyup.enter="searchItem($refs.searchbar.value, $refs.searchoptions.options[$refs.searchoptions.selectedIndex].value)"></i>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div class="navbar-dropdown">
                <div v-if="autocompleteSearch.length > 0" v-for="searchItem in autocompleteSearch">
                  <a class="no-bg-hl navbar-item" v-if="searchItem.wrapperType === 'track'"
                     v-bind:href="'/#/search/track' + '/' + limit + '/' + searchItem.trackName">
                    {{searchItem.trackName}} in &nbsp <b> Track</b>
                  </a>
                  <a class="no-bg-hl navbar-item" v-if="searchItem.wrapperType === 'collection'"
                     v-bind:href="'/#/album/' + searchItem.collectionId">
                    {{searchItem.collectionName}} in &nbsp <b> Album</b>
                  </a>
                  <a class="no-bg-hl navbar-item" v-if="searchItem.wrapperType === 'artist'"
                     v-bind:href="'/#/artist/' + searchItem.artistId">
                    {{searchItem.artistName}} in &nbsp <b> Artist</b>
                  </a>
                </div>
                <div class="no-bg-hl navbar-item">
                  <select class="select is-fullwidth" ref="searchoptions"
                          v-on:change="changeSearchOption($refs.searchoptions.options[$refs.searchoptions.selectedIndex].value)">
                    <option value="global">Global search</option>
                    <option value="artist">Search by artist</option>
                    <option value="album">Search by album</option>
                    <option value="track">Search by track</option>
                    <option value="user">Search by user</option>
                  </select>
                </div>
                <div v-if="currentSearchOption !== 'user'" class="no-bg-hl navbar-item">
                  <label class="label" for="limit">Limit :
                    <input id="limit" v-model="limit" class="input" type="number" ref="limit" min="0" max="200"
                           value="10">
                  </label>
                </div>
              </div>
            </template>
          </div>
        </div>


        <div class="navbar-end">
          <template v-if="isLoggedIn">
            <div class="no-bg-hl navbar-item" id="welcome-msg">Welcome, {{user}}</div>
            <div class="no-bg-hl navbar-item"><img v-bind:src="gravatarURL"/></div>

          </template>
          <template v-if="isLoggedIn">
            <a class="navbar-item is-tab" v-on:click="gotoUserPage()">
              Profile
            </a>
          </template>
          <template v-if="!isLoggedIn">
            <a class="navbar-item" v-on:click="redirectSignUp()">
              Sign Up
            </a>
          </template>
          <template v-if="!isLoggedIn">
            <a class="navbar-item" v-on:click="redirectLogin()">
              Sign In
            </a>
          </template>
          <template v-if="isLoggedIn">
            <a class="navbar-item is-tab" v-on:click="doLogout()">
              Logout
            </a>
          </template>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
  /* eslint-disable */
  import * as utils from '@/utils';
  import * as secureApi from '@/secureApi';

  export default {
    name: 'Navigation',
    props: ["isLoggedIn"],
    data: () => ({
      searchField: '',
      user: 'Louis-Mathieu',
      burgerActive: false,
      loggedIn: undefined,
      searchActive: false,
      currentSearchOption: 'global',
      following: undefined,
      userId: undefined,
      limit: 10,
      email: undefined,
      gravatarURL: undefined,
      autocompleteSearch: []
    }),
    methods: {
      onOverSearch() {
        this.searchActive = true;
      },
      leaveSearch() {
        this.searchActive = false;
      },
      activeBurger() {
        if (this.burgerActive) this.burgerActive = false;
        else this.burgerActive = true;
      },
      doLogout() {
        secureApi.logout();
      },

      gotoUserPage(){
        window.location = "/#/userpage/"+this.userId;
      },
      removeRedundancy(result, index, list){
        list.forEach(function (i, ind, l) {
          if(this.wrapperType === 'track' && i.wrapperType === 'track' && this.trackName === i.trackName && index <= ind){
            list.splice(ind,1)
          }
        }, result)
      },
      async searchItem(searchValue, optionValue, allowRedirectOnNoAuth) {
        let limit = 15;
        let returnValue = null;
        let status = undefined;
        let theJson = undefined;
        switch (optionValue) {
          case 'global' :
            if (this.searchField !== '') {
              returnValue = await secureApi.globalSearch(searchValue, limit, false);

              status = await returnValue.status;
              if(status === 403){
                this.autocompleteSearch = [];
              }
              else{
                theJson = await returnValue.theJson;
                this.autocompleteSearch = theJson.results;
              }

            } else {
              this.autocompleteSearch = [];
            }
            this.autocompleteSearch.map(this.removeRedundancy);
            break;
          case 'artist' :
            returnValue = await secureApi.globalSearch(searchValue, limit, false);

            status = await returnValue.status;
            if(status === 403){
              this.autocompleteSearch = [];
            }
            else{
              theJson = await returnValue.theJson;
              this.autocompleteSearch = theJson.results;
              this.autocompleteSearch.map(this.removeRedundancy);
            }
            break;
          case 'album' :
            returnValue = await secureApi.globalSearch(searchValue, limit, false);

            status = await returnValue.status;
            if(status === 403){
              this.autocompleteSearch = [];
            }
            else{
              theJson = await returnValue.theJson;
              this.autocompleteSearch = theJson.results;
              this.autocompleteSearch.map(this.removeRedundancy);
            }
            break;
          case 'track' :
            returnValue = await secureApi.globalSearch(searchValue, limit, false);

            status = await returnValue.status;
            if(status === 403){
              this.autocompleteSearch = [];
            }
            else{
              theJson = await returnValue.theJson;
              this.autocompleteSearch = theJson.results;
              this.autocompleteSearch.map(this.removeRedundancy);
            }
            break;
          case 'user' :
            returnValue = await secureApi.globalSearch(searchValue, limit, false);

            status = await returnValue.status;
            if(status === 403){
              this.autocompleteSearch = [];
            }
            else{
              theJson = await returnValue.theJson;
              this.autocompleteSearch = theJson.results;
              this.autocompleteSearch.map(this.removeRedundancy);
            }
            break;
        }
      },
      redirectSignUp() {
        this.$router.push('signup');
      },
      redirectLogin() {
        this.$router.push('login');
      },

      changeSearchOption(newValue) {
        this.currentSearchOption = newValue;
      },

      getGravatar(email, size) {
        return utils.getGravatar(email, size);
      }
    },
    async created() {
      let res = await secureApi.getTokenInfo(false);
      let good = await res.good;
      if (good) {
        let theJson = await res.theJson;
        this.user = await theJson.name;
        this.userId = await theJson.id;
        this.email = await theJson.email;
        this.gravatarURL = this.getGravatar(this.email, 50);
      }
    }
  }

</script>


<style lang="sass" scoped>
  @import "bulma_global"
  .navbar-burger:hover
    background: whitesmoke
</style>
