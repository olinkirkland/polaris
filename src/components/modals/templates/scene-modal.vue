<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader close-button>
                <div class="flex w-full gap-2 items-center">
                    <i class="fas fa-panorama"></i>
                    <p>{{ props.id }}</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div ref="scrollContainer" class="w-150 max-w-150 flex flex-col gap-5 dialogue-scroll">
                <div>
                    <transition-group name="fade" tag="ul" class="flex flex-col gap-5">
                        <li v-for="(entry, index) in history" :key="index" class="flex flex-col gap-2">
                            <template v-if="entry.isDivider">
                                <div class="h-5"></div>
                            </template>
                            <template v-else>
                                <span v-html="entry.text" :class="{ muted: isDividerAfterIndex(index) }"></span>
                            </template>
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
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import { useGameDataStore } from '@/store/game-data-store';
import type { Story } from 'inkjs';
import { nextTick, onMounted, ref } from 'vue';

const props = defineProps<{
    id: string;
}>();

const gameDataStore = useGameDataStore();
const story: Story = gameDataStore.getScene(props.id).story;

type HistoryEntry = { text?: string; isDivider?: boolean };

const history = ref<HistoryEntry[]>([]);
const choices = ref<string[]>([]);
const scrollContainer = ref<HTMLElement | null>(null);

function isDividerAfterIndex(index: number): boolean {
    // Check if there's a divider entry after the given index
    return history.value.slice(index + 1).some((entry) => entry.isDivider);
}

function appendLines(lines: string[]) {
    if (lines.length === 0) return;

    // Add a divider between dialogue blocks (when a choice/branch occurred)
    if (history.value.length > 0) {
        history.value.push({ isDivider: true });
    }

    history.value.push(...lines.map((text) => ({ text })));
}

function advance() {
    const lines: string[] = [];

    while (story.canContinue) {
        const text = story.Continue()?.trim();
        if (text) lines.push(text);
    }

    appendLines(lines);

    choices.value = story.currentChoices.map((choice) => choice.text);
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
    if (!story.currentChoices || story.currentChoices.length === 0) return;

    story.ChooseChoiceIndex(choiceIndex);
    advance();
    scrollToBottom();
}

onMounted(() => {
    story.ResetState(); // Always reset the story state when the modal is opened
    history.value = [];
    choices.value = [];

    advance();
    scrollToBottom();
});
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
    padding-right: 0.5rem; // Account for scrollbar width to prevent content from shifting
}
</style>
