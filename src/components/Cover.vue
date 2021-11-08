<template>
  <div
    class="cover"
    :class="{ 'cover-hover': coverHover }"
    @mousemove="focus = true"
    @mouseleave="focus = false"
    @click="clickCoverToPlay ? play() : goTo()"
  >
    <div class="cover-container">
      <div class="shade">
        <button
          v-show="focus"
          class="play-button"
          :style="playButtonStyles"
          @click.stop="play()"
        >
          <svg-icon icon-class="play" />
        </button>
      </div>
      <img :src="imageUrl" alt="" :style="imageStyles" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: Number, required: true },
    type: { type: String, required: true },
    imageUrl: { type: String, required: true },
    fixedSize: { type: Number, default: 0 },
    playButtonSize: { type: Number, default: 22 },
    coverHover: { type: Boolean, default: true },
    alwaysShowPlayButton: { type: Boolean, default: true },
    alwaysShowShadow: { type: Boolean, default: false },
    clickCoverToPlay: { type: Boolean, default: false },
    shadowMargin: { type: Number, default: 12 },
    radius: { type: Number, default: 12 },
  },
  data() {
    return {
      focus: false,
    };
  },
  computed: {
    imageStyles() {
      let styles = {};
      if (this.fixedSize !== 0) {
        styles.width = this.fixedSize + 'px';
        styles.height = this.fixedSize + 'px';
      }
      if (this.type === 'artist') styles.borderRadius = '50%';
      return styles;
    },
    playButtonStyles() {
      let styles = {};
      styles.width = this.playButtonSize + '%';
      styles.height = this.playButtonSize + '%';
      return styles;
    },
    shadowStyles() {
      let styles = {};
      styles.backgroundImage = `url(${this.imageUrl})`;
      if (this.type === 'artist') styles.borderRadius = '50%';
      return styles;
    },
  },
  methods: {
    play() {

    },
    goTo() {

    },
  }
}
</script>