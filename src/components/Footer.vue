<template>
  <section class="hero is-primary is-small" v-bind:id="forcePushDown?'footer-force':'footer'">
    <div class="hero-foot is-flex">
      <nav class="tabs is-boxed is-centered">
        <div class="container">
          <ul>
            <li><a>
              <span class="icon is-small"><i class="fa fa-globe"></i></span>
              About Us
            </a></li>
            <li><a>
              <span class="icon is-small"><i class="fa fa-file-text-o"></i></span>
              <span>Contact Us</span>
            </a></li>
          </ul>
        </div>
        <div class="container is-flex">
          <ul>
            <li><a>
               <span class="icon">
                <i class="fa fa-github"></i>
              </span>
            </a></li>
            <li><a>
               <span class="icon">
                <i class="fa fa-facebook"></i>
              </span>
            </a></li>
            <li><a>
               <span class="icon">
                <i class="fa fa-google-plus"></i>
              </span>
            </a></li>
            <li><a>
               <span class="icon">
                <i class="fa fa-twitter"></i>
              </span>
            </a></li>
            <li><a>
               <span class="icon">
                <i class="fa fa-pinterest"></i>
              </span>
            </a></li>
          </ul>
        </div>
      </nav>
    </div>
  </section>

</template>
<script>
  /* eslint-disable */
  export default {
    props: ["forcePushDown"],
  }
</script>

<style lang="sass">
  @import "bulma_global"
</style>
