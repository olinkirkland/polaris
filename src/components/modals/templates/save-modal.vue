<template>
    <ModalFrame class="w-xl">
        <template v-slot:header>
            <ModalHeader close-button>
                <div class="flex w-full gap-2 items-center">
                    <p>Save</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <label class="input-box mb-2">
                <span>{{ t('modals.save.save_name_label') }}</span>
                <input type="text" :placeholder="t('modals.save.save_name_placeholder')" v-model="saveName" />
            </label>
        </template>
        <template #footer>
            <div class="flex gap-2">
                <Button @click="onClickSave()" :disabled="saveName.length === 0"><span>Save</span></Button>
                <Button @click="ModalController.close()"><span>Cancel</span></Button>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';
import { useGameStateStore } from '@/store/game-state-store';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';

const gameState = useGameStateStore();

const saveName = ref('');

function onClickSave() {
    gameState.save(uuidv4(), saveName.value);
    ModalController.close();
}
</script>
