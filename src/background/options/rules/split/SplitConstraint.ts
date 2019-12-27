import CardSet from "../../../models/cards/CardSet";

export default class SplitConstraint {
  private _canHitAfterSplit: boolean = false;

  private _maxSplit: number;

  private _canHitAfterSplitWithAce: boolean = false;

  constructor(maxSplit: number = Infinity) {
    this._maxSplit = maxSplit;
  }

  public canSplit(cardSets: CardSet[], target: CardSet): boolean {
    return cardSets.length < this._maxSplit && target.canSplit;
  }

  public set canHitAfterSplit(value: boolean) {
    this._canHitAfterSplit = value;
  }

  public get canHitAfterSplit(): boolean {
    return this._canHitAfterSplit;
  }

  public set canHitAfterSplitWithAce(value: boolean) {
    this._canHitAfterSplitWithAce = value;
  }

  public get canHitAfterSplitWithAce(): boolean {
    return this._canHitAfterSplitWithAce;
  }
}
