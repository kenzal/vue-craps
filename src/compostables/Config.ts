import { CrapsTypes } from "@/enums/CrapsTypes";
import type { MaxOddsCrapless, MaxOddsStandard } from "@/compostables/MaxOdds";
import type { BetSignature } from "@/compostables/Bets";
import { ref } from "vue";
import { maxOdds345 } from "@/compostables/MaxOdds";

interface TableConfigStandard {
  isCrapless: CrapsTypes.Standard;
  maxOdds: MaxOddsStandard;
  bet_min: number;
}
interface TableConfigCrapless {
  isCrapless: CrapsTypes.Crapless;
  maxOdds: MaxOddsCrapless;
  bet_min: number;
  place_2_12_odds: [number, number];
  place_3_11_odds: [number, number];
}

export type TableConfig = TableConfigStandard | TableConfigCrapless;

export type PlacementStandard = 4 | 5 | 6 | 8 | 9 | 10;
export type PlacementHorn = 2 | 3 | 11 | 12;
export type PlacementCrapless = PlacementStandard | PlacementHorn;
export type PlacementBoxNumbers = PlacementStandard | PlacementHorn;
export type DiceRoll = [1 | 2 | 3 | 4 | 5 | 6, 1 | 2 | 3 | 4 | 5 | 6];
export type Placement = PlacementStandard | PlacementCrapless | DiceRoll;

export interface CrapsConfigStandard {
  table: TableConfigStandard;
  puck_location: PlacementStandard | null;
  existing_bets?: BetSignature[];
}
export interface CrapsConfigCrapless {
  table: TableConfigCrapless;
  puck_location: PlacementCrapless | null;
  existing_bets?: BetSignature[];
}
export type CrapsConfig = CrapsConfigStandard | CrapsConfigCrapless;

export const CurrentTableConfig = ref<CrapsConfigStandard>({
  puck_location: null,
  table: {
    isCrapless: CrapsTypes.Standard,
    maxOdds: maxOdds345,
    bet_min: 5,
  },
  existing_bets: [],
});

