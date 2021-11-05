<template>
  <div>
    <nav>
      <div class="win32-titlebar">
        <div class="title">YesPlayMusic</div>
        <div class="controls">
          <div
            class="button minimize codicon codicon-chrome-minimize"
            @click="windowMinimize"
          ></div>
          <div
            class="button max-restore codicon"
            :class="{
              'codicon-chrome-restore': !isWindowMaximized,
              'codicon-chrome-maximize': isWindowMaximized,
            }"
            @click="windowMaxRestore"
          ></div>
          <div
            class="button close codicon codicon-chrome-close"
            @click="windowClose"
          ></div>
        </div>
      </div>

      <div class="navigation-buttons">
        <button-icon @click.native="go('back')">
          <svg-icon icon-class="arrow-left" />
        </button-icon>
        <button-icon @click.native="go('forward')">
          <svg-icon icon-class="arrow-right" />
        </button-icon>
      </div>

      <div class="navigation-links">
        <router-link to="/" :class="{ active: $router.name === 'home' }">
          {{ $t('nav.home') }}
        </router-link>
        <router-link to="/explore" :class="{ active: $router.name === 'explore' }">
          {{ $t('nav.explore') }}
        </router-link>
        <router-link to="/library" :class="{ active: $router.name === 'library' }">
          {{ $t('nav.library') }}
        </router-link>
      </div>

      <div class="right-part">
        <div class="search-box">
          <div class="container" :class="{ active: inputFocus }">
            <svg-icon icon-class="search" />
            <div class="input">
              <input 
                ref="searchInput"
                v-model="keywords"
                :placeholder="inputFocus ? '' : $t('nav.search')"
                @keydown.enter="doSearch"
                @focus="inputFocus = true"
                @blur="inputFocus = false"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { isLooseLoggedIn, doLogout } from '@/utils/auth';
import 'vscode-codicons/dist/codicon.css';
// import ContextMenu from '@/components/ContextMenu.vue';
import ButtonIcon from '@/components/ButtonIcon.vue';

const electron =
  process.env.IS_ELECTRON === true ? window.require('electron') : null;
const ipcRenderer =
  process.env.IS_ELECTRON === true ? electron.ipcRenderer : null;

export default {
  name: 'Navbar',
  components: {
    ButtonIcon,
    // ContextMenu,
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
    toSettings() {
      this.$router.push({ name: 'settings' });
    },
    toGitHub() {
      window.open('https://github.com/qier222/YesPlayMusic');
    },
    toLogin() {
      if (process.env.IS_ELECTRON === true) {
        this.$router.push({ name: 'loginAccount' });
      } else {
        this.$router.push({ name: 'login' });
      }
    },
    windowMinimize() {
      ipcRenderer.send('minimize');
    },
    windowMaxRestore() {
      ipcRenderer.send('maximizeOrUnmaximize');
    },
    windowClose() {
      ipcRenderer.send('close');
    },
  },
};
</script>
