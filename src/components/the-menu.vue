<template>
    <Panel v-if="game.id">
        <p>
            <strong>{{ game.id }}</strong>
        </p>
        <Button @click="onClickExit">Exit to Main Menu</Button>
    </Panel>
    <Panel v-if="!game.id">
        <Button @click="onClickNew">New</Button>
        <ul>
            <li v-for="g in game.storageIndex">
                <pre>{{ JSON.stringify(g, null, 2) }}</pre>
                <Button @click="onClickLoad(g.path)">Load</Button>
                <Button @click="onClickRemove(g.path)">Remove</Button>
            </li>
        </ul>
    </Panel>
</template>

<script setup lang="ts">
import { useGameStore } from '@/store/game-store';
import Panel from './shared/panel.vue';

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

<style lang="scss" scoped>
li {
}
</style>
