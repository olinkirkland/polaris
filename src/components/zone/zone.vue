<template>
    <Card>
        <template #header>
            <div class="w-full flex items-center justify-between">
                <span>{{ gameState.zone?.label }}</span>
                <small>Zone</small>
            </div>
        </template>
        <p class="mb-2">{{ gameState.zone?.description }}</p>
        <ul v-if="gameState.zone" class="grid grid-cols-4 gap-2">
            <li v-for="pin in gameState.getPinsInZone(gameState.zone.id)">
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
