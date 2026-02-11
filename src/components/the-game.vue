<template>
    <div class="flex flex-col gap-5">
        <TheLoader />
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
import TheLoader from './the-loader.vue';

const game = useGameStore();
</script>

<style lang="scss" scoped></style>
