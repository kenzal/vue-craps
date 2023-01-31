<!--suppress CssUnknownTarget -->
<script setup>
import CrapsBox from "@/components/CrapsBox.vue";
import BetBox from "@/components/BetBox.vue";
import { useChipDenominations } from "@/compostables/Chips";

import { ref } from "vue";
import {flatOdds, maxOdds345} from "@/compostables/MaxOdds";
import {CrapsTypes} from "@/enums/CrapsTypes";
import {CurrentTableConfig} from "@/compostables/Config";
import GamingChip from "@/components/GamingChip.vue";
import CrapsDie from "@/components/CrapsDie.vue";
import CrapsDice from "@/components/CrapsDice.vue";
import HardwaysArea from "@/components/HardwaysArea.vue";

const boxes = ref([]);

const come = ref(0);
const field = ref(0);
const dontPass = ref(0);
const dontPassOdds = ref(0);
const pass = ref(0);
const passOdds = ref(0);

const betSizes = useChipDenominations();
const increment = ref(1);
const minBet = 5;
const config = {
  maxOdds: flatOdds(2)
};

const previousResponse = JSON.parse(
  '{"new_table":{"config":{},"puck_location":4,"existing_bets":[{"type":"PassLine","wager":5,"placement":4},{"type":"DontCome","wager":5,"placement":6,"odds":10},{"type":"Place","wager":5,"placement":4},{"type":"Place","wager":5,"placement":5},{"type":"Place","wager":6,"placement":6,"override_puck":"OFF"},{"type":"Place","wager":6,"placement":8},{"type":"Place","wager":5,"placement":9},{"type":"Place","wager":5,"placement":10},{"type":"Hop","wager":1,"placement":[1,3]},{"type":"AnySeven","wager":1}]}}'
);

const setBetSize = function (betSize) {
  increment.value = betSize;
};

const collectCurrentBets = function () {
  let allBets = [];
  for (const boxIndex in boxes.value)
    allBets.push(...boxes.value[boxIndex].getBets());
  console.log(allBets);
};
</script>
<template>
  <div class="crapsTable">
    <craps-box
      v-for="(maxOdds, boxNum) in config.maxOdds"
      v-bind:key="boxNum"
      :increment="increment"
      :max-odds="maxOdds"
      :min-bet="[6, 8].includes(Number(boxNum)) ? (minBet / 5) * 6 : minBet"
      :box-number="Number(boxNum)"
      :buy-allowed="[4, 10].includes(Number(boxNum))"
      :initial-bets="
        previousResponse.new_table.existing_bets.filter(
          (bet) => bet.placement === Number(boxNum)
        )
      "
      ref="boxes"
    />
    <div class="dont-come">
      <span>Don't</span><span>Come</span><span>Bar</span><craps-dice :dice-set="[6,6]" size="30px" display="inline-block"/>
      <div class="puckBox">
      <img v-if="CurrentTableConfig.puck_location===null" src="@/assets/puck-off.svg" alt="OFF" class="puck"/>
      </div>
    </div>
    <hardways-area class="props-box"></hardways-area>
    <div class="props-box"><craps-dice :dice-set="[6,6]" size="50px" /></div>
    <div class="self-serve">
      <bet-box
        :increment="increment"
        v-model="come"
        :min="minBet"
        style="grid-column: col / span 2"
        name="comeLine"
        >Come</bet-box
      >
      <bet-box
        :increment="increment"
        v-model="field"
        :min="minBet"
        style="grid-column: col / span 2"
        name="fieldLine"
        >Field</bet-box
      >
      <bet-box
        :increment="increment"
        v-model="dontPass"
        :min="minBet"
        name="dontLine"
        style=""
        >Don't Pass Bar <craps-dice :dice-set="[6,6]" size="20px" display="inline-block"/></bet-box
      >
      <bet-box
        :increment="increment"
        v-model="dontPassOdds"
        name="dontLineOdds"
        locked
      ></bet-box>
      <bet-box
        :increment="increment"
        v-model="pass"
        :min="minBet"
        name="passLine"
        >Pass</bet-box
      >
      <bet-box
        :increment="increment"
        v-model="passOdds"
        name="passLineOdds"
        locked
      ></bet-box>
    </div>
  </div>
  <ul class="bet-select">
    <gaming-chip
        v-for="betSize in betSizes"
        v-bind:key="betSize"
        @click="setBetSize(betSize)"
        :value="betSize"
        height="50px"
        :selected="betSize == increment"
    >
      {{ betSize }}
    </gaming-chip>
  </ul>
  <button @click="collectCurrentBets">Test</button>
</template>

<style>
.crapsTable {
  display: grid;
  background-color: #35654d;
  grid-template-columns: repeat(13, 1fr);
  grid-template-rows: auto auto;
  grid-gap: 1ex;
  grid-template-areas:
    "b1 b2 b3 b4 b5 b6"
    "p1 p2 ss";
  height: 80%;
}
.props-box {
  border: 2px solid white;
  height: 100%;
  grid-column-end: span 3;
}
.self-serve {
  display: grid;
  border: 2px solid white;
  height: 20ex;
  grid-column-end: span 7;
  grid-template-columns: [col] 75% [col] 25%;
  grid-auto-rows: 1fr;
}
.self-serve .bet-box {
  display: grid;
  width: 100%;
  height: 5ex;
  border: 1px solid white;
  text-align: center;
  grid-template-columns: [col] 66% [col] 34%;
}
.self-serve .bet-box span {
  float: left;
  display: inline-grid;
  align-items: center;
  height: 100%;
  line-height: unset;
  vertical-align: middle;
}

.dont-come {
  width: 100%;
  border: 2px solid white;
  display: inline-block;
  float: left;
  color: white;
  text-align: center;
}
.dont-come span {
  width: 100%;
  display: block;
}
.bet-box {
  display: table;
}
.wager {
  color: blue;
  font-weight: bold;
  text-align: center;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bet-select {
  max-height: 60px;
  border: 2px solid white;
}
gaming-chip {
  height: 60px;
  width: 60px;
}

.bet-select {
  list-style-type: none;
  height: 60px;
  background-color: #35654d;
}
.bet-select li {
  width: 60px;
  height: 60px;
  line-height: 60px;
  vertical-align: center;
  float: left;
}
.dont-come .puckBox {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
.dont-come .puckBox .puck {
  width: auto;
  height: auto;
  max-width: 50px;
  max-height: 50px;
}
</style>
