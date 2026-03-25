<template>
    <Card class="modal flex flex-col">
        <template #header v-if="$slots.header">
            <slot name="header"></slot>
        </template>
        <template #floor>
            <div class="modal__content flex flex-col gap-2 p-2 m-2">
                <slot name="content"></slot>
            </div>
        </template>
        <template #footer v-if="$slots.footer">
            <slot name="footer"></slot>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card from '../ui/card.vue';
</script>

<style lang="scss" scoped>
.modal {
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    height: fit-content;
    overflow: hidden;

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
