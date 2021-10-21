import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import '@/assets/icons';
import store from './store';
import '@/assets/css/global.scss';
import NProgress from 'nprogress';
import '@/assets/css/nprogress.css';

window.resetApp = () => {
  localStorage.clear();
  indexedDB.deleteDatabase('justmusic');
  document.cookie.split(';').forEach(c => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + 'path=/');
  });
  return '已重置应用，请刷新页面（Ctrl/Command + R）';
};
console.log(
  '如出现问题，可尝试在本页输入 %cresetApp()%c 然后按回车重置应用。',
  'background: #eaeffd;color:#335eea;padding: 4px 6px;border-radius:3px;',
  'background:unset;color:unset;'
);

Vue.config.productionTip = false;

// NProgress.start();
NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
