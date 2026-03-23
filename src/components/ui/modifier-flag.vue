<template>
    <Flag :flag-name="label" :flag-value="value" :flag-color="color" />
</template>

<script setup lang="ts">
import type { Modifier } from '@/stats/stats-register';
import { computed } from 'vue';
import Flag from './flag.vue';

const props = defineProps<{ modifier: Modifier }>();

const label = computed(() => props.modifier.source);

const value = computed(() => {
    const sign = (props.modifier.rawValue ?? 0) >= 0 ? '+' : ''; // Minus comes from the number itself
    const v = props.modifier.op === 'PERCENT' ? `${props.modifier.rawValue}%` : `${props.modifier.rawValue}`;
    return `${sign}${v}`;
});

const color = computed(() => {
    const rawValue = props.modifier.rawValue ?? 0;
    return rawValue > 0 ? 'blue' : 'red';
});
</script>
    