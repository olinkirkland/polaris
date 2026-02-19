<template>
    <Card>
        <p><strong>Zone</strong></p>
        <p>{{ gameState.currentZone }}</p>
        <ul v-if="gameState.currentZone" class="grid grid-cols-4 gap-2">
            <li v-for="pin in gameState.getPinsInZone(gameState.currentZone.id)">
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

const gameState = useGameStateStore();
</script>

<style lang="scss" scoped></style>
