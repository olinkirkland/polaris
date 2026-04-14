<template>
    <div class="h-full flex relative">
        <div class="relative flex-1">
            <AtlasViewer :pins="gameState.getPinsInZone(null)" :focusedPin="null" />
            <div class="overlay" v-if="!usePauseStore().isPaused">
                <div class="relative w-full h-full">
                    <!-- Pin labels -->
                    <div
                        v-for="(pin, index) in gameState
                            .getPinsInZone(null)
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
import AtlasViewer from '../3d-atlas-viewer.vue';

const gameState = useGameStateStore();
const focusedPin = ref<Pin | null>(null);

const coordinates = computed(() => {
    return gameState.getValue('atlas-coordinates');
});
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
