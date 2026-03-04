<template>
    <button class="w-fit flex gap-1.5 items-center py-1 px-2 rounded-lg cursor-pointer">
        <slot></slot>
    </button>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
button {
    background-color: var(--color-surface-raised);
    border: 1px solid var(--color-base-faint);
    transition: 0.2s box-shadow;
    height: fit-content;
    min-height: 2rem;

    &:hover {
        box-shadow: var(--shadow-sm);
    }

    &:active {
        filter: brightness(0.95);
        box-shadow: none;
    }
}

:deep {
    i {
        font-size: smaller;
    }
}
</style>
