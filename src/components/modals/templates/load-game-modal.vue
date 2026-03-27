<template>
    <ModalFrame class="w-100">
        <template v-slot:header>
            <ModalHeader closeButton>
                <div class="flex w-full gap-2 items-center">
                    <i class="fas fa-folder-open"></i>
                    <p>{{ name }}</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <ul class="flex flex-col gap-2">
                <li v-for="m in manifestGroup.manifests">
                    <Card>
                        <div class="flex gap-2">
                            <div class="flex flex-col">
                                <span>{{ m.label }}</span>
                                <!-- <small>Level 99, Lorem Ipsum</small> -->
                                <small>{{ new Date(m.date).toLocaleString() }}</small>
                            </div>
                            <Button class="ml-auto" @click="onClickLoad(m.path)">
                                <span>Load</span>
                            </Button>
                        </div>
                        <template #footer v-if="!arePackagesLoaded(m)">
                            <div class="flex flex-col gap-2">
                                <ul class="flex flex-wrap gap-2">
                                    <li v-for="p in m.packageIds">
                                        <Chip>
                                            <i class="text-sm fas fa-cube"></i>
                                            <span>{{ p }}</span>
                                        </Chip>
                                    </li>
                                </ul>
                                <small>
                                    <strong>Caution!</strong> Not all content expected by this save are loaded. You can
                                    load anyway, but there may be unintended consequences.
                                </small>
                            </div>
                        </template>
                    </Card>
                </li>
            </ul>
            <Card pressed>
                <div class="flex flex-col gap-1">
                    <span>Permanently delete this character?</span>
                    <Button @click="onClickRemove()">
                        <i class="fas fa-trash"></i>
                        <span>Delete this Character</span>
                    </Button>
                </div>
            </Card>
        </template>
        <template #footer>
            <small class="w-full text-center">{{ props.manifestGroup.id }}</small>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import Chip from '@/components/ui/chip.vue';
import ModalController from '@/controllers/modal-controller';
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import { StoredGameManifest, StoredGameManifestGroup, useStorageStore } from '@/store/storage-store';
import { computed } from 'vue';

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const storage = useStorageStore();

const props = defineProps<{
    manifestGroup: StoredGameManifestGroup;
}>();

const name = computed(() => {
    const m = props.manifestGroup.manifests[0];
    return m.summary.name || 'Unnamed';
});

function onClickRemove() {
    props.manifestGroup.manifests.forEach((m) => storage.remove(m.path));
    ModalController.close();
}

function onClickLoad(path: string) {
    gameState.load(path);
    ModalController.close();
}

function arePackagesLoaded(manifest: StoredGameManifest) {
    const gamePackageIds = manifest.packageIds;
    const loadedPackageIds = gameData.data?.packageDescriptions.map((p) => p.id);
    return gamePackageIds.every((p) => loadedPackageIds?.includes(p));
}
</script>
