import Person from "./Person";
import Card from "../cards/Card";
import { Action } from "../../constants/GameConstants";
import { CardCombination } from "../../constants/BasicStrategy";
import CardSet from "../cards/CardSet";

export default class Dealer extends Person {
  private _upCard: Card | undefined;

  public get upCard(): Card | undefined {
    return this._upCard;
  }

  public get point(): number {
    if (!this.currentCardSet) {
      throw new Error("Current card set not found.");
    }
    return this.currentCardSet.highestSum;
  }

  public reset(): void {
    this._cardSets = [new CardSet()];
    this._currentCardSetIndex = 0;
  }

  public addCard(card: Card): void {
    if (!this.prepareForAddingCard()) {
      throw new Error("Can not add card.");
    }
    if (this._upCard === undefined) {
      this._upCard = card;
    }
    if (!this.currentCardSet) {
      throw new Error("Current card set not found.");
    }
    this.currentCardSet.add(card);
  }

  public decideAction(): Action.HIT | Action.STAY | Action.NONE {
    if (!this.currentCardSet) {
      throw new Error("Current card set not found.");
    }
    if (this.currentCardSet.isBursted) {
      return Action.NONE;
    }
    if (this.currentCardSet.lowestSum < 17) {
      return Action.HIT;
    } else if (this.currentCardSet.lowestSum > 17) {
      return Action.STAY;
    } else {
      const combination = this.currentCardSet.cardCombnation;
      //TODO:  to constraint class
      if (combination === CardCombination.S17) {
        return Action.HIT;
      } else {
        return Action.STAY;
      }
    }
  }
}
