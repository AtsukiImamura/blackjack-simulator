import BaseCardDispensor from "./BaseCardDispensor";
import Card, { Mark } from "../cards/Card";

/**
 * The one which has Snail shepe.
 */
export default class SnailsCardDispensor extends BaseCardDispensor {
  /** Holder holding a bunch of cards. */
  private _holders: CardHolder[] = [];
  /** Holder that new card will be provided by. */
  private _currentHolder: CardHolder | undefined = undefined;

  constructor(deckNum: number = BaseCardDispensor.DEFAULT_DECK_NUM) {
    super(deckNum);
    this.init();
  }

  protected init(): void {
    if (this._deckNum === 0) {
      throw new Error("Deck number must not be 0.");
    }

    // Create all of type of cards depends on the number of deck at first.
    const candidateCards: Card[] = [];
    for (let deck = 0; deck < this._deckNum; deck++) {
      for (let num = 1; num <= 13; num++) {
        candidateCards.push(new Card(num, Mark.CRAB));
        candidateCards.push(new Card(num, Mark.DIAMOND));
        candidateCards.push(new Card(num, Mark.HEART));
        candidateCards.push(new Card(num, Mark.SPADE));
      }
    }

    // Pick card from candidates and put it into holder.
    let holderCards: Card[] = [];
    for (let cnt = 1; cnt < this._deckNum * 52; cnt++) {
      const rand = Math.floor(Math.random() * candidateCards.length);
      holderCards.push(...candidateCards.slice(rand, rand + 1));
      // Put the cards into holder every number holder can have.
      if (cnt % CardHolder.HOLD_NUM === 0) {
        this._holders.push(new CardHolder(holderCards));
        holderCards = [];
      }
    }
  }

  public next(): Card | undefined {
    if (!this._holders) {
      console.log("[next] check1");
      return undefined;
    }
    if (this._holders.length === 0) {
      console.log("[next] check2");
      return undefined;
    }
    if (!this._currentHolder || this._currentHolder.isEmpry()) {
      const rand = Math.floor(Math.random() * this._holders.length);
      this._currentHolder = this._holders.splice(rand, 1)[0];
    }
    if (!this._currentHolder) {
      console.log("[next] check3");
      return undefined;
    }
    const card = this._currentHolder.next();
    if (card) {
      this._pickedCards.push(card);
    }
    return card;
  }

  /**
   * 引かれたカードを詰めなおす
   */
  public refill(): void {
    while (this._pickedCards.length >= CardHolder.HOLD_NUM) {
      this._holders.push(
        new CardHolder(this._pickedCards.splice(0, CardHolder.HOLD_NUM))
      );
    }
  }
}

class CardHolder {
  public static readonly HOLD_NUM = 4;

  private _cards: Card[];

  public next(): Card | undefined {
    return this._cards.shift();
  }

  public isEmpry(): boolean {
    return this._cards.length === 0;
  }

  constructor(cards: Card[]) {
    if (cards.length !== CardHolder.HOLD_NUM) {
      throw new Error(`Number of cards must be ${CardHolder.HOLD_NUM}.`);
    }
    this._cards = cards;
  }
}
