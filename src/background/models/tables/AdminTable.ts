import Table from "./Table";
import Player from "../person/Player";
import BaseCardDispensor from "../dispensors/BaseCardDispensor";
import Dealer from "../person/Dealer";
import SnailsCardDispensor from "../dispensors/SnailsCardDispensor";
import { Action } from "../../constants/GameConstants";
import Card from "../cards/Card";
import GameSummary from "./GameSummary";
const uuid = require("uuid");

export default class AdminTable extends Table {
  protected _cardDispensor: BaseCardDispensor;

  private debug = false;

  /**
   * テーブルとして返す
   */
  public asTable(): Table {
    return this as Table;
  }

  constructor(
    dealer: Dealer = new Dealer(),
    players: Player[] = [],
    cardDispensor: BaseCardDispensor = new SnailsCardDispensor()
  ) {
    super(dealer, players);
    this._cardDispensor = cardDispensor;
  }

  // public init(): void {}

  /**
   * Add player. Can not too many players (more than maximum size).
   * @param player
   */
  public addPlayer(player: Player): void {
    if (this._players.length >= Table.MAX_PLAYER_NUM) {
      throw new Error(
        `Table is already full. ${this._players.length} players are there.`
      );
    }
    // player.uid =
    const uid = uuid.v4();
    player.uid = uid;

    this._players.push(player);
    this._summaries[uid] = new GameSummary();
  }

  public addDefaultPlayers(num: number) {
    for (let i = 0; i < num; i++) {
      this.addPlayer(new Player());
    }
  }

  public play(num: number) {
    for (let i = 0; i < num; i++) {
      this.playOnce();
    }
  }

  /**
   * Play game once, and then calcurate gained or losed coin of each players including dealer.
   */
  public playOnce(): void {
    if (this._players.length === 0) {
      throw new Error(
        "There is no player. Call addPlayer(player: Player) to add players in advance."
      );
    }

    // Every player decides how much they bet.

    // Pick cards at the begining of the game
    const cardRequireNum = this._players.length * 2 + 2;
    const cards = this._cardDispensor.batchNext(cardRequireNum);
    if (cards.length !== cardRequireNum) {
      throw new Error("Error on batch get new cards.");
    }
    let cnt = 0;
    for (const player of this._players) {
      player.reset();
      const amount = player.bet();
      {
        const card = cards[cnt];
        this._summaries[player.uid].addInitialCard(card);
        player.addCard(card);
      }
      {
        const card = cards[this._players.length + cnt];
        this._summaries[player.uid].addInitialCard(card);
        player.addCard(card);
      }
      this._summaries[player.uid].setBetAmount(amount);
      cnt++;
    }

    this._dealer.reset();
    this._dealer.addCard(cards[this._players.length]);
    this._dealer.addCard(cards[this._players.length * 2]);

    this._allCards = cards;

    // A turn will come to every player
    const upCard = this.dealerUpCard;
    if (!upCard) {
      throw new Error("Delader doesn't have up card.");
    }
    // console.log("\n#");
    for (const player of this._players) {
      if (this.debug) {
        console.log("\n## start ##");
        console.log("upCard = " + upCard.number);
      }
      // player.doctor();
      while (true) {
        const action = player.decideAction(upCard);
        if (this.debug) {
          player.test__getCardSets().forEach(cs => console.log("  ", cs));
        }

        if (action === Action.NONE) {
          break;
        }
        this._summaries[player.uid].addAction(action);

        let card: Card | undefined = undefined;
        switch (action) {
          case Action.DOUBLE:
          case Action.HIT:
            card = this._cardDispensor.next();
            if (!card) {
              throw new Error("Can not pick new Card! E0001");
            }
            this._allCards.push(card);
          default:
        }
        this._summaries[player.uid].addCard(card);
        player.commitAction(card);
      }
    }

    // Dealer's turn
    while (this._dealer.decideAction() === Action.HIT) {
      const card = this._cardDispensor.next();
      if (!card) {
        throw new Error("Can not pick new Card! E0002");
      }
      this._dealer.addCard(card);
      this._allCards.push(card);
    }

    if (this.debug) {
      for (const p of this._players) {
        p.test__getCardSets().forEach(cs => console.log(cs));
      }
      console.log("dealer point = " + this.dealerPoint);
    }

    // calcurate points
    for (const player of this._players) {
      const diff = player.summalize(this.asTable());
      if (this.debug) {
        console.log("diff = " + diff);
      }
      this._summaries[player.uid].addDealerPoint(this.dealerPoint);
      this._summaries[player.uid].finishTurn(diff);
    }

    // the end of the game
    this._cardDispensor.refill();
  }
}
