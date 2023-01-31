<template>
  <div class="hardway-box">
    <craps-dice :dice-set="[pips, pips]" />
    <div class="odds">S:T</div>
  </div>
</template>

<script setup lang="ts">
import CrapsDice from "@/components/CrapsDice.vue";
import type { ComputedRef, PropType } from "vue";
import { computed } from "vue";

const props = defineProps({
  value: {
    type: Number as PropType<4 | 6 | 8 | 10>,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});
const pips: ComputedRef<2 | 3 | 4 | 5> = computed(
  () => Math.floor(props.value / 2) as 2 | 3 | 4 | 5
);
</script>

<style scoped>
.hardway-box {
  display: grid;
  justify-content: center;
  align-content: center;
  text-align: center;
}
.odds {
  width: 100%;
  text-align: center;
}
</style>
