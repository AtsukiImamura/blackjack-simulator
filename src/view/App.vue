<template>
  <div>
    <Header></Header>
    <div class="results">
      <GameDetails
        class="details"
        :table="table"
        :turn-index="displayingTurnIndex"
      ></GameDetails>
      <div class="chart-area">
        <Roading v-if="roadingOpen"></Roading>
        <Config @commit="startGame"></Config>
        <div class="chart">
          <RevenueChart
            class="c"
            :table="table"
            @click="onSelectTurn"
          ></RevenueChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RevenueChart from "./charts/RevenueChart.vue";
import Config from "./Config.vue";
import Header from "./Header.vue";
import AdminTable from "../background/models/tables/AdminTable";
import GameDetails from "./components/GameDetails.vue";
import Roading from "./components/Roading.vue";

@Component({
  components: { RevenueChart, Header, GameDetails, Config, Roading }
})
export default class App extends Vue {
  public table: AdminTable = new AdminTable();

  public displayingTurnIndex: number = -1;

  public roadingOpen: boolean = false;

  public onSelectTurn(index: number) {
    this.displayingTurnIndex = index;
  }

  public mounted(): void {}

  public startGame(gameNum: number, playerNum: number) {
    this.roadingOpen = true;
    setTimeout(() => {
      const table = new AdminTable();
      table.addDefaultPlayers(playerNum);
      table.play(gameNum).then(() => {
        this.table = table;
        this.roadingOpen = false;
      });
    }, 1200);
  }
}
</script>

<style lang="scss" scoped>
.results {
  display: flex;
  @include sm {
    flex-direction: column-reverse;
    margin-top: 55px;
  }
  .details {
    min-width: 300px;
    width: 15vw;
    height: calc(100vh - 72px);
    @include sm {
      width: 100vw;
      height: calc(100vh - 270px - 125px);
    }
  }
  .chart-area {
    width: 80vw;
    margin: 0 auto;
    position: relative;
    @include sm {
      width: 100vw;
    }
    .chart {
      @include sm {
        overflow-x: scroll;
        overflow-y: hidden;
        height: 270px;
      }
      .c {
        @include sm {
          min-width: 800px;
          height: 270px;
        }
      }
    }
  }
  .user-actions {
    margin: 25px 0px;
    display: flex;
    justify-content: center;
    .once-more-btn {
      width: 120px;
      padding: 8px 10px;
      border: 1px solid #000080;
      border-radius: 3px;
      color: #000080;
      background-color: #ffffff;
      cursor: pointer;
      &:hover {
        background-color: #000080;
        transition-duration: 0.25s;
        // transition-delay: 0.1s;
        transition-timing-function: ease-in-out;
        color: #ffffff;
      }
    }
  }
}
</style>
