<template>
    <div class="flex flex-col h-dvh">
        <div class="flex-1 flex flex-col relative">
            <!-- Always there -->
            <Zone v-if="gameState.zone" />
            <Atlas v-else />

            <!-- Left Panels -->
            <!-- <Party /> -->

            <!-- Right Panels -->
            <!-- <Inventory /> -->
            <!-- <SkillsAndTalents /> -->

            <!-- Full Panels -->
            <Journal v-if="isPanelActive('journal')" />
            <Scene v-if="isPanelActive('scene')" :id="sceneId" />
        </div>
        <!-- <code class="mx-5">{{ activePanels.map((p) => p.id).join(', ') }}</code> -->

        <TheMenu :panels="activePanels.map((p) => p.id)" @clickPanel="togglePanel" />
    </div>
</template>

<script setup lang="ts">
import { ActionType, BaseAction } from '@/actions/base-action';
import { StartSceneAction } from '@/actions/start-scene-action';
import ActionController from '@/controllers/action-controller';
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import { onMounted, ref } from 'vue';
import Atlas from './atlas/atlas.vue';
import Journal from './journal.vue';
import Scene from './scene/scene.vue';
import TheMenu from './the-menu.vue';
import Zone from './zone/zone.vue';

const gameData = useGameDataStore();
const gameState = useGameStateStore();

type PanelLayout = { id: string; layout: 'full' | 'left' | 'right' };
const panelLayouts: PanelLayout[] = [
    { id: 'journal', layout: 'full' },
    { id: 'scene', layout: 'full' },
    { id: 'party', layout: 'left' },
    { id: 'inventory', layout: 'right' },
    { id: 'skills', layout: 'right' }
];

const activePanels = ref<PanelLayout[]>([]);

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

function togglePanel(id: string) {
    const panelLayout = panelLayouts.find((p) => p.id === id);
    if (!panelLayout) throw new Error(`No such panel: ${id}`);

    if (id !== 'scene' && isPanelActive(id)) {
        activePanels.value = activePanels.value.filter((p) => p.id !== id);
        return;
    }

    activePanels.value = activePanels.value.filter((p) => p.layout !== 'full');

    if (panelLayout.layout === 'left' || panelLayout.layout === 'full')
        activePanels.value = activePanels.value.filter((p) => p.layout !== 'left');
    if (panelLayout.layout === 'right' || panelLayout.layout === 'full')
        activePanels.value = activePanels.value.filter((p) => p.layout !== 'right');

    activePanels.value.push(panelLayout);
}

function isPanelActive(id: string) {
    return activePanels.value.find((p) => p.id === id);
}
</script>

<style lang="scss" scoped></style>
