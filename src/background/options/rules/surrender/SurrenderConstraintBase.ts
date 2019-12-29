import CardSet from "../../../models/cards/CardSet";

export default abstract class SurrenderConstraintBase {
  constructor() {}

  public canSurrender(targets: CardSet[]) {
    if (targets.length != 1) {
      return false;
    }
    return targets[0].cardNum === 2;
  }
}

export class EarlySurrender extends SurrenderConstraintBase {}

export class LateSurrender extends SurrenderConstraintBase {}
