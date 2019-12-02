import CardSet from "../../../models/cards/CardSet";

/**
 * Should NOT use this class directly.
 */
export default class SplitConstraintBase {
  public canSplit(cardSets: CardSet[], target: CardSet): boolean {
    return cardSets.length < 3;
  }

  public canHitAfterSplit(): boolean {
    return true;
  }

  public canHitAfterSplitWithAce(): boolean {
    return true;
  }
}
