<script setup lang="ts">
import TheModalContainer from './components/modals/the-modal-container.vue';
import Game from './components/the-game.vue';
</script>

<template>
    <div class="p-5">
        <div class="pattern"></div>
        <Game />
    </div>
    <TheModalContainer />
</template>

<style lang="css">
@import 'tailwindcss';
</style>

<style lang="scss">
@use '@/assets/styles/styles.scss';
@use '@/assets/styles/variables.scss';
</style>
