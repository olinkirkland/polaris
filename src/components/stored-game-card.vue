<template>
    <Card>
        <template #header>
            <div class="w-full flex flex-col justify-center items-center">
                <strong>{{ summary.name }}</strong>
            </div>
        </template>

        <div class="w-full flex flex-col gap-2">
            <em class="text-center">{{ summary.path }}</em>
            <small class="text-center">
                {{ manifestGroup.manifests[0].label }}
                &nbsp;•&nbsp;
                {{ date.toLocaleString() }}
            </small>
            <div class="flex gap-2 justify-center">
                <Button @click="onClickLoad()">
                    <i class="fa-solid fa-folder-open"></i>
                    <span>Manage ({{ manifestGroup.manifests.length }})</span>
                </Button>
                <Button @click="onClickContinue()" :disabled="!arePackagesLoaded()">
                    <span>Continue</span>
                    <i class="fa-solid fa-caret-right"></i>
                </Button>
            </div>
        </div>

        <template #footer>
            <div class="flex flex-col w-full gap-2">
                <ul class="flex flex-wrap justify-center gap-2">
                    <li v-for="p in manifestGroup.manifests[0].packageIds">
                        <Chip>
                            <i class="text-sm fa-solid fa-cube"></i>
                            <span>{{ p }}</span>
                        </Chip>
                    </li>
                </ul>
                <small class="w-full text-center">{{ manifestGroup.id }}</small>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';
import { useGameStateStore } from '@/store/game-state-store';
import { StoredGameManifestGroup } from '@/store/storage-store';
import { computed, PropType } from 'vue';
import LoadGameModal from './modals/templates/load-game-modal.vue';
import Chip from './ui/chip.vue';
import { useGameDataStore } from '@/store/game-data-store';

const gameState = useGameStateStore();
const gameData = useGameDataStore();

const props = defineProps({
    manifestGroup: {
        required: true,
        type: Object as PropType<StoredGameManifestGroup>
    }
});

const date = computed(() => new Date(props.manifestGroup.manifests[0].date));
const summary = computed(() => props.manifestGroup.manifests[0].summary);

function onClickLoad() {
    ModalController.open(LoadGameModal, { manifestGroup: props.manifestGroup });
}

function onClickContinue() {
    const manifest = props.manifestGroup.manifests[0];
    gameState.load(manifest.path);
}

function arePackagesLoaded() {
    const gamePackageIds = props.manifestGroup.manifests[0].packageIds;
    const loadedPackageIds = gameData.data?.packageDescriptions.map((p) => p.id);
    return gamePackageIds.every((p) => loadedPackageIds?.includes(p));
}
</script>
