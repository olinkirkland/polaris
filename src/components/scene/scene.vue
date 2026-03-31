<template>
    <Panel class="flex w-full h-full">
        <div class="speaker-overlay relative ml-auto flex-1 h-full">
            <div class="speaker-overlay__background absolute top-0 right-0 w-full h-full"></div>
            <div class="ml-auto flex flex-col relative h-fit p-5">
                <h2 class="text-right mb-2" v-html="speaker"></h2>
                <small class="max-w-60 text-right" v-html="speakerDescription"></small>
            </div>
        </div>
        <Card class="w-2/5">
            <div ref="scrollContainer" class="flex flex-col gap-5 dialogue-scroll">
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
            </div>
            <div v-if="choices.length > 0" class="choices pt-5">
                <ul class="flex flex-col gap-2">
                    <li v-for="(option, index) in choices" :key="index">
                        <p @click="choose(index)" class="w-full">❖ <span v-html="option"></span></p>
                    </li>
                </ul>
            </div>
        </Card>
        <small class="absolute top-0 left-0 m-3">{{ id }}</small>
    </Panel>
</template>

<script setup lang="ts">
import { useGameDataStore } from '@/store/game-data-store';
import type { Story } from 'inkjs';
import { nextTick, onMounted, ref } from 'vue';
import Panel from '../ui/panel.vue';

const gameData = useGameDataStore();
const story = ref<Story | null>(null);

type HistoryEntry = { text?: string };

const history = ref<HistoryEntry[]>([]);
const choices = ref<string[]>([]);
const scrollContainer = ref<HTMLElement | null>(null);

const speaker = ref<string>();
const speakerDescription = ref<string>();

const props = defineProps<{
    id: string;
}>();

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
        processTags(story.value.currentTags || []);
    }

    appendLines(lines);

    choices.value = story.value.currentChoices.map((choice) => choice.text);
}

function processTags(tags: string[]) {
    tags.forEach((t) => {
        const [key, ...valueParts] = t.split(':');
        const value = valueParts.join(':');
        switch (key) {
            case 'speaker':
                speaker.value = value;
                break;
            case 'speaker_description':
                speakerDescription.value = value;
            default:
                console.warn('Warning: Unrecognized tag', key, 'in', props.id);
                break;
        }
    });
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
    const scene = gameData.getScene(props.id!);
    story.value = scene.story;
    story.value.ResetState(); // Always reset the story state when the modal is opened
    history.value = [];
    choices.value = [];

    advance();
});
</script>

<style scoped lang="scss">
.panel {
    background-color: rgba(0, 0, 0, 0.4);
    background-image: url('/assets/images/tiles.png');
}

.card {
    background-color: black;
}

.choices {
    border-top: 1px dashed var(--color-base-faint);
    li {
        opacity: 0.8;
        transition: opacity 0.2s;
        cursor: pointer;
    }

    li:hover {
        opacity: 1;
    }
}

.speaker-overlay {
    color: white;
    text-shadow: 1px 1px 2px black;
    text-align: right;
    * {
        max-width: 20rem;
        width: 100%;
    }

    h2 {
        color: white;
        opacity: 0.75;
        font-size: 3rem;
    }

    .speaker-overlay__background {
        background: linear-gradient(to right, transparent, black);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition:
        opacity 0.5s ease,
        transform 0.5s ease;
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
    scroll-behavior: smooth;

    -ms-overflow-style: none;
    scrollbar-width: none;
}

:deep(.card > div) {
    flex: 1;
    min-height: 0;
}
</style>
