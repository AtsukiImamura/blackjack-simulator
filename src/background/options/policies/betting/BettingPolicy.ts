import Card from "../../../models/cards/Card";
import CountingMethodBase from "../counting/CountingMethodBase";

export enum GameResult {
  WIN = 1,

  LOSE = -1,

  PUSH = 0
}

export default abstract class BettingPolicy {
  protected _countingPolicy: CountingMethodBase;

  protected _unitAmount: number;

  protected _minBet: number;

  protected _maxBet: number;

  protected _currentAmount: number = 1;

  protected _gameResult: GameResult = GameResult.PUSH;

  constructor(
    countingPolicy: CountingMethodBase,
    unitAmount: number = 1,
    minBet: number = 1,
    maxBet: number = 100
  ) {
    this._countingPolicy = countingPolicy;
    this._unitAmount = unitAmount;
    this._currentAmount = this._unitAmount;
    this._minBet = minBet;
    this._maxBet = maxBet;
  }

  public memorizeCard(card: Card): void {
    this._countingPolicy.addCard(card);
  }

  public win(): void {
    this._gameResult = GameResult.WIN;
  }

  public push(): void {
    this._gameResult = GameResult.PUSH;
  }

  public lose(): void {
    this._gameResult = GameResult.LOSE;
  }

  public abstract calcNextBet(): number;
}
