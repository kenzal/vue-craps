<script lang="ts" setup>
import BetBoxNew from '@/components/BetBoxNew.vue';

import { onUpdated, reactive } from 'vue';
import type { PropType } from 'vue';
import type {
    BetSignature,
    BetSignatureBuy,
    BetSignatureCome,
    BetSignatureDontCome,
    BetSignatureLay,
    BetSignaturePlace,
} from '@/compostables/Bets';
import { BetMethods, findBet, fnMaxOddsDarkSide, fnMaxOddsLightSide } from '@/compostables/Bets';
import { BetType } from '@/enums/BetType';
import type { PlacementBoxNumbers } from '@/compostables/Config';
import { CurrentTableConfig } from '@/compostables/Config';
import CrapsPuck from '@/components/CrapsPuck.vue';

const props = defineProps({
    boxNumber: {
        type: Number as PropType<PlacementBoxNumbers>,
        required: true,
    },
    maxOdds: {
        type: Number,
        default: 0,
    },
    minBet: {
        type: Number,
        default: 0,
    },
    increment: {
        type: Number,
        default: 1,
    },
    buyAllowed: {
        type: Boolean,
        default: false,
    },
    initialBets: {
        type: Array as PropType<BetSignature[]>,
        default() {
            return [];
        },
    },
});
const getBets = function (): BetSignature[] {
    let bets = [] as BetSignature[];
    if (buyBet.wager) bets.push(buyBet);
    if (placeBet.wager) bets.push(placeBet);
    if (comeBet.wager) bets.push(comeBet);
    if (layBet.wager) bets.push(layBet);
    if (dontComeBet.wager) bets.push(dontComeBet);
    return bets;
};

const emptyDontCome: BetSignatureDontCome = {
    type: BetType.DONT_COME,
    ...BetMethods[BetType.DONT_COME],
    maxOdds: fnMaxOddsDarkSide,
    wager: 0,
    odds: 0,
    placement: props.boxNumber,
};
const emptyLay: BetSignatureLay = {
    type: BetType.LAY,
    ...BetMethods[BetType.LAY],
    wager: 0,
    placement: props.boxNumber,
};
const emptyCome: BetSignatureCome = {
    type: BetType.COME,
    ...BetMethods[BetType.COME],
    maxOdds: fnMaxOddsLightSide,
    wager: 0,
    odds: 0,
    placement: props.boxNumber,
};
const emptyPlace: BetSignaturePlace = {
    type: BetType.PLACE,
    ...BetMethods[BetType.PLACE],
    wager: 0,
    placement: props.boxNumber,
    override_puck: null,
};
const emptyBuy: BetSignatureBuy = {
    type: BetType.BUY,
    ...BetMethods[BetType.BUY],
    wager: 0,
    placement: props.boxNumber,
    override_puck: null,
};
const existingDontCome = findBet(props.initialBets, BetType.DONT_COME, props.boxNumber) ?? {};
const existingLay = findBet(props.initialBets, BetType.LAY, props.boxNumber) ?? {};
const existingCome = findBet(props.initialBets, BetType.COME, props.boxNumber) ?? {};
const existingPlace = findBet(props.initialBets, BetType.PLACE, props.boxNumber) ?? {};
const existingBuy = findBet(props.initialBets, BetType.BUY, props.boxNumber) ?? {};

const dontComeBet: BetSignatureDontCome = reactive(
    Object.assign(existingDontCome, Object.assign(emptyDontCome, existingDontCome)),
);
const layBet: BetSignatureLay = reactive(Object.assign(existingLay, Object.assign(emptyLay, existingLay)));
const comeBet: BetSignatureCome = reactive(Object.assign(existingCome, Object.assign(emptyCome, existingCome)));
const placeBet: BetSignaturePlace = reactive(Object.assign(existingPlace, Object.assign(emptyPlace, existingPlace)));
const buyBet: BetSignatureBuy = reactive(Object.assign(existingBuy, Object.assign(emptyBuy, existingBuy)));
const emit = defineEmits(['updateBets']);
onUpdated(() => {
    emit('updateBets', dontComeBet);
    emit('updateBets', layBet);
    emit('updateBets', comeBet);
    emit('updateBets', placeBet);
    emit('updateBets', buyBet);
});
defineExpose({ getBets });
</script>
<template>
    <div class="CrapsBox">
        <bet-box-new v-model="dontComeBet" :increment="increment" class="full-box" />
        <bet-box-new v-model="layBet" :increment="increment" class="full-box" />
        <div class="name-box full-box">
            <p :class="[6, 9].includes(boxNumber) ? 'name' : 'number'">
                {{ boxNumber === 6 ? 'Six' : boxNumber === 9 ? 'Nine' : boxNumber }}
            </p>
            <div class="puckBox">
                <craps-puck
                    v-if="CurrentTableConfig.puck_location === props.boxNumber"
                    :location="CurrentTableConfig.puck_location"
                    class="puck"
                />
            </div>
        </div>
        <bet-box-new v-model="comeBet" :increment="increment" class="full-box" />
        <bet-box-new
            v-model="placeBet"
            :increment="increment"
            :wager-toggle="placeBet.override_puck"
            class="half-box"
        />
        <bet-box-new
            v-if="buyAllowed"
            v-model="buyBet"
            :increment="increment"
            :min="20"
            :wager-toggle="buyBet.override_puck"
            class="half-box"
        />
    </div>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.CrapsBox {
    width: 100%;
    border: 1px solid white;
    display: grid;
    float: left;
    color: white;
    grid-template-columns: [col] 50% [col] 50%;
    grid-column-end: span 2;
}

.CrapsBox > div {
    height: 7ex;
    width: 100%;
    display: inline-grid;
    text-align: center;
    border: 1px solid white;
    vertical-align: bottom;
}

.full-box {
    width: 100%;
    grid-column: col / span 2;
}

.half-box {
    width: 50%;
}

.bet-box {
    display: flex;
    justify-items: center;
}

.name-box {
    display: flex;
    font-size: xx-large;
    justify-content: center;
    align-items: center;
}
.name-box .name {
    transform: rotate(-35deg);
}

.puckBox {
    position: absolute;
    bottom: 0;
    display: block;
    height: 50px;
    width: 100%;
    left: 0;
}
.puck {
    max-width: 50px;
    max-height: 50px;
}
</style>
