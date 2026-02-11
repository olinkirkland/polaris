<template>
    <div class="flex flex-col gap-5">
        <TheLoader />
        <div v-if="gameData.data">
            <TheMenu />
            <Atlas v-if="game.id" />
            <Zone v-if="game.id" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStore } from '@/store/game-store';
import Atlas from './atlas/atlas.vue';
import TheLoader from './the-loader.vue';
import TheMenu from './the-menu.vue';
import Zone from './zone/zone.vue';

const gameData = useGameDataStore();
const game = useGameStore();
</script>

<style lang="scss" scoped></style>
