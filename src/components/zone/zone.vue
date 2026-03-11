<template>
    <Card class="m-3">
        <template #header>
            <div class="w-full flex items-center justify-between">
                <span>{{ gameState.zone?.label }}</span>
                <small>Zone</small>
            </div>
        </template>
        <p class="mb-2">{{ gameState.zone?.description }}</p>
        <ul v-if="gameState.zone" class="grid grid-cols-3 gap-2">
            <li v-for="pin in gameState.getPinsInZone(gameState.zone.id)">
                <Card>
                    <Button @click="pin.actions.forEach((a) => a.act())" class="w-full justify-center">
                        <span>{{ pin.label }}</span>
                    </Button>
                    <Card v-if="pin.actions.length">
                        <ul class="mt-1 flex flex-wrap gap-1">
                            <li v-for="action in pin.actions"><ActionDescription :action="action" /></li>
                        </ul>
                    </Card>
                </Card>
            </li>
        </ul>
    </Card>
</template>

<script lang="ts" setup>
import { useGameStateStore } from '@/store/game-state-store';
import ActionDescription from '../shared/action-description.vue';

const gameState = useGameStateStore();
</script>

<style lang="scss" scoped></style>
