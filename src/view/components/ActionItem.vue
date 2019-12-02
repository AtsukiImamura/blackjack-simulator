<template>
  <div class="action-summary">
    <div class="action">
      <span :class="summary.action.toLowerCase()">{{ summary.action }}</span>
    </div>
    <div class="card" v-if="summary.card">
      <span>{{ summary.card.number }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ActionSummary } from "../../background/models/tables/GameSummary";

@Component({
  components: {}
})
export default class ActionItem extends Vue {
  @Prop()
  public summary!: ActionSummary;

  public mounted(): void {}
}
</script>

<style lang="scss" scoped>
.action-summary {
  display: flex;
  margin: 3px 0;
  font-size: 14px;
  .action {
    width: 30%;
    margin: 0 2% 0 8%;
    span {
      display: block;
      padding: 3px 5px;
      border-radius: 3px;
      width: 60px;
      text-align: center;
      border: 1px solid #ffffff;
    }
    .hit {
      background-color: #ff0000;
      border-color: #ff0000;
      color: #ffffff;
    }
    .stay {
      //   background-color: #808080;
      border-color: #808080;
      color: #808080;
    }
    .double {
      background-color: #ffa000;
      border-color: #ffa000;
      color: #ffffff;
    }
    .split {
      border-color: #0080ff;
      color: #0080ff;
    }
    .surrender {
      border-color: #b3009b;
      color: #b3009b;
    }
  }
  .card {
    width: 50%;
  }
}
</style>