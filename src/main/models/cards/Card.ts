/**
 * Trump card
 */
export default class Card {
  protected _number: number;

  protected _mark: Mark;

  public get number(): number {
    return this._number;
  }

  public get mark(): Mark {
    return this._mark;
  }

  constructor(number: number, mark: Mark) {
    this._number = number;
    this._mark = mark;
  }
}

/**
 * Trump mark
 */
export enum Mark {
  SPADE = 0,

  DIAMOND = 1,

  HEART = 2,

  CRAB = 3
}
