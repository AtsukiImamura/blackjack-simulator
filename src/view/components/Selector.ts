import { Component, Vue, Prop, Emit } from "vue-property-decorator";

export interface IConfigSelection {
  id: number;

  name: string;

  disabled?: boolean;
}

@Component({
  components: {}
})
export default class Selector extends Vue {
  @Prop()
  public options!: IConfigSelection[];

  @Prop()
  public default?: number;

  public selectedId: number = 0;

  public get selectedValue(): string {
    const target = this.selectedOption;
    if (!target) {
      return "";
    }
    return target.name;
  }

  public get selectedOption(): IConfigSelection | undefined {
    const targetOptions = this.options.filter(op => op.id === this.selectedId);
    if (targetOptions.length === 0) {
      return undefined;
    }
    return targetOptions[0];
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
    return this.options.map(op => op.name);
  }

  @Emit("select")
  public select(id: number): number {
    const target = this.selectedOption;
    if (!target) {
      throw new Error(`ID ${id} doesn't aprear in ids.`);
    }
    return target.id;
  }
}
