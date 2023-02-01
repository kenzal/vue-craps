import { CrapsTypes } from '@/enums/CrapsTypes';

export interface MaxOddsStandard {
    [key: number]: number;
    4: number;
    5: number;
    6: number;
    8: number;
    9: number;
    10: number;
}

export interface MaxOddsCrapless {
    [key: number]: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    8: number;
    9: number;
    10: number;
    11: number;
    12: number;
}

export type MaxOdds = MaxOddsStandard | MaxOddsCrapless;

const maxOdds345: MaxOddsStandard = { 4: 3, 5: 4, 6: 5, 8: 5, 9: 4, 10: 3 };

const flatOdds = function (odds: number, isCrapless: CrapsTypes = CrapsTypes.Standard): MaxOdds {
    let maxOdds = { 4: odds, 5: odds, 6: odds, 8: odds, 9: odds, 10: odds };
    if (isCrapless) {
        maxOdds = {
            2: odds,
            3: odds,
            ...maxOdds,
            11: odds,
            12: odds,
        } as MaxOddsCrapless;
    }
    return maxOdds;
};

export { maxOdds345, flatOdds };
