<template>
    <button class="w-fit flex items-center gap-1.5 py-1 px-1 rounded-lg cursor-pointer" :class="{ icon }">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    icon?: boolean;
}>();
</script>

<style scoped lang="scss">
button {
    background-color: var(--color-surface-raised);
    border: 1px solid var(--color-base-faint);
    transition: 0.2s box-shadow;
    height: fit-content;
    min-height: 2rem;

    &.icon {
        background-color: transparent;
        border: none;

        &:hover {
            box-shadow: none;
        }
    }

    &:hover {
        box-shadow: var(--shadow-sm);
    }

    &:active {
        filter: brightness(0.95);
        box-shadow: none;
    }
}

:deep(span) {
    white-space: nowrap;
}

:deep(i) {
    font-size: smaller;
}

:deep(i:first-child),
:deep(span:first-child) {
    margin-left: 0.25rem;
}

:deep(:last-child:not(mark)) {
    margin-right: 0.25rem;
}
</style>
