<template>
    <Card class="modal">
        <slot name="header"></slot>
        <div class="modal__content p-2 flex flex-col gap-2">
            <slot name="content"></slot>
        </div>
        <footer v-if="$slots.footer">
            <slot name="footer"></slot>
        </footer>
        <div class="modal__background w-full h-full top-0 left-0 absolute"></div>
    </Card>
</template>

<script setup lang="ts">
import Card from '../shared/card.vue';
</script>

<style lang="scss" scoped>
.modal {
    position: relative;
    display: flex;
    flex-direction: column;
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

    footer {
        border-top: 1px solid var(--surface-border);
        background-color: var(--overlay);
        padding: 1rem;
        width: 100%;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
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
