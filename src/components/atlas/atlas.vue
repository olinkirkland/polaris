<template>
    <Card>
        <template #header>Atlas</template>
        <ul class="grid grid-cols-3 gap-2">
            <li v-for="pin in gameState.getPinsInZone('atlas')">
                <Card>
                    <p>{{ pin.label }}</p>
                    <ul v-if="pin.actions.length" class="mt-1 flex flex-wrap gap-1">
                        <li v-for="action in pin.actions">
                            <ActionButton :action="action" />
                        </li>
                    </ul>
                    <em v-else>No Actions</em>
                </Card>
            </li>
        </ul>
    </Card>
</template>

<script lang="ts" setup>
import { useGameStateStore } from '@/store/game-state-store';
import Card from '../shared/card.vue';

const gameState = useGameStateStore();
</script>

<style lang="scss" scoped></style>
