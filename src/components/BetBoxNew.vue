<template>
    <div
        class="bet-box"
        :class="bet.getOptions().hasOdds ? 'withOdds' : 'withoutOdds'"
        @click.prevent="increaseWager(true)"
    >
        <div class="wager-container">
            <gaming-chip
                v-if="'wager' in bet"
                @click.prevent="increaseWager(false)"
                @contextmenu.prevent="decreaseWager"
                class="wager"
                :value="bet.wager"
            />
            <craps-puck
                :status="wagerToggle"
                :allow-toggle="!(wagerToggle === undefined)"
                v-if="'wager' in bet && bet.wager"
                @toggleMe="toggleMe"
                @followMe="followMe"
                class="toggle-puck"
            />
        </div>
        <div class="odds-container">
            <gaming-chip
                v-if="'odds' in bet"
                @click.prevent="increaseOdds"
                @contextmenu.prevent="decreaseOdds"
                class="wager odds"
                :value="bet.odds"
            />
            <craps-puck
                :status="wagerToggle"
                v-if="oddsToggle"
                @toggleMe="toggleMe"
                @followMe="followMe"
                class="toggle-puck"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { BetSignature } from '@/compostables/Bets';
import { computed } from 'vue';
import { CurrentTableConfig } from '@/compostables/Config';
import GamingChip from '@/components/GamingChip.vue';
import { BetStatus } from '@/enums/BetStatus';
import CrapsPuck from '@/components/CrapsPuck.vue';

const emit = defineEmits(['updateBet', 'update:modelValue']);

const props = defineProps({
    modelValue: {
        type: Object as PropType<BetSignature>,
        required: true,
    },
    increment: {
        type: Number,
        default: 1,
    },
    min: {
        type: Number,
        default: undefined,
    },
    wagerToggle: {
        type: String as PropType<BetStatus | null>,
    },
    oddsToggle: {
        type: String as PropType<BetStatus | null>,
    },
});

const bet = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        return emit('update:modelValue', value);
    },
});
const toggleMe = (): void => {
    if (bet.value.getOptions().allowOverride)
        // @ts-ignore
        bet.value.override_puck = bet.value.override_puck == BetStatus.ON ? BetStatus.OFF : BetStatus.ON;
    emit('updateBet', bet);
};
const followMe = (): void => {
    if ('override_puck' in bet.value) bet.value.override_puck = null;
    emit('updateBet', bet);
};

const minWager = props.min ?? CurrentTableConfig.table.bet_min;

const increaseWager = (onlyIfZero = false): void => {
    if (!bet.value.canIncrease()) return;
    if (onlyIfZero && bet.value.wager) return;
    bet.value.wager = Math.max(minWager, bet.value.wager + props.increment);
    emit('updateBet', bet);
};
const increaseOdds = (): void => {
    if ('odds' in bet.value) bet.value.odds = Math.min(bet.value.maxOdds(), bet.value.odds + props.increment);
    emit('updateBet', bet);
};
const decreaseWager = (): void => {
    bet.value.wager = Math.max(0, bet.value.wager - props.increment);
    if (minWager && bet.value.wager < minWager) bet.value.wager = 0;
    if ('odds' in bet.value) bet.value.odds = Math.min(bet.value.maxOdds(), bet.value.odds);
    emit('updateBet', bet);
};
const decreaseOdds = (): void => {
    if ('odds' in bet.value) bet.value.odds = Math.max(0, bet.value.odds - props.increment);
    emit('updateBet', bet);
};
</script>

<style scoped>
.bet-box {
    display: grid;
}
.withOdds {
    grid-template-columns: [col] 50% [col] 50%;
}
.withoutOdds {
    grid-template-columns: [col] 100%;
}
.wager-container {
    width: fit-content;
}
.toggle-puck {
    width: 40%;
    z-index: 15;
    position: absolute;
    bottom: 0;
    left: 0;
}
</style>
