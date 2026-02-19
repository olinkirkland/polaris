<template>
    <Card>
        <p><strong>Atlas</strong></p>
        <ul class="grid grid-cols-4 gap-2">
            <li v-for="pin in gameState.getPinsInZone('atlas')">
                <Card>
                    <p>{{ pin.label }}</p>
                    <ul v-if="pin.actions.length" class="mt-1 flex flex-wrap gap-1">
                        <li v-for="action in pin.actions">
                            <Button @click="action.act()">{{ action.type }}</Button>
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
