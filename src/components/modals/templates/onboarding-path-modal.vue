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
                <li v-for="p in gameData.data?.characterPaths">
                    <Card class="h-full" :pressed="characterPath?.id === p.id">
                        <template #header>
                            <p>{{ p.label }}</p>
                            <Button class="ml-auto" :disabled="characterPath?.id === p.id" @click="characterPath = p">
                                <i v-if="characterPath?.id === p.id" class="fas fa-check"></i>
                                <span>{{ characterPath?.id === p.id ? 'Selected' : 'Select' }}</span></Button
                            >
                        </template>
                        <em>{{ p.description }}</em>
                        <template #footer>
                            <ul class="flex flex-wrap gap-1">
                                <li v-for="attributeModifier in p.modifiers">
                                    <Flag :flag-name="attributeModifier.target" :flag-value="attributeModifier.value" />
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
import { Character } from '@/game-data/character/character';
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import Flag from '@/components/ui/flag.vue';
import ModalController from '@/controllers/modal-controller';
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
    // playerCharacter.modifiers = characterPath.value!.modifiers;
    gameState.setCharacter(playerCharacter);

    gameState.setActiveNodeId('onboarding', 'complete');
    ModalController.close();
}
</script>
