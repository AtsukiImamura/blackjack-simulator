<template>
  <div class="action-summary" v-if="summary.action != 'STAY'">
    <div class="action">
      <span :class="summary.action.toLowerCase()">
        <span>{{
          summary.action.slice(0, 1).toUpperCase() +
            summary.action.slice(1).toLowerCase()
        }}</span>
      </span>
    </div>
    <div class="card">
      <TrumpCard
        v-if="summary.card"
        :card="summary.card"
        :class="summary.action.toLowerCase()"
      ></TrumpCard>
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
    margin: 0px -10px 0 8%;
    > span {
      display: block;
      padding: 3px;
      border-radius: 3px 0 0 3px;
      width: 50px;
      text-align: center;
      border: 1px solid #ffffff;
      height: 33.5px;
      display: flex;
      justify-content: center;
      align-items: center;
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
    .need {
      background-color: #ffffff;
      border-color: #c0c0c0;
      color: #c0c0c0;
    }
    .split,
    .surrender {
      width: 76px;
      border-radius: 3px;
      height: 20px;
    }
  }
  .card {
    width: calc(45px + 5%);
    margin-left: 5%;
    /deep/ img {
      border: 1px solid transparent;
      border-width: 1px 1px 1px 0;
      border-radius: 0 3px 3px 0;
      margin: 0;
      &:hover {
        margin: 0;
        border-width: 1px 1px 1px 0;
      }
    }
    /deep/ .hit .main-image {
      border-color: #ff0000;
    }
    /deep/ .stay .main-image {
      border-color: #808080;
    }
    /deep/ .double .main-image {
      border-color: #ffa000;
    }
    /deep/ .split .main-image {
      border-color: #0080ff;
    }
    /deep/ .surrender .main-image {
      border-color: #b3009b;
      border-width: 1px;
    }
    /deep/ .need .main-image {
      border-color: #c0c0c0;
      border-width: 1px;
    }
  }
}
</style>
