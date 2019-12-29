import CardSet from "../../../models/cards/CardSet";

export enum DoubleTiming {
  EXCEPT_FOR_SOFT_HAND = 0,

  ONLY_ON_CHANCE_HAND = 1,

  ALWAYS = 2
}

export default class DoubleConstraint {
  private _doubleTiming: DoubleTiming;

  private _canDoubleOnSplitted: boolean = true;

  private _maxDoubleNum: number;

  constructor(
    doubleTiming: DoubleTiming = DoubleTiming.ALWAYS,
    maxDoubleNum: number = 2
  ) {
    this._maxDoubleNum = maxDoubleNum;
    this._doubleTiming = doubleTiming;
  }

  public get canDoubleOnSplitted(): boolean {
    return this._canDoubleOnSplitted;
  }

  public set canDoubleOnSplitted(value: boolean) {
    this._canDoubleOnSplitted = value;
  }

  public canDouble(target: CardSet): boolean {
    if (target.cardNum !== 2) {
      return false;
    }
    if (target.doubleNum >= this._maxDoubleNum) {
      return false;
    }
    if (!this._canDoubleOnSplitted && target.isSplitted) {
      return false;
    }
    const sum = target.highestSum;
    if (
      this._doubleTiming === DoubleTiming.ONLY_ON_CHANCE_HAND &&
      !(9 <= sum && 11 <= sum)
    ) {
      return false;
    }
    if (
      this._doubleTiming === DoubleTiming.EXCEPT_FOR_SOFT_HAND &&
      target.isSoftHand
    ) {
      return false;
    }
    return true;
  }
}
