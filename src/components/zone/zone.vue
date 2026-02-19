<template>
    <Card>
        <p><strong>Zone</strong></p>
    </Card>
</template>

<script lang="ts" setup>
import { useGameStateStore } from '@/store/game-state-store';

const gameState = useGameStateStore();
</script>

<style lang="scss" scoped></style>
