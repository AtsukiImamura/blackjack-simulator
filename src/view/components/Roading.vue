<template>
  <div class="roading"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Roading extends Vue {
  public mounted(): void {}
}
</script>

<style lang="scss" scoped>
.roading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 200;

  $total-width: 210px;
  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 45%;
    left: calc(50% - #{$total-width / 2});
    height: 28px;
  }
  &:after {
    background-color: rgba(0, 0, 144, 0.7);
    animation: roading 5.5s cubic-bezier(0.1, 0, 0.28, 1) 0.3s 1 forwards;
    @keyframes roading {
      0% {
        width: $total-width * 0;
      }
      100% {
        width: $total-width * 1;
      }
    }
  }
  &:before {
    background-color: rgba(255, 255, 255, 0.7);
    width: $total-width;
  }
}
</style>
