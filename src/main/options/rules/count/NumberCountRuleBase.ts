import Card from "../../../models/cards/Card";

export default abstract class NumberCountRuleBase {
  public abstract apply(cards: Card[]): number[];
}
