<template>
    <Card class="m-3" v-if="zone">
        <template #header>
            <div class="w-full flex items-center justify-between">
                <span>{{ zone.label }}</span>
                <small>Zone</small>
            </div>
        </template>
        <p class="mb-2">{{ zone.description }}</p>
        <div class="relative w-full flex-1">
            <TerrainViewer
                :zoneId="zone.id"
                :pins="gameState.getPinsInZone(zone.id)"
                style="height: 500px"
                :isMapEnabled="isMapEnabled"
            />
            <div class="overlay">
                <div class="relative w-full h-full">
                    <div
                        v-for="(pin, index) in gameState.getPinsInZone(zone.id)"
                        :class="{ 'opacity-0': !isMapEnabled }"
                        class="pin-label"
                        :style="{
                            left: pin.labelPoint?.x + 'px',
                            top: `calc(${pin.labelPoint?.y + 'px'} - 1.5rem)`,
                            'transition-delay': `${index * 0.2}s`
                        }"
                        @click="pin.actions.forEach((a) => a.act())"
                    >
                        <div class="flex flex-col items-start gap-2">
                            <span v-html="pin.label"></span>
                            <ActionDescription v-for="action in pin.actions" :action="action" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Card>
</template>

<script lang="ts" setup>
import { useGameStateStore } from '@/store/game-state-store';
import { computed } from 'vue';
import TerrainViewer from '../terrain-viewer.vue';
import ActionDescription from '../ui/action-description.vue';

const props = defineProps({
    currentPanel: {
        type: String
    }
});

const gameState = useGameStateStore();
const zone = computed(() => gameState.zone);
const isMapEnabled = computed(() => !props.currentPanel);
</script>

<style lang="scss" scoped>
.overlay {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
}

.pin-label {
    pointer-events: all;
    position: absolute;
    transform: translateX(-50%) translateY(-100%);
    transition: opacity 0.5s;

    > div {
        border: 1px solid transparent;
        color: white;
        background-color: rgba($color: #000000, $alpha: 0.5);
        padding: 0.5rem 1rem;
        transition:
            top 0.2s,
            left 0.2s,
            scale 0.2s;
        border-radius: 5px;
        scale: 0.97;
    }

    &:hover {
        cursor: pointer;
        z-index: 1;
        > div {
            border: 1px solid white;
            scale: 1;
            > span {
                text-underline-offset: 0.2rem;
                text-decoration: underline;
            }
        }
    }
}
</style>
