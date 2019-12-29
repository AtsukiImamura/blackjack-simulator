import BettingPolicy from "./BettingPolicy";

export default class ImamBettingPolicy extends BettingPolicy {
  public calcNextBet(): number {
    let multiplier = 1;
    if (this._countingPolicy.evaluate() > 5) {
      multiplier = 1.5;
    }
    this._currentAmount = Math.floor(this._unitAmount * multiplier);
    return this._currentAmount;
  }
}
