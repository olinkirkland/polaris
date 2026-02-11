<template>
    <button class="w-fit flex gap-1 items-center py-1 px-2 rounded-sm shadow">
        <slot></slot>
    </button>
</template>

<style scoped lang="scss">
// Button

button {
    background-color: var(--color-surface-raised);
    border: 1px solid var(--color-text-weaker);
    display: flex;
    gap: 0.25rem;
    cursor: pointer;

    &:hover {
        filter: brightness(0.95);
    }

    &:active {
        filter: brightness(0.9);
        box-shadow: none;
    }
}
</style>
