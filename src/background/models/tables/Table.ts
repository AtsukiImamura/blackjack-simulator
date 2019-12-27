import Dealer from "../person/Dealer";
import Player from "../person/Player";
import Card from "../cards/Card";
import GameSummary from "./GameSummary";

export default class Table {
  public static readonly MAX_PLAYER_NUM = 6;

  protected _players: Player[] = [];

  protected _dealer: Dealer;

  protected _allCards: Card[] = [];

  protected _summaries: { [uid: string]: GameSummary } = {};

  public get summaries(): GameSummary[] {
    return Object.values(this._summaries);
  }

  public get allCards(): Card[] {
    return this._allCards;
  }

  public get dealerPoint(): number {
    const sums = this._dealer.sums;
    if (sums.length !== 1) {
      throw new Error("Something wrong with length of sum of the dealer.");
    }
    return sums[0];
  }

  public get dealerUpCard(): Card | undefined {
    return this._dealer.upCard;
  }

  constructor(dealer: Dealer = new Dealer(), players: Player[] = []) {
    if (players.length >= Table.MAX_PLAYER_NUM) {
      throw new Error(
        `Too many players were found. Number of player must be less than ${Table.MAX_PLAYER_NUM +
          1}`
      );
    }
    this._players = players;
    this._dealer = dealer;
  }
}
