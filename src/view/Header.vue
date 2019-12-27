<template>
  <div class="hd">
    <div class="h-left">
      <h1 class="title">iMam's Black Jack Simulator</h1>
    </div>
    <div class="h-center"></div>
    <div class="h-right">
      <!-- <input class="options-btn" type="button" value="Options" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Header extends Vue {
  public mounted(): void {}
}
</script>

<style lang="scss" scoped>
.hd {
  display: flex;
  justify-content: space-between;
  background-color: #383838;
  margin-bottom: 10px;
  width: 100vw;
  @include sm {
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 100;
  }
  .h-left {
    .title {
      color: #ffffff;
      margin: 8px 10px;
      font-size: 28px;
      @include sm {
        font-size: 20px;
        margin: 12px 10px;
      }
    }
  }
  .h-right {
    .options-btn {
    }
  }
}
</style>