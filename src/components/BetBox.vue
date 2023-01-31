<template>
  <div
    class="bet-box"
    @click.prevent="increase"
    @contextmenu.prevent="decrease"
  >
    <span v-if="$slots.default" class="name"><slot></slot></span>
    <gaming-chip
      v-if="modelValue"
      class="wager"
      :value="modelValue"
      />
  </div>
</template>

<script setup>
import { watch } from "vue";
import GamingChip from "@/components/GamingChip.vue";

const emit = defineEmits(["update:modelValue"]);

const increase = () => {
  if (props.locked || props.noIncrease) return;
  emit(
    "update:modelValue",
    Math.min(props.max, Math.max(props.min, props.modelValue + props.increment))
  );
};
const decrease = () => {
  if (props.locked || props.noDecrease) return;
  let value = Math.max(0, props.modelValue - props.increment);
  if (props.min && value < props.min) value = 0;
  emit("update:modelValue", value);
};

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: Infinity,
  },
  min: {
    type: Number,
    default: 0,
  },
  increment: {
    type: Number,
    default: 1,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  noDecrease: {
    type: Boolean,
    default: false,
  },
  noIncrease: {
    type: Boolean,
    default: false,
  },
});
watch(
  () => props.max,
  (newMax) => {
    if (newMax < props.modelValue)
      emit("update:modelValue", Math.min(newMax.valueOf(), props.modelValue));
  }
);
</script>

<style scoped>
.bet-box * {
  pointer-events: none;
}
</style>
