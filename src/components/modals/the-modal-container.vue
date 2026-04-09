<template>
    <div
        class="modal-container fixed w-full flex flex-col justify-center items-center p-3 top-0 z-99"
        :class="{ active: !!currentModal }"
    >
        <div
            class="modal-container__background w-full h-full absolute top-0 opacity-100"
            @click="onClickBackground()"
        ></div>
        <component :is="currentModal" v-bind="currentModalConfig" ref="modalRef" />
        <span
            v-if="useEnvStore().DEBUG && usePauseStore().isPaused"
            class="absolute top-0 right-0 p-5 text-red-500 flex gap-2 items-center"
        >
            <i class="fas fa-pause"></i>
        </span>
    </div>
</template>

<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';
import { useEnvStore } from '@/store/env-store';
import { usePauseStore } from '@/store/pause-store';
import _ from 'lodash';
import { ComponentOptions, ref, shallowRef } from 'vue';

const modalRef = ref();
const currentModal = shallowRef<ComponentOptions | null>(null);
const currentModalConfig = shallowRef<any | null>(null);
const fadeInterval = ref();
function onClickBackground() {
    if (currentModalConfig.value?.closeOnClick) ModalController.close();
}

const queue: { modal: any; modalConfig: any }[] = [];

ModalController.getInstance().addEventListener(({ modal, modalConfig }) => {
    // If no modal was passed, close the current one
    if (!modal) {
        currentModal.value = null;
        if (!queue.length) {
            usePauseStore().resume();
            return;
        }

        // If there are modals in the queue, open the next one
        const { modal, modalConfig } = queue.shift()!;
        ModalController.open(modal, modalConfig);
        usePauseStore().pause();
        return;
    }

    // Is there already a modal open?
    if (currentModal.value) {
        // If a matching modalConfig is already in the queue, don't add it again
        const queueIncludingCurrent = [...queue, { modal: currentModal.value, modalConfig: currentModalConfig.value }];

        const isModalAlreadyInQueue = queueIncludingCurrent.find((queued) =>
            _.isEqual(queued.modalConfig, modalConfig)
        );

        if (isModalAlreadyInQueue) return;

        // Add the modal to the queue and close the current one to trigger the queue
        queue.push({ modal, modalConfig });
        ModalController.close();
        return;
    }

    if (modal) {
        currentModal.value = { ...modal! } as any;
        currentModalConfig.value = { ...modalConfig };
        usePauseStore().pause();
    }

    // Wait for the modal to be mounted before fading in
    requestAnimationFrame(() => {
        if (fadeInterval.value) clearInterval(fadeInterval.value);
        const modalEl = modalRef.value?.$el;
        if (!modalEl) return;
        const modalHeaderChildren = modalEl.querySelector('.modal__header')
            ? [modalEl.querySelector('.modal__header')]
            : [];
        const modalContentChildren = Array.from<HTMLElement>(
            modalEl.querySelector('.modal__content > div')?.children || []
        );
        const modalChildren = [...modalHeaderChildren, ...modalContentChildren];
        // @ts-ignore
        window.modalChildren = modalChildren;
    });
});
</script>

<style scoped lang="scss">
.modal-container {
    height: 100vh;
    height: 100dvh;
    min-height: -webkit-fill-available;
    -webkit-overflow-scrolling: touch;

    > .modal-container__background {
        z-index: -1;
        background-color: rgba(255, 255, 255, 0.8);
        background-image: url('/assets/images/tiles.png');
    }

    &:not(.active) {
        pointer-events: none;
        > .modal-container__background {
            opacity: 0;
        }
    }
}
</style>
