<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { Bar } from "vue-chartjs";
import { ChartData, ChartOptions } from "chart.js";
import AdminTable from "../../background/models/tables/AdminTable";
import GameSummary from "../../background/models/tables/GameSummary";

@Component({
  components: {}
})
export default class RevenueChart extends Mixins(Bar) {
  @Prop()
  public table!: AdminTable;

  @Watch("table")
  public onValuesChange(table: AdminTable) {
    this.renderChart(this.createChartData(table.summaries[0]), this.options);
  }

  public mounted(): void {}

  private createChartData(summary: GameSummary) {
    return {
      labels: summary.turns.map((turn, index) => String(index)),
      datasets: [
        {
          label: "revenue",
          data: summary.points,
          borderWidth: 1,
          borderColor: "#000060",
          backgroundColor: "#000060"
        }
      ]
    } as ChartData;
  }

  public options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            // suggestedMin: 100,
            // suggestedMax: 2000,
            callback: function(value, index, values) {
              return value;
            }
          }
        }
      ]
    }
  } as ChartOptions;
}
</script>

<style lang="scss" scoped></style>
