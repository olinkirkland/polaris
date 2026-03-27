<template>
    <div class="the-menu flex justify-between items-center p-3">
        <div class="flex items-center mr-2">
            <div class="flex items-center gap-2">
                <Button
                    @click="$emit('clickPanel', 'journal')"
                    :class="{ pressed: currentPanel === 'journal' }"
                    :disabled="isLocked"
                >
                    <i class="fas fa-book"></i>
                    <span>Journal</span>
                </Button>
                <Button
                    @click="$emit('clickPanel', 'party')"
                    :class="{ pressed: currentPanel === 'party' }"
                    :disabled="isLocked"
                >
                    <ExperienceBar />
                </Button>
                <Button
                    @click="$emit('clickPanel', 'inventory')"
                    :class="{ pressed: currentPanel === 'inventory' }"
                    :disabled="isLocked"
                >
                    <i class="fas fa-box-open"></i>
                    <span>Inventory</span>
                </Button>
            </div>
        </div>
        <div class="flex gap-2">
            <Button @click="onClickSave" :disabled="isLocked">
                <i class="fas fa-save"></i>
                <span>Save</span>
            </Button>
            <Button @click="onClickExit"><span>Exit</span></Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGameStateStore } from '@/store/game-state-store';
import { computed } from 'vue';
import ExperienceBar from './experience-bar.vue';

const gameState = useGameStateStore();
const player = computed(() => gameState.getCharacter('player'));

const props = defineProps<{
    currentPanel?: string;
    isLocked?: boolean;
}>();

function onClickSave() {
    gameState.save('quicksave', 'Quicksave');
}

function onClickExit() {
    gameState.reset();
}
</script>

<style lang="scss" scoped>
.the-menu {
    background-color: black;
}
</style>