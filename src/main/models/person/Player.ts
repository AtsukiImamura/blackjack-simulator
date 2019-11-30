import BettingPolicy from "../../options/policies/betting/BettingPolicy";
import Person from "./Person";
import Table from "../tables/Table";
import CardSet from "../cards/CardSet";
import SplitConstraintBase from "../../options/rules/split/SplitConstraintBase";
import BasicSplitConstraint from "../../options/rules/split/BasicSplitConstraint";
import { Action } from "../../constants/GameConstants";
import BasicStrategy, { CardCombination } from "../../constants/BasicStrategy";
import Card from "../cards/Card";
import ImamBettingPolicy from "../../options/policies/betting/ImamBettingPolicy";
// import { DebugUtils } from "../../utils/DebugUtils";
import BasicDoubleConstraint from "../../options/rules/double/BasicDoubleConstraint";

export default class Player extends Person {
  private _coinAmount: number = 0;

  private _bettingPolicy: BettingPolicy;

  private _splitConstraint: typeof SplitConstraintBase;

  private _currentAction: Action = Action.NONE;

  public get coinAmount(): number {
    return this._coinAmount;
  }

  constructor(
    policyType: typeof BettingPolicy = ImamBettingPolicy,
    // policyType: typeof BettingPolicy = BettingPolicy,
    splitConstraint: typeof SplitConstraintBase = BasicSplitConstraint
  ) {
    super();
    this._bettingPolicy = new policyType();
    this._splitConstraint = splitConstraint;
  }

  public reset(): void {
    this._cardSets = [new CardSet()];
    this._currentCardSetIndex = 0;
    this._currentAction = Action.NONE;
  }

  public test__getCardconbinations(): CardCombination[] {
    return this._cardSets.map(cs => cs.cardCombnation);
  }

  public test__getCardSets(): CardSet[] {
    return this._cardSets;
  }

  /**
   * テーブルのすべての情報をもとに次に備える
   * @param table
   */
  public summalize(table: Table): number {
    const dealerPoint = table.dealerPoint;
    const coinTmp = this._coinAmount;
    for (const cardSet of this._cardSets) {
      this._coinAmount += cardSet.calcDiff(dealerPoint);
    }
    this._bettingPolicy.memorize(table.allCards);
    const diff = this._coinAmount - coinTmp;
    if (Math.abs(diff) > 8) {
      // console.log(`## diff = ${diff}`);
      // console.log(DebugUtils.toJsonLines(this._cardSets));
    }
    return diff;
  }

  public bet(): number {
    if (!this.canBet()) {
      return 0;
    }
    const betAmount = this._bettingPolicy.calcNextBet();

    // Initialize cardset when player bets.
    this._cardSets = [];
    this._cardSets.push(new CardSet(betAmount));

    return betAmount;
  }

  public decideAction(upCard: Card): Action {
    if (this.currentCardSet && this.currentCardSet.isSplitted) {
      this._currentAction = Action.HIT;
      return Action.HIT;
    }
    if (!this.currentCardSet) {
      this._currentAction = Action.NONE;
      return Action.NONE;
    }
    if (
      this.currentCardSet.isBursted ||
      this._currentAction === Action.DOUBLE
    ) {
      this._currentCardSetIndex++;
      this._currentAction = Action.STAY;
      return Action.STAY;
    }
    this._currentAction = Action.NONE;
    const cardCombnation = this.currentCardSet.cardCombnation;
    if (cardCombnation === CardCombination.LOW) {
      this._currentAction = Action.HIT;
      return Action.HIT;
    }
    const strategies = BasicStrategy.get(cardCombnation);
    if (!strategies) {
      console.log("cardCombnation = ", CardCombination[cardCombnation]);
      throw new Error("Strategies are empry set.");
    }
    let action = strategies[upCard.number > 10 ? 10 : upCard.number];
    if (action === Action.SPLIT && !this.canSplit()) {
      // TODO: スプリットできない場合にハードに読み替えて戦略を算出
      action = Action.STAY;
      if (this.currentCardSet && this.currentCardSet.lowestSum < 12) {
        action = Action.HIT;
      }
    }

    if (action === Action.DOUBLE && !this.canDouble()) {
      action = Action.HIT;
    }
    if (action == Action.STAY || action === Action.SURRENDER) {
      this._currentCardSetIndex++;
    }
    this._currentAction = action;
    return action;
  }

  public commitAction(card: Card | undefined = undefined) {
    switch (this._currentAction) {
      case Action.STAY:
        if (card) {
          throw new Error("Player doesn't need any card on calling STAY.");
        }
        break;
      case Action.HIT:
        if (!card) {
          throw new Error("Card is required on calling HIT.");
        }
        this.attmptToHit(card);
        break;
      // hit
      case Action.DOUBLE:
        if (!card) {
          throw new Error("Card is required on calling DOUBLE.");
        }
        this.attemptToDouble(card);
        break;
      // double.
      case Action.SPLIT:
        if (card) {
          throw new Error("Player doesn't need any card on calling SPLIT.");
        }
        this.attemptToSplit();
        break;
      case Action.SURRENDER:
        if (card) {
          throw new Error("Player doesn't need any card on calling SURRENDER.");
        }
        this.attemptToSurrender();
        break;
      default:
        throw new Error("Suspicious action has been detected. Check it out!");
    }
  }

  private attemptToSurrender() {
    if (!this.currentCardSet) {
      throw new Error("Current card set not found.");
    }
    this.currentCardSet.surrender();
  }

  private attemptToSplit() {
    if (!this.currentCardSet) {
      throw new Error("Current card set not found.");
    }
    if (!this.currentCardSet.canSplit) {
      throw new Error("Attempted to split card set, but it can not splitted.");
    }
    const newCardSet = this.currentCardSet.split();
    this._cardSets.push(newCardSet);
  }

  private attemptToDouble(card: Card) {
    if (!this.currentCardSet) {
      throw new Error("Current card set not found.");
    }
    this.currentCardSet.double(card);
  }

  private attmptToHit(card: Card) {
    if (!this.currentCardSet) {
      throw new Error("Current card set not found.");
    }
    this.currentCardSet.add(card);
  }
  public switchCardSet(): boolean {
    if (this._currentCardSetIndex >= this._cardSets.length) {
      return false;
    }
    this._currentCardSetIndex++;
    return true;
  }

  private canBet(): boolean {
    if (!this.currentCardSet) {
      return true;
    }
    return this._cardSets.length === 1 && this.currentCardSet.canBet();
  }

  private canSplit(): boolean {
    if (!this.currentCardSet) {
      throw new Error("Current card set nout found.");
    }
    return new this._splitConstraint().canSplit(
      this._cardSets,
      this.currentCardSet
    );
  }

  private canDouble(): boolean {
    if (!this.currentCardSet) {
      throw new Error("Current card set nout found.");
    }
    return new BasicDoubleConstraint().canDouble(this.currentCardSet);
  }
}
