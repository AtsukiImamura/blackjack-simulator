import Card from "../cards/Card";

export default abstract class BaseCardDispensor {
  /** Default number of trump deck. */
  public static readonly DEFAULT_DECK_NUM = 4;
  /** Number of trump deck which is held in the dispensor. */
  protected _deckNum: number = 0;
  /** Memory of picked cards. */
  protected _pickedCards: Card[] = [];

  constructor(deckNum: number = BaseCardDispensor.DEFAULT_DECK_NUM) {
    this._deckNum = deckNum;
  }

  /**
   * Get next card if exists. If the next card does not exist, returns undefined.
   */
  public abstract next(): Card | undefined;

  public abstract refill(): void;

  /**
   * Get specific number of next card from dispensor.
   * It must return array of Card, but length of array is possibly less than required number when it could not get new card from dispensor.
   *
   * @param num
   */
  public batchNext(num: number): Card[] {
    const cards: Card[] = [];
    for (let index = 0; index < num; index++) {
      const card = this.next();
      if (!card) {
        continue;
      }
      cards.push(card);
    }
    return cards;
  }

  /**
   * Reset the cards. This method is same as init() basically.
   */
  public reset(): void {
    this.init();
  }

  /**
   * Init the cards to be able to provide cards. Implementation will be different rely on implementation of the dispensor.
   */
  protected abstract init(): void;
}
