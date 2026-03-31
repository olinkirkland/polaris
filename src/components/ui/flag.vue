<template>
    <div class="w-fit flex gap-1.5 items-center py-1 px-1 rounded-lg" :class="flagClass" :style="customStyle">
        <span class="ml-1" v-html="flagLabel"></span>
        <mark>{{ flagValue }}</mark>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    flagLabel: string;
    flagValue: string | number | boolean;
    flagColor?: string;
}>();

const flagType = computed<'string' | 'number' | 'boolean'>(() => {
    if (typeof props.flagValue === 'number') return 'number';
    if (typeof props.flagValue === 'boolean') return 'boolean';
    return 'string';
});

const flagClass = computed(() => {
    return props.flagColor ? 'custom' : flagType.value;
});

const customStyle = computed(() => {
    if (!props.flagColor) return {};
    return {
        '--bg': `var(--color-${props.flagColor}-100)`,
        '--mark-bg': `var(--color-${props.flagColor}-700)`,
        '--mark-color': `var(--color-${props.flagColor}-100)`
    };
});
</script>

<style scoped lang="scss">
.number {
    background-color: var(--color-blue-100);
    color: var(--color-blue-700);
    > mark {
        background-color: var(--color-blue-700);
        color: var(--color-blue-100);
    }
}

.string {
    background-color: var(--color-green-100);
    color: var(--color-green-700);
    > mark {
        background-color: var(--color-green-700);
        color: var(--color-green-100);
    }
}

.boolean {
    background-color: var(--color-purple-100);
    color: var(--color-purple-700);
    > mark {
        background-color: var(--color-purple-700);
        color: var(--color-purple-100);
    }
}

.custom {
    background-color: var(--bg);
    color: var(--mark-bg);
    > mark {
        background-color: var(--mark-bg);
        color: var(--mark-color);
    }
}
</style>
