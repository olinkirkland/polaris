<template>
    <Panel raised>
        <p><strong>Atlas</strong></p>
    </Panel>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/store/game-store';

const game = useGameStore();
</script>

<style lang="scss" scoped></style>
