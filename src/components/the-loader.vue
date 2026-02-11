<template>
    <Card>
        <template #header>
            <div class="flex items-center gap-2">
                <DotBadge>1</DotBadge>
                <span>Load Content</span>
            </div>
        </template>
        <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
                <label v-for="c in content" class="cursor-pointer" :disabled="c.disabled">
                    <Card :pressed="c.selected">
                        <div class="flex justify-between gap-2">
                            <div class="flex flex-col">
                                <span>{{ c.label }}</span>
                                <em>{{ c.url }}</em>
                            </div>
                            <Checkbox :id="c.url" v-model="c.selected" />
                        </div>
                    </Card>
                </label>
            </div>
        </div>
        <template #footer>
            <Button @click="onClickLoad">Load</Button>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { loadGameContent } from '@/content-loader';
import { ref } from 'vue';
import DotBadge from './ui/dot-badge.vue';

const content = ref<{ label: string; url: string; selected: boolean; disabled: boolean }[]>([]);
content.value.push({
    label: 'Main',
    url: '/assets/game-data/packages/main.json',
    selected: true,
    disabled: true
});

function onClickLoad() {
    const selectedContent = content.value.filter((c) => c.selected);
    loadGameContent(selectedContent);
}
</script>

<style lang="scss" scoped></style>
