<template>
  <div class="body">
    <nav-menu v-bind:isLoggedIn="false"></nav-menu>
    <div class="login-signup">
      <div class="login-signup-box">
        <h1 class="is-size-3">Connect to UBeat</h1>
        <div class="field" :class="{invalid: $v.email.$error}">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" type="email" v-model="email" @blur="$v.email.$touch()">
          </div>
          <p v-if="$v.email.$error" class="help is-danger">Please provide a valide email.</p>
        </div>
        <div class="field" :class="{invalid: $v.password.$error}">
          <label class="label">Password</label>
          <div class="control">
            <input class="input" type="password" v-model="password" @blur="$v.password.$touch()">
          </div>
          <p v-if="serverError" class="help is-danger">The service is temporarily unavailable. Please try again later</p>
          <p v-if="userError" class="help is-danger">Wrong email or password.</p>
        </div>
        <div class="control">
          <button v-on:click="doLogin(email, password)" :disabled="$v.$invalid" class="button is-primary">Submit</button>
        </div>
        <a class="is-size-6" href="/#/signup">No Account yet? Create one.</a>
      </div>
    </div>
    <hero-footer v-bind:forcePushDown="true"></hero-footer>
  </div>
</template>
<script>
  /* eslint-disable */
  import * as secureApi from '@/secureApi';
  import * as Cookies from "js-cookie";
  import * as utils from '@/utils';
  import Footer from '@/components/Footer';
  import Navigation from '@/components/Navigation';
  import {required, email, minLength} from 'vuelidate/lib/validators'

  export default {
    name: "Login",
    components: {
      'nav-menu': Navigation,
      'hero-footer': Footer
    },
    data: () => ({
      email: undefined,
      password: undefined,
      userError: false,
      serverError: false
    }),
    validations: {
      email: {required, email},
      password: {required}
    },
    methods: {
      async doLogin(email, password) {
        let res = await secureApi.login(email, password);
        let good = await res.good;
        if (good) {
          let theJson = await res.theJson;
          Cookies.set("Authorization", theJson.token);
          window.location = "/#/userpage/" + theJson.id;
        }
        else {
          let status = await res.status;
          if (status === 401) {
            this.serverError = false;
            this.userError = true;
          }
          else if (status >= 500) {
            this.userError = false;
            this.serverError = true;
          }
        }
      }
    },
    async created() {
      utils.verifyAuthWithRedirect(false);
    }
  }
</script>
<style lang="sass">
  @import "bulma_global.sass"
  @import "artist.css"

</style>
