<template>
  <div class="column is-one-third">
    <div class="box has-text-centered">
      <span class="has-text-weight-bold">{{followedUser.name}}</span>
      <br/>
      <span>{{followedUser.email}}</span>
      <br/>
      <template v-if="canUnfollow">
        <a class="button is-danger is-outlined" @click="$emit('doUnfollowUser', followedUser.email, followedUser._id);">
          <span>Remove</span>
        </a>
      </template>
      <a class="button is-link" v-on:click="gotoProfile()">Go to Profile</a>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import * as utils from '@/utils';

  export default {
    props: {
      followedUser: {
        type: Object,
        required: true
      },
      canUnfollow: {
        type: Boolean,
        required: true
      }
    },
    data: () => ({}),
    methods: {
      async gotoProfile() {
        let userId = await utils.getUserIdFromEmail(this.followedUser.email);
        this.$router.push({path: "/userpage/" + userId});
      }
    },
    async created() {
    }
  };
</script>
