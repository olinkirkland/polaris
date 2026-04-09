<template>
    <div v-if="zone" class="h-full flex relative overflow-hidden">
        <div class="relative flex-1">
            <TerrainViewer
                :zoneId="zone.id"
                :pins="gameState.getPinsInZone(zone.id)"
                :cameraSplines="zone.cameraSplines"
                :focusedPin="focusedPin"
            />
            <div class="overlay" v-if="!usePauseStore().isPaused">
                <div class="relative w-full h-full">
                    <!-- Pin labels -->
                    <div
                        v-for="(pin, index) in gameState
                            .getPinsInZone(zone.id)
                            .slice()
                            .sort((a, b) => (a.labelPoint?.y || 0) - (b.labelPoint?.y || 0))"
                        class="pin-label"
                        :class="{ disabled: !!focusedPin && focusedPin !== pin }"
                        :style="{
                            left: pin.labelPoint?.x + 'px',
                            top: `calc(${pin.labelPoint?.y + 'px'} - 1.5rem)`,
                            'z-index': index
                        }"
                    >
                        <Card v-if="focusedPin !== pin" class="collapsed-pin" @click="focusedPin = pin">
                            <div class="flex flex-col items-start gap-2">
                                <span v-html="pin.label"></span>
                            </div>
                        </Card>
                        <div v-else>
                            <!-- Focused Pin card -->
                            <transition name="slide-right">
                                <div v-if="focusedPin" class="w-sm">
                                    <Card>
                                        <template #header>
                                            <div class="px-0.5 flex gap-2 w-full justify-center">
                                                <h2 class="opacity-50 tracking-wider">{{ focusedPin.label }}</h2>
                                            </div>
                                        </template>
                                        <!-- <ActionDescription v-for="action in focusedPin.actions" :action="action" /> -->
                                        <div class="flex gap-2 justify-center w-full">
                                            <Button @click="focusedPin = null">
                                                <i class="fa-solid fa-right-from-bracket rotate-90"></i>
                                                <span>Back</span>
                                            </Button>
                                            <Button @click="focusedPin.actions.forEach((a) => a.act())">
                                                <span>Do: {{ focusedPin.actions.map((a) => a.type).join(', ') }}</span>
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            </transition>
                        </div>
                    </div>

                    <!-- Zone description -->
                    <div v-if="!usePauseStore().isPaused && !useEnvStore().STEALTH" class="m-2 p-3 max-w-2/3 absolute bottom-0">
                        <h2 class="opacity-20 mb-1 text-6xl tracking-wide">{{ zone.label }}</h2>
                        <p>
                            {{ zone.description }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Pin } from '@/game-data/pin/pin';
import { useGameStateStore } from '@/store/game-state-store';
import { usePauseStore } from '@/store/pause-store';
import { computed, ref } from 'vue';
import TerrainViewer from '../terrain-viewer.vue';
import Card from '../ui/card.vue';
import { useEnvStore } from '@/store/env-store';

const gameState = useGameStateStore();
const zone = computed(() => gameState.zone);
const focusedPin = ref<Pin | null>(null);
</script>

<style lang="scss" scoped>
.overlay {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
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

    &.disabled {
        opacity: 0.1;
        pointer-events: none;
    }

    .card.collapsed-pin {
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
}
</style>
