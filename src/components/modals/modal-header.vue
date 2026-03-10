<template>
    <div class="modal__header px-0.5 flex gap-2 w-full">
        <slot></slot>
        <Button icon :class="closeButton ? '' : 'close--hidden'" @click="onClickClose">
            <i class="fas fa-times"></i>
        </Button>
    </div>
</template>

<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';

const props = defineProps<{
    closeButton?: boolean;
    closeButtonAction?: Function;
}>();

function onClickClose() {
    props.closeButtonAction ? props.closeButtonAction() : ModalController.close();
}
</script>

<style lang="scss" scoped>
.modal__header {
    border-bottom: 1px solid var(--surface-raised);

    .close {
        margin-left: auto;
    }
}

.close--hidden {
    opacity: 0;
    pointer-events: none;
}
</style>
