import { Component, Vue, Prop, Emit } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Selector extends Vue {
  @Prop()
  public options!: Map<number, string>;

  @Prop()
  public default?: number;

  public selectedId: number = 0;

  public get selectedValue(): string {
    const value = this.options.get(this.selectedId);
    if (!value) {
      return "";
    }
    return value;
  }

  public craeted(): void {
    if (this.default) {
      this.selectedId = this.default;
    }
  }

  public get keys(): number[] {
    const keys: number[] = [];
    for (const key of this.options.keys()) {
      keys.push(key);
    }
    return keys;
  }

  public get values(): string[] {
    const values: string[] = [];
    for (const value of this.options.values()) {
      values.push(value);
    }
    return values;
  }

  @Emit("select")
  public select(id: number) {
    if (!this.options.has(id)) {
      throw new Error(`ID ${id} doesn't aprear in ids.`);
    }
    this.selectedId = id;
  }
}
