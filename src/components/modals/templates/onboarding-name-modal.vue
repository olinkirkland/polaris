<template>
    <ModalFrame class="w-175">
        <template v-slot:header>
            <ModalHeader>
                <div class="flex w-full gap-2 items-center">
                    <i class="fas fa-person"></i>
                    <p>By what name are you known?</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia nobis eaque ducimus. Lorem, ipsum dolor.
            </p>
            <label class="input-box mb-2">
                <span>Name</span>
                <input type="text" placeholder="e.g., Helda Brighyin" v-model="characterName" />
            </label>
            <small class="muted text-center"><i class="fas fa-wand-magic-sparkles mr-1"></i>Name Suggestions</small>
            <Card>
                <ul class="grid grid-cols-3 gap-1 text-center muted">
                    <li v-for="m in gameData.data?.nameSuggestions">
                        <em>{{ m }}</em>
                    </li>
                </ul>
            </Card>
        </template>
        <template #footer>
            <Button @click="onClickCancel()" class="ml-auto">
                <span>Cancel</span>
            </Button>
            <Button @click="onClickSubmit()" :disabled="characterName.length === 0">
                <span>Continue</span>
            </Button>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import ModalController from '@/controllers/modal-controller';
import { Character } from '@/game-data/character/character';
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import { ref } from 'vue';

const gameState = useGameStateStore();
const gameData = useGameDataStore();

const props = defineProps<{}>();
const characterName = ref<string>('');

function onClickCancel() {
    gameState.reset();
    ModalController.close();
}

function onClickSubmit() {
    const playerCharacter = new Character();
    playerCharacter.id = 'player';
    playerCharacter.name = characterName.value;

    gameState.setCharacter(playerCharacter);

    gameState.setActiveNodeId('onboarding', 'heritage');
    ModalController.close();
}
</script>
