<template>
    <!-- In Game Menu -->
    <Card v-if="gameState.id" raised reverse>
        <template #header>
            <DotBadge>G</DotBadge>
            <span>In-Game</span>
            <div class="flex gap-2 ml-auto">
                <Button @click="onClickSave">
                    <i class="fa-solid fa-save"></i>
                    <span>Quick Save</span></Button
                >
                <Button @click="onClickExit">Exit to Main Menu</Button>
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
                <i class="fa-solid fa-plus"></i>
                <span>New</span>
            </Button>

            <!-- List of Save Games to be loaded -->
            <ul class="grid grid-cols-3 gap-2">
                <li v-for="g in storage.indexes.sort((a, b) => (a.date > b.date ? -1 : 1))">
                    <Card>
                        <template #header>
                            <div class="w-full flex justify-center items-center">
                                <em>{{ g.label }}</em>
                            </div>
                        </template>
                        <div class="flex flex-col gap-2 mb-2">
                            <small class="w-full text-ellipsis line-clamp-1">{{ g.path }}</small>
                            <p>{{ new Date(g.date).toLocaleString() }}</p>
                            <ul class="flex flex-wrap gap-2">
                                <li v-for="p in g.packageIds">
                                    <Chip>
                                        <i class="text-sm fa-solid fa-cube"></i>
                                        <span>{{ p }}</span>
                                    </Chip>
                                </li>
                            </ul>
                        </div>
                        <template #footer>
                            <Button @click="onClickLoad(g.path)"><span>Load</span></Button>
                            <Button @click="onClickRemove(g.path)">
                                <i class="fa-solid fa-trash"></i>
                                <span>Delete</span>
                            </Button>
                        </template>
                    </Card>
                </li>
            </ul>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { useGameStateStore } from '@/store/game-state-store';
import { useStorageStore } from '@/store/storage-store';
import Chip from './ui/chip.vue';

const gameState = useGameStateStore();
const storage = useStorageStore();
``;

function onClickNew() {
    gameState.startNewGame();
}

function onClickLoad(path: string) {
    gameState.load(path);
}

function onClickRemove(path: string) {
    gameState.remove(path);
}

function onClickSave() {
    gameState.save('quicksave', 'Quicksave');
}

function onClickExit() {
    gameState.reset();
}
</script>

<style lang="scss" scoped></style>
