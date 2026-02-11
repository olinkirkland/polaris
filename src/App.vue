<script setup lang="ts">
import Game from './components/the-game.vue';
</script>

<template>
    <div class="p-5">
        <div class="pattern"></div>
        <Game />
        <!-- <the-modal-container /> -->
    </div>
</template>

<style lang="scss">
@use '@/assets/styles/styles.scss';
</style>

<style lang="css">
@import 'tailwindcss';
</style>
