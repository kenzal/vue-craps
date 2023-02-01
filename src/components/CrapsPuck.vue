<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 500"
        @click.prevent="$emit('toggleMe')"
        @contextmenu.prevent="$emit('followMe')"
    >
        <g class="puck" :class="currentStatus.toLowerCase()" v-if="location !== undefined || (allowToggle && status)">
            <circle fill="black" cx="250" cy="250" r="245" />
            <circle v-if="currentStatus === BetStatus.ON" fill="white" cx="250" cy="250" r="230" />
            <text x="50%" y="50%" text-anchor="middle" style="font: bold 200px sans-serif" dy="70px">
                {{ currentStatus.toUpperCase() }}
            </text>
        </g>
    </svg>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed } from 'vue';
import { BetStatus } from '@/enums/BetStatus';
import type { Placement } from '@/compostables/Config';

const props = defineProps({
    status: {
        type: String as PropType<BetStatus | null>,
        default: null,
    },
    location: {
        type: Number as PropType<Placement | null>,
    },
    allowToggle: {
        type: Boolean,
        default: false,
    },
});

const currentStatus = computed(() => props.status ?? (props.location ? BetStatus.ON : BetStatus.OFF));
</script>

<style scoped>
.puck {
    pointer-events: all;
}
.on text {
    fill: black;
}
.off text {
    fill: white;
}
</style>
