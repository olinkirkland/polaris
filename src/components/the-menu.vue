<template>
    <Panel v-if="game.id" id="InGameMenu" raised reverse>
        <p>id: {{ game.id }}</p>
        <Button @click="onClickExit">Exit to Main Menu</Button>
    </Panel>
    <Panel v-if="!game.id" id="StorageMenu" raised>
        <Button @click="onClickNew">New</Button>
        <ul>
            <li v-for="g in game.storageIndex">
                <Panel>
                    <pre>{{ JSON.stringify(g, null, 2) }}</pre>
                    <div class="button-row">
                        <Button @click="onClickLoad(g.path)">Load</Button>
                        <Button @click="onClickRemove(g.path)">Remove</Button>
                    </div>
                </Panel>
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
#InGameMenu {
    p {
        margin-bottom: 0.5rem;
    }
}

ul {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}
</style>
