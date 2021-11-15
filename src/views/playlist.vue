<template>
  <div>
    <div class="playlist" v-show="show">
      <div
        v-if="specialPlaylistInfo === undefined && !isLikeSongsPage"
        class="playlist-info"
      >
        <Cover
          :id="playlist.id"
          :image-url="playlist.coverImgUrl | resizeImage(1024)"
          :show-play-button="true"
          :always-show-shadow="true"
          :click-cover-to-play="true"
          :fixed-size="288"
          type="playlist"
          :cover-hover="false"
          :play-button-size="18"
          @click.right.native="openMenu"
        >
        </Cover>
        <div class="info">
          <div class="title" @click.right="openMenu">
            <span v-if="playlist.privacy === 10" class="lock-icon">
              <svg-icon icon-class="lock"></svg-icon>
            </span>
            {{ playlist.name }}
          </div>
          <div class="artist">
            Playlist by
            <span
              v-if="
              [
                5277771961,
                5277965913,
                5277969451,
                5277778542,
                5278068783,
              ].includes(playlist.id)
              "
              style="font-weight: 600"
            >
              Apple Music
            </span>
            <a
              v-else
              :href="`https://music.163.com/#/user/home?id=${playlist.creator.userId}`"
              target="blank"
            >
              {{ playlist.creator.nickname }}
            </a>
          </div>
          <div class="date-and-count">
            {{ $t('playlist.updatedAt') }}
            {{ playlist.updateTime | formatDate }} · {{ playlist.trackCount }}
            {{ $t('common.songs') }}
          </div>
          <div class="description" @click="toggleFullDescription">
            {{ playlist.description }}
          </div>
          <div class="buttons">
            <ButtonTwoTone
              icon-class="play"
              @click.native="playPlaylistByID()"
            >
              {{ $t('common.play') }}
            </ButtonTwoTone>
            <ButtonTwoTone
              v-if="playlist.creator.userId !== data.user.userId"
              :icon-class="playlist.subscribed ? 'heart-solid' : 'heart'"
              :icon-button="true"
              :horizontal-padding="0"
              :color="playlist.subscribed ? 'blue' : 'grey'"
              :text-color="playlist.subscribed ? '#335eea' : ''"
              :background-color="
                playlist.subscribed ? 'var(--color-secondary-bg)' : ''
              "
              @click.native="likePlaylist"
            >
            </ButtonTwoTone>
            <ButtonTwoTone
              icon-class="more"
              :icon-button="true"
              :horizontal-padding="0"
              color="grey"
              @click.native="openMenu"
            ></ButtonTwoTone>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import NProgress from 'nprogress';
import {
  getPlaylistDetail,
  // subscribePlaylist,
  // deletePlaylist,
} from '@/api/playlist';
// import { getTrackDetail } from '@/api/track';
// import { isAccountLoggedIn } from '@/utils/auth';
// import nativeAlert from '@/utils/nativeAlert';
// import locale from '@/locale';

import ButtonTwoTone from '@/components/ButtonTwoTone.vue';
// import ContextMenu from '@/components/ContextMenu.vue';
// import TrackList from '@/components/TrackList.vue';
import Cover from '@/components/Cover.vue';
// import Modal from '@/components/Modal.vue';

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
    // ContextMenu,
    // TrackList,
    // Modal,
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
  created() {
    if (this.$route.name === 'likedSongs') {
      this.loadData(this.data.likedSongPlaylistID);
    } else {
      this.loadData(this.$route.params.id);
    }
    setTimeout(() => {
      if (!this.show) NProgress.start();
    }, 1000);
  },
  methods: {
    ...mapMutations(['appendTrackToPlayerList']),
    ...mapActions(['playFirstTrackOnlist', 'playTrackOnListByID', 'showToast']),
    playPlaylistByTD(trackID = 'first') {
      console.log(trackID);
    },
    likePlaylist(toast = false) {
      console.log(toast);
    },
    loadData(id, next = undefined) {
      this.id = id;
      getPlaylistDetail(this.id, true)
        .then(data => {
          this.playlist = data.playlist;
          this.tracks = data.playlist.tracks;
          NProgress.done();
          if (next !== undefined) next();
          this.show = true;
          this.lastLoadedTrackIndex = data.playlist.tracks.length - 1;
          return data;
        })
        .then(() => {
          if (this.playlist.trackCount > this.tracks.length) {
            this.loadingMore = true;
            this.loadMore();
          }
        })
    },
    loadMore(loadNum = 100) {
      console.log(loadNum);
    },
    openMenu() {

    },
    deletePlaylist() {

    },
    editPlaylist() {

    },
    searchInPlaylist() {

    },
    removeTrack() {

    },
    inputDebounce() {

    },
    toggleFullDescription() {

    },
  },
};
</script>

<style lang="scss" scoped>
.playlist {
  margin-top: 32px;
}
.playlist-info {
  display: flex;
  margin-bottom: 72px;
  position: relative;
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    margin-left: 56px;
    .title {
      font-size: 36px;
      font-weight: 700;
      color: var(--color-text);
      .lock-icon {
        opacity: 0.28;
        color: var(--color-text);
        margin-right: 8px;
        .svg-icon {
          height: 26px;
          width: 26px;
        }
      }
    }
    .artist {
      font-size: 18px;
      opacity: 0.88;
      color: var(--color-text);
      margin-top: 24px;
    }
    .data-and-count {
      font-size: 14px;
      opacity: 0.68;
      color: var(--color-text);
      margin-top: 2px;
    }
    .description {
      font-size: 14px;
      opacity: 0.68;
      color: var(--color-text);
      margin-top: 24px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      cursor: pointer;
      &:hover {
        transition: opacity 0.3s;
        opacity: 0.88;
      }
    }
    .buttons {
      margin-top: 32px;
      display: flex;
      button {
        margin-right: 16px;
      }
    }
  }
}
</style>