import SplitConstraintBase from "./SplitConstraintBase";
import CardSet from "../../../models/cards/CardSet";

export default class BasicSplitConstraint implements SplitConstraintBase {
  // private static readonly MAX_SPLIT_NUM = 2;

  public canSplit(cardSets: CardSet[], target: CardSet): boolean {
    return cardSets.length < 3;
  }

  public canHitAfterSplit(): boolean {
    return true;
  }

  public canHitAfterSplitWithAce(): boolean {
    return false;
  }
}
