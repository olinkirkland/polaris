<template>
    <ModalFrame class="w-175">
        <template v-slot:header>
            <ModalHeader>
                <div class="flex w-full gap-2 items-center">
                    <i class="fas fa-person"></i>
                    <p>Choose Attributes</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci in autem deleniti eum! Nulla sed
                voluptatum a harum officiis consequatur.
            </p>
            <ul class="grid grid-cols-2 gap-3">
                <Card v-for="k in ['brawn', 'agility', 'wits', 'aura']">
                    <h2 class="capitalize text-center">
                        <mark>{{ character.stats.getValue(k) }}</mark> {{ k }}
                    </h2>
                </Card>
            </ul>
        </template>
        <template #footer>
            <Button @click="onClickCancel()" class="ml-auto">
                <span>Cancel</span>
            </Button>
            <Button @click="onClickSubmit()" :disabled="attributePoints > 0">
                <span>Continue</span>
            </Button>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import ModalController from '@/controllers/modal-controller';
import { useGameStateStore } from '@/store/game-state-store';
import { ref } from 'vue';

const gameState = useGameStateStore();

const props = defineProps<{
    characterId: string;
}>();

const character = gameState.getCharacter(props.characterId)!;
const attributePoints = ref(0);

function onClickCancel() {
    gameState.reset();
    ModalController.close();
}

function onClickSubmit() {
    const playerCharacter = gameState.getCharacter('player');

    // Apply the attributes

    gameState.setCharacter(playerCharacter);

    // TODO: Add attributes

    // gameState.setValue('flags.heritage', heritage.value!.id);

    // gameState.setActiveNodeId('onboarding', 'path');
    ModalController.close();
}
</script>
