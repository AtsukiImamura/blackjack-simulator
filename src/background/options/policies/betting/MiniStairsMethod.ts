import BettingPolicy, { GameResult } from "./BettingPolicy";

export default class MiniStairsMethod extends BettingPolicy {
  public calcNextBet(): number {
    let nextBet = 0;
    switch (this._gameResult) {
      case GameResult.WIN:
        nextBet =
          this._unitAmount *
          Math.min(Math.floor(this._currentAmount / this._unitAmount) + 1, 3);
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
