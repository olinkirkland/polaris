<template>
    <div class="card">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.card {
    background-color: var(--color-surface-raised);
    box-shadow: var(--shadow-raised);
    border: 1px solid var(--color-base-weak);
    border-radius: var(--border-radius);
    padding: 1.2rem;
}
</style>
