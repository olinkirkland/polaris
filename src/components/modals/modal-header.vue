<template>
    <div class="modal__header">
        <slot></slot>
        <Button icon class="close" :class="closeButton ? '' : 'close--hidden'" @click="onClickClose">
            <i class="fas fa-times"></i>
        </Button>
    </div>
</template>

<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';

const props = defineProps({
    closeButton: Boolean,
    closeButtonAction: Function
});

function onClickClose() {
    props.closeButtonAction ? props.closeButtonAction() : ModalController.close();
}
</script>

<style lang="scss" scoped>
.modal__header {
    position: relative;
    display: flex;
    align-items: center;
    height: 2rem;
    padding: 0 2rem;
    padding-right: 0.5rem;
    width: 100%;
    gap: 1rem;
    background-color: var(--overlay);
    border-bottom: 1px solid var(--surface-border);

    .close {
        margin-left: auto;
    }
}

.close--hidden {
    opacity: 0;
    pointer-events: none;
}
</style>
