import Card from "../../../models/cards/Card";

export default class BettingPolicy {
  protected _memorizeNum: number = 2;

  protected _recentCards: Card[][] = [];

  protected _unitAmount: number = 1;

  protected _currentAmount: number = 1;

  protected _minBet: number = 1;

  public calcUnitPoints(points: number[]): number[] {
    return points.map(p => p / this._unitAmount);
  }

  public memorize(cards: Card[]): void {
    // console.log(
    //   "BettingPolicy [memorize] this._recentCards.length = " +
    //     this._recentCards.length
    // );
    if (this._recentCards.length >= this._memorizeNum) {
      this._recentCards.shift();
    }
    this._recentCards.push(cards);
    // console.log(
    //   "         --> this._recentCards.length = " + this._recentCards.length
    // );
  }

  /**
   * Dicedes and returns prospection of cards of next game. Positive value represents positive status and possibility of getting high card is higher than nomal status.
   * 0 represents nomal status.
   * Negative value represents negative status.
   */
  public calcStatus(): number {
    return 0;
  }

  protected calcAjustment(): number {
    return 1;
  }

  public calcNextBet(): number {
    let addition = 0;
    const status = this.calcStatus();
    if (status > 0) {
      addition = this.calcAjustment();
    } else if (status < 0) {
      addition = -this.calcAjustment();
    }
    // this._currentAmount = this._unitAmount + addition;
    // return this._currentAmount;
    return Math.max(this._unitAmount + addition, this._minBet);
  }
}
