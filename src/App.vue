<script setup lang="ts">
import Game from './components/the-game.vue';
</script>

<template>
    <div class="app-layout">
        <div class="pattern"></div>
        <Game />
        <!-- <the-modal-container /> -->
    </div>
</template>

<style lang="scss">
@use '@/assets/scss/reset.scss';
@use '@/assets/scss/variables.scss';
@use '@/assets/scss/styles.scss';
</style>
