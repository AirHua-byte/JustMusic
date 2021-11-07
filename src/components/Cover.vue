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
      return '';
    },
    playButtonStyles() {
      return '';
    },
    shadowStyles() {
      return '';
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