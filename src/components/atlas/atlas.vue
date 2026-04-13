<template>
    <div class="h-full flex relative">
        <div class="relative flex-1">
            <TerrainViewer
                v-if="atlas"
                :zoneId="atlas.id"
                :pins="gameState.getPinsInZone(atlas.id)"
                :cameraSplines="atlas.cameraSplines"
                :focusedPin="null"
            />
            <div class="overlay" v-if="!usePauseStore().isPaused"></div>
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
import { usePauseStore } from '@/store/pause-store';
import { computed } from 'vue';
import TerrainViewer from '../terrain-viewer.vue';
import Card from '../ui/card.vue';

const gameState = useGameStateStore();
const atlas = computed(() => gameState.zone!);

const coordinates = computed(() => {
    return gameState.getValue('atlas-coordinates');
});
</script>

<style lang="scss" scoped></style>
