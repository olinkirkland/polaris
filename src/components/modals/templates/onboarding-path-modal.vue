<template>
    <ModalFrame class="w-175">
        <template v-slot:header>
            <ModalHeader>
                <div class="flex w-full gap-2 items-center">
                    <i class="fas fa-person"></i>
                    <p>Choose your Path</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <ul class="grid grid-cols-2 gap-3">
                <li v-for="path in gameData.data?.characterPaths">
                    <Card class="h-full" :pressed="characterPath?.id === path.id">
                        <template #header>
                            <p>{{ path.label }}</p>
                            <Button
                                class="ml-auto"
                                :disabled="characterPath?.id === path.id"
                                @click="characterPath = path"
                            >
                                <i v-if="characterPath?.id === path.id" class="fas fa-check"></i>
                                <span>{{ characterPath?.id === path.id ? 'Selected' : 'Select' }}</span></Button
                            >
                        </template>
                        <em>{{ path.description }}</em>
                        <template #footer>
                            <ul class="flex flex-wrap gap-1">
                                <li v-for="(modifier, index) in path.modifiers" :key="index">
                                    <ModifierFlag :modifier="modifier" />
                                </li>
                            </ul>
                        </template>
                    </Card>
                </li>
            </ul>
        </template>
        <template #footer>
            <Button @click="onClickCancel()" class="ml-auto">
                <span>Cancel</span>
            </Button>
            <Button @click="onClickSubmit()" :disabled="!characterPath">
                <span>Continue</span>
            </Button>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import ModifierFlag from '@/components/ui/modifier-flag.vue';
import ModalController from '@/controllers/modal-controller';
import { Character } from '@/game-data/character/character';
import { CharacterPath } from '@/game-data/character/character-path';
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import { ref } from 'vue';

const gameState = useGameStateStore();
const gameData = useGameDataStore();

const props = defineProps<{}>();
const characterPath = ref<CharacterPath>();

function onClickCancel() {
    gameState.reset();
    ModalController.close();
}

function onClickSubmit() {
    const playerCharacter = gameState.getCharacter('player') || new Character();
    playerCharacter.id = 'player';
    playerCharacter.characterPathId = characterPath.value!.id;
    playerCharacter.stats.applyModifiers(characterPath.value!.modifiers);
    gameState.setCharacter(playerCharacter);

    gameState.setActiveNodeId('onboarding', 'complete');
    ModalController.close();
}
</script>
