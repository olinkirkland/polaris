<template>
    <div class="card">
        <div class="content p-2">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.panel {
    background-color: var(--color-surface);
    border: 1px solid var(--color-surface-raised);
    border-radius: var(--radius-md);

    .content {
        padding: 1.2rem;
    }
}
</style>
