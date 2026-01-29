<template>
    <Panel raised>
        <div class="flex flex-column gap-sm">
            <div class="grid">
                <Checkbox v-for="c in content" v-model="c.selected">
                    <div class="flex flex-column">
                        <span>{{ c.label }}</span>
                        <em>{{ c.url }}</em>
                    </div>
                </Checkbox>
            </div>

            <Button @click="onClickLoad">Load</Button>
        </div>
    </Panel>
</template>

<script setup lang="ts">
import { loadGameContent } from '@/content-loader';
import { ref } from 'vue';

const content = ref<{ label: string; url: string; selected?: boolean }[]>([]);
content.value.push({
    label: 'Main',
    url: '/assets/game-data/packages/main.json'
});
content.value.push({
    label: 'Main',
    url: '/assets/game-data/packages/main.json'
});
content.value.push({
    label: 'Main',
    url: '/assets/game-data/packages/main.json'
});
content.value.push({
    label: 'Main',
    url: '/assets/game-data/packages/main.json'
});
content.value.push({
    label: 'Main',
    url: '/assets/game-data/packages/main.json'
});

function onClickLoad() {
    const selectedContent = content.value.filter((c) => c.selected);
    loadGameContent(selectedContent);
}
</script>

<style lang="scss" scoped></style>
