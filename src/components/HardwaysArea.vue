<template>
  <div>
    <div class="title">Hardways</div>
    <div class="hardways-props">
      <hardways-box
        v-for="(value, index) in hardwayList"
        v-bind:key="index"
        :value="value"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import HardwaysBox from "@/components/HardwaysBox.vue";

const hardwayList: (4 | 6 | 8 | 10)[] = [6, 8, 4, 10];
</script>

<style scoped>
.hardways-props{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

</style>
