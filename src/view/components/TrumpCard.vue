<template>
  <div class="trump-card" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <img class="main-image" :src="imageSrc" />
    <div class="micro-scope" :class="{ visible: microScope }">
      <img :src="imageSrc" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Card from "../../background/models/cards/Card";

@Component({
  components: {}
})
export default class TrumpCard extends Vue {
  @Prop()
  card!: Card;

  public microScope: boolean = false;

  public _microScope: boolean = false;

  public get imageSrc(): string {
    return `images/trump/${this.card.mark}-${this.card.number}.png`;
  }

  public onMouseEnter(): void {
    this._microScope = true;
    setTimeout(() => {
      this.microScope = !this.microScope && this._microScope;
    }, 500);
  }

  public onMouseLeave(): void {
    this._microScope = false;
    this.microScope = false;
  }

  public mounted(): void {}
}
</script>

<style lang="scss" scoped>
.trump-card {
  position: relative;
  .main-image {
    width: 28px;
    border: 1px solid #c0c0c0;
  }
  .micro-scope {
    position: absolute;
    top: 10px;
    left: 18px;
    width: 100px;
    justify-content: center;
    display: none;
    z-index: 10;
    padding: 10px;
    img {
      width: 90%;
    }
    &.visible {
      box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.25);
      // transition-delay: 0.5s;
      display: flex;
      animation: to-visible 0.4s ease 0s 1 forwards;
      @keyframes to-visible {
        from {
          display: none;
          background-color: transparent;
        }
        to {
          display: block;
          background-color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }
}
</style>
