<template>
    <div class="card rounded-md" :class="{ pressed: props.pressed }">
        <div class="p-5">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    pressed: {
        type: Boolean,
        default: false
    }
});
</script>

<style lang="scss" scoped>
.card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-base-faint);

    &.pressed {
        background-color: var(--color-surface-raised);
        border: 1px solid var(--color-base-faint);
    }
}
</style>
