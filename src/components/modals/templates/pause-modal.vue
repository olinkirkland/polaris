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
                <i class="fas fa-save"></i>
                <span>Save</span>
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

const gameState = useGameStateStore();

const props = defineProps<{}>();

const gameStateId = gameState.id;

function onClickSave() {
    gameState.save('quicksave', 'Quicksave');
    ModalController.close();
}

function onClickExit() {
    gameState.reset();
}
</script>
