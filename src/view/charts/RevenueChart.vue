<script lang="ts">
import { Component, Mixins, Prop, Watch, Emit } from "vue-property-decorator";
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

  @Emit("click")
  public onClickChart(index: number): number {
    return index;
  }

  public mounted(): void {}

  private createChartData(summary: GameSummary) {
    return {
      labels: summary.turns.map(
        (turn, index) =>
          `[${String(turn.id)}] ${turn.diff > 0 ? "+" : "-"} ${Math.abs(
            turn.diff
          )}`
      ),
      datasets: [
        {
          label: "revenue",
          data: summary.points,
          borderWidth: 1,
          // borderColor: "#000060",
          // backgroundColor: "#000060",
          backgroundColor: context => {
            var index = context.dataIndex;
            const dataset = context.dataset;
            if (!dataset) {
              return "#000080";
            }
            const data = dataset.data;
            if (!data) {
              return "#000080";
            }
            var value = data[index ? index : 0];
            return value ? (value < 0 ? "#a00000" : "#000080") : "#008000";
          },
          hoverBorderColor: "#c0c0c0"
        }
      ]
    } as ChartData;
  }

  public options = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      callbacks: {}
    },
    legend: {
      display: false
    },
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
      ],
      xAxes: [
        {
          display: false
        }
      ]
    },
    onClick: (e, el: { _index: number }[]) => {
      if (el.length === 0) {
        return;
      }
      const index = el[0]._index;
      if (!index) {
        return;
      }
      this.onClickChart(index);
    }
  } as ChartOptions;
}
</script>

<style lang="scss" scoped></style>
