<template>
    <ModalFrame class="w-96">
        <template v-slot:header>
            <ModalHeader>
                <div class="flex w-full gap-2 items-center">
                    <i class="fa-solid fa-user"></i>
                    <p>Who are you?</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <label class="input-box">
                <span>My Name</span>
                <input type="text" placeholder="Character Name" />
            </label>
        </template>
        <template #footer>
            <Button @click="onClickSubmit()" class="ml-auto">Submit</Button>
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

function onClickSubmit() {
    // Advance quest 'complete-onboarding'
    gameState.setActiveNode('onboarding', 'complete-onboarding');
    ModalController.close();
}
</script>
