<template>
  <div class="b">
    <div class="config-area" :class="{ shrunk: isHidden }">
      <div class="config conf-number">
        <span class="title">Number of games</span>
        <input class="num" type="text" v-model="gameNum" />
        <div class="e-messages" v-if="gameNumMessages.length > 0">
          <div class="e" v-for="(msg, index) in gameNumMessages" :key="index">
            {{ msg }}
          </div>
        </div>
      </div>
      <div class="config conf-number">
        <span class="title">Number of players</span>
        <input class="num" type="text" v-model="playerNum" />
        <div class="e-messages" v-if="playerNumMessages.length > 0">
          <div class="e" v-for="(msg, index) in playerNumMessages" :key="index">
            {{ msg }}
          </div>
        </div>
      </div>
      <div class="config">
        <span class="title">Card counting</span>
        <div class="drop-down">
          <DropDownSelector :options="countingOptions"></DropDownSelector>
        </div>
      </div>
      <div class="config">
        <span class="title">Money system</span>
        <div class="drop-down">
          <DropDownSelector :options="moneySystemOptions"></DropDownSelector>
        </div>
      </div>
      <div class="config">
        <span class="title">Allowed number of splits</span>

        <div class="drop-down">
          <DropDownSelector :options="splitNumberRules"></DropDownSelector>
        </div>
      </div>
      <div class="config">
        <span class="title">Resplit with ace</span>
        <div class="drop-down">
          <DropDownSelector :options="resplitRulesOnAce"></DropDownSelector>
        </div>
      </div>
    </div>
    <div class="user-actions">
      <span class="btn-ok" type="button" @click="onClickOK()">{{
        isHidden ? "Once More" : "Start"
      }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Watch } from "vue-property-decorator";
import DropDownSelector from "./components/DropDownSelector.vue";
import TableContext from "../background/options/TableContext";
import { IConfigSelection } from "./components/Selector";
import HeaulisticCounting from "../background/options/policies/counting/HeaulisticCounting";
import NeverCounting from "../background/options/policies/counting/NeverCounting";
import CountingMethodBase from "../background/options/policies/counting/CountingMethodBase";
import NomalBetting from "../background/options/policies/betting/NomalBetting";
import MartingaleMethod from "../background/options/policies/betting/MartingaleMethod";
import ParlayMethod from "../background/options/policies/betting/ParlayMethod";
import MiniStairsMethod from "../background/options/policies/betting/MiniStairsMethod";
import DoubleConstraint, {
  DoubleTiming
} from "../background/options/rules/double/DoubleConstraint";

@Component({
  components: { DropDownSelector }
})
export default class Config extends Vue {
  private gameNum: number = 100;

  private playerNum: number = 4;

  public isHidden: boolean = false;

  public _cardCountingPolicy: CountingMethodBase = new HeaulisticCounting();

  public gameNumMessages: string[] = [];

  public playerNumMessages: string[] = [];

  public get countingOptions(): IConfigSelection[] {
    return [
      {
        id: 0,
        name: "Heuristic",
        onSelect: () => (this._cardCountingPolicy = new HeaulisticCounting())
      },
      {
        id: 1,
        name: "Never",
        onSelect: () => (this._cardCountingPolicy = new NeverCounting())
      }
    ];
  }

  public get moneySystemOptions(): IConfigSelection[] {
    return [
      {
        id: 0,
        name: "Nomal",
        onSelect: () =>
          TableContext.setBettingPolicy(
            new NomalBetting(this._cardCountingPolicy)
          )
      },
      {
        id: 1,
        name: "Martingale method",
        onSelect: () => {
          // console.log("Martingale method");
          // console.log(this._cardCountingPolicy);
          TableContext.setBettingPolicy(
            new MartingaleMethod(this._cardCountingPolicy)
          );
        }
      },
      {
        id: 2,
        name: "Parlay method",
        onSelect: () =>
          TableContext.setBettingPolicy(
            new ParlayMethod(this._cardCountingPolicy)
          )
      },
      {
        id: 3,
        name: "1-2-3 method",
        onSelect: () =>
          TableContext.setBettingPolicy(
            new MiniStairsMethod(this._cardCountingPolicy)
          )
      }
    ];
  }

  public get doubleTimingRules(): IConfigSelection[] {
    return [
      {
        id: 0,
        name: "Only when the player has 9,10 or 11",
        onSelect: () =>
          (TableContext.doubleConstraint = new DoubleConstraint(
            DoubleTiming.ONLY_ON_CHANCE_HAND
          ))
      },
      {
        id: 1,
        name: "Except for soft cards",
        onSelect: () =>
          (TableContext.doubleConstraint = new DoubleConstraint(
            DoubleTiming.EXCEPT_FOR_SOFT_HAND
          ))
      },
      {
        id: 2,
        name: "Always",
        onSelect: () =>
          (TableContext.doubleConstraint = new DoubleConstraint(
            DoubleTiming.ALWAYS
          ))
      }
    ];
  }

  public get doubleRulesOnSplit(): IConfigSelection[] {
    return [
      {
        id: 0,
        name: "Allowed",
        onSelect: () =>
          (TableContext.doubleConstraint.canDoubleOnSplitted = true)
      },
      {
        id: 1,
        name: "Not allowed",
        onSelect: () =>
          (TableContext.doubleConstraint.canDoubleOnSplitted = false)
      }
    ];
  }

  public get splitNumberRules(): IConfigSelection[] {
    return [
      {
        id: 0,
        name: "No limit",
        onSelect: () => TableContext.setMaxSplitNum(Infinity)
      },
      {
        id: 1,
        name: "No more than 1 time",
        onSelect: () => TableContext.setMaxSplitNum(1)
      },
      {
        id: 2,
        name: "No more than 2 times",
        onSelect: () => TableContext.setMaxSplitNum(2)
      }
    ];
  }

  public get resplitRulesOnAce(): IConfigSelection[] {
    return [
      {
        id: 0,
        name: "Allowed",
        onSelect: () =>
          (TableContext.splitRule.canResplitAfterSplittingWithAce = true)
      },
      {
        id: 1,
        name: "Not allowed",
        onSelect: () =>
          (TableContext.splitRule.canResplitAfterSplittingWithAce = false)
      }
    ];
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
    return num.match(/^[1-9][0-9]*$/);
  }

  public mounted(): void {
    this._cardCountingPolicy = new HeaulisticCounting();
  }

  public onClickOK(): void {
    if (this.isHidden) {
      this.isHidden = false;
      return;
    }
    if (screen.width < 540) {
      this.isHidden = true;
    }
    this.commit(this.gameNum, this.playerNum);
  }

  @Emit("commit")
  public commit(gameNum: number, playerNum: number) {}
}
</script>

<style lang="scss" scoped>
.b {
  width: 100%;
  padding: 8px 0px;
  box-shadow: 1.5px 1.5px 2px 2px rgba(80, 80, 80, 0.25);
  margin-bottom: 10px;
  .config-area {
    display: flex;
    flex-wrap: wrap;
    overflow: visible;
    @include sm {
      flex-direction: column;
    }
    &.shrunk {
      max-height: 0px;
      transition-duration: 0.5px;
      overflow: hidden;
      animation: shrink 0.8s ease 0s 1 forwards;
      @keyframes shrink {
        from {
          height: auto;
        }
        to {
          height: 0px;
        }
      }
    }
    .config {
      display: block;
      margin: 5px 10px;
      position: relative;
      @include sm {
        display: flex;
      }
      .title {
        display: block;
        padding: 4px 2px;
        font-size: 12px;
        @include sm {
          width: 140px;
        }
      }
      .drop-down {
        @include sm {
          width: 210px;
        }
      }
      &.conf-number {
        .num {
          display: block;
          padding: 4px 8px;
          border: 1px solid #c0c0c0;
          width: 210px;
          color: #383838;
          border-radius: 3px;
          font-size: 16px;
          @include sm {
            width: 194px;
          }
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
        z-index: 10;
        animation: apearance 0.5s ease 0s 1 forwards;
        @include sm {
          left: 120px;
          width: 220px;
          top: 25px;
        }

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
  }

  .user-actions {
    display: flex;
    justify-content: center;
    margin: 10px 0px;
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
}
</style>
