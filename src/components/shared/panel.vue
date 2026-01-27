<template>
    <div class="panel" :class="{ 'panel--raised': props.raised, 'panel--reverse': props.reverse }">
        <div class="panel-content">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    raised: Boolean,
    reverse: Boolean
});
</script>

<style lang="scss" scoped>
.panel {
    background-color: var(--color-surface);
    border: 1px solid var(--color-surface-raised);
    border-radius: var(--border-radius);

    &--raised {
        box-shadow: var(--shadow-raised);
    }

    &--reverse {
        background-color: var(--color-surface-reverse);
        border-color: var(--color-surface-reverse);
        color: var(--color-text-reverse);
    }

    .panel-content {
        padding: 1.2rem;
    }
}
</style>
