<template>
    <ModalFrame class="w-175">
        <template v-slot:header>
            <ModalHeader>
                <div class="flex w-full gap-2 items-center">
                    <i class="fas fa-person"></i>
                    <p>What is your origin?</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci in autem deleniti eum! Nulla sed
                voluptatum a harum officiis consequatur.
            </p>
            <ul class="grid grid-cols-2 gap-3">
                <li v-for="h in gameData.data?.characterHeritages">
                    <Card class="h-full" :pressed="heritage?.id === h.id">
                        <template #header>
                            <p>{{ h.label }}</p>
                            <Button class="ml-auto" :disabled="heritage?.id === h.id" @click="heritage = h">
                                <i v-if="heritage?.id === h.id" class="fas fa-check"></i>
                                <span>{{ heritage?.id === h.id ? 'Selected' : 'Select' }}</span></Button
                            >
                        </template>
                        <em>{{ h.description }}</em>
                    </Card>
                </li>
            </ul>
        </template>
        <template #footer>
            <Button @click="onClickCancel()" class="ml-auto">
                <span>Cancel</span>
            </Button>
            <Button @click="onClickSubmit()" :disabled="!heritage">
                <span>Continue</span>
            </Button>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import { Character } from '@/game-data/character/character';
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import ModalController from '@/controllers/modal-controller';
import { Heritage } from '@/game-data/character/heritage';
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import { ref } from 'vue';

const gameState = useGameStateStore();
const gameData = useGameDataStore();

const props = defineProps<{}>();
const heritage = ref<Heritage>();

function onClickCancel() {
    gameState.reset();
    ModalController.close();
}

function onClickSubmit() {
    if (!heritage.value) return;
    gameState.setValue('flags.heritage', heritage.value.id);

    gameState.setActiveNodeId('onboarding', 'path');
    ModalController.close();
}
</script>
