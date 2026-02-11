<template>
    <Card raised>
        <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
                <label v-for="c in content" class="cursor-pointer" :disabled="c.disabled">
                    <Card>
                        <div class="flex justify-between gap-2">
                            <div class="flex flex-col">
                                <span>{{ c.label }}</span>
                                <em>{{ c.url }}</em>
                            </div>
                            <Checkbox v-model="c.selected" />
                        </div>
                    </Card>
                </label>
            </div>

            <Button @click="onClickLoad">Load</Button>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { loadGameContent } from '@/content-loader';
import { ref } from 'vue';

const content = ref<{ label: string; url: string; selected?: boolean; disabled?: boolean }[]>([]);
content.value.push({
    label: 'Main',
    url: '/assets/game-data/packages/main.json',
    selected: true,
    disabled: true
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
