<template>
    <div class="panel">
        <div class="panel-content">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.panel {
    background-color: var(--color-surface);
    border: 1px solid var(--color-surface-raised);
    border-radius: var(--border-radius);
    .panel-content {
        padding: 1.2rem;
    }
}
</style>
