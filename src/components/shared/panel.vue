<template>
    <div class="panel">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.panel {
    background-color: var(--color-surface);
    border: 1px solid var(--color-base-weak);
    border-radius: var(--border-radius);
    padding: 1.2rem;
}
</style>
