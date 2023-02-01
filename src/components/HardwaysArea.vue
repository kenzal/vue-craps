<template>
    <div>
        <div class="title" @click.prevent="allToggle" @contextmenu.prevent="allFollow">Hardways</div>
        <div class="hardways-props">
            <hardways-box v-model="bet6" @update-bet="updateBet"/>
            <hardways-box v-model="bet8"  @update-bet="updateBet"/>
            <hardways-box v-model="bet4"  @update-bet="updateBet"/>
            <hardways-box v-model="bet10" @update-bet="updateBet" />
        </div>
    </div>
</template>

<script setup lang="ts">
import HardwaysBox from '@/components/HardwaysBox.vue';
import { onUpdated, PropType, reactive } from 'vue';
import { BetMethods, BetSignatureHardway, findBet } from '@/compostables/Bets';
import { BetType } from '@/enums/BetType';
import { BetStatus } from '@/enums/BetStatus';

const hardwayList: (4 | 6 | 8 | 10)[] = [6, 8, 4, 10];

const props = defineProps({
    initialBets: {
        type: Array as PropType<BetSignatureHardway[]>,
        default() {
            return [];
        },
    },
    increment: {
        type: Number,
        default: 1,
    },
});
interface HardwayBetsObject {
    4?: BetSignatureHardway;
    6?: BetSignatureHardway;
    8?: BetSignatureHardway;
    10?: BetSignatureHardway;
}
const found: HardwayBetsObject = {};
const bets: HardwayBetsObject = {};
hardwayList.forEach((hardway) => {
    const empty: BetSignatureHardway = {
        ...BetMethods[BetType.HARDWAY],
        type: BetType.HARDWAY,
        placement: Number(hardway) as 4 | 6 | 8 | 10,
        wager: 0,
        override_puck: null,
    };
    found[hardway] = (findBet(props.initialBets, BetType.HARDWAY, Number(hardway) as 4 | 6 | 8 | 10) ??
        {}) as BetSignatureHardway;
    bets[hardway] = Object.assign(found[hardway] as BetSignatureHardway, Object.assign({}, empty, found[hardway]));
});
const bet4 = reactive<BetSignatureHardway>(bets[4]);
const bet6 = reactive<BetSignatureHardway>(bets[6]);
const bet8 = reactive<BetSignatureHardway>(bets[8]);
const bet10 = reactive<BetSignatureHardway>(bets[10]);

const allFollow = (): void => {
    [bet4, bet6, bet8, bet10].forEach((bet: BetSignatureHardway) => (bet.override_puck = null));
};
const emit = defineEmits(['updateBets']);

const updateBet = (bet: BetSignatureHardway) => {
  emit('updateBets', bet)
};
const updateBets = () => {
    [bet4, bet6, bet8, bet10].forEach((bet: BetSignatureHardway) => emit('updateBets', bet));
};
onUpdated(() => updateBets());
const allToggle = (): void => {
    const found = [bet4, bet6, bet8, bet10].filter(
        (bet: BetSignatureHardway) => bet.override_puck === null || bet.override_puck === BetStatus.OFF,
    );
    if (found.length) {
        [bet4, bet6, bet8, bet10].forEach((bet: BetSignatureHardway) => (bet.override_puck = BetStatus.ON));
    } else {
        [bet4, bet6, bet8, bet10].forEach((bet: BetSignatureHardway) => (bet.override_puck = BetStatus.OFF));
    }
    updateBets();
};
</script>

<style scoped>
.title {
    text-align: center;
    width: 100%;
    border: 1px solid white;
    font-weight: bold;
}
.hardways-props {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
}
</style>
