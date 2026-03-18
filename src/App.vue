<template>
    <div>
        <div class="pattern"></div>
        <TheTitle v-if="!gameState.id" />
        <Game v-else />
    </div>
    <TheModalContainer />
    <SaveOverlay />
</template>

<script setup lang="ts">
import TheModalContainer from './components/modals/the-modal-container.vue';
import Game from './components/the-game.vue';
import TheTitle from './components/the-title.vue';
import SaveOverlay from './components/ui/save-overlay.vue';
import { useGameStateStore } from './store/game-state-store';

const gameState = useGameStateStore();
</script>

<style lang="css">
@import 'tailwindcss';
@source inline("{hover:,}bg-red-{50,{100..900..100},950}");
</style>

<style lang="scss">
@use '@/assets/styles/styles.scss';
@use '@/assets/styles/variables.scss';
</style>
