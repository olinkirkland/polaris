<template>
    <div v-if="sceneId" class="scene-view w-full h-full absolute right-0 top-0">
        <Card class="h-full w-120 max-w-120">
            <template v-slot:header>
                <div class="flex w-full gap-2 items-center">
                    <i class="fas fa-panorama"></i>
                    <p>{{ sceneId }}</p>
                </div>
            </template>
            <div ref="scrollContainer" class="flex-1 flex flex-col gap-5 dialogue-scroll">
                <div>
                    <transition-group name="fade" tag="ul" class="flex flex-col gap-5">
                        <li
                            v-for="(entry, index) in history"
                            :key="index"
                            class="flex flex-col gap-2"
                            :class="{ muted: isOld(index) }"
                        >
                            <span v-html="entry.text"></span>
                        </li>
                    </transition-group>
                </div>

                <div v-if="choices.length > 0">
                    <ul class="flex flex-col gap-2">
                        <li v-for="(option, index) in choices" :key="index">
                            <Button @click="choose(index)" class="w-full">
                                <span v-html="option"></span>
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { ActionType, BaseAction } from '@/actions/base-action';
import { StartSceneAction } from '@/actions/start-scene-action';
import ActionController from '@/controllers/action-controller';
import { useGameDataStore } from '@/store/game-data-store';
import type { Story } from 'inkjs';
import { nextTick, onMounted, ref } from 'vue';

const gameData = useGameDataStore();
const sceneId = ref<string | null>(null);
const story = ref<Story | null>(null);

type HistoryEntry = { text?: string };

const history = ref<HistoryEntry[]>([]);
const choices = ref<string[]>([]);
const scrollContainer = ref<HTMLElement | null>(null);

function isOld(index: number): boolean {
    const choiceIndex = history.value.findLastIndex((entry) => entry.text?.includes('[choice]'));
    return choiceIndex !== -1 && index < choiceIndex;
}

function makeChoiceLine(text: string): string {
    return `<div [choice] class="mb-1"></div>`;
}

function appendLines(lines: string[]) {
    if (lines.length === 0) return;
    history.value.push(...lines.map((text) => ({ text })));
}

function advance() {
    if (!story.value) return;
    const lines: string[] = [];

    while (story.value.canContinue) {
        const text = story.value.Continue()?.trim();
        if (text) lines.push(text);
    }

    appendLines(lines);

    choices.value = story.value.currentChoices.map((choice) => choice.text);
}

function scrollToBottom() {
    nextTick(() => {
        if (!scrollContainer.value) return;
        scrollContainer.value.scrollTo({
            top: scrollContainer.value.scrollHeight,
            behavior: 'smooth'
        });
    });
}

function choose(choiceIndex: number) {
    if (!story.value) return;
    if (!story.value.currentChoices || story.value.currentChoices.length === 0) return;

    // Record the player's choice in the history (so it's visible in the dialogue log)
    const choiceText = story.value.currentChoices[choiceIndex]?.text;
    if (choiceText) appendLines([makeChoiceLine(choiceText)]);

    story.value.ChooseChoiceIndex(choiceIndex);
    advance();
    scrollToBottom();
}

onMounted(() => {
    // Start listening to the action-controller
    const actionController = ActionController.getInstance();
    actionController.addEventListener(ActionType.SCENE, onSceneAction);
});

function onSceneAction(action: BaseAction) {
    console.log('@onSceneAction:', action);
    const sceneAction = action as StartSceneAction;
    sceneId.value = sceneAction.id;
    const scene = gameData.getScene(sceneAction.id);
    story.value = scene.story;
    story.value.ResetState(); // Always reset the story state when the modal is opened
    history.value = [];
    choices.value = [];

    advance();
}
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition:
        opacity 500ms ease,
        transform 500ms ease;
}

.fade-enter-from {
    opacity: 0;
}

.fade-enter-to {
    opacity: 1;
}

.dialogue-scroll {
    overflow-y: auto;
    min-height: 0;

    -ms-overflow-style: none;
    scrollbar-width: none;
}

:deep(.card > div) {
    flex: 1;
    min-height: 0;
}
</style>
