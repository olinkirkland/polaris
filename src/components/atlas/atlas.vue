<template>
    <Card>
        <template #header>Atlas (World Map)</template>
        <p>
            From up here in your <em>Skyship</em>, the world looks small and simple. But there are many places to
            explore, and many secrets to uncover.<br />Pick a location to travel to.
        </p>
        <p v-if="coordinates">
            Your coordinates: <mark>{{ coordinates.x }}, {{ coordinates.y }}</mark>
        </p>
        <ul class="grid grid-cols-3 gap-2">
            <li v-for="pin in gameState.getPinsInZone('atlas')">
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
import Card from '../ui/card.vue';
import { computed } from 'vue';

const gameState = useGameStateStore();

const coordinates = computed(() => {
    return gameState.getValue('atlas-coordinates');
});
</script>

<style lang="scss" scoped></style>
