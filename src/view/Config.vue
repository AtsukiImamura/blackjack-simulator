<template>
  <div class="config-area">
    <div class="config conf-number">
      <span class="title">ゲーム回数</span>
      <input class="num" type="text" v-model="gameNum" />
      <div class="e-messages" v-if="gameNumMessages.length > 0">
        <div class="e" v-for="(msg, index) in gameNumMessages" :key="index">{{ msg }}</div>
      </div>
    </div>
    <div class="config conf-number">
      <span class="title">プレイ人数</span>
      <input class="num" type="text" v-model="playerNum" />
      <div class="e-messages" v-if="playerNumMessages.length > 0">
        <div class="e" v-for="(msg, index) in playerNumMessages" :key="index">{{ msg }}</div>
      </div>
    </div>
    <div class="config">
      <span class="title">カウンティング</span>
      <DropDownSelector :options="countingOptions"></DropDownSelector>
    </div>
    <div class="config">
      <span class="title">マネーシステム</span>
      <DropDownSelector :options="moneySystemOptions"></DropDownSelector>
    </div>
    <div class="config">
      <span class="btn-ok" type="button" @click="onClickOK()">Start</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Watch } from "vue-property-decorator";
import DropDownSelector from "./components/DropDownSelector.vue";

@Component({
  components: { DropDownSelector }
})
export default class Config extends Vue {
  private gameNum: number = 100;

  private playerNum: number = 4;

  public get countingOptions(): Map<number, string> {
    return new Map<number, string>([[0, "しない"], [1, "ヒューリスティック"]]);
  }

  public get moneySystemOptions(): Map<number, string> {
    return new Map<number, string>([
      [0, "一様"],
      [1, "マーチンゲール法"],
      [2, "パーレー法"],
      [3, "ココモ法"],
      [4, "1-2-3法"],
      [5, "1-3-2-6法"]
    ]);
  }

  @Watch("gameNum")
  public onGameNumChange(num: string) {
    this.gameNumMessages = [];
    if (!this.isNumber(num)) {
      this.gameNumMessages.push("Number is required in this field.");
      return;
    }
    if (Number(num) < 0) {
      this.gameNumMessages.push("Number of games must be more than 0");
      return;
    }
  }

  @Watch("playerNum")
  public onPlayerNumChange(num: string) {
    this.playerNumMessages = [];
    if (!this.isNumber(num)) {
      this.playerNumMessages.push("Number is required in this field.");
      return;
    }
    if (Number(num) < 0 || Number(num) > 6) {
      this.playerNumMessages.push("Number of players must be between 1 and 6.");
      return;
    }
  }

  private isNumber(num: string) {
    return num.match(/[1-9][0-9]*/);
  }

  public gameNumMessages: string[] = [];

  public playerNumMessages: string[] = [];

  public mounted(): void {}

  public onClickOK(): void {
    this.commit(this.gameNum, this.playerNum);
  }

  @Emit("commit")
  public commit(gameNum: number, playerNum: number) {}
}
</script>

<style lang="scss" scoped>
.config-area {
  width: 100%;
  padding: 16px 0px;
  // background-color: #383838;
  // color: #ffffff;
  display: flex;
  flex-wrap: wrap;
  box-shadow: 1.5px 1.5px 2px 2px rgba(0, 0, 0, 0.25);
  .config {
    display: flex;
    margin: 10px 16px;
    position: relative;
    .title {
      padding: 4px 12px;
    }
    &.conf-number {
      .num {
        padding: 4px 8px;
        border: 1px solid #c0c0c0;
        width: 180px;
        color: #383838;
        border-radius: 3px;
        font-size: 16px;
      }
    }
    .e-messages {
      position: absolute;
      display: block;
      width: 200px;
      background-color: #ffffff;
      box-shadow: 1.5px 1.5px 1px 1px rgba(0, 0, 0, 0.281);
      right: -150px;
      top: 35px;
      color: #eb3515;
      border-radius: 3px;
      padding: 4px 8px;
      font-size: 13px;

      animation: apearance 0.5s ease 0s 1 forwards;

      @keyframes apearance {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    }
  }

  .btn-ok {
    padding: 4px 12px;
    background-color: #ffffff;
    color: #383838;
    border-radius: 3px;
    min-width: 80px;
    min-height: 18px;
    border: 1.5px solid #383838;
    display: block;
    text-align: center;
    &:hover {
      background-color: #383838;
      border: 1.5px solid transparent;
      color: #ffffff;
      transition-duration: 0.25s;
      border-radius: 3px;
      cursor: pointer;
    }
    &:focus {
      border: 1.5px solid #ffffff;
    }
  }
}
</style>
