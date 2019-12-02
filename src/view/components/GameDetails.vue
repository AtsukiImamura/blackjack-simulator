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
import { Component, Vue, Prop } from "vue-property-decorator";
import GameSummary, {
  TurnSummary
} from "../../background/models/tables/GameSummary";
import TurnItem from "./TurnItem.vue";
import AdminTable from "../../background/models/tables/AdminTable";

@Component({
  components: { TurnItem }
})
export default class GameDetails extends Vue {
  @Prop()
  public table!: AdminTable;

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

  public mounted(): void {}
}
</script>

<style lang="scss" scoped>
.__details {
  overflow-y: scroll;
}
</style>