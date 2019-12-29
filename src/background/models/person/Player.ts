import BettingPolicy from "../../options/policies/betting/BettingPolicy";
import Person from "./Person";
import Table from "../tables/Table";
import CardSet from "../cards/CardSet";
import SplitConstraint from "../../options/rules/split/SplitConstraint";
import { Action } from "../../constants/GameConstants";
import BasicStrategy, { CardCombination } from "../../constants/BasicStrategy";
import Card from "../cards/Card";
import DoubleConstraint from "../../options/rules/double/DoubleConstraint";
import * as lodash from "lodash";
import SurrenderConstraintBase from "../../options/rules/surrender/SurrenderConstraintBase";

export default class Player extends Person {
  private _coinAmount: number = 0;

  private _bettingPolicy: BettingPolicy;

  private _splitConstraint: SplitConstraint;

  private _doubleConstraint: DoubleConstraint;

  private _surrenderConstraint: SurrenderConstraintBase;

  private _currentAction: Action = Action.NONE;

  public get coinAmount(): number {
    return this._coinAmount;
  }

  constructor(
    policyType: BettingPolicy,
    splitConstraint: SplitConstraint,
    doubleConstraint: DoubleConstraint,
    surrenderConstraint: SurrenderConstraintBase
  ) {
    super();
    this._bettingPolicy = lodash.cloneDeep(policyType);
    this._splitConstraint = splitConstraint;
    this._doubleConstraint = doubleConstraint;
    this._surrenderConstraint = surrenderConstraint;
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
    for (const c of table.allCards) {
      this._bettingPolicy.memorizeCard(c);
    }
    const diff = this._coinAmount - coinTmp;
    if (diff > 0) {
      this._bettingPolicy.win();
    } else if (diff < 0) {
      this._bettingPolicy.lose();
    } else {
      this._bettingPolicy.push();
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
    this._cardSets.push(new CardSet(betAmount, this._doubleConstraint));

    return betAmount;
  }

  public lookCard(card: Card | undefined) {
    if (!card) {
      return;
    }
    this._bettingPolicy.memorizeCard(card);
  }

  public lookCards(cards: Card[]) {
    for (const c of cards) {
      this.lookCard(c);
    }
  }

  public decideAction(upCard: Card): Action {
    if (this._currentAction === Action.SURRENDER) {
      return Action.NONE;
    }
    if (this.currentCardSet && this.currentCardSet.isSplitted) {
      this._currentAction = Action.NEED;
      return Action.NEED;
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
    if (action === Action.SURRENDER) {
      if (!this._surrenderConstraint.canSurrender(this._cardSets)) {
        action = Action.HIT;
      }
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
      case Action.NEED:
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
    if (!card) {
      throw new Error("Card is required after chocing hit.");
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
    return this._splitConstraint.canSplit(this._cardSets, this.currentCardSet);
  }

  private canDouble(): boolean {
    if (!this.currentCardSet) {
      throw new Error("Current card set nout found.");
    }
    return this.currentCardSet.canDouble;
  }
}
