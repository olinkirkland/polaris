<template>
    <div v-if="zone" class="h-full flex relative">
        <div class="relative flex-1">
            <TerrainViewer
                :zoneId="zone.id"
                :pins="gameState.getPinsInZone(zone.id)"
                :cameraSplines="zone.cameraSplines"
            />
            <div class="overlay" v-if="!usePauseStore().isGamePaused">
                <div class="relative w-full h-full">
                    <Card
                        v-for="(pin, index) in gameState
                            .getPinsInZone(zone.id)
                            .slice()
                            .sort((a, b) => (a.labelPoint?.y || 0) - (b.labelPoint?.y || 0))"
                        class="pin-label"
                        :style="{
                            left: pin.labelPoint?.x + 'px',
                            top: `calc(${pin.labelPoint?.y + 'px'} - 1.5rem)`,
                            'z-index': index
                        }"
                        @click="pin.actions.forEach((a) => a.act())"
                    >
                        <div class="flex flex-col items-start gap-2">
                            <span v-html="pin.label"></span>
                            <ActionDescription v-for="action in pin.actions" :action="action" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
        <div v-if="!usePauseStore().isGamePaused" class="zone-description m-2 p-3 max-w-2/3 absolute bottom-0">
            <h2 class="opacity-30 mb-1">{{ zone.label }}</h2>
            <p>
                {{ zone.description }}
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useGameStateStore } from '@/store/game-state-store';
import { computed } from 'vue';
import TerrainViewer from '../terrain-viewer.vue';
import ActionDescription from '../ui/action-description.vue';
import Card from '../ui/card.vue';
import { usePauseStore } from '@/store/pause-store';

const gameState = useGameStateStore();
const zone = computed(() => gameState.zone);
</script>

<style lang="scss" scoped>
.overlay {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
}

.pin-label {
    pointer-events: all;
    position: absolute;
    transform: translateX(-50%) translateY(-100%);
    width: max-content;
    max-width: 20rem;
    text-align: center;

    > div {
        border: 1px solid transparent;
        color: white;
        background-color: rgba($color: #000000, $alpha: 0.5);
        padding: 0.5rem 1rem;
    }

    &:hover {
        cursor: pointer;
        z-index: 99 !important;
        span {
            text-underline-offset: 0.2rem;
            text-decoration: underline;
        }
    }
}

.zone-description {
    background-color: var(--color-transparent-faint-black);
    color: white;
}
</style>
