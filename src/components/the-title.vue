<template>
    <div class="relative h-dvh flex flex-col gap-2 p-2 items-center justify-center">
        <h1 v-if="!env.STEALTH">{{ t('home.title') }}</h1>
        <Card>
            <Button
                v-if="recentSave"
                @click="gameState.load(recentSave!.path)"
                :disabled="!arePackagesLoaded(recentSave!)"
                class="w-full"
                v-tippy="{
                    content: recentSaveTooltip
                }"
            >
                <span>{{ t(`home.continue_game_button`, { name: recentSave.summary.name! }) }}</span>
            </Button>
            <div class="flex gap-2">
                <Button @click="gameState.startNewGame()">
                    <span>{{ t('home.new_game_button') }}</span>
                </Button>
                <Button v-if="storage.manifestGroups.length > 0" @click="ModalController.open(LoadGameModal)">
                    <span>{{ t('home.load_game_button') }}</span>
                </Button>
            </div>
        </Card>
        <TheLoader class="absolute! bottom-2 left-2" />
    </div>
</template>

<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';
import { useEnvStore } from '@/store/env-store';
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import { StoredGameManifest, useStorageStore } from '@/store/storage-store';
import { computed } from 'vue';
import LoadGameModal from './modals/templates/load-game-modal.vue';
import TheLoader from './the-content-loader.vue';
import Card from './ui/card.vue';

const env = useEnvStore();
const gameState = useGameStateStore();
const gameData = useGameDataStore();
const storage = useStorageStore();

const recentSave = computed(() => gameState.getMostRecentSave());
const recentSaveTooltip = computed(() => {
    if (!recentSave.value) return 'No recent save found';
    return `
    <div class="w-full flex flex-col justify-center items-center">
        <p>${recentSave.value.summary.name}</p>
    </div>
    <div class="w-full flex flex-col gap-2">
        <small class="text-center">
            ${recentSave.value.label}
            &nbsp;•&nbsp;
            ${new Date(recentSave.value.date).toLocaleString()}
        </small>
    </div>`;
});

function arePackagesLoaded(manifest: StoredGameManifest) {
    const gamePackageIds = manifest.packageIds;
    const loadedPackageIds = gameData.data?.packageDescriptions.map((p) => p.id);
    return gamePackageIds.every((p) => loadedPackageIds?.includes(p));
}
</script>
