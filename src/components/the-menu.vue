<template>
    <!-- In Game Menu -->
    <Card v-if="gameState.id" raised reverse>
        <template #header>
            <DotBadge>G</DotBadge>
            <span>In-Game</span>
            <div class="flex gap-2 ml-auto">
                <Button @click="onClickSave">
                    <i class="fas fa-save"></i>
                    <span>Quick Save</span></Button
                >
                <Button @click="onClickExit"><span>Exit to Main Menu</span></Button>
            </div>
        </template>
        <div id="InGameMenu">
            <p>id: {{ gameState.id }}</p>
        </div>
    </Card>
    <!-- Main Menu -->
    <Card v-if="!gameState.id" raised>
        <template #header class="justify-between debug">
            <DotBadge>M</DotBadge>
            <span>Main Menu</span>
        </template>
        <div class="flex flex-col gap-2">
            <Button @click="onClickNew" theme>
                <i class="fas fa-plus"></i>
                <span>New Character</span>
            </Button>

            <!-- List of Save Games to be loaded -->
            <ul class="grid grid-cols-3 gap-2">
                <li v-for="g in storage.manifestGroups">
                    <StoredGameCard :manifestGroup="g" />
                </li>
            </ul>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { useGameStateStore } from '@/store/game-state-store';
import { useStorageStore } from '@/store/storage-store';
import StoredGameCard from './stored-game-card.vue';

const gameState = useGameStateStore();
const storage = useStorageStore();

function onClickNew() {
    gameState.startNewGame();
}

function onClickSave() {
    gameState.save('quicksave', 'Quicksave');
}

function onClickExit() {
    gameState.reset();
}
</script>

<style lang="scss" scoped></style>
