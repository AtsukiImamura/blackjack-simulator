<template>
  <div class="action-summary" v-if="summary.action != 'STAY'">
    <div class="action">
      <span
        :class="summary.action.toLowerCase()"
      >{{ summary.action.slice(0,1).toUpperCase() + summary.action.slice(1).toLowerCase() }}</span>
    </div>
    <div class="card">
      <TrumpCard v-if="summary.card" :card="summary.card"></TrumpCard>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ActionSummary } from "../../background/models/tables/GameSummary";
import TrumpCard from "./TrumpCard.vue";

@Component({
  components: { TrumpCard }
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
  min-width: 110px;
  .action {
    width: 60%;
    margin: 0 2% 0 8%;
    span {
      display: block;
      padding: 3px 5px;
      border-radius: 3px;
      width: 50px;
      text-align: center;
      border: 1px solid #ffffff;
    }
    .hit {
      background-color: #ff0000;
      border-color: #ff0000;
      color: #ffffff;
    }
    .stay {
      background-color: #ffffff;
      border-color: #808080;
      color: #808080;
    }
    .double {
      background-color: #ffa000;
      border-color: #ffa000;
      color: #ffffff;
    }
    .split {
      background-color: #ffffff;
      border-color: #0080ff;
      color: #0080ff;
    }
    .surrender {
      background-color: #ffffff;
      border-color: #b3009b;
      color: #b3009b;
    }
  }
  .card {
    width: calc(45px + 5%);
    margin-left: 5%;
  }
}
</style>