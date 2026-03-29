<template>
    <div class="relative h-dvh flex flex-col gap-2 p-2 items-center justify-center">
        <Card>
            <template #header class="justify-between debug">
                <span>Main Menu</span>
            </template>
            <ul class="flex flex-wrap gap-2">
                <li>
                    <Button @click="gameState.startNewGame()">
                        <i class="fas fa-plus"></i>
                        <span>New Game</span>
                    </Button>
                </li>
                <li>
                    <Button
                        v-if="recentSave"
                        @click="gameState.load(recentSave!.path)"
                        :disabled="!arePackagesLoaded(recentSave!)"
                    >
                        <span>{{ `Continue as ${recentSave.summary.name}` }}</span>
                    </Button>
                </li>
            </ul>
        </Card>
        <Card v-if="storage.manifestGroups.length > 0">
            <template #header>
                <span>Load Game</span>
            </template>
            <div class="flex flex-col gap-2">
                <!-- List of Save Games to be loaded -->
                <ul class="grid grid-cols-2 gap-2">
                    <li v-for="g in storage.manifestGroups">
                        <StoredGameCard :manifestGroup="g" />
                    </li>
                </ul>
            </div>
        </Card>
        <TheLoader class="absolute! bottom-2 right-2" />
    </div>
</template>

<script setup lang="ts">
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import { StoredGameManifest, useStorageStore } from '@/store/storage-store';
import { computed } from 'vue';
import StoredGameCard from './stored-game-card.vue';
import TheLoader from './the-content-loader.vue';
import Card from './ui/card.vue';

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const storage = useStorageStore();

const recentSave = computed(() => gameState.getMostRecentSave());

function arePackagesLoaded(manifest: StoredGameManifest) {
    const gamePackageIds = manifest.packageIds;
    const loadedPackageIds = gameData.data?.packageDescriptions.map((p) => p.id);
    return gamePackageIds.every((p) => loadedPackageIds?.includes(p));
}
</script>
