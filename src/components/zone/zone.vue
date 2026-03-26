<template>
    <div v-if="zone" class="h-full flex relative">
        <div class="relative flex-1">
            <TerrainViewer :zoneId="zone.id" :pins="gameState.getPinsInZone(zone.id)" :isMapEnabled="isMapEnabled" />
            <div class="overlay" :class="{ 'overlay--disabled': !isMapEnabled }">
                <div class="relative w-full h-full">
                    <div
                        v-for="(pin, index) in gameState
                            .getPinsInZone(zone.id)
                            .slice()
                            .sort((a, b) => (a.labelPoint?.y || 0) - (b.labelPoint?.y || 0))"
                        :class="{ 'opacity-0': !isMapEnabled }"
                        class="pin-label"
                        :style="{
                            left: pin.labelPoint?.x + 'px',
                            top: `calc(${pin.labelPoint?.y + 'px'} - 1.5rem)`,
                            'transition-delay': `${index * 0.2}s`,
                            'z-index': index
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
        <div class="zone-description m-2 p-5 absolute bottom-0" :class="{ 'opacity-0': !isMapEnabled }">
            <p>
                <strong>{{ zone.label }}</strong> &mdash; {{ zone.description }}
            </p>
        </div>
    </div>
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

.zone-description {
    transition: opacity 0.5s;
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
            // top 0.2s,
            // left 0.2s,
            scale 0.2s;
        scale: 0.97;
    }

    &:hover {
        cursor: pointer;
        z-index: 99 !important;
        > div {
            background-color: rgba($color: #000000, $alpha: 0.8);
            border: 1px solid white;
            scale: 1;
            > span {
                text-underline-offset: 0.2rem;
                text-decoration: underline;
            }
        }
    }
}

.zone-description {
    background-color: var(--color-transparent-black);
    color: white;
}
</style>
