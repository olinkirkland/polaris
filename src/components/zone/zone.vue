<template>
    <Card class="m-3" v-if="zone">
        <template #header>
            <div class="w-full flex items-center justify-between">
                <span>{{ zone.label }}</span>
                <small>Zone</small>
            </div>
        </template>
        <p class="mb-2">{{ zone.description }}</p>
        <ul v-if="zone" class="grid grid-cols-3 gap-2">
            <li v-for="pin in gameState.getPinsInZone(zone.id)">
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
        <TerrainViewer :zoneId="zone.id" :pins="gameState.getPinsInZone(zone.id)" style="height: 500px" />
    </Card>
</template>

<script lang="ts" setup>
import { useGameStateStore } from '@/store/game-state-store';
import { computed } from 'vue';
import TerrainViewer from '../terrain-viewer.vue';
import ActionDescription from '../ui/action-description.vue';

const gameState = useGameStateStore();
const zone = computed(() => gameState.zone);
</script>

<style lang="scss" scoped></style>
