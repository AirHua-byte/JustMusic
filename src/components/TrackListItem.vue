<template>
  <div>
    TrackListItem
  </div>
</template>

<script>
import ArtistsInline from '@/components/ArtistsInLine.vue';
import ExplicitSymbol from '@/components/ExplicitSymbol.vue';
import { mapState } from 'vuex';

export default {
  name: 'TrackListItem',
  components: { ArtistsInline, ExplicitSymbol },
  props: {
    trackProp: Object,
    highlightPlayingTrack: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return { hover: false, trackStyle: {} };
  },
  computed: {
    ...mapState(['settings']),
    track() {
      return this.type === 'cloudDisk'
        ? this.trackProp.simpleSong
        : this.trackProp
    },
    imgUrl() {
      let image =
        this.track?.al?.picUrl ??
        this.track?.album?.picUrl ??
        'https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg';
      return image + '?param=224y224';
    },
    artists() {
      if (this.track.ar !== undefined) return this.track.ar;
      if (this.track.artists !== undefined) return this.track.artists;
      return [];
    },
    album() {
      return this.track.album || this.track.al || this.track?.simpleSong?.ar;
    },
    translate() {
      let t;
      if (this.track?.tns?.length > 0) t = this.track.tns[0];
      else t = this.track.alia[0];
      return t;
    },
    type() {

    },
    isAlbum() {

    },
    isTranslate() {
      
    },
    isPlaylist() {

    },
    isLiked() {

    },
    isPlaying() {

    },
    trackClass() {

    },
    isMenuOpened() {

    },
    focus() {

    },
    showUnavailableSongInGreyStyle() {

    },
    showLikeButton() {

    },
    showOrderNumber() {

    },
    showAlbumName() {

    },
    showTrackTime() {

    },
  },
  methods: {
    goToAlbum() {

    },
    playTrack() {

    },
    likedThisSong() {

    },
  },
};
</script>