<template>
  <div class="home" v-show="show">
    <div
     class="index-row first-row"
     v-if="settings.showPlaylistsByAppleMusic !== false"
    >
      <div class="title"> by Apple Music </div>
      <CoverRow
        :type="'playlist'"
        :items="byAppleMusic"
        sub-text="appleMusic"
        :image-size="1024"
      ></CoverRow>
    </div>
  </div>
</template>

<script>
import { toplists, recommendPlaylist } from '@/api/playlist';
import { toplistOfArtists } from '@/api/artist';
import { byAppleMusic } from '@/utils/staticData';
import { newAlbums } from '@/api/album';
import NProgress from 'nprogress';
import { mapState } from 'vuex';
import CoverRow from '@/components/CoverRow.vue';
// import FMCard from '@/components/FMCard.vue';
// import dailyTracksCard from '@/components/DailyTracksCard.vue'

export default {
  name: 'Home',
  components: { CoverRow, },
  data() {
    return {
      show: false,
      // 推荐歌单
      recommendPlaylist: { items: [] },
      // 新专速递
      newReleasesAlbum: { items: [] },
      toplist: {
        items: [],
        ids: [19723756, 180106, 60198, 3812895, 60131],
      },
      recommendArtists: {
        items: [],
        indexs: [],
      },
    };
  },
  computed: {
    ...mapState(['settings']),
    byAppleMusic() {
      return byAppleMusic;
    },
  },
  activated() {
    this.loadData();
    this.$parent.$refs.scrollbar.restorePosition();
  },
  methods: {
    loadData() {
      setTimeout(() => {
        if (!this.show) NProgress.start();
      }, 1000);
      recommendPlaylist({
        limit: 10,
      }).then(data => {
        this.recommendPlaylist.items = data.result;
        NProgress.done();
        this.show = true;
      });
      newAlbums({
        area: this.settings.musicLanguage ?? 'ALL',
        limit: 10,
      }).then(data => {
        this.newReleasesAlbum.items = data.albums;
      });

      const toplistOfArtistsAreaTable = {
        all: null,
        zh: 1,
        ea: 2,
        jp: 4,
        kr: 3,
      };
      toplistOfArtists(
        toplistOfArtistsAreaTable[this.settings.musicLanguage ?? 'all']
      ).then(data => {
        let indexs = [];
        while (indexs.length < 6) {
          let tmp = ~~(Math.random() * 100);
          if (!indexs.includes(tmp)) indexs.push(tmp);
        }
        this.recommendArtists.indexs = indexs;
        this.recommendArtists.items = data.list.artists.filter((l, index) => 
          indexs.includes(index)
        );
      });
      toplists().then(data => {
        this.toplist.items = data.list.filter(l => 
          this.toplist.ids.includes(l.id)
        );
      });
      // this.$refs.DailyTracksCard.loadDailyTracks();
      console.log(this.settings)
    },
  },
};
</script>
