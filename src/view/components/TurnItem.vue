<template>
  <div class="turn-item">
    <div class="dealer">
      <span class="key">Dealer's point</span>
      <span class="value">{{ turn.dealerPoint }}</span>
    </div>
    <div class="player">
      <ActionItem v-for="(summary, index) in actionSummaries" :key="index" :summary="summary"></ActionItem>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  TurnSummary,
  ActionSummary
} from "../../background/models/tables/GameSummary";
import ActionItem from "./ActionItem.vue";

@Component({
  components: { ActionItem }
})
export default class TurnItem extends Vue {
  @Prop()
  public turn!: TurnSummary;

  public get actionSummaries(): ActionSummary[] {
    return this.turn.actions;
  }

  public mounted(): void {}
}
</script>

<style lang="scss" scoped>
.turn-item {
  margin: 0;
  padding: 8px 12px;
  border-bottom: 1px solid #c0c0c0;
  .dealer {
    width: 100%;
    display: flex;
    .key {
      width: 48%;
      margin: 3px 1%;
    }
    .value {
      width: 45%;
      margin: 3px 2.5%;
    }
  }
}
</style>