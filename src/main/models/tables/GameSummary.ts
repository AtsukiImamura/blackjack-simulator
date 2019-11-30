import { Action } from "../../constants/GameConstants";
import Card from "../cards/Card";

export default class GameSummary {
  // private _points: number[] = [0];

  private _turns: TurnSummary[];

  private _currentTurn: TurnSummary | undefined;

  public get points(): number[] {
    let cur = 0;
    const points: number[] = [];
    for (const turn of this._turns) {
      cur += turn.diff;
      points.push(cur);
    }
    return points;
  }

  public addDealerPoint(point: number) {
    if (!this._currentTurn) {
      throw new Error("Current Turn not found. Why?");
    }
    this._currentTurn.dealerPoint = point;
  }

  public addInitialCard(card: Card) {
    if (!this._currentTurn) {
      this._currentTurn = new TurnSummary();
    }
    this._currentTurn.addInitialCard(card);
  }

  public get turns(): TurnSummary[] {
    return this._turns;
  }

  constructor() {
    this._turns = [];
  }

  public addAction(action: Action) {
    if (!this._currentTurn) {
      this._currentTurn = new TurnSummary();
    }
    this._currentTurn.addAction(action);
  }

  public addCard(card: Card | undefined) {
    if (!this._currentTurn) {
      throw new Error(
        "Curent Turn not found, but the method called. Call 'addAction' first."
      );
    }
    this._currentTurn.addCard(card);
  }

  public finishTurn(diff: number) {
    if (!this._currentTurn) {
      throw new Error("Current Turn not found. Why?");
    }
    this._currentTurn.diff = diff;
    this._turns.push(this._currentTurn);
    this._currentTurn = undefined;
  }
}

export class TurnSummary {
  private _dealerPoint: number = 0;

  private _actions: ActionSummary[] = [];

  private _initialCards: Card[] = [];

  private _diff: number = 0;

  public get dealerPoint(): number {
    return this._dealerPoint;
  }

  public set dealerPoint(point: number) {
    if (this._dealerPoint) {
      return;
    }
    this._dealerPoint = point;
  }

  public get diff(): number {
    return this._diff;
  }

  public set diff(diff: number) {
    if (this._diff !== 0) {
      return;
    }
    this._diff = diff;
  }

  public addInitialCard(card: Card) {
    this._initialCards.push(card);
  }

  public get initialCards(): Card[] {
    return this._initialCards;
  }

  public get actions(): ActionSummary[] {
    return this._actions;
  }

  public addAction(action: Action) {
    this._actions.push(new ActionSummary(action));
  }

  public addCard(card: Card | undefined) {
    if (this._actions.length === 0) {
      throw new Error("No action found in summary. Can not add card.");
    }
    this._actions[this._actions.length - 1].setCard(card);
  }
}

export class ActionSummary {
  private _action: Action;

  private _card: Card | undefined;

  public get action(): string {
    return Action[this._action];
  }

  public get card(): Card | undefined {
    return this._card;
  }

  public setCard(card: Card | undefined) {
    this._card = card;
  }

  constructor(action: Action = Action.NONE) {
    this._action = action;
  }
}
