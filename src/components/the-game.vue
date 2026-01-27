<template>
    <div class="layout">
        <TheMenu />
        <Atlas v-if="game.id" />
        <Zone v-if="game.id" />
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/store/game-store';
import Atlas from './atlas/atlas.vue';
import TheMenu from './the-menu.vue';
import Zone from './zone/zone.vue';

const game = useGameStore();
</script>

<style lang="scss" scoped>
.layout {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
}
</style>
