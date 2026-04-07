<template>
    <ModalFrame class="w-64">
        <template v-slot:header>
            <ModalHeader close-button>
                <div class="flex w-full gap-2 items-center">
                    <p>Paused</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <Button @click="onClickSave">
                <span>Save</span>
            </Button>
            <Button @click="onClickLoad">
                <span>Load</span>
            </Button>
            <Button @click="onClickQuickSave">
                <span>Quicksave</span>
            </Button>
            <!-- TODO: Disable when there's no quickload -->
            <Button
                @click="onClickQuickLoad"
                :disabled="!relativeQuickSave"
                v-tippy="{ content: relativeQuickSaveTooltip }"
            >
                <span>Quickload</span>
            </Button>
            <Button @click="onClickExit"><span>Exit</span></Button>
        </template>
        <template #footer>
            <small class="w-full text-center">{{ gameStateId }}</small>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import ModalController from '@/controllers/modal-controller';
import { useGameStateStore } from '@/store/game-state-store';
import LoadGameModal from './load-game-modal.vue';
import SaveModal from './save-modal.vue';
import { useStorageStore } from '@/store/storage-store';
import { computed } from 'vue';

const gameState = useGameStateStore();
const storage = useStorageStore();

const props = defineProps<{}>();

const gameStateId = computed(() => gameState.id);

const relativeQuickSaveTooltip = computed(() => {
    if (!relativeQuickSave.value) return null;
    return `
    <div class="w-full flex flex-col justify-center items-center">
        <p>${relativeQuickSave.value.summary.name}</p>
    </div>
    <div class="w-full flex flex-col gap-2">
        <small class="text-center">
            ${relativeQuickSave.value.label}
            &nbsp;•&nbsp;
            ${new Date(relativeQuickSave.value.date).toLocaleString()}
        </small>
    </div>`;
});

function onClickSave() {
    ModalController.open(SaveModal);
    ModalController.close();
}

function onClickLoad() {
    ModalController.open(LoadGameModal, { selectedManifestGroupId: gameStateId.value });
    ModalController.close();
}

function onClickQuickSave() {
    gameState.save('quicksave', 'Quicksave');
    ModalController.close();
}

function onClickQuickLoad() {
    gameState.load(gameStateId + '/' + 'quicksave');
    ModalController.close();
}

function onClickExit() {
    gameState.reset();
    ModalController.close();
}

const relativeQuickSave = computed(() => {
    const manifestGroup = storage.manifestGroups.find((g) => g.id === gameStateId.value);
    console.log('manifests:', manifestGroup?.manifests);

    const q = manifestGroup?.manifests.find((m) => m.path.endsWith('/quicksave'));
    console.log(q);
    return q;
});
</script>
