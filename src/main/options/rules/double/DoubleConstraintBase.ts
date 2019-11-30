import CardSet from "../../../models/cards/CardSet";

export default class DoubleConstraintBase {
  public canDouble(target: CardSet): boolean {
    return !target.isSplitted && target.doubleNum < 2;
  }
}
