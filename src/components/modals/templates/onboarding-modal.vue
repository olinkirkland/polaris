<template>
    <ModalFrame class="w-200">
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
                <input type="text" placeholder="Character Name" v-model="characterName" />
            </label>
            <ul class="grid grid-cols-2 gap-3">
                <li v-for="p in gameData.data?.characterPaths">
                    <Card class="h-full" :pressed="characterPath?.id === p.id">
                        <template #header>
                            <p>{{ p.label }}</p>
                            <Button class="ml-auto" :disabled="characterPath?.id === p.id" @click="characterPath = p">
                                <i v-if="characterPath?.id === p.id" class="fa-solid fa-check"></i>
                                <span>{{ characterPath?.id === p.id ? 'Selected' : 'Select' }}</span></Button
                            >
                        </template>
                        <em>{{ p.description }}</em>
                        <template #footer>
                            <ul class="flex flex-wrap gap-1">
                                <li v-for="attributeModifier in p.attributeModifiers">
                                    <Flag :flag-name="attributeModifier.key" :flag-value="attributeModifier.value" />
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
            <Button @click="onClickSubmit()" :disabled="characterName.length === 0 || !characterPath">
                <span>Start</span>
            </Button>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import { Character } from '@/character/character';
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
const characterName = ref<string>('');
const characterPath = ref<CharacterPath>();

function onClickCancel() {
    gameState.reset();
    ModalController.close();
}

function onClickSubmit() {
    if (!characterPath.value) return;

    // Add player character to state
    const playerCharacter = new Character();
    playerCharacter.id = 'player';
    playerCharacter.name = characterName.value;
    playerCharacter.characterPathId = characterPath.value.id;
    playerCharacter.attributeModifiers = characterPath.value.attributeModifiers;
    gameState.setCharacter(playerCharacter);

    // Onboarding quest
    gameState.setActiveNode('onboarding', 'complete-onboarding');
    ModalController.close();
}
</script>
