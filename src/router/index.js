/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Album from '@/components/Album';
import Artist from '@/components/Artist';
import Playlists from '@/components/Playlists';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import UserPage from '@/components/UserPage';
import SearchResultsPage from '@/components/SearchResultsPage';
import SearchUserResultsPage from '@/components/SearchUserResultsPage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    }, {
      path: '/artist/:artist_id',
      name: 'Artist',
      component: Artist
    }, {
      path: '/album/:album_id',
      name: 'Album',
      component: Album
    }, {
      path: '/playlists/:user_id',
      name: 'Playlists',
      component: Playlists
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    }, {
      path: '/userpage/:user_id',
      name: 'UserPage',
      component: UserPage
    }, {
      path: '/search/:type/:limit/:id',
      name: 'SearcgResultsPage',
      component: SearchResultsPage
    }, {
      path: '/search/:type/:id',
      name: 'SearchUserResultsPage',
      component: SearchUserResultsPage
    }
  ]
});
