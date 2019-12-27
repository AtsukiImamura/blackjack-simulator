<template>
  <div class="dr-selector">
    <input
      class="selected-item"
      type="button"
      :value="selectedValue"
      @click="showOptions()"
    />
    <div class="options-bg" v-show="isOptionOpen" @click="closeOptions()"></div>
    <ul class="options" v-show="isOptionOpen">
      <li
        class="option"
        :class="{
          selected: option.id === selectedId,
          disabled: option.disabled
        }"
        v-for="(option, index) in this.options"
        :key="index"
        @click="
          select(option.id);
          closeOptions();
        "
      >
        {{ option.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import Selector from "./Selector";

@Component({
  components: {}
})
export default class DropDownSelector extends Mixins(Selector) {
  public isOptionOpen: boolean = false;
  public mounted(): void {}

  public showOptions(): void {
    this.isOptionOpen = true;
  }

  public closeOptions(): void {
    this.isOptionOpen = false;
  }
}
</script>

<style lang="scss" scoped>
.dr-selector {
  width: 240px;
  position: relative;
  max-width: 100%;
  .selected-item {
    width: 100%;
    border: 1px solid #cccccc;
    padding: 4px 8px;
    height: 32px;
    cursor: pointer;
    background-color: #ffffff;
    &:after {
      content: "";
      position: absolute;
      right: 10px;
      top: 16px;
      width: 10px;
      height: 10px;
    }
    &:hover {
      transition-duration: 0.25s;
      background-color: #f8f8f8;
    }
    &:focus {
      outline: none;
    }
  }
  .options {
    width: 100%;
    margin: 0;
    padding: 0;
    position: absolute;
    top: 32px;
    left: 1px;
    background-color: #ffffff;
    z-index: 3;
    // box-shadow: 1px 1px 1.5px 1.5px rgba(0, 0, 0, 0.25);
    .option {
      list-style: none;
      padding: 4px 8px;
      width: calc(100% - 18px);
      border: 1px solid #cccccc;
      border-top-width: 0px;

      &:hover {
        background-color: #f8f8f8;
        cursor: pointer;
      }
      &.selected {
        background-color: #808080;
        color: #ffffff;
        &:hover {
          background-color: #808080;
        }
      }
      &.disabled {
        color: #c0c0c0;
        &:hover {
          background-color: #ffffff;
          cursor: not-allowed;
        }
      }
    }
  }
  .options-bg {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
  }
}
</style>
