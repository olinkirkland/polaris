<template>
    <Card>
        <div class="flex justify-between items-center">
            <div class="flex items-center mr-2">
                <div class="mr-5">
                    <p>
                        {{ player?.name }} <em class="muted">• {{ player?.characterPath?.label }}</em>
                    </p>
                </div>
                <div class="flex items-center gap-2">
                    <Button @click="$emit('clickPanel', 'journal')" :class="{ pressed: panels.includes('journal') }">
                        <i class="fas fa-book"></i>
                        <span>Journal</span>
                    </Button>
                </div>
            </div>
            <div class="flex gap-2">
                <Button @click="onClickSave">
                    <i class="fas fa-save"></i>
                    <span>Save</span>
                </Button>
                <Button @click="onClickExit"><span>Exit</span></Button>
            </div>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { useGameStateStore } from '@/store/game-state-store';
import { computed } from 'vue';

const gameState = useGameStateStore();
const player = computed(() => gameState.getCharacter('player'));

const props = defineProps<{
    panels: string[];
}>();

function onClickSave() {
    gameState.save('quicksave', 'Quicksave');
}

function onClickExit() {
    gameState.reset();
}
</script>

<style lang="scss" scoped></style>
