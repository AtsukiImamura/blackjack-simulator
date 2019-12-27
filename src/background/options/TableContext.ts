import DoubleConstraintBase from "./rules/double/DoubleConstraintBase";
import BasicDoubleConstraint from "./rules/double/BasicDoubleConstraint";
import SplitConstraint from "./rules/split/SplitConstraint";
import NumberCountRuleBase from "./rules/count/NumberCountRuleBase";
import BasicNumberCountRule from "./rules/count/BasicNumberCountRule";
import BettingPolicy from "./policies/betting/BettingPolicy";
import ImamBettingPolicy from "./policies/betting/ImamBettingPolicy";

class TableContext {
  private _doubleRule: DoubleConstraintBase = new BasicDoubleConstraint();

  private _splitRule: SplitConstraint = new SplitConstraint();

  private _countingType: NumberCountRuleBase = new BasicNumberCountRule();

  //   private _surrenderPolicy: SurrenderPolicy = new SurrenderPolicy();

  private _bettingPolicy: BettingPolicy = new ImamBettingPolicy();

  public setMaxSplitNum(num: number) {
    this._splitRule = new SplitConstraint(num);
  }

  public setCanHitAfterSplit(value: boolean) {
    this._splitRule.canHitAfterSplit = value;
  }

  public setCanHitAfterSplitOnAce(value: boolean) {
    this._splitRule.canHitAfterSplitWithAce = value;
  }

  public get splitRule(): SplitConstraint {
    return this._splitRule;
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
}

export default new TableContext();
