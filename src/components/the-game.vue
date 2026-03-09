<template>
    <div class="flex flex-col gap-3">
        <TheMenu />
        <div v-if="gameData.data" class="flex flex-col gap-5">
            <Atlas v-if="gameState.id && !gameState.zone" />
            <Zone v-if="gameState.id && gameState.zone" />
            <Journal v-if="gameState.id" />
            <!-- <Scene /> -->
            <!-- <Battle /> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import Atlas from './atlas/atlas.vue';
import Journal from './journal.vue';
import Zone from './zone/zone.vue';
import TheMenu from './the-menu.vue';

const gameData = useGameDataStore();
const gameState = useGameStateStore();
</script>

<style lang="scss" scoped></style>
