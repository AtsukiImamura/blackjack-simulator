import { Action } from "./GameConstants";

export enum CardCombination {
  OUT_OF_RANGE = 0,

  HIGH = -1,

  LOW = -2,

  S18 = 118,

  S17 = 117,

  S16 = 116,

  S15 = 115,

  S14 = 114,

  S13 = 113,

  S12 = 112,

  // H4 = 4,

  // H5 = 5,

  // H6 = 6,

  // H7 = 7,

  // H8 = 8,

  H9 = 9,

  H10 = 10,

  H11 = 11,

  H12 = 12,

  H13 = 13,

  H14 = 14,

  H15 = 15,

  H16 = 16,

  P4 = 1002,

  P6 = 1003,

  P8 = 1004,

  P10 = 1005,

  P12 = 1006,

  P14 = 1007,

  P16 = 1008,

  P18 = 1009,

  P20 = 1010,

  PA = 1021
}

const BasicStrategy: Map<CardCombination, { [key: number]: Action }> = new Map<
  CardCombination,
  { [key: number]: Action }
>();
BasicStrategy.set(CardCombination.H9, {
  2: Action.HIT,
  3: Action.DOUBLE,
  4: Action.DOUBLE,
  5: Action.DOUBLE,
  6: Action.DOUBLE,
  7: Action.HIT,
  8: Action.HIT,
  9: Action.HIT,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.H10, {
  2: Action.DOUBLE,
  3: Action.DOUBLE,
  4: Action.DOUBLE,
  5: Action.DOUBLE,
  6: Action.DOUBLE,
  7: Action.DOUBLE,
  8: Action.DOUBLE,
  9: Action.DOUBLE,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.H11, {
  2: Action.DOUBLE,
  3: Action.DOUBLE,
  4: Action.DOUBLE,
  5: Action.DOUBLE,
  6: Action.DOUBLE,
  7: Action.DOUBLE,
  8: Action.DOUBLE,
  9: Action.DOUBLE,
  10: Action.DOUBLE,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.H12, {
  2: Action.HIT,
  3: Action.HIT,
  4: Action.STAY,
  5: Action.STAY,
  6: Action.STAY,
  7: Action.HIT,
  8: Action.HIT,
  9: Action.HIT,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.H13, {
  2: Action.STAY,
  3: Action.STAY,
  4: Action.STAY,
  5: Action.STAY,
  6: Action.STAY,
  7: Action.HIT,
  8: Action.HIT,
  9: Action.HIT,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.H14, {
  2: Action.STAY,
  3: Action.STAY,
  4: Action.STAY,
  5: Action.STAY,
  6: Action.STAY,
  7: Action.HIT,
  8: Action.HIT,
  9: Action.HIT,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.H15, {
  2: Action.STAY,
  3: Action.STAY,
  4: Action.STAY,
  5: Action.STAY,
  6: Action.STAY,
  7: Action.HIT,
  8: Action.HIT,
  9: Action.HIT,
  10: Action.SURRENDER,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.H16, {
  2: Action.STAY,
  3: Action.STAY,
  4: Action.STAY,
  5: Action.STAY,
  6: Action.STAY,
  7: Action.HIT,
  8: Action.HIT,
  9: Action.SURRENDER,
  10: Action.SURRENDER,
  1: Action.SURRENDER
});
BasicStrategy.set(CardCombination.HIGH, {
  2: Action.STAY,
  3: Action.STAY,
  4: Action.STAY,
  5: Action.STAY,
  6: Action.STAY,
  7: Action.STAY,
  8: Action.STAY,
  9: Action.STAY,
  10: Action.STAY,
  1: Action.STAY
});

BasicStrategy.set(CardCombination.S13, {
  2: Action.HIT,
  3: Action.HIT,
  4: Action.HIT,
  5: Action.DOUBLE,
  6: Action.DOUBLE,
  7: Action.HIT,
  8: Action.HIT,
  9: Action.HIT,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.S14, {
  2: Action.HIT,
  3: Action.HIT,
  4: Action.HIT,
  5: Action.DOUBLE,
  6: Action.DOUBLE,
  7: Action.HIT,
  8: Action.HIT,
  9: Action.HIT,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.S15, {
  2: Action.HIT,
  3: Action.HIT,
  4: Action.DOUBLE,
  5: Action.DOUBLE,
  6: Action.DOUBLE,
  7: Action.HIT,
  8: Action.HIT,
  9: Action.HIT,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.S16, {
  2: Action.HIT,
  3: Action.HIT,
  4: Action.DOUBLE,
  5: Action.DOUBLE,
  6: Action.DOUBLE,
  7: Action.HIT,
  8: Action.HIT,
  9: Action.HIT,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.S17, {
  2: Action.HIT,
  3: Action.DOUBLE,
  4: Action.DOUBLE,
  5: Action.DOUBLE,
  6: Action.DOUBLE,
  7: Action.HIT,
  8: Action.HIT,
  9: Action.HIT,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.S18, {
  2: Action.STAY,
  3: Action.DOUBLE,
  4: Action.DOUBLE,
  5: Action.DOUBLE,
  6: Action.DOUBLE,
  7: Action.STAY,
  8: Action.STAY,
  9: Action.HIT,
  10: Action.HIT,
  1: Action.HIT
});

BasicStrategy.set(CardCombination.P4, {
  2: Action.HIT,
  3: Action.HIT,
  4: Action.SPLIT,
  5: Action.SPLIT,
  6: Action.SPLIT,
  7: Action.SPLIT,
  8: Action.HIT,
  9: Action.HIT,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.P6, {
  2: Action.HIT,
  3: Action.HIT,
  4: Action.SPLIT,
  5: Action.SPLIT,
  6: Action.SPLIT,
  7: Action.SPLIT,
  8: Action.HIT,
  9: Action.HIT,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.P8, {
  2: Action.HIT,
  3: Action.HIT,
  4: Action.HIT,
  5: Action.HIT,
  6: Action.HIT,
  7: Action.HIT,
  8: Action.HIT,
  9: Action.HIT,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.P10, {
  2: Action.DOUBLE,
  3: Action.DOUBLE,
  4: Action.DOUBLE,
  5: Action.DOUBLE,
  6: Action.DOUBLE,
  7: Action.DOUBLE,
  8: Action.DOUBLE,
  9: Action.DOUBLE,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.P12, {
  2: Action.HIT,
  3: Action.SPLIT,
  4: Action.SPLIT,
  5: Action.SPLIT,
  6: Action.SPLIT,
  7: Action.HIT,
  8: Action.HIT,
  9: Action.HIT,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.P14, {
  2: Action.SPLIT,
  3: Action.SPLIT,
  4: Action.SPLIT,
  5: Action.SPLIT,
  6: Action.SPLIT,
  7: Action.SPLIT,
  8: Action.HIT,
  9: Action.HIT,
  10: Action.HIT,
  1: Action.HIT
});
BasicStrategy.set(CardCombination.P16, {
  2: Action.SPLIT,
  3: Action.SPLIT,
  4: Action.SPLIT,
  5: Action.SPLIT,
  6: Action.SPLIT,
  7: Action.SPLIT,
  8: Action.SPLIT,
  9: Action.SPLIT,
  10: Action.SPLIT,
  1: Action.SPLIT
});
BasicStrategy.set(CardCombination.P18, {
  2: Action.SPLIT,
  3: Action.SPLIT,
  4: Action.SPLIT,
  5: Action.SPLIT,
  6: Action.SPLIT,
  7: Action.STAY,
  8: Action.SPLIT,
  9: Action.SPLIT,
  10: Action.STAY,
  1: Action.STAY
});
BasicStrategy.set(CardCombination.P20, {
  2: Action.STAY,
  3: Action.STAY,
  4: Action.STAY,
  5: Action.STAY,
  6: Action.STAY,
  7: Action.STAY,
  8: Action.STAY,
  9: Action.STAY,
  10: Action.STAY,
  1: Action.STAY
});
BasicStrategy.set(CardCombination.PA, {
  2: Action.SPLIT,
  3: Action.SPLIT,
  4: Action.SPLIT,
  5: Action.SPLIT,
  6: Action.SPLIT,
  7: Action.SPLIT,
  8: Action.SPLIT,
  9: Action.SPLIT,
  10: Action.SPLIT,
  1: Action.SPLIT
});

export default BasicStrategy;
