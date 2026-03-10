<template>
    <div class="card rounded-lg flex flex-col" :class="{ pressed: props.pressed }">
        <header v-if="hasHeader" class="p-3 w-full flex items-center gap-2">
            <slot name="header"></slot>
        </header>
        <div class="flex flex-col p-3 gap-2 flex-1" v-if="$slots.default">
            <slot></slot>
        </div>
        <slot name="floor"></slot>
        <footer v-if="hasFooter" class="p-3 w-full flex items-center gap-2">
            <slot name="footer"></slot>
        </footer>
    </div>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue';

const props = defineProps<{
    pressed?: boolean;
}>();

const slots = useSlots();
const hasHeader = computed(() => !!slots.header);
const hasFooter = computed(() => !!slots.footer);
</script>

<style lang="scss" scoped>
.card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-base-faint);

    &.pressed {
        background-color: var(--color-surface-raised);
        border: 1px solid var(--color-base-faint);
    }

    header {
        border-bottom: 1px solid var(--color-base-faint);
    }

    footer {
        border-top: 1px solid var(--color-base-faint);
    }

    header,
    footer {
        min-height: 2rem;
        flex-shrink: 0;
    }
}
</style>
