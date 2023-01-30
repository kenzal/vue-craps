<!--suppress CssUnknownTarget -->
<script setup>
import CrapsBox from "@/components/CrapsBox.vue";
import BetBox from "@/components/BetBox.vue";
import { useChipDenominations } from "@/compostables/Chips";

import { ref } from "vue";
import {flatOdds, maxOdds345} from "@/compostables/MaxOdds";
import {CrapsTypes} from "@/enums/CrapsTypes";
import {CurrentTableConfig} from "@/compostables/Config";

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
      <span>Don't</span><span>Come</span><span>Bar</span><span>12</span>
      <img v-if="CurrentTableConfig.puck_location===null" src="@/assets/puck-off.svg" alt="OFF" class="puck"/>
    </div>
    <div class="props-box"></div>
    <div class="props-box"></div>
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
        >Don't Pass Bar 12</bet-box
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
    <li
        v-for="betSize in betSizes"
        v-bind:key="betSize"
        @click="setBetSize(betSize)"
        :class="'wager chip-' + betSize"
    >
      {{ betSize }}
    </li>
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

.chip-1 {
  color: blue;
  background-image: url("data:image/svg+xml,%3Csvg fill='azure' height='60px' width='60px' version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 296.477 296.477' xml:space='preserve'%3E%3Cg%3E%3Ccircle cx='148.2385' cy='148.2385' r='148.2385' fill='blue'/%3E%3Cpath d='M244.63,35.621c-21.771-18.635-47.382-29.855-73.767-33.902C121.871-5.797,70.223,11.421,35.622,51.847 c-53.236,62.198-45.972,155.773,16.226,209.01c21.771,18.634,47.381,29.853,73.766,33.901 c48.991,7.517,100.641-9.703,135.241-50.13C314.091,182.431,306.826,88.856,244.63,35.621z M273.361,191.241l-45.305-15.618 c6.102-17.803,6.028-37.107,0.014-54.724l45.257-15.575c3.577,10.453,5.862,21.429,6.74,32.741 C281.489,156.374,279.152,174.388,273.361,191.241z M275.905,104.058c0-0.003,0-0.005,0-0.008 C275.905,104.053,275.905,104.055,275.905,104.058z M247.935,61.472l-36.069,31.332c-2.669-3.055-5.579-5.961-8.752-8.677 c-11.467-9.814-24.81-15.995-38.637-18.692l9.095-46.741c22.33,4.33,43.21,14.294,60.635,29.209 C239.147,52.131,243.728,56.669,247.935,61.472z M103.251,23.983c6.428-2.315,13.021-4.109,19.71-5.388l9.087,46.843 c-17.789,3.467-34.584,12.651-47.393,27.341L48.55,61.38C63.334,44.416,82.206,31.568,103.251,23.983z M23.124,105.236 l45.297,15.617c-6.102,17.803-6.028,37.105-0.015,54.723l-45.295,15.588c-3.562-10.441-5.837-21.4-6.713-32.688 C14.976,140.151,17.32,122.11,23.124,105.236z M48.467,235.066l36.145-31.395c2.669,3.056,5.58,5.964,8.754,8.68 c11.466,9.814,24.808,15.993,38.634,18.691l-9.143,46.997c-22.325-4.348-43.185-14.422-60.604-29.333 C57.288,244.458,52.689,239.898,48.467,235.066z M193.203,272.635c-6.409,2.309-12.986,4.11-19.658,5.403l-9.117-47 c17.789-3.467,34.585-12.651,47.394-27.342l36.121,31.409C233.154,252.087,214.257,265.047,193.203,272.635z'/%3E%3C/g%3E%3C/svg%3E");
}
.chip-5 {
  color: white;
  background-image: url("data:image/svg+xml,%3Csvg fill='firebrick' height='60px' width='60px' version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 296.477 296.477' xml:space='preserve'%3E%3Cg%3E%3Ccircle cx='148.2385' cy='148.2385' r='148.2385' fill='white'/%3E%3Cpath d='M244.63,35.621c-21.771-18.635-47.382-29.855-73.767-33.902C121.871-5.797,70.223,11.421,35.622,51.847 c-53.236,62.198-45.972,155.773,16.226,209.01c21.771,18.634,47.381,29.853,73.766,33.901 c48.991,7.517,100.641-9.703,135.241-50.13C314.091,182.431,306.826,88.856,244.63,35.621z M273.361,191.241l-45.305-15.618 c6.102-17.803,6.028-37.107,0.014-54.724l45.257-15.575c3.577,10.453,5.862,21.429,6.74,32.741 C281.489,156.374,279.152,174.388,273.361,191.241z M275.905,104.058c0-0.003,0-0.005,0-0.008 C275.905,104.053,275.905,104.055,275.905,104.058z M247.935,61.472l-36.069,31.332c-2.669-3.055-5.579-5.961-8.752-8.677 c-11.467-9.814-24.81-15.995-38.637-18.692l9.095-46.741c22.33,4.33,43.21,14.294,60.635,29.209 C239.147,52.131,243.728,56.669,247.935,61.472z M103.251,23.983c6.428-2.315,13.021-4.109,19.71-5.388l9.087,46.843 c-17.789,3.467-34.584,12.651-47.393,27.341L48.55,61.38C63.334,44.416,82.206,31.568,103.251,23.983z M23.124,105.236 l45.297,15.617c-6.102,17.803-6.028,37.105-0.015,54.723l-45.295,15.588c-3.562-10.441-5.837-21.4-6.713-32.688 C14.976,140.151,17.32,122.11,23.124,105.236z M48.467,235.066l36.145-31.395c2.669,3.056,5.58,5.964,8.754,8.68 c11.466,9.814,24.808,15.993,38.634,18.691l-9.143,46.997c-22.325-4.348-43.185-14.422-60.604-29.333 C57.288,244.458,52.689,239.898,48.467,235.066z M193.203,272.635c-6.409,2.309-12.986,4.11-19.658,5.403l-9.117-47 c17.789-3.467,34.585-12.651,47.394-27.342l36.121,31.409C233.154,252.087,214.257,265.047,193.203,272.635z'/%3E%3C/g%3E%3C/svg%3E");
}
.chip-25 {
  color: white;
  background-image: url("data:image/svg+xml,%3Csvg fill='forestgreen' height='60px' width='60px' version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 296.477 296.477' xml:space='preserve'%3E%3Cg%3E%3Ccircle cx='148.2385' cy='148.2385' r='148.2385' fill='white'/%3E%3Cpath d='M244.63,35.621c-21.771-18.635-47.382-29.855-73.767-33.902C121.871-5.797,70.223,11.421,35.622,51.847 c-53.236,62.198-45.972,155.773,16.226,209.01c21.771,18.634,47.381,29.853,73.766,33.901 c48.991,7.517,100.641-9.703,135.241-50.13C314.091,182.431,306.826,88.856,244.63,35.621z M273.361,191.241l-45.305-15.618 c6.102-17.803,6.028-37.107,0.014-54.724l45.257-15.575c3.577,10.453,5.862,21.429,6.74,32.741 C281.489,156.374,279.152,174.388,273.361,191.241z M275.905,104.058c0-0.003,0-0.005,0-0.008 C275.905,104.053,275.905,104.055,275.905,104.058z M247.935,61.472l-36.069,31.332c-2.669-3.055-5.579-5.961-8.752-8.677 c-11.467-9.814-24.81-15.995-38.637-18.692l9.095-46.741c22.33,4.33,43.21,14.294,60.635,29.209 C239.147,52.131,243.728,56.669,247.935,61.472z M103.251,23.983c6.428-2.315,13.021-4.109,19.71-5.388l9.087,46.843 c-17.789,3.467-34.584,12.651-47.393,27.341L48.55,61.38C63.334,44.416,82.206,31.568,103.251,23.983z M23.124,105.236 l45.297,15.617c-6.102,17.803-6.028,37.105-0.015,54.723l-45.295,15.588c-3.562-10.441-5.837-21.4-6.713-32.688 C14.976,140.151,17.32,122.11,23.124,105.236z M48.467,235.066l36.145-31.395c2.669,3.056,5.58,5.964,8.754,8.68 c11.466,9.814,24.808,15.993,38.634,18.691l-9.143,46.997c-22.325-4.348-43.185-14.422-60.604-29.333 C57.288,244.458,52.689,239.898,48.467,235.066z M193.203,272.635c-6.409,2.309-12.986,4.11-19.658,5.403l-9.117-47 c17.789-3.467,34.585-12.651,47.394-27.342l36.121,31.409C233.154,252.087,214.257,265.047,193.203,272.635z'/%3E%3C/g%3E%3C/svg%3E");
}
.chip-100 {
  color: white;
  background-image: url("data:image/svg+xml,%3Csvg fill='black' height='60px' width='60px' version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 296.477 296.477' xml:space='preserve'%3E%3Cg%3E%3Ccircle cx='148.2385' cy='148.2385' r='148.2385' fill='white'/%3E%3Cpath d='M244.63,35.621c-21.771-18.635-47.382-29.855-73.767-33.902C121.871-5.797,70.223,11.421,35.622,51.847 c-53.236,62.198-45.972,155.773,16.226,209.01c21.771,18.634,47.381,29.853,73.766,33.901 c48.991,7.517,100.641-9.703,135.241-50.13C314.091,182.431,306.826,88.856,244.63,35.621z M273.361,191.241l-45.305-15.618 c6.102-17.803,6.028-37.107,0.014-54.724l45.257-15.575c3.577,10.453,5.862,21.429,6.74,32.741 C281.489,156.374,279.152,174.388,273.361,191.241z M275.905,104.058c0-0.003,0-0.005,0-0.008 C275.905,104.053,275.905,104.055,275.905,104.058z M247.935,61.472l-36.069,31.332c-2.669-3.055-5.579-5.961-8.752-8.677 c-11.467-9.814-24.81-15.995-38.637-18.692l9.095-46.741c22.33,4.33,43.21,14.294,60.635,29.209 C239.147,52.131,243.728,56.669,247.935,61.472z M103.251,23.983c6.428-2.315,13.021-4.109,19.71-5.388l9.087,46.843 c-17.789,3.467-34.584,12.651-47.393,27.341L48.55,61.38C63.334,44.416,82.206,31.568,103.251,23.983z M23.124,105.236 l45.297,15.617c-6.102,17.803-6.028,37.105-0.015,54.723l-45.295,15.588c-3.562-10.441-5.837-21.4-6.713-32.688 C14.976,140.151,17.32,122.11,23.124,105.236z M48.467,235.066l36.145-31.395c2.669,3.056,5.58,5.964,8.754,8.68 c11.466,9.814,24.808,15.993,38.634,18.691l-9.143,46.997c-22.325-4.348-43.185-14.422-60.604-29.333 C57.288,244.458,52.689,239.898,48.467,235.066z M193.203,272.635c-6.409,2.309-12.986,4.11-19.658,5.403l-9.117-47 c17.789-3.467,34.585-12.651,47.394-27.342l36.121,31.409C233.154,252.087,214.257,265.047,193.203,272.635z'/%3E%3C/g%3E%3C/svg%3E");
}
.chip-500 {
  color: white;
  background-image: url("data:image/svg+xml,%3Csvg fill='indigo' height='60px' width='60px' version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 296.477 296.477' xml:space='preserve'%3E%3Cg%3E%3Ccircle cx='148.2385' cy='148.2385' r='148.2385' fill='white'/%3E%3Cpath d='M244.63,35.621c-21.771-18.635-47.382-29.855-73.767-33.902C121.871-5.797,70.223,11.421,35.622,51.847 c-53.236,62.198-45.972,155.773,16.226,209.01c21.771,18.634,47.381,29.853,73.766,33.901 c48.991,7.517,100.641-9.703,135.241-50.13C314.091,182.431,306.826,88.856,244.63,35.621z M273.361,191.241l-45.305-15.618 c6.102-17.803,6.028-37.107,0.014-54.724l45.257-15.575c3.577,10.453,5.862,21.429,6.74,32.741 C281.489,156.374,279.152,174.388,273.361,191.241z M275.905,104.058c0-0.003,0-0.005,0-0.008 C275.905,104.053,275.905,104.055,275.905,104.058z M247.935,61.472l-36.069,31.332c-2.669-3.055-5.579-5.961-8.752-8.677 c-11.467-9.814-24.81-15.995-38.637-18.692l9.095-46.741c22.33,4.33,43.21,14.294,60.635,29.209 C239.147,52.131,243.728,56.669,247.935,61.472z M103.251,23.983c6.428-2.315,13.021-4.109,19.71-5.388l9.087,46.843 c-17.789,3.467-34.584,12.651-47.393,27.341L48.55,61.38C63.334,44.416,82.206,31.568,103.251,23.983z M23.124,105.236 l45.297,15.617c-6.102,17.803-6.028,37.105-0.015,54.723l-45.295,15.588c-3.562-10.441-5.837-21.4-6.713-32.688 C14.976,140.151,17.32,122.11,23.124,105.236z M48.467,235.066l36.145-31.395c2.669,3.056,5.58,5.964,8.754,8.68 c11.466,9.814,24.808,15.993,38.634,18.691l-9.143,46.997c-22.325-4.348-43.185-14.422-60.604-29.333 C57.288,244.458,52.689,239.898,48.467,235.066z M193.203,272.635c-6.409,2.309-12.986,4.11-19.658,5.403l-9.117-47 c17.789-3.467,34.585-12.651,47.394-27.342l36.121,31.409C233.154,252.087,214.257,265.047,193.203,272.635z'/%3E%3C/g%3E%3C/svg%3E");
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
.dont-come .puck {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
