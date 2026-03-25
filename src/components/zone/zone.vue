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
        <div class="relative w-full flex-1">
            <TerrainViewer :zoneId="zone.id" :pins="gameState.getPinsInZone(zone.id)" style="height: 500px" />
            <div class="overlay">
                <div class="relative w-full h-full">
                    <span v-for="p in pinLabels" class="pin-label" :style="{ left: p.x + 'px', top: p.y + 'px' }">
                        <span v-html="p.label"></span>
                    </span>
                </div>
            </div>
        </div>
    </Card>
</template>

<script lang="ts" setup>
import { Pin } from '@/game-data/pin/pin';
import { useGameStateStore } from '@/store/game-state-store';
import { Point } from '@/util/math-util';
import { computed } from 'vue';
import TerrainViewer from '../terrain-viewer.vue';
import ActionDescription from '../ui/action-description.vue';

const gameState = useGameStateStore();
const zone = computed(() => gameState.zone);
const pinLabels = computed<(Point & { label: string })[]>(() => {
    if (!zone.value) return [];
    const pins: Pin[] = gameState.getPinsInZone(zone.value.id);
    const pinLabelObjects = pins.map((p) => {
        return { x: p.labelPoint?.x || 0, y: p.labelPoint?.y || 0, label: p.label };
    });

    // TODO: Make sure they don't overlap

    return pinLabelObjects;
});
</script>

<style lang="scss" scoped>
.overlay {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.pin-label {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.5);
    color: black;
    padding: 0.5rem 1rem;
    transform: translate(-50%, -175%);
    transition: all 0.2s;
    border-radius: 99px;
}
</style>
