<template>
    <div class="h-full flex relative">
        <div class="relative flex-1">
            <AtlasTerrainViewer />
            <div class="overlay" v-if="!usePauseStore().isGamePaused"></div>
        </div>
    </div>

    <Card class="m-3">
        <template #header>Atlas (World Map)</template>
        <p>
            From up here in your <em>Skyship</em>, the world looks small and simple. But there are many places to
            explore, and many secrets to uncover.<br />Pick a location to travel to.
        </p>
        <p v-if="coordinates">
            <mark>{{ coordinates.x }}, {{ coordinates.y }}</mark>
        </p>
    </Card>
</template>

<script lang="ts" setup>
import { useGameStateStore } from '@/store/game-state-store';
import { computed } from 'vue';
import Card from '../ui/card.vue';
import { usePauseStore } from '@/store/pause-store';
import AtlasTerrainViewer from '../atlas-terrain-viewer.vue';

const gameState = useGameStateStore();

const coordinates = computed(() => {
    return gameState.getValue('atlas-coordinates');
});
</script>

<style lang="scss" scoped></style>
