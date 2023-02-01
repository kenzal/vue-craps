<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <title lang="en">Die: {{ pips }} Pips</title>
        <g>
            <rect height="90" width="90" x="5" y="5" :fill="color" fill-opacity=".6"></rect>
            <rect height="90" width="90" x="5" y="5" :stroke="color" fill-opacity="0"></rect>
            <circle class="cc" v-if="[1, 3, 5].includes(pips)" r="10" cx="50" cy="50" fill="white"></circle>
            <circle class="tr" v-if="[2, 3, 4, 5, 6].includes(pips)" r="10" cx="75" cy="25" fill="white"></circle>
            <circle class="bl" v-if="[2, 3, 4, 5, 6].includes(pips)" r="10" cx="25" cy="75" fill="white"></circle>
            <circle class="ul" v-if="[4, 5, 6].includes(pips)" r="10" cx="25" cy="25" fill="white"></circle>
            <circle class="br" v-if="[4, 5, 6].includes(pips)" r="10" cx="75" cy="75" fill="white"></circle>
            <circle class="cl" v-if="[6].includes(pips)" r="10" cx="25" cy="50" fill="white"></circle>
            <circle class="rr" v-if="[6].includes(pips)" r="10" cx="75" cy="50" fill="white"></circle>
        </g>
    </svg>
</template>

<script setup lang="ts">
import type { Pips } from '@/compostables/Dice';
import type { PropType } from 'vue';
const props = defineProps({
    pips: {
        type: Number as PropType<Pips>,
        required: true,
    },
    color: {
        type: String,
        default: 'red',
    },
});
</script>

<style scoped></style>
