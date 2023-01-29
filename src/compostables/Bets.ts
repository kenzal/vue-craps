import type {
  CrapsConfig,
  DiceRoll,
  Placement,
  PlacementBoxNumbers,
  PlacementHorn,
} from "@/compostables/Config";
import { CurrentTableConfig } from "@/compostables/Config";
import { BetType } from "@/enums/BetType";
import type { BetStatus } from "@/enums/BetStatus";
import type { MaxOdds, MaxOddsStandard } from "@/compostables/MaxOdds";

const trueOddsList = {
  2: 6,
  3: 3,
  4: 2,
  5: 3 / 2,
  6: 6 / 5,
  8: 6 / 5,
  9: 3 / 2,
  10: 2,
  11: 3,
  12: 6,
};

export interface IBetOptions {
  readonly hasOdds: boolean;
  readonly allowOverride: boolean;
  readonly hasPlacement: boolean;
  readonly hasVig: boolean;

  readonly [key: string]: boolean;
}

interface BetSignatureBasic {
  readonly type: BetType;
  wager: number;
  payout?: number;
  getOptions(): IBetOptions;
  canIncrease(): boolean;
  canDecrease(): boolean;
}

interface withOdds {
  odds: number;
  maxOdds(): number;
}

interface withOverride {
  override_puck: BetStatus | null;
}

interface withPlacement {
  placement: Placement | null;
}

interface withVig extends BetSignatureBasic {
  vig_paid?: number;
}

const BetOptions: { [key in BetType]: IBetOptions } = {
  [BetType.ANY_CRAPS]: {
    hasOdds: false,
    allowOverride: false,
    hasPlacement: false,
    hasVig: false,
  },
  [BetType.ANY_SEVEN]: {
    hasOdds: false,
    allowOverride: false,
    hasPlacement: false,
    hasVig: false,
  },
  [BetType.BUY]: {
    hasOdds: false,
    allowOverride: true,
    hasPlacement: true,
    hasVig: true,
  },
  [BetType.C_AND_E]: {
    hasOdds: false,
    allowOverride: false,
    hasPlacement: false,
    hasVig: false,
  },
  [BetType.COME]: {
    hasOdds: true,
    allowOverride: false,
    hasPlacement: true,
    hasVig: false,
  },
  [BetType.CRAPS_3_WAY]: {
    hasOdds: false,
    allowOverride: false,
    hasPlacement: false,
    hasVig: false,
  },
  [BetType.DONT_COME]: {
    hasOdds: true,
    allowOverride: false,
    hasPlacement: true,
    hasVig: false,
  },
  [BetType.DONT_PASS]: {
    hasOdds: true,
    allowOverride: false,
    hasPlacement: true,
    hasVig: false,
  },
  [BetType.FIELD]: {
    hasOdds: false,
    allowOverride: false,
    hasPlacement: false,
    hasVig: false,
  },
  [BetType.HARDWAY]: {
    hasOdds: false,
    allowOverride: true,
    hasPlacement: true,
    hasVig: false,
  },
  [BetType.HOP]: {
    hasOdds: false,
    allowOverride: false,
    hasPlacement: true,
    hasVig: false,
  },
  [BetType.HORN]: {
    hasOdds: false,
    allowOverride: false,
    hasPlacement: false,
    hasVig: false,
  },
  [BetType.HORN_HIGH]: {
    hasOdds: false,
    allowOverride: false,
    hasPlacement: true,
    hasVig: false,
  },
  [BetType.LAY]: {
    hasOdds: false,
    allowOverride: false,
    hasPlacement: true,
    hasVig: true,
  },
  [BetType.PASS_LINE]: {
    hasOdds: true,
    allowOverride: false,
    hasPlacement: true,
    hasVig: false,
  },
  [BetType.PLACE]: {
    hasOdds: false,
    allowOverride: true,
    hasPlacement: true,
    hasVig: false,
  },
  [BetType.PUT]: {
    hasOdds: true,
    allowOverride: true,
    hasPlacement: true,
    hasVig: false,
  },
  [BetType.WORLD]: {
    hasOdds: false,
    allowOverride: false,
    hasPlacement: false,
    hasVig: false,
  },
};

const fnGetOptions = function (this: BetSignatureBasic) {
  return BetOptions[this.type];
};

export const fnMaxOddsLightSide = function (
  this:
    | BetSignatureCome
    | BetSignaturePassLine
    | BetSignaturePut
    | BetSignatureDontCome
    | BetSignatureDontPass
): number {
  if (this.placement !== undefined && this.wager !== undefined) {
    const placement = this.placement as PlacementBoxNumbers;
    const config = CurrentTableConfig.value as CrapsConfig;
    const maxOddsSet = config.table.maxOdds as MaxOdds;
    const maxOdds = maxOddsSet[placement] as number;
    const wager = this.wager as number;
    return Math.floor(maxOdds * wager);
  }
  return 0;
};

export const fnMaxOddsDarkSide = function (
  this: BetSignatureDontCome | BetSignatureDontPass
): number {
  if (typeof this.placement !== "number" || this.wager === undefined) return 0;
  const lightSideMax = fnMaxOddsLightSide.bind(this)();
  console.log(lightSideMax);
  const trueOdds = trueOddsList[this.placement];
  return Math.floor(lightSideMax * trueOdds);
};

export const BetMethods: {
  [key in BetType]: {
    getOptions(): IBetOptions;
    canIncrease(): boolean;
    canDecrease(): boolean;
    canRemove(): boolean;
  };
} = {
  [BetType.ANY_CRAPS]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(): boolean {
      return true;
    },
    canRemove(): boolean {
      return true;
    },
  },
  [BetType.ANY_SEVEN]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(): boolean {
      return true;
    },
    canRemove(): boolean {
      return true;
    },
  },
  [BetType.BUY]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(): boolean {
      return true;
    },
    canRemove(): boolean {
      return true;
    },
  },
  [BetType.C_AND_E]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(): boolean {
      return true;
    },
    canRemove(): boolean {
      return true;
    },
  },
  [BetType.COME]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(this: withPlacement): boolean {
      return this.placement === null;
    },
    canRemove(this: withPlacement): boolean {
      return this.placement === null;
    },
  },
  [BetType.CRAPS_3_WAY]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(): boolean {
      return true;
    },
    canRemove(): boolean {
      return true;
    },
  },
  [BetType.DONT_COME]: {
    getOptions: fnGetOptions,
    canIncrease(this: withPlacement): boolean {
      return this.placement === null;
    },
    canDecrease(): boolean {
      return true;
    },
    canRemove(): boolean {
      return true;
    },
  },
  [BetType.DONT_PASS]: {
    getOptions: fnGetOptions,
    canIncrease(this: withPlacement): boolean {
      return this.placement === null;
    },
    canDecrease(): boolean {
      return true;
    },
    canRemove(): boolean {
      return true;
    },
  },
  [BetType.FIELD]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(): boolean {
      return true;
    },
    canRemove(): boolean {
      return true;
    },
  },
  [BetType.HARDWAY]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(): boolean {
      return true;
    },
    canRemove(): boolean {
      return true;
    },
  },
  [BetType.HOP]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(): boolean {
      return true;
    },
    canRemove(): boolean {
      return true;
    },
  },
  [BetType.HORN]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(): boolean {
      return true;
    },
    canRemove(): boolean {
      return true;
    },
  },
  [BetType.HORN_HIGH]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(): boolean {
      return true;
    },
    canRemove(): boolean {
      return true;
    },
  },
  [BetType.LAY]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(): boolean {
      return true;
    },
    canRemove(): boolean {
      return true;
    },
  },
  [BetType.PASS_LINE]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(this: withPlacement): boolean {
      return this.placement === null;
    },
    canRemove(this: withPlacement): boolean {
      return this.placement === null;
    },
  },
  [BetType.PLACE]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(): boolean {
      return true;
    },
    canRemove(): boolean {
      return true;
    },
  },
  [BetType.PUT]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(this: withPlacement): boolean {
      return this.placement === null;
    },
    canRemove(this: withPlacement): boolean {
      return this.placement === null;
    },
  },
  [BetType.WORLD]: {
    getOptions: fnGetOptions,
    canIncrease(): boolean {
      return true;
    },
    canDecrease(): boolean {
      return true;
    },
    canRemove(): boolean {
      return true;
    },
  },
};

export interface BetSignatureAnyCraps extends BetSignatureBasic {
  type: BetType.ANY_CRAPS;
}

export interface BetSignatureAnySeven extends BetSignatureBasic {
  type: BetType.ANY_SEVEN;
}

export interface BetSignatureBuy
  extends BetSignatureBasic,
    withOverride,
    withPlacement,
    withVig {
  type: BetType.BUY;
  placement: Placement;
}

export interface BetSignatureCE extends BetSignatureBasic {
  type: BetType.C_AND_E;
}

export interface BetSignatureCome
  extends BetSignatureBasic,
    withOdds,
    withPlacement {
  type: BetType.COME;
}

export interface BetSignatureCraps3Way extends BetSignatureBasic {
  type: BetType.CRAPS_3_WAY;
}

export interface BetSignatureDontCome
  extends BetSignatureBasic,
    withOdds,
    withPlacement {
  type: BetType.DONT_COME;
}

export interface BetSignatureDontPass
  extends BetSignatureBasic,
    withOdds,
    withPlacement {
  type: BetType.DONT_PASS;
}

export interface BetSignatureField extends BetSignatureBasic {
  type: BetType.FIELD;
}

export interface BetSignatureHardway
  extends BetSignatureBasic,
    withPlacement,
    withOverride {
  type: BetType.HARDWAY;
  placement: PlacementHorn;
}

export interface BetSignatureHop extends BetSignatureBasic, withPlacement {
  type: BetType.HOP;
  placement: DiceRoll;
}

export interface BetSignatureHorn extends BetSignatureBasic {
  type: BetType.HORN;
}

export interface BetSignatureHornHigh extends BetSignatureBasic, withPlacement {
  type: BetType.HORN_HIGH;
  placement: PlacementHorn;
}

export interface BetSignatureLay
  extends BetSignatureBasic,
    withPlacement,
    withVig {
  type: BetType.LAY;
}

export interface BetSignaturePassLine
  extends BetSignatureBasic,
    withOdds,
    withPlacement {
  type: BetType.PASS_LINE;
}

export interface BetSignaturePlace
  extends BetSignatureBasic,
    withOverride,
    withPlacement {
  type: BetType.PLACE;
  placement: Placement;
}

export interface BetSignaturePut
  extends BetSignatureBasic,
    withOdds,
    withOverride,
    withPlacement {
  type: BetType.PUT;
  placement: Placement;
}

export interface BetSignatureWorld extends BetSignatureBasic {
  type: BetType.WORLD;
}

export type BetSignature =
  | BetSignatureAnyCraps
  | BetSignatureAnySeven
  | BetSignatureBuy
  | BetSignatureCE
  | BetSignatureCome
  | BetSignatureCraps3Way
  | BetSignatureDontCome
  | BetSignatureDontPass
  | BetSignatureField
  | BetSignatureHardway
  | BetSignatureHop
  | BetSignatureHorn
  | BetSignatureHornHigh
  | BetSignatureLay
  | BetSignaturePassLine
  | BetSignaturePlace
  | BetSignaturePut
  | BetSignatureWorld;

export function findBet(
  list: BetSignature[],
  type: BetType,
  placement: Placement | null = null
): BetSignature | undefined {
  const allOfType = list.filter((bet) => bet.type === type);
  if (BetOptions[type].hasPlacement)
    return allOfType
      .filter((bet) => "placement" in bet && bet.placement === placement)
      .pop();
  return allOfType.pop();
}
