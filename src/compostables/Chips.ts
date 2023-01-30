import { ref } from "vue";

export function useChipDenominations() {
  return ref([1, 5, 25, 100, 500]);
}

