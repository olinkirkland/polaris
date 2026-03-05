<template>
    <ModalFrame class="w-150">
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
                    <Card class="h-full" :pressed="characterHeritage?.id === h.id">
                        <template #header>
                            <p>{{ h.label }}</p>
                            <Button
                                class="ml-auto"
                                :disabled="characterHeritage?.id === h.id"
                                @click="characterHeritage = h"
                            >
                                <i v-if="characterHeritage?.id === h.id" class="fas fa-check"></i>
                                <span>{{ characterHeritage?.id === h.id ? 'Selected' : 'Select' }}</span></Button
                            >
                        </template>
                        <em>{{ h.description }}</em>
                        <template #footer>
                            {{ h.id }}
                        </template>
                    </Card>
                </li>
            </ul>
        </template>
        <template #footer>
            <Button @click="onClickCancel()" class="ml-auto">
                <span>Cancel</span>
            </Button>
            <Button @click="onClickSubmit()" :disabled="!characterHeritage">
                <span>Continue</span>
            </Button>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import { Character, Heritage } from '@/character/character';
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import ModalController from '@/controllers/modal-controller';
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import { ref } from 'vue';

const gameState = useGameStateStore();
const gameData = useGameDataStore();

const props = defineProps<{}>();
const characterHeritage = ref<Heritage>();

function onClickCancel() {
    gameState.reset();
    ModalController.close();
}

function onClickSubmit() {
    const playerCharacter = new Character();
    playerCharacter.id = 'player';
    playerCharacter.heritageId = characterHeritage.value!.id;
    gameState.setCharacter(playerCharacter);

    gameState.setActiveNode('onboarding', 'path');
    ModalController.close();
}
</script>
