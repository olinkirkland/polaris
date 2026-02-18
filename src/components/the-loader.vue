<template>
    <Card>
        <template #header>
            <div class="flex items-center gap-2">
                <DotBadge>L</DotBadge>
                <span>Load Content</span>
            </div>
        </template>
        <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
                <label v-for="c in availablePackages" class="cursor-pointer" :disabled="c.forced">
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
            <Button @click="onClickLoad" :disabled="isLoadingContent">
                <i v-if="isLoadingContent" class="fa-solid fa-circle-notch fa-spin"></i>
                <span>Load Selected Content</span>
            </Button>
            <div class="ml-auto flex items-center gap-2">
                <p>{{ gameData.data?.packageDescriptions.map((p) => p.label).join(', ') }}</p>
                <Button @click="onClickReset">
                    <i class="fa-solid fa-arrow-rotate-left"></i>
                    <span>Reset</span>
                </Button>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useGameDataStore } from '@/store/game-data-store';
import { ref } from 'vue';
import DotBadge from './ui/dot-badge.vue';

type PackageManifest = {
    url: string;
    label: string;
    selected?: boolean;
    forced?: boolean;
};

const gameData = useGameDataStore();
const availablePackages = ref<PackageManifest[]>([]);
availablePackages.value.push(
    {
        url: '/assets/game-data/packages/core.json',
        label: 'Core',
        forced: true // This content must always be loaded
    },
    {
        url: '/assets/game-data/packages/foo.json',
        label: 'Foo'
    }
);

const isLoadingContent = ref(false);
onClickLoad(); // Load initially

async function onClickLoad() {
    isLoadingContent.value = true;
    const selectedContent = availablePackages.value.filter((c) => c.selected || c.forced).map((p) => p.url);
    await useGameDataStore().loadGameDataPackages(selectedContent);
    isLoadingContent.value = false;
}

function onClickReset() {
    gameData.resetGameData();
}
</script>

<style lang="scss" scoped></style>
