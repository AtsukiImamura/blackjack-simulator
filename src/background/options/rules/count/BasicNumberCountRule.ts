import NumberCountRuleBase from "./NumberCountRuleBase";
import Card from "../../../models/cards/Card";

export default class BasicNumberCountRule extends NumberCountRuleBase {
  public apply(cards: Card[]): number[] {
    let possiblyNumbers: number[] = [0];
    cards.forEach(card => {
      if (card.number === 1) {
        const added = possiblyNumbers.map(num => num + 10);
        possiblyNumbers.push(...added);
      }
      possiblyNumbers = possiblyNumbers.map(
        num => num + (card.number > 10 ? 10 : card.number)
      );
    });
    return possiblyNumbers.filter(num => num <= 21);
  }
}
