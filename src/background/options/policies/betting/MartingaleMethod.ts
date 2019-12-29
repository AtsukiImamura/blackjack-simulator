import BettingPolicy, { GameResult } from "./BettingPolicy";

export default class MartingaleMethod extends BettingPolicy {
  public calcNextBet(): number {
    let nextBet = 0;
    switch (this._gameResult) {
      case GameResult.WIN:
        nextBet = this._unitAmount;
        break;
      case GameResult.LOSE:
        nextBet = Math.min(this._currentAmount * 2, this._maxBet);
        break;
      case GameResult.PUSH:
        nextBet = this._currentAmount;
        break;
    }
    console.log(
      `[calcNextBet] result:${GameResult[this._gameResult]} current:${
        this._currentAmount
      } unit:${this._unitAmount} next:${nextBet}`
    );
    this._currentAmount = nextBet;
    return nextBet;
  }
}
