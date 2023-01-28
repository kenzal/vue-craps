import { ref } from "vue";

export function useChipDenominations() {
  return ref([1, 5, 25, 100, 500]);
}

export function useBestChip(value) {
  return Math.max.apply(
    null,
    useChipDenominations().value.filter((denomination) => denomination <= value)
  );
}
