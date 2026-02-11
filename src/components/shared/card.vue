<template>
    <div class="card rounded-md">
        <div class="p-3">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-base-faint);
}
</style>
