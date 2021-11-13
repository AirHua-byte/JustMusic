<template>
  <div>
    playlist
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import NProgress from 'nprogress';
import {
  getPlaylistDetail,
  subscribePlaylist,
  deletePlaylist,
} from '@/api/playlist';
import { getTrackDetail } from '@/api/track';
import { isAccountLoggedIn } from '@/utils/auth';
import nativeAlert from '@/utils/nativeAlert';
import locale from '@/locale';

import ButtonTwoTone from '@/components/ButtonTwoTone.vue';
import ContextMenu from '@/components/ContextMenu.vue';
import TrackList from '@/components/TrackList.vue';
import Cover from '@/components/Cover.vue';
import Modal from '@/components/Modal.vue';

const specialPlaylist = {
  2829816518: {
    name: '欧美私人订制',
    gradient: 'gradient-pink-purple-blue',
  },
  2890490211: {
    name: '助眠鸟鸣声',
    gradient: 'gradient-green',
  },
  5089855855: {
    name: '夜的胡思乱想',
    gradient: 'gradient-moonstone-blue',
  },
  2888212971: {
    name: '全球百大DJ',
    gradient: 'gradient-orange-red',
  },
  2829733864: {
    name: '睡眠伴侣',
    gradient: 'gradient-midnight-blue',
  },
  2829844572: {
    name: '洗澡时听的歌',
    gradient: 'gradient-yellow',
  },
  2920647537: {
    name: '还是会想你',
    gradient: 'gradient-dark-blue-midnight-blue',
  },
  2890501416: {
    name: '助眠白噪声',
    gradient: 'gradient-sky-blue',
  },
  5217150082: {
    name: '摇滚唱片行',
    gradient: 'gradient-yellow-red',
  },
  2829961453: {
    name: '古风音乐大赏',
    gradient: 'gradient-fog',
  },
  4923261701: {
    name: 'Trance',
    gradient: 'gradient-light-red-light-blue ',
  },
  5212729721: {
    name: '欧美点唱机',
    gradient: 'gradient-indigo-pink-yellow',
  },
  3103434282: {
    name: '甜蜜少女心',
    gradient: 'gradient-pink',
  },
  2829896389: {
    name: '日系私人订制',
    gradient: 'gradient-yellow-pink',
  },
  2829779628: {
    name: '运动随身听',
    gradient: 'gradient-orange-red',
  },
  2860654884: {
    name: '独立女声精选',
    gradient: 'gradient-sharp-blue',
  },
  898150: {
    name: '浪漫婚礼专用',
    gradient: 'gradient-pink',
  },
  2638104052: {
    name: '牛奶泡泡浴',
    gradient: 'gradient-fog',
  },
  5317236517: {
    name: '后朋克精选',
    gradient: 'gradient-pink-purple-blue',
  },
  2821115454: {
    name: '一周原创发现',
    gradient: 'gradient-blue-purple',
  },
  3136952023: {
    name: '私人雷达',
    gradient: 'gradient-radar',
  },
};

export default {
  name: 'Playlist',
  components: {
    Cover,
    ButtonTwoTone,
    ContextMenu,
    TrackList,
    Modal,
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      },
    },
  },
  data() {
    return {
      show: false,
      playlist: {
        id: 0,
        coverImgUrl: '',
        creator: {
          userId: '',
        },
        trackIds: [],
      },
      showFullDescription: false,
      tracks:  [],
      loadingMore: false,
      hasMore: false,
      lastLoadedTrackIndex: 9,
      displaySearchInPlaylist: false,
      searchKeyWords: '',
      inputFocus: false,
      debounceTimeout: null,
      searchInputWidth: '0px', // 搜索栏宽度
    };
  },
  computed: {
    ...mapState(['player', 'data']),
    isLikeSongsPage() {
      return this.$route.name === 'likedSongs';
    },
    specialPlaylistInfo() {
      return specialPlaylist[this.playlist.id];
    },
    isUserOwnPlaylist() {
      return (
        this.playlist.creator.userId === this.data.user.userId &&
        this.playlist.id !== this.data.likedSongPlaylistID
      );
    },
    filteredTracks() {
      return this.tracks.filter(
        track => 
          (track.name &&
            track.name
              .toLowerCase()
              .includes(this.searchKeyWords.toLowerCase())) ||
          (track.al.name &&
            track.al.name
              .toLowerCase()
              .includes(this.searchKeyWords.toLowerCase())) ||
          track.ar.find(
            artist =>
              artist.name &&
              artist.name
                .toLowerCase()
                .includes(this.searchKeyWords.toLowerCase())
          )
      );
    },
  },
}
</script>