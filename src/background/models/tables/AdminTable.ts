import Table from "./Table";
import Player from "../person/Player";
import BaseCardDispensor from "../dispensors/BaseCardDispensor";
import Dealer from "../person/Dealer";
import SnailsCardDispensor from "../dispensors/SnailsCardDispensor";
import { Action } from "../../constants/GameConstants";
import Card from "../cards/Card";
import GameSummary from "./GameSummary";
import TableContext from "../../options/TableContext";
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
      this.addPlayer(
        new Player(
          TableContext.bettingPolicy,
          TableContext.splitRule,
          TableContext.doubleConstraint,
          TableContext.surrenderConstraint
        )
      );
    }
  }

  public play(num: number): Promise<void> {
    const promise = Promise.resolve();
    for (let i = 0; i < num; i++) {
      promise.then(() => {
        return this.playOnce();
      });
    }
    promise.catch(err => {
      console.error(err);
    });
    return promise;
  }

  /**
   * Play game once, and then calcurate gained or losed coin of each players including dealer.
   */
  public playOnce(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._players.length === 0) {
        reject(
          "There is no player. Call addPlayer(player: Player) to add players in advance."
        );
        return;
      }

      // Every player decides how much they bet.

      // Pick cards at the begining of the game
      const cardRequireNum = this._players.length * 2 + 2;
      const cards = this._cardDispensor.batchNext(cardRequireNum);
      if (cards.length !== cardRequireNum) {
        reject("Error on batch get new cards.");
        return;
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
      for (const p of this._players) {
        p.lookCards(cards);
      }

      // When the dealder does not have black jack.
      if (!this._dealer.checkBlackJack()) {
        // Turn will come to every player
        const upCard = this.dealerUpCard;
        if (!upCard) {
          reject("Delader doesn't have up card.");
          return;
        }
        for (const player of this._players) {
          if (this.debug) {
            console.log("\n## start ##");
            console.log("upCard = " + upCard.number);
          }
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
            if (
              action === Action.DOUBLE ||
              action === Action.HIT ||
              action === Action.NEED
            ) {
              card = this._cardDispensor.next();
              if (!card) {
                reject("Can not pick new Card! E0001");
                return;
              }
              this._allCards.push(card);
            }
            this._summaries[player.uid].addCard(card);
            player.commitAction(card);
            for (const p of this._players) {
              p.lookCard(card);
            }
          }
        }

        // Dealer's turn
        while (this._dealer.decideAction() === Action.HIT) {
          const card = this._cardDispensor.next();
          if (!card) {
            reject("Can not pick new Card! E0002");
            return;
          }
          this._dealer.addCard(card);
          this._allCards.push(card);
          for (const p of this._players) {
            p.lookCard(card);
          }
        }
      }

      if (this.debug) {
        for (const p of this._players) {
          p.test__getCardSets().forEach(cs => console.log(cs));
        }
        console.log("dealer point = " + this._dealer.cardSet.highestSum);
      }

      // calcurate points
      for (const player of this._players) {
        const diff = player.summalize(this.asTable());
        if (this.debug) {
          console.log("diff = " + diff);
        }
        this._summaries[player.uid].addDealerCardSet(this._dealer.cardSet);
        this._summaries[player.uid].finishTurn(diff);
      }

      // the end of the game
      this._cardDispensor.refill();
      resolve();
    });
  }
}
