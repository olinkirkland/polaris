<template>
    <!-- In Game Menu -->
    <Card v-if="game.id" raised reverse>
        <template #header>
            <DotBadge>3</DotBadge>
            <span>In-Game</span>
            <Button @click="onClickExit" class="ml-auto">Exit to Main Menu</Button>
        </template>
        <div id="InGameMenu">
            <p>id: {{ game.id }}</p>
        </div>
    </Card>
    <!-- Main Menu -->
    <Card v-if="!game.id" raised>
        <template #header class="justify-between debug">
            <DotBadge>2</DotBadge>
            <span>Main Menu</span>
        </template>
        <div class="flex flex-col gap-2">
            <Button @click="onClickNew" theme>
                <i class="fa-solid fa-plus"></i>
                <span>New</span></Button
            >

            <ul class="grid grid-cols-3 gap-2">
                <li v-for="g in game.storageIndex">
                    <Card>
                        <pre class="mb-2">{{ JSON.stringify(g, null, 2) }}</pre>
                        <div class="flex gap-2 justify-end">
                            <Button @click="onClickLoad(g.path)"><span>Load</span></Button>
                            <Button @click="onClickRemove(g.path)">
                                <i class="fa-solid fa-trash"></i>
                                <span>Delete</span>
                            </Button>
                        </div>
                    </Card>
                </li>
            </ul>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { useGameStore } from '@/store/game-store';

const game = useGameStore();

function onClickNew() {
    game.startNewGame();
}

function onClickLoad(path: string) {
    game.load(path);
}

function onClickRemove(path: string) {
    game.remove(path);
}

function onClickExit() {
    game.reset();
}
</script>

<style lang="scss" scoped></style>
