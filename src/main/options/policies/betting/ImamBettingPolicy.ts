import BettingPolicy from "./BettingPolicy";

export default class ImamBettingPolicy extends BettingPolicy {
  //   public dicidedStatus(): number {}

  constructor() {
    super();
    this._minBet = 1;
    this._unitAmount = 2;
  }

  protected calcAjustment(): number {
    return Math.ceil(this._unitAmount / 2);
  }

  public calcStatus(): number {
    let lowCount = 0;
    let highCount = 0;
    for (const cs of this._recentCards) {
      for (const c of cs) {
        if (c.number > 1 && c.number < 8) {
          lowCount++;
        }
        if (c.number === 1 || c.number > 8) {
          highCount++;
        }
      }
    }
    const diff = lowCount - highCount;
    const res = diff * Math.floor(Math.abs(diff / 8));
    // console.log(`diff = ${diff}  res = ${res}`);
    return res;
  }
}
