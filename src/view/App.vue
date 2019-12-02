<template>
  <div>
    <Config @commit="startGame"></Config>
    <div class="results">
      <GameDetails class="details" :table="table"></GameDetails>
      <div class="chart-area">
        <RevenueChart :table="table"></RevenueChart>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RevenueChart from "./charts/RevenueChart.vue";
import Config from "./Config.vue";
import AdminTable from "../background/models/tables/AdminTable";
// import GameSummary from "../background/models/tables/GameSummary";
import GameDetails from "./components/GameDetails.vue";

@Component({
  components: { RevenueChart, Config, GameDetails }
})
export default class App extends Vue {
  public table: AdminTable = new AdminTable();

  public mounted(): void {}

  public startGame(gameNum: number, playerNum: number) {
    const table = new AdminTable();
    table.addDefaultPlayers(playerNum);
    table.play(gameNum);
    this.table = table;
  }
}
</script>

<style lang="scss" scoped>
.results {
  display: flex;
  .details {
    min-width: 300px;
    width: 15vw;
    height: calc(100vh - 95px);
  }
  .chart-area {
    width: 80vw;
    margin: 0 auto;
  }
}
</style>
