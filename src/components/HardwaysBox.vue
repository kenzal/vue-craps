<template>
    <div class="hardway-box">
        <craps-dice :dice-set="[pips, pips]" color="orange" />
        <div class="odds">{{ [4, 10].includes(bet.placement) ? 7 : 9 }}:1</div>
        <bet-box-new v-model="bet" :increment="increment" @update-bet="updateBet" :min="1" :wager-toggle="bet.override_puck" class="bet-box" />
    </div>
</template>

<script setup lang="ts">
import CrapsDice from '@/components/CrapsDice.vue';
import type { ComputedRef, PropType } from 'vue';
import {computed, unref} from 'vue';
import type { BetSignatureHardway } from '@/compostables/Bets';
import BetBoxNew from '@/components/BetBoxNew.vue';
const emit = defineEmits(['updateBet','update:modelValue']);

const props = defineProps({
    modelValue: {
        type: Object as PropType<BetSignatureHardway>,
        required: true,
    },
    increment: {
        type: Number,
        default: 1,
    },
});

const bet = computed<BetSignatureHardway>({
    get() {
        return props.modelValue;
    },
    set(value) {
        return emit('update:modelValue', value);
    },
});

const updateBet = (bet: BetSignatureHardway) => {
  emit('updateBet', unref(bet))
}
const pips: ComputedRef<2 | 3 | 4 | 5> = computed(() => Math.floor(bet.value.placement / 2) as 2 | 3 | 4 | 5);
</script>

<style scoped>
.hardway-box {
    display: grid;
    justify-content: center;
    align-content: center;
    text-align: center;
    border: 1px solid white;
}
.odds {
    width: 100%;
    text-align: center;
}
.hardway-box > .bet-box {
    position: absolute;
    z-index: 9;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
