import CountingMethodBase from "./CountingMethodBase";

export default class NeverCounting extends CountingMethodBase {
  public reset() {
    this._currentCount = 0;
    this._cards = [];
  }

  public evaluate() {
    return 0;
  }
}
