<template>
  <div>
    
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { isLooseLoggedIn, doLogout } from '@/utils/auth';
import 'vscode-codicons/dist/codicon.css';
import ContextMenu from '@/components/ContextMenu.vue';
import ButtonIcon from '@/components/ButtonIcon.vue';

const electron = 
  process.env.IS_ELECTRON === true ? window.require('electron') : null;
const ipcRenderer = 
  process.env.IS_ELECTRON === true ? electron.ipcRenderer : null;

export default {
  name: 'Navbar',
  components: {
    ButtonIcon,
    ContextMenu,
  },
  data() {
    return {
      inputFocus: false,
      langs: ['zh-CN', 'zh-TW', 'en', 'tr'],
      keywords: '',
      isWindowMaximized: false,
    };
  },
  computed: {
    ...mapState(['settings', 'data']),
    isLooseLoggedIn() {
      return isLooseLoggedIn();
    },
    avatarUrl() {
      return this.data?.user?.avatarUrl && this.isLooseLoggedIn
        ? `${this.data?.user?.avatarUrl}?param=512y512`
        : 'http://s4.music.126.net/style/web2/img/default/default_avatar.jpg?param=60y60';
    },
  },
  created() {
    if (process.env.IS_ELECTRON === true) {
      ipcRenderer.on('isMaximized', (event, value) => {
        this.isWindowMaximized = value;
      });
    }
  },
  methods: {
    go(where) {
      if (where === 'back') this.$router.go(-1);
      else this.$router.go(1);
    },
    doSearch() {
      if (!this.keywords) return;
      if (
        this.$router.name === 'search' && 
        this.$router.params.keywords === this.keywords
      ) {
        return;
      }
      this.$router.push({
        name: 'search',
        params: { keywords: this.keywords },
      });
    },
    showUserProfileMenu(e) {
      this.$refs.userProfileMenu.openMenu(e);
    },
    logout() {
      if (!confirm('确定要退出吗？')) return;
      doLogout();
      this.$router.push({ name: 'home' });
    },
    
  }
}
</script>