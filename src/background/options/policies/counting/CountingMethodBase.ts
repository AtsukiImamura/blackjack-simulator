import Card from "../../../models/cards/Card";

export default abstract class CountingMethodBase {
  protected _cards: Card[] = [];

  protected _currentCount: number = 0;

  protected _memorizeNum: number = -1;

  public addCard(card: Card) {
    if (this._memorizeNum >= 0 && this._cards.length >= this._memorizeNum) {
      this._cards.unshift();
    }
    this._cards.push(card);
  }

  /**
   * Reset count.
   */
  public abstract reset(): void;

  /**
   * Evaluate shown cards. This method must return positive value when cards is profitable for player
   *  and return negative value on the opposit situation.
   */
  public abstract evaluate(): number;
}
