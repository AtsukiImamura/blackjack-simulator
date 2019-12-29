import BettingPolicy from "./BettingPolicy";

export default class NomalBetting extends BettingPolicy {
  public calcNextBet(): number {
    return this._unitAmount;
  }
}
