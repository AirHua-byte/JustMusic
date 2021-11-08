<template>
  <div class="cover-row" :style="rowStyles">
    <div
     class="item"
     v-for="item in items"
     :key="item.id"
     :class="{ artist: type === 'artist' }"
    >
      <Cover
        :id="item.id"
        :image-url="getImageUrl(item)"
        :type="type"
        :play-button-size="type === 'artist' ? 26 : playButtonSize"
      ></Cover>
    </div>
  </div>
</template>

<script>
import Cover from '@/components/Cover.vue';
// import ExplicitSymbol from '@/components/ExplicitSymbol.vue';

export default {
  name: 'CoverRow',
  components: {
    Cover,
    // ExplicitSymbol,
  },
  props: {
    items: { type: Array, require: true },
    type: { type: String, require: true },
    subText: { type: String, default: 'null' },
    subTextFontSize: { type: String, default: '16px' },
    showPlayCount: { type: Boolean, default: false },
    columnNumber: { type: Number, default: 5 },
    gap: { type: String, default: '44px 24px' },
    playButtonSize: { type: Number, default: 22 },
  },
  computed: {
    rowStyles() {
      return {
        'grid-template-columns': `repeat(${this.columnNumber}, 1fr)`,
        gap: this.gap,
      };
    },
  },
  methods: {
    getSubText(item) {
      if (this.subText === 'copywriter') return item.copywriter;
      if (this.subText === 'description') return item.description;
      if (this.subText === 'updateFrequency') return item.updateFrequency;
      if (this.subText === 'creator') return 'by' + item.creator.nickname;
      if (this.subText === 'releaseYear')
        return new Date(item.publishTime).getFullYear();
      if (this.subText === 'artist') {
        if (item.artist !== undefined)
          return `<a href="/#/artist/${item.artist.id}">${item.artist.name}</a>`;
        if (item.artists !== undefined) {
          return `<a href="/#/artist/${item.artists[0].id}">${item.artists[0].name}</a>`;
        }
      }
      if (this.subText === 'albumType+releaseYear') {
        let albumType = item.type;
        if (item.type === 'EP/Single') {
          albumType = item.size === 1 ? 'Single' : 'EP';
        } else if (item.type === 'Single') {
          albumType = 'Single';
        } else if (item.type === '专辑') {
          albumType = 'Album';
        }
        return `${albumType} · ${new Date(item.publishTime).getFullYear()}`;
      }
      if (this.subText === 'appleMusic') return 'by Apple Music';
    },
    isPrivacy(item) {
      return this.type === 'playlist' && item.privacy === 10;
    },
    isExplicit(item) {
      return this.type === 'album' && item.mark === 1056768;
    },
    getTitleLink(item) {
      return `/${this.type}/${item.id}`;
    },
    getImageUrl(item) {
      /* if (item.img1v1Url) {
        let img1v1ID = item.img1v1Url.split('/');
        img1v1ID = img1v1ID[img1v1ID.length - 1];
        if (img1v1ID === '5639395138885805.jpg') {
          // 没有头像的歌手，网易云返回的img1v1Url并不是正方形的 😅😅😅
          return 'https://p2.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=512y512';
        }
      } */
      let img = item.img1v1Url || item.picUrl || item.coverImgUrl;
      return `${img?.replace('http://', 'https://')}?param=512y512`;
    },
  },
};
</script>
