<template>
    <div class="relative h-dvh flex flex-col gap-2 p-2 items-center justify-center">
        <h1>{{ t('home.title') }}</h1>
        <Card>
            <Button
                v-if="recentSave"
                @click="gameState.load(recentSave!.path)"
                :disabled="!arePackagesLoaded(recentSave!)"
                v-tippy="'Hello world'"
            >
                <span>{{ t(`home.continue_game_button`, { name: recentSave.summary.name! }) }}</span>
            </Button>
            <div class="flex gap-2">
                <Button @click="gameState.startNewGame()">
                    <span>{{ t('home.new_game_button') }}</span>
                </Button>
                <Button v-if="storage.manifestGroups.length > 0" @click="showLoadGamePanel = !showLoadGamePanel">
                    <span>{{ t('home.load_game_button') }}</span>
                </Button>
            </div>
        </Card>
        <div class="w-full p-5 flex justify-center">
            <div v-if="storage.manifestGroups.length > 0 && showLoadGamePanel" class="overflow-x-auto pb-2">
                <!-- List of Save Games to be loaded -->
                <ul class="flex gap-2">
                    <li v-for="g in storage.manifestGroups">
                        <StoredGameCard :manifestGroup="g" />
                    </li>
                </ul>
            </div>
        </div>
        <TheLoader class="absolute! bottom-2 right-2" />
    </div>
</template>

<script setup lang="ts">
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import { StoredGameManifest, useStorageStore } from '@/store/storage-store';
import { computed, ref } from 'vue';
import StoredGameCard from './stored-game-card.vue';
import TheLoader from './the-content-loader.vue';
import Card from './ui/card.vue';
import { t } from '@/i18n/locale';

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const storage = useStorageStore();

const recentSave = computed(() => gameState.getMostRecentSave());

const showLoadGamePanel = ref(false);

function arePackagesLoaded(manifest: StoredGameManifest) {
    const gamePackageIds = manifest.packageIds;
    const loadedPackageIds = gameData.data?.packageDescriptions.map((p) => p.id);
    return gamePackageIds.every((p) => loadedPackageIds?.includes(p));
}
</script>
