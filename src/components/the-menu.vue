<template>
    <Card>
        <div class="flex justify-between">
            <div>
                <p>
                    {{ player?.name }} <em class="muted">• {{ player?.characterPath?.label }}</em>
                </p>
                <small>{{ gameState.id }}</small>
            </div>
            <div class="flex gap-2">
                <Button @click="onClickSave">
                    <i class="fas fa-save"></i>
                    <span>Quick Save</span></Button
                >
                <Button @click="onClickExit"><span>Exit to Main Menu</span></Button>
            </div>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { useGameStateStore } from '@/store/game-state-store';
import { computed } from 'vue';

const gameState = useGameStateStore();
const player = computed(() => gameState.getCharacter('player'));

function onClickSave() {
    gameState.save('quicksave', 'Quicksave');
}

function onClickExit() {
    gameState.reset();
}
</script>

<style lang="scss" scoped></style>
