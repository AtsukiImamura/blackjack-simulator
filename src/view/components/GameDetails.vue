<template>
  <div class="__details">
    <div class="player-selection"></div>
    <div class="detail-area">
      <div class="h"></div>
      <div class="b">
        <TurnItem v-for="(turn, index) in turns" :key="index" :turn="turn"></TurnItem>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import GameSummary, {
  TurnSummary
} from "../../background/models/tables/GameSummary";
import TurnItem from "./TurnItem.vue";
import Table from "../../background/models/tables/Table";

@Component({
  components: { TurnItem }
})
export default class GameDetails extends Vue {
  @Prop()
  public table!: Table;
  @Prop()
  public turnIndex?: number;

  public currentSummaryIndex: number = 0;

  public get summaries(): GameSummary[] {
    return this.table.summaries;
  }

  public get turns(): TurnSummary[] {
    if (this.currentSummaryIndex >= this.summaries.length) {
      // throw new Error(
      //   "turn not found. this.currentSummaryIndex = " + this.currentSummaryIndex
      // );
      return [];
    }
    return this.summaries[this.currentSummaryIndex].turns;
  }

  @Watch("turnIndex")
  public onTurnIndexChanged(index: number) {
    const turnElement = document.getElementById("turn-" + index);
    if (!turnElement) {
      return;
    }
    turnElement.scrollIntoView(true);
  }

  public mounted(): void {}
}
</script>

<style lang="scss" scoped>
.__details {
  // margin-top: 5px;
  // box-shadow: 1px 1px 2px 2px rgba(80, 80, 80, 0.25);
  border-right: 1px solid #c0c0c0;

  overflow-y: scroll;
  -ms-overflow-style: none; /* IE, Edge 対応 */
  scrollbar-width: none; /* Firefox 対応 */
  &::-webkit-scrollbar {
    /* Chrome, Safari 対応 */
    display: none;
  }
}
</style>