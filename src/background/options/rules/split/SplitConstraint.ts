import CardSet from "../../../models/cards/CardSet";

export default class SplitConstraint {
  private _canResplitAfterSplittingWithAce: boolean = true;

  private _maxSplit: number;

  constructor(maxSplit: number = Infinity) {
    this._maxSplit = maxSplit;
  }

  public canSplit(cardSets: CardSet[], target: CardSet): boolean {
    return cardSets.length < this._maxSplit && target.canSplit;
  }

  public get canResplitAfterSplittingWithAce(): boolean {
    return this._canResplitAfterSplittingWithAce;
  }

  public set canResplitAfterSplittingWithAce(value: boolean) {
    this._canResplitAfterSplittingWithAce = value;
  }
}
