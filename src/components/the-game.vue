<template>
    <div class="flex flex-col h-dvh">
        <div class="flex-1 flex flex-col relative">
            <!-- Always there -->
            <Zone v-if="gameState.zone" :currentPanel="currentPanel" />
            <Atlas v-else />

            <!-- Panels -->
            <Journal v-if="currentPanel === 'journal'" />
            <Scene v-if="currentPanel === 'scene'" :id="sceneId" />
            <TheInventory v-if="currentPanel === 'inventory'" />
            <TheParty v-if="currentPanel === 'party'" />
        </div>

        <TheMenu :currentPanel="currentPanel" @clickPanel="togglePanel" :isLocked="currentPanel === 'scene'" />
    </div>
</template>

<script setup lang="ts">
import { ActionType, BaseAction } from '@/actions/base-action';
import { StartSceneAction } from '@/actions/start-scene-action';
import ActionController from '@/controllers/action-controller';
import { useGameStateStore } from '@/store/game-state-store';
import { onMounted, ref } from 'vue';
import Atlas from './atlas/atlas.vue';
import TheInventory from './inventory-panel/the-inventory.vue';
import Journal from './journal.vue';
import TheParty from './party-panel/the-party.vue';
import Scene from './scene/scene.vue';
import TheMenu from './the-menu.vue';
import Zone from './zone/zone.vue';

const gameState = useGameStateStore();

const currentPanel = ref<string>();

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
    togglePanel('scene');
}

function togglePanel(panel: string) {
    if (currentPanel.value === panel && panel !== 'scene') return (currentPanel.value = undefined);
    currentPanel.value = panel;
}
</script>

<style lang="scss" scoped></style>
