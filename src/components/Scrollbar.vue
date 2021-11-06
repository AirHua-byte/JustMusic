<template>
  <div>
    <transition name="fade">
      <div
        v-show="show"
      >

      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Scrollbar',
  data() {
    return {
      top: 0,
      thumbHeight: 0,
      active: false,
      show: false,
      hideTimer: null,
      isOnDrag: false,
      onDragClientY: 0,
      positions: {
        home: { scrollTop: 0, params: {} },
      },
    };
  },
  computed: {
    thumbStyle() {
      return {
        transform: `translateY(${this.top}px)`,
        height: `${this.thumbHeight}px`,
      };
    },
    main() {
      return this.$parent.$refs.main;
    },
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      this.show = false;
      next();
    });
  },
  methods: {
    handleScroll() {
      const clintHeight = this.main.clientHeight - 128;
      const scrollHeight = this.main.scrollHeight - 128;
      const scrollTop = this.main.scrollTop;
      let top = ~~((scrollTop / scrollHeight) * clintHeight);
      let thumbHeight = ~~((clintHeight / scrollHeight) * clintHeight);

      if (thumbHeight < 24) thumbHeight = 24;
      if (top > clintHeight - thumbHeight) {
        top = clintHeight - thumbHeight;
      }
      this.top = top;
      this.thumbHeight = thumbHeight;

      if (!this.show && clintHeight !== thumbHeight) this.show = true;
      this.setScrollbarHideTimeout();

      const route = this.$route;
      if (route.meta.savePosition) {
        this.positions[route.name] = { scrollTop, params: route.params };
      }
    },
    handleMouseenter() {
      this.active = true;
    },
    handleMouseleave() {
      this.active = false;
      this.setScrollbarHideTimeout();
    },
    handleDragStart(e) {
      this.onDragClientY = e.clientY;
      this.isOnDrag = true;
    },
    handleDragMove(e) {
      if (!this.isOnDrag) return;
      const clintHeight = this.main.clientHeight - 128;
      const scrollHeight = this.main.scrollHeight - 128;
      const clientY = e.clientY;
      const scrollTop = this.main.scrollTop;
      const offset = ~~(
        ((clientY - this.onDragClientY) / clintHeight) *
        scrollHeight
      );
      this.top = ~~((scrollTop / scrollHeight) * clintHeight);
      this.main.scrollBy(0, offset);
      this.onDragClientY = clientY;
    },
    handleDragEnd() {
      this.isOnDrag = false;
      this.$parent.userSelectNone = false;
      document.removeEventListener('mousemove', this.handleDragMove);
      document.removeEventListener('mouseup', this.handleDragEnd);
    },
    hanleClick(e) {
      let scrollTop;
      if (e.clientY < this.top + 84) {
        scrollTop = -256
      } else {
        scrollTop = 256;
      }
      this.main.scrollBy({
        top: scrollTop,
        behavior: 'smooth',
      });
    },
    setScrollbarHideTimeout() {
      if (this.hideTimer !== null) clearTimeout(this.hideTimer);
      this.hideTimer = setTimeout(() => {
        if (!this.active) this.show = false;
        this.hideTimer = null;
      }, 4000);
    },
    restorePosition() {
      const route = this.$route;
      if (
        !route.meta.savePosition ||
        this.positions[route.name] === undefined ||
        this.main === undefined
      ) {
        return;
      }
      this.main.scrollTo({ top: this.positions[route.name].scrollTop });
    },
  },
};
</script>
