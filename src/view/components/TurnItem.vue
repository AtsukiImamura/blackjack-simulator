<template>
  <div
    class="turn-item"
    :class="{ 'g-lose': turn.diff < 0, 'g-win': turn.diff > 0 }"
    :id="'turn-' + turn.id"
    :turn-id="turn.id"
  >
    <div class="turn-info-list">
      <div class="dealer turn-info">
        <span class="key">
          <img :src="DEALER_IMG_PATH" alt="dealer" />
        </span>
        <span class="value">{{ turn.dealerPoint }}</span>
      </div>
      <div class="bet-amount turn-info">
        <span class="key">
          <img :src="CHIPS_IMG_PATH" alt="chips" />
        </span>
        <span class="value">{{ turn.betAmount }}</span>
      </div>
      <div class="initial-cards">
        <TrumpCard
          class="c"
          v-for="(card, index) in turn.initialCards"
          :key="index"
          :card="card"
        ></TrumpCard>
      </div>
    </div>
    <div class="player">
      <div
        class="actions"
        v-for="(actions, index) in actionSummariesPerCardSet"
        :key="index"
      >
        <ActionItem
          v-for="(summary, index) in actions"
          :key="index"
          :summary="summary"
        ></ActionItem>
      </div>
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
import { Action } from "../../background/constants/GameConstants";
import TrumpCard from "./TrumpCard.vue";

@Component({
  components: { ActionItem, TrumpCard }
})
export default class TurnItem extends Vue {
  public DEALER_IMG_PATH = "./images/dealer.svg";

  public CHIPS_IMG_PATH = "./images/chips.svg";

  @Prop()
  public turn!: TurnSummary;

  public get actionSummaries(): ActionSummary[] {
    return this.turn.actions;
  }

  public get actionSummariesPerCardSet(): ActionSummary[][] {
    const actionLists: ActionSummary[][] = [[]];
    for (const [index, action] of this.turn.actions.entries()) {
      actionLists[actionLists.length - 1].push(action);
      if (
        action.action === Action[Action.STAY] &&
        index < this.turn.actions.length - 1
      ) {
        actionLists.push([]);
      }
    }
    return actionLists;
  }

  public mounted(): void {}
}
</script>

<style lang="scss" scoped>
.turn-item {
  margin: 0;
  padding: 8px 12px;
  border-bottom: 1px solid #c0c0c0;
  position: relative;
  @include sm {
    padding: 8px 12px 8px 30px;
  }
  @mixin turn-id {
    position: absolute;
    top: 0px;
    left: 0px;
    padding: 3px 4px;
    height: calc(100% - 6px);
    min-width: 14px;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 120, 0.45),
      rgba(0, 0, 120, 0.05)
    );
    color: #ffffff;
    content: attr(turn-id);
    transition-duration: 0.5s;
  }
  &:hover {
    &:after {
      @include turn-id;
    }
  }
  @include sm {
    &:after {
      @include turn-id;
      background: rgba(0, 0, 155, 0.568);
      border: 1px solid #ffffff;
      border-width: 1px 0px;
    }
  }
  &.g-lose {
  }
  &.g-win {
    background-color: #cce6ff;
  }
  .turn-info-list {
    width: 100%;
    display: flex;
    .turn-info {
      display: flex;
      // padding: 4px;
      width: 10%;
      min-width: 50px;
      // margin: 0 2%;
      .key {
        width: 45%;
        margin: 3px 2.5%;
        img {
          width: 80%;
          max-height: 25px;
        }
        max-height: 25px;
      }
      .value {
        width: 45%;
        margin: 3px 0px;
      }
    }
    .initial-cards {
      display: flex;
      .c {
        // display: block;
        // width: 24px;
        // text-align: center;
        margin: 0px 3px;
        // border: 1px solid #808080;
        // border-radius: 3px;
        // padding: 3px 0px 0px 0px;
      }
    }
  }
  .player {
    margin-top: 6px;
    display: flex;
    .actions {
      display: block;
      border-right: 1px solid #c0c0c0;
      padding-right: 3px;
      &:last-child {
        border-right: none;
      }
    }
  }
}
</style>
