import Vue from "vue";
import Vuex from "vuex";
import state from './state';
import mutations from './mutation';
import actions from './action';
import Player from '@/utils/Player';

// vuex 自定义插件
import saveToLocalStorage from './plugins/localStorage';
import { getSendSettingsPlugin } from './plugins/sendSettings';
import { changeAppearance } from "@/utils/common";

Vue.use(Vuex);

let plugins = [saveToLocalStorage];

const options = {
  state,
  mutations,
  actions,
  plugins,
};

export default new Vuex.Store(options);

if ([undefined, null].includes(store.state.settings.lang)) {
  const defaultLang = 'en';
  const langMapper = new Map()
    .set('zh', 'zh-CN')
    .set('zh-TW', 'zh-TW')
    .set('en', 'en')
    .set('tr', 'tr');

  store.state.settings.lang = langMapper.get(
    langMapper.has(navigator.language)
      ? navigator.language
      : navigator.language.slice(0, 2)
  ) || defaultLang;

  localStorage.setItem('settings', JSON.stringify(store.state.settings));
}

changeAppearance(store.state.settings.appearance);

window
  .matchMedia('(prefers-color-scheme: drak)')
  .addEventListener('change', () => {
    if (store.state.settings.appearance === 'auto') {
      changeAppearance(store.state.settings.appearance);
    }
  });

let player = new Player();
player = new Proxy(player, {
  set(target, prop, val) {
    target[prop] = val;
    if (prop === '_howler') return true;
    target.saveSelfToLocalStorage();
    target.sendSelfToIpcMain();
    return true;
  },
});

store.state.player = player;
export default store;