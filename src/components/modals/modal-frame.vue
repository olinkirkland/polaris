<template>
    <Card class="modal flex flex-col">
        <template #header v-if="$slots.header">
            <slot name="header"></slot>
        </template>
        <div class="modal__content flex flex-col gap-2 p-2 h-full">
            <slot name="content"></slot>
        </div>
        <template #footer v-if="$slots.footer">
            <slot name="footer"></slot>
        </template>
        <div class="modal__background w-full h-full top-0 left-0 absolute"></div>
    </Card>
</template>

<script setup lang="ts">
import Card from '../shared/card.vue';
</script>

<style lang="scss" scoped>
.modal {
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    border-radius: var(--radius-md);

    .modal__background {
        background-color: var(--surface);
        z-index: -1;
    }

    .modal__content {
        flex: 1;
        max-width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
}

:deep(.modal__content > *) {
    width: 100%;
}

@media (max-width: 768px) {
    .modal footer {
        justify-content: center;
    }
}
</style>
