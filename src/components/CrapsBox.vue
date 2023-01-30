<script lang="ts" setup>
import BetBoxNew from "@/components/BetBoxNew.vue";

import { ref } from "vue";
import type { PropType } from "vue";
import type {
  BetSignature,
  BetSignatureBuy,
  BetSignatureCome,
  BetSignatureDontCome,
  BetSignatureLay,
  BetSignaturePlace,
} from "@/compostables/Bets";
import {
  BetMethods,
  findBet,
  fnMaxOddsDarkSide,
  fnMaxOddsLightSide,
} from "@/compostables/Bets";
import { BetType } from "@/enums/BetType";
import type { PlacementBoxNumbers } from "@/compostables/Config";
import { CurrentTableConfig } from "@/compostables/Config";

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
  if (buyBet.value.wager) bets.push(buyBet.value);
  if (placeBet.value.wager) bets.push(placeBet.value);
  if (comeBet.value.wager) bets.push(comeBet.value);
  if (layBet.value.wager) bets.push(layBet.value);
  if (dontComeBet.value.wager) bets.push(dontComeBet.value);
  return bets;
};

const emptyDontCome = {
  type: BetType.DONT_COME,
  ...BetMethods[BetType.DONT_COME],
  maxOdds: fnMaxOddsDarkSide,
  wager: 0,
  odds: 0,
  placement: props.boxNumber,
};
const emptyLay = {
  type: BetType.LAY,
  ...BetMethods[BetType.LAY],
  wager: 0,
  placement: props.boxNumber,
};
const emptyCome = {
  type: BetType.COME,
  ...BetMethods[BetType.COME],
  maxOdds: fnMaxOddsLightSide,
  wager: 0,
  odds: 0,
  placement: props.boxNumber,
};
const emptyPlace = {
  type: BetType.PLACE,
  ...BetMethods[BetType.PLACE],
  wager: 0,
  placement: props.boxNumber,
  override_puck: null,
};
const emptyBuy = {
  type: BetType.BUY,
  ...BetMethods[BetType.BUY],
  wager: 0,
  placement: props.boxNumber,
  override_puck: null,
};
const existingDontCome =
  findBet(props.initialBets, BetType.DONT_COME, props.boxNumber) ?? {};
const existingLay =
  findBet(props.initialBets, BetType.LAY, props.boxNumber) ?? {};
const existingCome =
  findBet(props.initialBets, BetType.COME, props.boxNumber) ?? {};
const existingPlace =
  findBet(props.initialBets, BetType.PLACE, props.boxNumber) ?? {};
const existingBuy =
  findBet(props.initialBets, BetType.BUY, props.boxNumber) ?? {};

const dontComeBet = ref<BetSignatureDontCome>(
  Object.assign(emptyDontCome, existingDontCome) as BetSignatureDontCome
);
const layBet = ref<BetSignatureLay>(
  Object.assign(emptyLay, existingLay) as BetSignatureLay
);
const comeBet = ref<BetSignatureCome>(
  Object.assign(emptyCome, existingCome) as BetSignatureCome
);
const placeBet = ref<BetSignaturePlace>(
  Object.assign(emptyPlace, existingPlace) as BetSignaturePlace
);
const buyBet = ref<BetSignatureBuy>(
  Object.assign(emptyBuy, existingBuy) as BetSignatureBuy
);

defineExpose({ getBets });
</script>
<template>
  <div class="CrapsBox">
    <bet-box-new
      v-model="dontComeBet"
      :increment="increment"
      class="full-box"
    />
    <bet-box-new v-model="layBet" :increment="increment" class="full-box" />
    <div class="name-box full-box">
      {{ boxNumber === 6 ? "Six" : boxNumber === 9 ? "Nine" : boxNumber }}
      <img
        v-if="CurrentTableConfig.puck_location === props.boxNumber"
        alt="ON"
        class="puck"
        src="@/assets/puck-on.svg"
      />
    </div>
    <bet-box-new v-model="comeBet" :increment="increment" class="full-box" />
    <bet-box-new v-model="placeBet" :increment="increment" class="half-box" />
    <bet-box-new
      v-if="buyAllowed"
      v-model="buyBet"
      :increment="increment"
      class="half-box"
    />
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
  justify-content: center;
}

.puck {
  width: 50px;
}
</style>
