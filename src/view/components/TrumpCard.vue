<template>
  <div class="trump-card" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <img class="main-image" :src="imageSrc" />
    <div class="micro-scope" v-show="microScope" ref="microScope">
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

  public onMouseEnter(e: MouseEvent): void {
    this._microScope = true;
    setTimeout(() => {
      const microScope = this.$refs.microScope as HTMLDivElement;
      microScope.style.top = `${e.clientY - 5}px`;
      microScope.style.left = `${e.clientX + 10}px`;
      this.microScope = !this.microScope && this._microScope;
    }, 500);
  }

  public onMouseLeave(): void {
    this._microScope = false;
    this.microScope = false;
  }
}
</script>

<style lang="scss" scoped>
.trump-card {
  position: relative;
  overflow: visible;
  .main-image {
    max-width: 28px;
    border: 1px solid #c0c0c0;
    margin: 1px;
    cursor: pointer;
    &:hover {
      border-width: 2px;
      margin: 0px;
    }
  }
  .micro-scope {
    display: flex;
    position: fixed;
    top: 40vh;
    // left: calc(50vw - 70px);
    width: 140px;
    justify-content: center;
    z-index: 20;
    padding: 10px;
    box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.25);
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
    img {
      width: 90%;
    }
  }
}
</style>
