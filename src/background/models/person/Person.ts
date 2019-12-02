import CardSet from "../cards/CardSet";
import Card from "../cards/Card";

export default abstract class Person {
  protected _cardSets: CardSet[] = [];

  protected _currentCardSetIndex: number = -1;

  protected _uid: string = "";

  // protected set currentCardSetIndex(index: number) {
  //   if (index >= this._cardSets.length) {
  //     throw new Error("index out of bounds.");
  //   }
  //   this._currentCardSetIndex = index;
  // }

  // protected get currentCardIndex(): number {
  //   return this._currentCardSetIndex;
  // }
  public get uid(): string {
    return this._uid;
  }

  public set uid(uid: string) {
    if (this.uid !== "") {
      return;
    }
    this._uid = uid;
  }

  protected get currentCardSet(): CardSet | undefined {
    return this._cardSets[this._currentCardSetIndex];
  }

  public get sums(): number[] {
    return this._cardSets.map(cs => cs.highestSum);
  }

  constructor() {
    // const cardSet = new CardSet();
    // this._cardSets.push(cardSet);
    // this._currentCardSetIndex = 0;
    this.reset();
  }

  public abstract reset(): void;

  // public abstract decideAction(): Action;

  public addCard(card: Card): void {
    if (!this.prepareForAddingCard()) {
      throw new Error("Can not add card.");
    }
    if (!this.currentCardSet) {
      throw new Error("Current card set not found.");
    }
    this.currentCardSet.add(card);
  }

  public doctor(): void {
    this._cardSets.forEach(cs => cs.doctor());
  }

  protected prepareForAddingCard(): boolean {
    if (this._cardSets.length === 0) {
      return false;
    }
    if (!this.currentCardSet) {
      ++this._currentCardSetIndex;
    }
    if (this._currentCardSetIndex >= this._cardSets.length) {
      return false;
    }
    return true;
  }

  // public get areBursted(): boolean[] {
  //   return this._cardSets.map(cs => cs.isBursted);
  // }
}
