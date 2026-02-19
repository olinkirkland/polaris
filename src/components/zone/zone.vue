<template>
    <Card>
        <p><strong>Zone</strong></p>
    </Card>
</template>

<script lang="ts" setup>
import { useGameStateStore } from '@/store/game-state-store';

const gameState = useGameStateStore();
// const zone = gameState.currentZone;
</script>

<style lang="scss" scoped></style>
