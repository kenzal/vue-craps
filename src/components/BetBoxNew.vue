<template>
  <div
    class="bet-box"
    :class="bet.getOptions().hasOdds ? 'withOdds' : 'withoutOdds'"
  >
    <gaming-chip
      v-if="'wager' in bet"
      @click.prevent="increaseWager"
      @contextmenu.prevent="decreaseWager"
      class="wager"
      :chip-value="bet.wager"
    />
    <gaming-chip
      v-if="'odds' in bet"
      @click.prevent="increaseOdds"
      @contextmenu.prevent="decreaseOdds"
      class="wager odds"
      :chip-value="bet.odds"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { BetSignature } from "@/compostables/Bets";
import { computed } from "vue";
import { CurrentTableConfig } from "@/compostables/Config";
import GamingChip from "@/components/GamingChip.vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Object as PropType<BetSignature>,
    required: true,
  },
  increment: {
    type: Number,
    default: 1,
  },
});

const bet = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    return emit("update:modelValue", value);
  },
});

const increaseWager = (): void => {
  if (!bet.value.canIncrease()) return;
  const minWager = CurrentTableConfig.table.bet_min;
  bet.value.wager = Math.max(minWager, bet.value.wager + props.increment);
};
const increaseOdds = (): void => {
  if ("odds" in bet.value)
    bet.value.odds = Math.min(
      bet.value.maxOdds(),
      bet.value.odds + props.increment
    );
};
const decreaseWager = (): void => {
  bet.value.wager = Math.max(0, bet.value.wager - props.increment);
  const minWager = CurrentTableConfig.table.bet_min;
  if (minWager && bet.value.wager < minWager) bet.value.wager = 0;
  if ("odds" in bet.value)
    bet.value.odds = Math.min(bet.value.maxOdds(), bet.value.odds);
};
const decreaseOdds = (): void => {
  if ("odds" in bet.value)
    bet.value.odds = Math.max(0, bet.value.odds - props.increment);
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
</style>
