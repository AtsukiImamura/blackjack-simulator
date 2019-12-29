import CountingMethodBase from "./CountingMethodBase";

export default class BasicCounting extends CountingMethodBase {
  public reset(): void {
    this._cards = [];
  }

  public evaluate(): number {
    let value = 0;
    for (const c of this._cards) {
      if (2 <= c.number && c.number <= 6) {
        value++;
      } else if (9 <= c.number && c.number <= 13) {
        value++;
      } else {
        // do nothing
      }
    }
    const remainDeckNum = Math.floor((8 * 52 - this._cards.length) / 52) + 1;
    return Math.floor(value / remainDeckNum);
  }
}
