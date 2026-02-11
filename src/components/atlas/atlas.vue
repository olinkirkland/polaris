<template>
    <Card>
        <p><strong>Atlas</strong></p>
    </Card>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/store/game-store';

const game = useGameStore();
</script>

<style lang="scss" scoped></style>
