<template>
    <Card v-if="game.id" raised reverse>
        <div id="InGameMenu">
            <p>id: {{ game.id }}</p>
            <Button @click="onClickExit">Exit to Main Menu</Button>
        </div>
    </Card>
    <Card v-if="!game.id" raised>
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
