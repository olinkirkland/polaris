<template>
    <Panel v-if="game.id" raised reverse>
        <div id="InGameMenu">
            <p>id: {{ game.id }}</p>
            <Button @click="onClickExit">Exit to Main Menu</Button>
        </div>
    </Panel>
    <Panel v-if="!game.id" raised>
        <div id="StorageMenu">
            <Button @click="onClickNew" theme>
                <i class="fa-solid fa-square-plus"></i>
                <span>New</span></Button
            >
            <ul>
                <li v-for="g in game.storageIndex">
                    <pre>{{ JSON.stringify(g, null, 2) }}</pre>
                    <div class="button-row">
                        <Button @click="onClickLoad(g.path)"><span>Load</span></Button>
                        <Button @click="onClickRemove(g.path)">
                            <i class="fa-solid fa-trash"></i>
                            <span>Remove</span></Button
                        >
                    </div>
                </li>
            </ul>
        </div>
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
#StorageMenu,
#InGameMenu {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
}

#StorageMenu {
    ul {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
        li {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
    }
}
</style>
