import CountingMethodBase from "./CountingMethodBase";

export default class HeaulisticCounting extends CountingMethodBase {
  constructor() {
    super();
    this._memorizeNum = 20;
  }

  public reset(): void {
    this._cards = [];
    this._currentCount = 0;
  }

  public evaluate(): number {
    let count = 0;
    for (const c of this._cards) {
      if (c.number > 1 && c.number < 8) {
        count++;
      }
      if (c.number === 1 || c.number > 8) {
        count--;
      }
    }
    return count * Math.floor(Math.abs(count / 8));
  }
}
