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
   * Summarize result of one game and prepare for next game.
   * Summarizing includes calculating point, judge win or lose, and memorising cards and result.
   *
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

  /**
   * The player bets money accorging to his/her own strategies or money systems.
   */
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

  /**
   * Look card presented on the table.
   * @param card
   */
  public lookCard(card: Card | undefined) {
    if (!card) {
      return;
    }
    this._bettingPolicy.memorizeCard(card);
  }

  /**
   * Look multiple cards presented on the table.
   * @param cards
   */
  public lookCards(cards: Card[]) {
    for (const c of cards) {
      this.lookCard(c);
    }
  }

  /**
   * Decide action based on dealer's up card and own cards.
   * After calling this method, caller must also call commitAction() to complete action player decided in this method.
   *
   * @param upCard
   */
  public decideAction(upCard: Card): Action {
    // after surrender
    if (this._currentAction === Action.SURRENDER) {
      return Action.NONE;
    }
    // after split
    if (this.currentCardSet && this.currentCardSet.isSplitted) {
      this._currentAction = Action.NEED;
      return Action.NEED;
    }
    // no more card set
    if (!this.currentCardSet) {
      this._currentAction = Action.NONE;
      return Action.NONE;
    }
    // after burst and double
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
      if (this.currentCardSet && this.currentCardSet.lowestSum < 12) {
        action = Action.HIT;
      } else {
        action = Action.STAY;
      }
    }

    if (action === Action.DOUBLE && !this.canDouble()) {
      action = Action.HIT;
    }

    // player will handle next card set next time.
    // if (action == Action.STAY) {
    //   this._currentCardSetIndex++;
    // }
    if (
      action === Action.SURRENDER &&
      !this._surrenderConstraint.canSurrender(this._cardSets)
    ) {
      action = Action.HIT;
    }
    this._currentAction = action;
    return action;
  }

  /**
   * Complete action decided by player. When a card is needed according to action, a card is required but it must not be presented the action does not need any card.
   * @param card
   */
  public commitAction(card: Card | undefined = undefined) {
    switch (this._currentAction) {
      case Action.STAY:
        if (card) {
          throw new Error("Player doesn't need any card on calling STAY.");
        }
        this._currentCardSetIndex++;
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

  /**
   * Surrender
   */
  private attemptToSurrender() {
    if (!this.currentCardSet) {
      throw new Error("Current card set not found.");
    }
    this.currentCardSet.surrender();
    this._currentCardSetIndex++;
  }

  /**
   * Split
   * TODO: check condition here as well.
   */
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

  /**
   * Double
   * @param card
   */
  private attemptToDouble(card: Card) {
    if (!this.currentCardSet) {
      throw new Error("Current card set not found.");
    }
    this.currentCardSet.double(card);
  }

  /**
   * Hit
   * @param card
   */
  private attmptToHit(card: Card) {
    if (!this.currentCardSet) {
      throw new Error("Current card set not found.");
    }
    if (!card) {
      throw new Error("Card is required after chocing hit.");
    }
    this.currentCardSet.add(card);
  }

  /**
   * Change handling card set to next one.
   * Notice that the handling card may be undefined.
   */
  public switchCardSet(): boolean {
    if (this._currentCardSetIndex >= this._cardSets.length) {
      return false;
    }
    this._currentCardSetIndex++;
    return true;
  }

  /**
   * Returns if the player is waiting for bet.
   */
  private canBet(): boolean {
    if (!this.currentCardSet) {
      return true;
    }
    return this._cardSets.length === 1 && this.currentCardSet.canBet();
  }

  /**
   * Returns if the player's card set can be splitted according to split constraints.
   */
  private canSplit(): boolean {
    if (!this.currentCardSet) {
      throw new Error("Current card set nout found.");
    }
    return this._splitConstraint.canSplit(this._cardSets, this.currentCardSet);
  }

  /**
   * Returns if the player's card set can be doubled according to double constraints.
   */
  private canDouble(): boolean {
    if (!this.currentCardSet) {
      throw new Error("Current card set nout found.");
    }
    return this.currentCardSet.canDouble;
  }
}
