<script setup>
import BetBox from "@/components/BetBox.vue";

import { onBeforeMount, ref } from "vue";

const props = defineProps({
  boxNumber: {
    type: Number,
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
    type: Array,
    default() {
      return [];
    },
  },
});
const getBets = function () {
  let bets = [];
  if (place.value)
    bets.push({
      type: "Place",
      wager: place.value,
      placement: props.boxNumber,
    });
  if (buy.value)
    bets.push({ type: "Buy", wager: buy.value, placement: props.boxNumber });
  if (come.value)
    bets.push({
      type: "Come",
      wager: come.value,
      odds: comeOdds.value,
      placement: props.boxNumber,
    });
  if (lay.value)
    bets.push({ type: "Lay", wager: lay.value, placement: props.boxNumber });
  if (dont.value)
    bets.push({
      type: "DontCome",
      wager: dont.value,
      odds: dontOdds.value,
      placement: props.boxNumber,
    });
  return bets;
};

const dont = ref(0);
const dontOdds = ref(0);
const lay = ref(0);
const come = ref(0);
const comeOdds = ref(0);
const place = ref(0);
const buy = ref(0);
const trueOdds = {
  4: 2,
  5: 3 / 2,
  6: 6 / 5,
  8: 6 / 5,
  9: 3 / 2,
  10: 2,
};

onBeforeMount(() => {
  const initDont = props.initialBets
    .filter((bet) => bet.type === "DontCome")
    .pop();
  const initLay = props.initialBets.filter((bet) => bet.type === "Lay").pop();
  const initCome = props.initialBets.filter((bet) => bet.type === "Come").pop();
  const initPlace = props.initialBets
    .filter((bet) => bet.type === "Place")
    .pop();
  const initBuy = props.initialBets.filter((bet) => bet.type === "Buy").pop();
  if (initDont) {
    dont.value = initDont.wager;
    dontOdds.value = initDont.odds ?? 0;
  }
  if (initCome) {
    come.value = initCome.wager;
    comeOdds.value = initCome.odds ?? 0;
  }
  if (initLay) lay.value = initLay.wager;
  if (initPlace) place.value = initPlace.wager;
  if (initBuy) buy.value = initBuy.wager;
});

defineExpose({ getBets });
</script>
<template>
  <div class="CrapsBox">
    <bet-box v-model="dont" :increment="increment" class="half-box" no-increase>
      Dont
    </bet-box>
    <bet-box
      v-model="dontOdds"
      :increment="increment"
      :max="Math.floor(maxOdds * dont * trueOdds[boxNumber])"
      class="half-box"
    >
      Odds
    </bet-box>
    <bet-box
      v-model="lay"
      :increment="increment"
      :min="minBet"
      class="full-box"
    >
      Lay
    </bet-box>
    <div class="name-box full-box">
      {{ boxNumber === 6 ? "Six" : boxNumber === 9 ? "Nine" : boxNumber }}
    </div>
    <bet-box
      v-model="come"
      :increment="increment"
      :min="minBet"
      class="half-box"
      no-decrease
    >
      Come
    </bet-box>
    <bet-box
      v-model="comeOdds"
      :increment="increment"
      :max="come.valueOf() * maxOdds"
      class="half-box"
    >
      Odds
    </bet-box>
    <bet-box
      v-model="place"
      :increment="increment"
      :min="minBet"
      class="half-box"
    >
      Place
    </bet-box>
    <bet-box
      v-if="buyAllowed"
      v-model="buy"
      :increment="increment"
      :min="Math.max(minBet, 20)"
      class="half-box"
    >
      Buy
    </bet-box>
  </div>
</template>

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

.CrapsBox div {
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
  flex: 1;
}

.name-box {
  font-size: xx-large;
}
</style>
