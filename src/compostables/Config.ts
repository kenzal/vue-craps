import { CrapsTypes } from '@/enums/CrapsTypes';
import type { MaxOddsCrapless, MaxOddsStandard } from '@/compostables/MaxOdds';
import { maxOdds345 } from '@/compostables/MaxOdds';
import type { BetSignature } from '@/compostables/Bets';
import { reactive } from 'vue';
import { BetStatus } from '@/enums/BetStatus';

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
export type PlacementHardways = 2 | 4 | 6 | 8 | 10 | 12;
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

export const CurrentTableConfig = reactive<CrapsConfigStandard>({
    puck_location: 4,
    table: {
        isCrapless: CrapsTypes.Standard,
        maxOdds: maxOdds345,
        bet_min: 5,
    },
    existing_bets: [
        // @ts-ignore
        { type: 'PassLine', wager: 5, placement: 4 },
        // @ts-ignore
        { type: 'DontCome', wager: 5, placement: 6, odds: 10 },
        // @ts-ignore
        // { type: "Place", wager: 5, placement: 4 },
        // @ts-ignore
        { type: 'Place', wager: 5, placement: 5 },
        // @ts-ignore
        { type: 'Hardway', wager: 6, placement: 6, override_puck: BetStatus.OFF },
        // @ts-ignore
        { type: 'Place', wager: 6, placement: 8 },
        // @ts-ignore
        { type: 'Place', wager: 5, placement: 9 },
        // @ts-ignore
        { type: 'Place', wager: 5, placement: 10 },
        // @ts-ignore
        { type: 'Hop', wager: 1, placement: [1, 3] },
        // @ts-ignore
        { type: 'AnySeven', wager: 1 },
    ],
});
