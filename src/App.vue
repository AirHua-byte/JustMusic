<template>
  <div id="app" :class="{ 'user-select-none': userSelectNone }">
  </div>
</template>

<script>
import ModalAddTrackToPlaylist from './components/ModalAddTrackToPlaylist.vue';
import ModalNewPlaylist from './components/ModalNewPlaylist.vue'
import Scrollbar from './components/Scrollbar.vue'
import Navbar from './components/Navbar.vue'
import Player from './components/Player.vue'
import Toast from './components/Toast.vue';
import Lyrics from './views/lyrics.vue';
import {mapState} from 'vuex';

export default {
  name: 'App',
  components: {
    Navbar,
    Player,
    Toast,
    ModalAddTrackToPlaylist,
    ModalNewPlaylist,
    Lyrics,
    Scrollbar
  },
  data() {
    return {
      userSelectNone: false,
    };
  },
};
</script>
