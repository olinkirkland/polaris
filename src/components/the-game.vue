<template>
    <div class="flex flex-col h-dvh">
        <div class="flex-1 flex flex-col relative">
            <!-- Always there -->
            <Zone v-if="gameState.zone" />
            <Atlas v-else />

            <!-- Panels -->
            <Journal v-if="currentPanel === 'journal'" @on-close="currentPanel = null" />
            <Scene v-if="currentPanel === 'scene'" :id="sceneId" @on-close="currentPanel = null" />
            <TheInventory v-if="currentPanel === 'inventory'" @on-close="currentPanel = null" />
            <TheParty v-if="currentPanel === 'party'" @on-close="currentPanel = null" />
        </div>
        <transition name="slide-top">
            <TheMenu v-if="!usePauseStore().isPaused" />
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ActionType, BaseAction } from '@/actions/base-action';
import { StartSceneAction } from '@/actions/start-scene-action';
import ActionController from '@/controllers/action-controller';
import { useGameStateStore } from '@/store/game-state-store';
import { usePauseStore } from '@/store/pause-store';
import { onMounted, ref } from 'vue';
import Atlas from './atlas/atlas.vue';
import TheInventory from './inventory-panel/the-inventory.vue';
import Journal from './journal.vue';
import TheParty from './party-panel/the-party.vue';
import Scene from './scene/scene.vue';
import TheMenu from './the-menu.vue';
import Zone from './zone/zone.vue';

const gameState = useGameStateStore();

const currentPanel = ref<string | null>(null);

onMounted(() => {
    // Start listening to the action-controller
    const actionController = ActionController.getInstance();
    actionController.addEventListener(ActionType.SCENE, onSceneAction);
});

const sceneId = ref();

function onSceneAction(action: BaseAction) {
    console.log('@onSceneAction:', action);
    const sceneAction = action as StartSceneAction;
    sceneId.value = sceneAction.id;
    currentPanel.value = 'scene';
}
</script>

<style lang="scss" scoped></style>
