import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import VueI18n from 'vue-i18n';
import store from '@/store';

import en from './lang/en';
import zhCN from './lang/zh-CN';
import zhTW from './lang/zh-TW';
import tr from './lang/tr.js';

Vue.use(VueClipboard);
Vue.use(VueI18n);

// Vue I18n 是 Vue.js 的国际化插件。
const il18n = new VueI18n({
  locale: store.state.settings.lang,
  messages: {
    en,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    tr,
  },
  silentTranslationWarn: true,
});

export default il18n;
