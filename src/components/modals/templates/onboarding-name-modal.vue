<template>
    <ModalFrame class="w-175">
        <template v-slot:header>
            <ModalHeader>
                <div class="flex w-full gap-2 items-center">
                    <i class="fas fa-person"></i>
                    <p>{{ t('modals.onboarding_name.heading') }}</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <p>
                {{ t('modals.onboarding_name.description') }}
            </p>
            <label class="input-box mb-2">
                <span>{{ t('modals.onboarding_name.name_label') }}</span>
                <input
                    type="text"
                    :placeholder="t('modals.onboarding_name.name_placeholder')"
                    v-model="characterName"
                />
            </label>
            <small class="muted text-center"
                ><i class="fas fa-wand-magic-sparkles mr-1"></i
                >{{ t('modals.onboarding_name.name_suggestions') }}</small
            >
            <Card>
                <ul class="grid grid-cols-3 gap-1 text-center muted w-full">
                    <li v-for="m in gameData.data?.nameSuggestions" @click="characterName = m" class="cursor-pointer">
                        <em>{{ m }}</em>
                    </li>
                </ul>
            </Card>
        </template>
        <template #footer>
            <Button @click="onClickCancel()" class="ml-auto">
                <span>{{ t('common.cancel') }}</span>
            </Button>
            <Button @click="onClickSubmit()" :disabled="characterName.length === 0">
                <span>{{ t('common.continue') }}</span>
            </Button>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import ModalController from '@/controllers/modal-controller';
import { Character } from '@/game-data/character/character';
import { t } from '@/i18n/locale';
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

    gameState.setActiveQuestNodeId('onboarding', 'heritage');
}
</script>
