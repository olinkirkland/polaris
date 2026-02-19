<template>
    <!-- In Game Menu -->
    <Card v-if="gameState.id" raised reverse>
        <template #header>
            <DotBadge>G</DotBadge>
            <span>In-Game</span>
            <Button @click="onClickExit" class="ml-auto">Exit to Main Menu</Button>
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
                <li v-for="g in storage.indexes">
                    <Card>
                        <template #header>
                            <div class="w-full flex justify-center items-center">
                                <em>{{ g.label }}</em>
                            </div>
                        </template>
                        <div class="flex flex-col gap-2 mb-2">
                            <small>{{ g.path }}</small>
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

function onClickExit() {
    gameState.reset();
}
</script>

<style lang="scss" scoped></style>
