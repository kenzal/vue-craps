<template>
    <div>
        <craps-die v-for="(pips, index) in diceSet" v-bind:key="index" :pips="pips" :color="color" :height="size" />
    </div>
</template>

<script setup lang="ts">
import CrapsDie from '@/components/CrapsDie.vue';
import type { Pips } from '@/compostables/Dice';
import type { PropType } from 'vue';

defineProps({
    diceSet: {
        type: Array as PropType<Pips[]>,
        required: true,
    },
    color: {
        type: String,
        default: 'red',
    },
    size: {
        type: String,
        default: '50px',
    },
});
</script>

<style scoped></style>
