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
            <ul class="ml-auto flex items-center gap-2">
                <li v-for="p in gameData.data?.packageDescriptions">
                    <Chip>
                        <i class="text-sm fa-solid fa-cube"></i>
                        <span>{{ p.id }}</span>
                    </Chip>
                </li>
            </ul>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useGameDataStore } from '@/store/game-data-store';
import { wait } from '@/util/wait-util';
import { ref } from 'vue';
import Chip from './ui/chip.vue';
import DotBadge from './ui/dot-badge.vue';

type PackageManifest = {
    url: string;
    label: string;
    selected?: boolean;
    forced?: boolean;
};

const gameData = useGameDataStore();
const availablePackages = ref<PackageManifest[]>([]);
const isLoadingContent = ref(false);

loadPackageManifests();

async function loadPackageManifests() {
    const base = import.meta.url;
    console.log(base);
    const response = await fetch('assets/game-data/package-manifests.json');
    if (!response.ok) throw new Error(`@loadPackageManifests: ${response.status}`);
    const data: PackageManifest[] = await response.json();
    availablePackages.value = data;
    // Initial load if nothing is loaded yet
    if (!gameData.data?.packageDescriptions.length) onClickLoad();
}

async function onClickLoad() {
    isLoadingContent.value = true;
    await wait(0.5);
    gameData.resetGameData();
    const selectedContent = availablePackages.value.filter((c) => c.selected).map((p) => p.url);
    await gameData.loadGameDataPackages(selectedContent);
    isLoadingContent.value = false;
}
</script>

<style lang="scss" scoped></style>
