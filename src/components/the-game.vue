<template>
    <div class="flex flex-col gap-5">
        <TheLoader v-if="!gameState.id" />
        <div v-if="gameData.data" class="flex flex-col gap-5">
            <TheMenu />
            <Atlas v-if="gameState.id && !gameState.zone" />
            <Zone v-if="gameState.id && gameState.zone" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import Atlas from './atlas/atlas.vue';
import TheLoader from './the-loader.vue';
import TheMenu from './the-menu.vue';
import Zone from './zone/zone.vue';

const gameData = useGameDataStore();
const gameState = useGameStateStore();
</script>

<style lang="scss" scoped></style>
