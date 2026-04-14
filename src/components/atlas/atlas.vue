<template>
    <div class="h-full flex relative">
        <div class="relative flex-1">
            <AtlasViewer :pins="gameState.getPinsInZone('atlas')" :focusedPin="null" />
            <div class="overlay" v-if="!usePauseStore().isPaused"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useGameStateStore } from '@/store/game-state-store';
import { usePauseStore } from '@/store/pause-store';
import { computed } from 'vue';
import AtlasViewer from '../3d-atlas-viewer.vue';

const gameState = useGameStateStore();
const atlas = computed(() => gameState.zone!);

const coordinates = computed(() => {
    return gameState.getValue('atlas-coordinates');
});
</script>

<style lang="scss" scoped></style>
