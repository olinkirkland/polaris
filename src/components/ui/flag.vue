<template>
    <div class="w-fit flex gap-1.5 items-center py-1 px-2 rounded-lg">
        <span class="flag-name">{{ flagName }}</span>
        <mark :class="'mark--' + flagType">{{ flagValue }}</mark>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    flagName: string;
    flagValue: string | number | boolean;
}>();

const flagType = computed<'string' | 'number' | 'boolean'>(() => {
    if (typeof props.flagValue === 'number') return 'number';
    if (typeof props.flagValue === 'boolean') return 'boolean';
    return 'string';
});
</script>

<style scoped lang="scss">
div {
    background-color: var(--color-gray-100);
}

.mark--number {
    background-color: var(--color-blue-700);
    color: var(--color-blue-100);
}

.mark--string {
    background-color: var(--color-green-700);
    color: var(--color-green-100);
}

.mark--boolean {
    background-color: var(--color-purple-700);
    color: var(--color-purple-100);
}
</style>
