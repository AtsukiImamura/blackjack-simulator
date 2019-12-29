import DoubleConstraint from "./rules/double/DoubleConstraint";
import SplitConstraint from "./rules/split/SplitConstraint";
import NumberCountRuleBase from "./rules/count/NumberCountRuleBase";
import BasicNumberCountRule from "./rules/count/BasicNumberCountRule";
import BettingPolicy from "./policies/betting/BettingPolicy";
import ImamBettingPolicy from "./policies/betting/ImamBettingPolicy";
import SurrenderConstraintBase, {
  EarlySurrender
} from "./rules/surrender/SurrenderConstraintBase";
import HeaulisticCounting from "./policies/counting/HeaulisticCounting";

class TableContext {
  private _doubleConstraint: DoubleConstraint = new DoubleConstraint();

  private _splitConstraint: SplitConstraint = new SplitConstraint();

  private _countingType: NumberCountRuleBase = new BasicNumberCountRule();

  private _surrenderConstraint: SurrenderConstraintBase = new EarlySurrender();

  private _bettingPolicy: BettingPolicy = new ImamBettingPolicy(
    new HeaulisticCounting()
  );

  public setMaxSplitNum(num: number) {
    this._splitConstraint = new SplitConstraint(num);
  }

  public get splitRule(): SplitConstraint {
    return this._splitConstraint;
  }

  public setBettingPolicy(policyType: BettingPolicy) {
    this._bettingPolicy = policyType;
  }

  public get bettingPolicy(): BettingPolicy {
    return this._bettingPolicy;
  }

  public setCountingType<T extends NumberCountRuleBase>(countingType: T) {
    this._countingType = countingType;
  }

  public get countingType(): NumberCountRuleBase {
    return this._countingType;
  }

  public get surrenderConstraint(): SurrenderConstraintBase {
    return this._surrenderConstraint;
  }

  public set surrenderConstraint(constraint: SurrenderConstraintBase) {
    this._surrenderConstraint = constraint;
  }

  public get doubleConstraint(): DoubleConstraint {
    return this._doubleConstraint;
  }

  public set doubleConstraint(constraint: DoubleConstraint) {
    this._doubleConstraint = constraint;
  }
}

export default new TableContext();
