import BettingPolicy, { GameResult } from "./BettingPolicy";

export default class ParLayMethod extends BettingPolicy {
  public calcNextBet(): number {
    let nextBet = this._currentAmount;
    switch (this._gameResult) {
      case GameResult.WIN:
        nextBet = Math.min(this._currentAmount * 2, this._maxBet);
        break;
      case GameResult.LOSE:
        nextBet = this._unitAmount;
        break;
      case GameResult.PUSH:
        nextBet = this._currentAmount;
        break;
    }
    this._currentAmount = nextBet;
    return nextBet;
  }
}
