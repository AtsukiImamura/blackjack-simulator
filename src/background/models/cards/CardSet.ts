import Card from "./Card";
import BasicNumberCountRule from "../../options/rules/count/BasicNumberCountRule";
import { CardCombination } from "../../constants/BasicStrategy";
import DoubleConstraint from "../../options/rules/double/DoubleConstraint";

export class CardSetBase {
  protected _cards: Card[] = [];

  protected _betAmount: number;

  protected _unitAmount: number;

  protected _doubleConstraint: DoubleConstraint;

  protected _isSurrenderd: boolean = false;

  constructor(
    betAmount: number = 0,
    doubleConstraint: DoubleConstraint = new DoubleConstraint()
  ) {
    this._betAmount = betAmount;
    this._unitAmount = betAmount;
    this._doubleConstraint = doubleConstraint;
  }

  public get cardNum(): number {
    return this._cards.length;
  }

  public get cards(): Card[] {
    return this._cards.slice(0);
  }

  public get possibleSums(): number[] {
    return new BasicNumberCountRule().apply(this._cards).sort((a, b) => a - b);
  }

  public get highestSum(): number {
    const possibleSums = this.possibleSums;
    return possibleSums.length === 0
      ? 0
      : possibleSums[possibleSums.length - 1];
  }

  public get lowestSum(): number {
    const possibleSums = this.possibleSums;
    return possibleSums.length === 0 ? 0 : possibleSums[0];
  }

  public get cardCombnation(): CardCombination {
    if (this._cards.length < 2) {
      throw new Error(
        "Length of cards must be more than 1 as get combination."
      );
    }
    const point = this.highestSum;
    if (point === 0) {
      return CardCombination.OUT_OF_RANGE;
    }
    if (point > 18) {
      return CardCombination.HIGH;
    }
    if (this.hasAce) {
      // soft-hand
      switch (point) {
        case 12:
          if (
            this._cards.length === 2 &&
            this._cards[0].number === 1 &&
            this._cards[1].number === 1
          ) {
            return CardCombination.PA;
          }
          // Ace doesn't work
          return CardCombination.H12;
        case 13:
          return CardCombination.S13;
        case 14:
          return CardCombination.S14;
        case 15:
          return CardCombination.S15;
        case 16:
          return CardCombination.S16;
        case 17:
          return CardCombination.S17;
        case 18:
          return CardCombination.S18;
      }
    } else if (this.canSplit) {
      // split
      switch (point) {
        case 4:
          return CardCombination.P4;
        case 6:
          return CardCombination.P6;
        case 8:
          return CardCombination.P8;
        case 10:
          return CardCombination.P10;
        case 12:
          return CardCombination.P12;
        case 14:
          return CardCombination.P14;
        case 16:
          return CardCombination.P16;
        case 18:
          return CardCombination.P18;
      }
    } else {
      if (point < 9) {
        return CardCombination.LOW;
      }
      // hard-hand
      switch (point) {
        case 9:
          return CardCombination.H9;
        case 10:
          return CardCombination.H10;
        case 11:
          return CardCombination.H11;
        case 12:
          return CardCombination.H12;
        case 13:
          return CardCombination.H13;
        case 14:
          return CardCombination.H14;
        case 15:
          return CardCombination.H15;
        case 16:
          return CardCombination.H16;
        case 17:
          return CardCombination.HIGH;
        case 18:
          return CardCombination.HIGH;
      }
    }
    console.log("cards = ", this._cards);
    throw new Error("Satisfied conbination name not found.  point = " + point);
  }

  private get hasAce(): boolean {
    return (
      this._cards.map(card => card.number).filter(num => num === 1).length > 0
    );
  }

  public get isBursted(): boolean {
    return this._cards.length > 0 && this.possibleSums.length === 0;
  }

  public get isSplitted(): boolean {
    return this._cards.length === 1;
  }

  public get isSoftHand(): boolean {
    return this.possibleSums.length > 1;
  }

  public get canSplit(): boolean {
    return (
      this._cards.length === 2 &&
      this._cards[0].number === this._cards[1].number
    );
  }

  public canBet(): boolean {
    return this._betAmount === 0;
  }

  public get doubleNum(): number {
    return Math.floor(this._betAmount / this._unitAmount);
  }
}

export default class CardSet extends CardSetBase {
  public doctor(): void {
    const errors: string[] = [];
    if (this._cards.length < 2) {
      errors.push("ERROR :  length of cards is " + this._cards.length);
    }

    if (errors.length > 0) {
      console.log(this);
      errors.forEach(e => console.log(e));
    }
  }

  public asBase(): CardSetBase {
    return this as CardSetBase;
  }

  public calcDiff(dealerPoint: number): number {
    if (this.isBursted) {
      return -this._betAmount;
    }
    if (this._isSurrenderd) {
      return -this._betAmount * 0.5;
    }
    const sum = this.highestSum;
    if (this.cardNum == 2 && sum === 21) {
      return this._betAmount * 1.5;
    }
    if (dealerPoint < sum) {
      return this._betAmount;
    } else if (dealerPoint > sum) {
      return -this._betAmount;
    } else {
      return 0;
    }
  }

  public add(card: Card): void {
    this._cards.push(card);
  }

  public split(): CardSet {
    if (this._cards.length !== 2) {
      throw new Error("Number of card set must be 2 when split.");
    }
    const cardSet = new CardSet(this._betAmount, this._doubleConstraint);
    cardSet.add(this._cards.splice(0, 1)[0]);
    return cardSet;
  }

  public double(card: Card): number {
    if (!this.canDouble) {
      console.error(
        "Attempted to do ilegal action DOUBLE while number of cards is more than 2."
      );
      return this._betAmount;
    }
    this.add(card);
    return (this._betAmount += this._unitAmount);
  }

  public get canDouble(): boolean {
    return this._doubleConstraint.canDouble(this);
  }

  public surrender(): number {
    this._isSurrenderd = true;
    return this._betAmount * 0.5;
  }
}
