<template>
  <div
    class="turn-item"
    :class="{ 'g-lose': turn.diff < 0, 'g-win': turn.diff > 0 }"
    :id="'turn-' + turn.id"
    :turn-id="turn.id"
  >
    <div class="turn-info-list">
      <div
        class="dealer turn-info"
        @mouseenter="displayDealerCards"
        @mouseleave="hideDealerCards"
      >
        <img class="delaer-icon" :src="DEALER_IMG_PATH" alt="dealer" />
        <span class="dealer-point">{{ turn.dealerCardSet.highestSum }} </span>
        <div class="dealder-cards" v-show="isDelearCardsOpen" ref="dealerCards">
          <TrumpCard
            class="c"
            v-for="(card, index) in turn.dealerCardSet.cards"
            :key="index"
            :card="card"
          ></TrumpCard>
        </div>
      </div>
      <div class="bet-amount turn-info">
        <img class="coin-icon" :src="CHIPS_IMG_PATH" alt="chips" />
        <span class="amount">{{ turn.betAmount }}</span>
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

  public isDelearCardsOpen: boolean = false;

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

  public displayDealerCards(e: MouseEvent) {
    const dealerCards = this.$refs.dealerCards as HTMLDivElement;
    dealerCards.style.top = `${e.clientY - 15}px`;
    dealerCards.style.left = `${Math.max(40, e.clientX)}px`;
    this.isDelearCardsOpen = true;
  }

  public hideDealerCards() {
    this.isDelearCardsOpen = false;
  }
}
</script>

<style lang="scss" scoped>
.turn-item {
  margin: 0;
  padding: 8px 12px;
  border-bottom: 1px solid #c0c0c0;
  position: relative;
  overflow-y: visible;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  display: flex;
  flex-direction: column;
  width: auto;

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
      @include sm {
        @include turn-id;
      }
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
    // width: 100%;
    display: flex;
    justify-content: flex-start;
    overflow: visible;
    .turn-info {
      display: flex;
      justify-content: flex-start;
      min-width: 50px;
      .key {
        margin: 3px 2.5%;
        img {
          width: 80%;
          max-height: 25px;
        }
        max-height: 25px;
      }
      .value {
        margin: 3px 0px;
        &.dealer-value {
          display: flex;
        }
      }
      &.dealer {
        position: relative;
        cursor: pointer;
        margin-right: 8px;
        &:hover {
          .dealer-point {
            color: #a0a0a0;
          }
        }
        .delaer-icon {
          width: 80%;
          max-height: 25px;
          max-width: 26px;
          margin-right: 5px;
        }
        .dealder-cards {
          position: fixed;
          box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.25);
          background-color: rgba(255, 255, 255, 0.8);
          animation: to-visible 0.4s ease 0s 1 forwards;
          overflow: visible;
          display: flex;
          margin: 0px 6px;
          padding: 8px 12px;
          z-index: 20;
          @keyframes to-visible {
            from {
              width: 0px;
            }
            to {
              width: auto;
            }
          }
        }
      }
      &.bet-amount {
        .coin-icon {
          width: 80%;
          max-height: 25px;
          max-width: 26px;
          margin-right: 5px;
        }
      }
    }
    .initial-cards {
      display: flex;
      .c {
        margin: 0px 3px;
      }
    }
  }
  .player {
    margin-top: 6px;
    display: flex;
    width: auto;
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
