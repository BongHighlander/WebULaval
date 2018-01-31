<template>
  <div class="body">
    <nav-menu v-bind:isLoggedIn="false"></nav-menu>
    <div class="login-signup">
      <div class="login-signup-box">

        <h1 class="is-size-3">Sign up to UBeat</h1>

        <div class="field" :class="{invalid: $v.email.$error}">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" type="email" v-model="email" @blur="$v.email.$touch()">
          </div>
          <p v-if="emptyEmail" class="help is-danger">This field is required.</p>
          <p v-if="badEmail" class="help is-danger">This email address is already in use.</p>
          <p v-if="$v.email.$error" class="help is-danger">Please provide a valide email.</p>
        </div>
        <div class="field" :class="{invalid: $v.username.$error}">
          <label class="label">Name</label>
          <div class="control">
            <input class="input" type="text" v-model="username" @blur="$v.username.$touch()">
          </div>
          <p v-if="$v.username.$error" class="help is-danger">The username needs to be at least 4 characters..</p>
        </div>
        <div class="field" :class="{invalid: $v.password.$error}">
          <label class="label">Password</label>
          <div class="control">
            <input class="input" type="password" v-model="password" @blur="$v.password.$touch()">
          </div>
          <p v-if="$v.password.$error" class="help is-danger">Password needs to be at least 6 characters.</p>
          <p v-if="serverError" class="help is-danger">The service is temporarily unavailable. Please try again
            later</p>
        </div>
        <div class="control">
          <button v-on:click="doSignUp(email, password)" :disabled="$v.$invalid" class="button is-primary">Submit
          </button>
        </div>
      </div>
    </div>
    <hero-footer v-bind:forcePushDown="true"></hero-footer>
  </div>
</template>
<script>
  /* eslint-disable */
  import * as utils from '@/utils';
  import * as secureApi from '@/secureApi';
  import Navigation from '@/components/Navigation';
  import Footer from '@/components/Footer';
  import {required, email, minLength} from 'vuelidate/lib/validators'

  export default {
    name: "SignUp",
    components: {
      'nav-menu': Navigation,
      'hero-footer': Footer
    },
    data: () => ({
      email: undefined,
      password: undefined,
      username: undefined,
      emptyEmail: false,
      badEmail: false,
      serverError: false
    }),
    validations: {
      email: {required, email},
      username: {required, minLen: minLength(4)},
      password: {required, minLen: minLength(6)}
    },
    methods: {
      async doSignUp() {
        if (this.email === undefined || this.email.length === 0) {
          this.serverError = false;
          this.badEmail = false;
          this.emptyEmail = true;
        }
        else {
          let res = await secureApi.signUp(this.username, this.email, this.password);
          let status = await res.status;
          if (status === 401) {
            this.serverError = false;
            this.emptyEmail = false;
            this.badEmail = true;
          }
          else if (status >= 500) {
            this.emptyEmail = false;
            this.badEmail = false;
            this.serverError = true;
          }
          else {
            utils.theLogin(this.email, this.password);
          }
        }
      }
    },
    created() {
      utils.verifyAuthWithRedirect(false);
    }
  }
</script>
