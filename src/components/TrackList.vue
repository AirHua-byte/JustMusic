<template>
  <div class="track-list">
    <ContextMenu ref="menu">
      <div class="item-info" v-show="type !== 'cloudDisk'">
        <img :src="rightClickedTrackComputed.al.picUrl | resizeImage(224)" alt="" />
        <div class="info">
          <div class="title">{{ rightClickedTrackComputed.name }}</div>
          <div class="subtitle">{{ rightClickedTrackComputed.ar[0].name }}</div>
        </div>
      </div>
      <hr v-show="type !== 'cloudDisk'" />
      <div class="item" @click="play">{{ $t('contextMenu.play') }}</div>
      <div class="item" @click="addToQueue">
        {{ $t('contextMenu.addToQueue') }}
      </div>
      <div
        v-if="extraContextMenuItem.includes('removeTrackFromQueue')"
        class="item"
        @click="removeTrackFromQueue"  
      >
        从队列中删除
      </div>
      <hr v-show="type !== 'cloudDisk'" />
      <div
        class="item"
        v-show="!isRightClickedTrackLiked && type !== 'cloudDisk'"
        @click="like"
      >
        {{ $t('contextMenu.saveToMyLikedSongs') }}
      </div>
      <div
        class="item"
        v-show="isRightClickedTrackLiked && type !== 'cloudDisk'"
        @click="like"
      >
        {{ $t('contextMenu.removeFromMyLikedSongs') }}
      </div>
      <div
        class="item"
        v-if="extraContextMenuItem.includes('removeTrackFromPlaylist')"
        @click="removeTrackFromPlaylist"
      >
        从歌单中删除
      </div>
      <div
        class="item"
        v-show="type !== 'cloudDisk'"
        @click="addTrackToPlaylist"  
      >
        {{ $t('contextMenu.addToPlaylist') }}
      </div>
      <div
        class="item"
        v-if="extraContextMenuItem.includes('removeTrackFromCloudDisk')"
        @click="removeTrackFromCloudDisk"
      >
        从云盘中删除
      </div>
    </ContextMenu>

    <div :style="listStyles">
      <TrackListItem
        v-for="(track, index) in tracks"
        :key="itemKey === 'id' ? track.id : `${track.id}${index}`"
        :track-prop="track"
        :highlight-playing-track="highlightPlayingTrack"
        @dblclick.native="playThisList(track.id || track.songId)"
        @click.right.native="openMenu($event, track, index)"
      >
      </TrackListItem>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
// import { addOrRemoveTackFromPlaylist } from '@/api/playlist';
// import { cloudDiskTrackDelete } from '@/api/user';
// import { isAccountLoggedIn } from '@/utils/auth';

import TrackListItem from '@/components/TrackListItem.vue';
import ContextMenu from '@/components/ContextMenu.vue'
// import locale from '@/locale';

export default {
  name: 'TrackList',
  components: {
    TrackListItem,
    ContextMenu,
  },
  props: {
    tracks: {
      type: Array,
      default: () => {
        return [];
      },
    },
    type: {
      type: String,
      default: 'tracklist',
    }, // tracklist | album | playlist | cloudDisk
    id: {
      type: Number,
      default: 0,
    },
    dbclickTrackFunc: {
      type: String,
      default: 'default',
    },
    albumObject: {
      type: Object,
      default: () => {
        return {
          artist: {
            name: '',
          },
        };
      },
    },
    extraContextMenuItem: {
      type: Array,
      default: () => {
        return [];
      },
    },
    columnNumber: {
      type: Number,
      default: 4,
    },
    highlightPlayingTrack: {
      type: Boolean,
      default: true,
    },
    itemKey: {
      type: String,
      default: 'id',
    },
  },
  data() {
    return {
      rightClickedTrack: {
        id: 0,
        name: '',
        ar: [{ name: '' }],
        al: { picUrl: '' },
      },
      rightClickedTrackIndex: -1,
      listStyles: {},
    };
  },
  computed: {
    ...mapState(['liked', 'player']),
    isRightClickedTrackLiked() {
      return this.liked.songs.includes(this.rightClickedTrack?.id);
    },
    rightClickedTrackComputed() {
      return this.type === 'cloudDisk'
        ? {
          id: 0,
          name: '',
          ar: [{ name: '' }],
          al: { picUrl: '' },
        }
        : this.rightClickedTrack;
    },
  },
  created() {
    if (this.type === 'tracklist') {
      this.listStyles = {
        display: 'grid',
        gap: '4px',
        gridTemplateColums: `repeat(${this.columnNumber}, 1fr)`,
      };
    }
  },
  methods: {
    ...mapMutations(['updateModal']),
    ...mapActions(['nextTrack', 'showToast', 'likeATrack']),
    openMenu(e, track, index = -1) {
      this.rightClickedTrack = track;
      this.rightClickedTrackIndex = index;
      this.$refs.menu.openMenu(e);
    },
    closeMenu() {

    },
    playThisList() {

    },
    playThisListDefault() {

    },
    play() {
      this.player.addTrackToPlayNext(this.rightClickedTrack.id, true);
    },
    addToQueue() {
      
    },
    like() {

    },
    addTrackToPlaylist() {
      
    },
    removeTrackFromPlaylist() {

    },
    removeTrackFromQueue() {

    },
    removeTrackFromCloudDisk() {

    },
  },
};
</script>